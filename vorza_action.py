"""Enqueue an explicit operator close/cancel; never enable VORZA or send HTTP here."""
import argparse
from vorza_worker import request_action


def main():
    parser=argparse.ArgumentParser(description='Solicitar close/cancel VORZA de una publicacion confirmada')
    parser.add_argument('--external-id',required=True)
    parser.add_argument('--action',required=True,choices=['close','cancel'])
    parser.add_argument('--reason')
    parser.add_argument('--note',default='')
    args=parser.parse_args()
    try:
        job=request_action(args.external_id,args.action,args.reason,args.note)
    except ValueError as exc:
        parser.exit(2,str(exc)+'\n')
    print('Accion encolada:',job,'; no implica cierre automatico de posiciones')


if __name__=='__main__':
    main()
