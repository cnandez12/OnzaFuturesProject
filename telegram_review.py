"""Revisión manual de publicaciones de Telegram atascadas. Nunca envía mensajes.

Los fallos que con certeza no se publicaron se repiten solos. Aquí llegan los
casos que el sistema no puede decidir: 'unknown' (sin confirmación), 'sending'
(worker interrumpido a mitad de envío) y 'failed' (rechazo definitivo).

  python telegram_review.py list
  python telegram_review.py retry   --event 123
  python telegram_review.py confirm --event 123 --message-id 4567
  python telegram_review.py retry   --publication 45
  python telegram_review.py confirm --publication 45 --message-id 890

Antes de decidir, mirar el canal: si el mensaje NO está, usar retry (el worker
lo publicará); si SÍ está, usar confirm con su número de mensaje. Un retry de
un mensaje que sí se publicó lo duplica.

Para lo que ya es demasiado viejo para publicarse:

  python telegram_review.py discard --older-than-hours 24            # solo cuenta
  python telegram_review.py discard --older-than-hours 24 --execute  # descarta

discard marca como 'skipped' todo lo atascado o en espera con esa antigüedad.
No se publica nunca y no borra filas ni toca la contabilidad.
"""

from __future__ import annotations

import argparse
import os

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

REVIEW = ("failed", "unknown", "sending")
# Un envío en curso dura segundos: no tocar 'sending' recientes de un worker activo.
SENDING_GRACE = "2 minutes"

EVENTS_SQL = f"""SELECT id, signal_id, event_type, telegram_status AS status, telegram_result AS detail,
        received_at FROM tv_events
    WHERE state = 'applied' AND (telegram_status IN ('failed', 'unknown')
        OR (telegram_status = 'sending' AND received_at < now() - interval '{SENDING_GRACE}'))
    ORDER BY id"""
PUBLICATIONS_SQL = f"""SELECT id, job_key, chat_id, method, status, detail, available_at FROM telegram_publications
    WHERE status IN ('failed', 'unknown')
        OR (status = 'sending' AND available_at < now() - interval '{SENDING_GRACE}')
    ORDER BY id"""


def connect():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise SystemExit("DATABASE_URL no configurada")
    return psycopg2.connect(url, connect_timeout=5)


def listing(cur) -> list[str]:
    lines = []
    cur.execute(EVENTS_SQL)
    for row in cur.fetchall():
        lines.append(f"evento {row['id']} · {row['signal_id']} · {row['event_type']} · "
                     f"{row['status']} · {row['detail'] or 'sin detalle'}")
    cur.execute(PUBLICATIONS_SQL)
    for row in cur.fetchall():
        lines.append(f"publicacion {row['id']} · {row['job_key']} · {row['method']} · "
                     f"{row['status']} · {row['detail'] or 'sin detalle'}")
    return lines


def retry_event(cur, event_id: int) -> bool:
    cur.execute("""UPDATE tv_events SET telegram_status='pending', telegram_attempts=0,
        telegram_next_attempt_at=NULL, telegram_result='Reencolado por revision manual'
        WHERE id=%s AND state='applied' AND telegram_status IN %s""", (event_id, REVIEW))
    return cur.rowcount == 1


def confirm_event(cur, event_id: int, message_id: int, chat_id: str) -> bool:
    cur.execute("""UPDATE tv_events SET telegram_status='delivered', telegram_message_id=%s,
        telegram_next_attempt_at=NULL, telegram_result='Confirmado por revision manual'
        WHERE id=%s AND state='applied' AND telegram_status IN %s
        RETURNING signal_id, event_type""", (message_id, event_id, REVIEW))
    row = cur.fetchone()
    if row is None:
        return False
    if row["event_type"] == "entry":
        # Los resultados de la señal responden a este mensaje de entrada.
        cur.execute("""UPDATE tv_signals SET telegram_entry_message_id=%s, telegram_chat_id=%s
            WHERE signal_id=%s""", (message_id, chat_id, row["signal_id"]))
    return True


def retry_publication(cur, publication_id: int) -> bool:
    cur.execute("""UPDATE telegram_publications SET status='pending', attempts=0, available_at=now(),
        detail='Reencolado por revision manual' WHERE id=%s AND status IN %s""", (publication_id, REVIEW))
    return cur.rowcount == 1


def confirm_publication(cur, publication_id: int, message_id: int) -> bool:
    cur.execute("""UPDATE telegram_publications SET status='delivered', message_id=%s,
        detail='Confirmado por revision manual' WHERE id=%s AND status IN %s""",
                (message_id, publication_id, REVIEW))
    return cur.rowcount == 1


STALE = ("pending", "sending", "failed", "unknown")
DISCARDED = "Descartado por revision manual; no se publica"
EVENTS_STALE = """state='applied' AND telegram_status IN %s
    AND received_at < now() - %s * interval '1 hour'"""
PUBLICATIONS_STALE = "status IN %s AND available_at < now() - %s * interval '1 hour'"


def stale_counts(cur, hours: int) -> dict:
    """Cuánto se descartaría, por cola y estado. Solo lectura."""
    cur.execute(f"SELECT telegram_status AS status, count(*) AS total FROM tv_events WHERE {EVENTS_STALE} GROUP BY 1",
                (STALE, hours))
    main_queue = {row["status"]: row["total"] for row in cur.fetchall()}
    cur.execute(f"SELECT status, count(*) AS total FROM telegram_publications WHERE {PUBLICATIONS_STALE} GROUP BY 1",
                (STALE, hours))
    return {"principal": main_queue, "distribucion": {row["status"]: row["total"] for row in cur.fetchall()}}


def discard_stale(cur, hours: int) -> tuple[int, int]:
    """Marca como 'skipped' lo atascado o en espera más viejo que `hours`. No envía nada."""
    if hours < 1:
        raise ValueError("La antiguedad minima es 1 hora: lo reciente puede estar en pleno envio")
    cur.execute("SET LOCAL lock_timeout = '5s'")
    cur.execute(f"""UPDATE tv_events SET telegram_status='skipped', telegram_next_attempt_at=NULL,
        telegram_result=%s WHERE {EVENTS_STALE}""", (DISCARDED, STALE, hours))
    events = cur.rowcount
    cur.execute(f"UPDATE telegram_publications SET status='skipped', detail=%s WHERE {PUBLICATIONS_STALE}",
                (DISCARDED, STALE, hours))
    return events, cur.rowcount


def main():
    parser = argparse.ArgumentParser(description="Revisar publicaciones de Telegram atascadas; no envia mensajes")
    actions = parser.add_subparsers(dest="action", required=True)
    actions.add_parser("list", help="Mostrar lo que requiere revision")
    old = actions.add_parser("discard", help="Descartar sin publicar lo atascado que ya es antiguo")
    old.add_argument("--older-than-hours", type=int, required=True)
    old.add_argument("--execute", action="store_true", help="Sin esta opcion solo se muestran los conteos")
    for name, text in (("retry", "El mensaje NO esta en el canal: volver a encolarlo"),
                       ("confirm", "El mensaje SI esta en el canal: registrar su numero")):
        sub = actions.add_parser(name, help=text)
        target = sub.add_mutually_exclusive_group(required=True)
        target.add_argument("--event", type=int, help="ID de tv_events (canal principal)")
        target.add_argument("--publication", type=int, help="ID de telegram_publications (Free y resumenes)")
        if name == "confirm":
            sub.add_argument("--message-id", type=int, required=True)
            sub.add_argument("--chat-id", help="Solo entradas: chat del mensaje; por defecto DESTINATION_CHANNEL_ID")
    args = parser.parse_args()
    load_dotenv()
    conn = connect()
    try:
        with conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
            if args.action == "list":
                lines = listing(cur)
                print("\n".join(lines) if lines else "Nada requiere revision")
                return
            if args.action == "discard":
                if args.older_than_hours < 1:
                    parser.exit(2, "--older-than-hours debe ser 1 o mas\n")
                print("Atascado con mas de", args.older_than_hours, "h:", stale_counts(cur, args.older_than_hours))
                if not args.execute:
                    print("Nada cambiado. Repetir con --execute para descartar.")
                    return
                events, publications = discard_stale(cur, args.older_than_hours)
                print(f"Descartados sin publicar: {events} eventos del canal principal y "
                      f"{publications} publicaciones de Free/resumenes")
                return
            if args.action == "confirm" and args.message_id <= 0:
                parser.exit(2, "message-id debe ser positivo\n")
            if args.event is not None:
                if args.action == "retry":
                    done = retry_event(cur, args.event)
                else:
                    chat_id = args.chat_id or os.getenv("DESTINATION_CHANNEL_ID", "")
                    if not chat_id:
                        parser.exit(2, "Falta --chat-id o DESTINATION_CHANNEL_ID\n")
                    done = confirm_event(cur, args.event, args.message_id, chat_id)
            elif args.action == "retry":
                done = retry_publication(cur, args.publication)
            else:
                done = confirm_publication(cur, args.publication, args.message_id)
    finally:
        conn.close()
    if not done:
        parser.exit(2, "Sin cambios: el ID no existe o no esta en failed/unknown/sending\n")
    print("Hecho:", args.action, "evento" if args.event is not None else "publicacion",
          args.event if args.event is not None else args.publication)


if __name__ == "__main__":
    main()
