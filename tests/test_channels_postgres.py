"""Opt-in SQL integration using session-local TEMP tables; no public data changes."""
import os
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

import psycopg2
from psycopg2.extras import Json, RealDictCursor
import telegram_channels as tc


@unittest.skipUnless(os.getenv("ONZA_TEST_DATABASE_URL"),"Optional PostgreSQL TEMP-table integration")
class PostgresChannels(unittest.TestCase):
    def setUp(self):
        self.conn = psycopg2.connect(os.environ["ONZA_TEST_DATABASE_URL"],connect_timeout=5)
        self.addCleanup(self.conn.close)
        self.cur = self.conn.cursor(cursor_factory=RealDictCursor)
        self.cur.execute("CREATE TEMP TABLE sim_track_record (id int,symbol text,direction text,entry_price numeric,exit_price numeric,leverage int,hit_tp1 bool,hit_tp2 bool,hit_tp3 bool,tp1 numeric,tp2 numeric,tp3 numeric,close_reason text,final_profit_pct numeric,closed_at timestamptz)")
        self.cur.execute("CREATE TEMP TABLE tv_events (id int,signal_id text,event_type text,payload jsonb,received_at timestamptz,state text,telegram_status text,telegram_message_id bigint)")
        self.cur.execute("CREATE TEMP TABLE tv_signals (id int,signal_id text,telegram_chat_id text,margin_used numeric default 20)")
        self.cur.execute("CREATE TEMP TABLE trades (message_id int,date timestamptz)")
        schema = Path(tc.__file__).with_name("schema.sql").read_text(encoding="utf-8").split("-- Independent durable Telegram distribution;")[1]
        schema = schema[schema.index("CREATE TABLE"):schema.index("CREATE INDEX")]
        self.cur.execute(schema.replace("CREATE TABLE IF NOT EXISTS", "CREATE TEMP TABLE"))
        self.cur.execute("INSERT INTO telegram_channel_state VALUES ('free_started:free','2026-01-01T00:00:00+00:00')")
        self.cur.execute("INSERT INTO sim_track_record(id,symbol,direction,final_profit_pct,closed_at) VALUES (1,'BTCUSDT','LONG',10,'2026-01-02'),(2,'ETHUSDT','LONG',15,'2026-01-02')")
        self.conn.commit()

    def event(self,n,sid,kind):
        p = dict(signalId=sid,typeSignal=kind,symbol="BTCUSD.P",direction="LONG",timeframe="1H",entry=100,price=105,leverage=20,
                 takeProfits=[dict(price=101),dict(price=102),dict(price=105)],stopLoss=dict(price=98))
        self.cur.execute("INSERT INTO tv_events VALUES (%s,%s,%s,%s,%s,'applied','delivered',%s)",(n,sid,kind,Json(p),datetime.now(timezone.utc),100+n))
        if kind == "entry":
            self.cur.execute("INSERT INTO tv_signals(id,signal_id,telegram_chat_id) VALUES (%s,%s,'main')",(n,sid))
            self.cur.execute("INSERT INTO trades VALUES (%s,%s)",(n,datetime.now(timezone.utc)-timedelta(minutes=10)))

    def test_quota_reply_duplicate_and_promotion(self):
        for i in range(1,5):
            self.event(i,f"s{i}","entry")
        tc.plan_free(self.cur,"free")
        tc.plan_free(self.cur,"free")
        self.cur.execute("SELECT count(*) AS n FROM telegram_free_selections")
        self.assertEqual(self.cur.fetchone()["n"],3)
        self.event(5,"s1","tp2")
        self.event(6,"s4","tp3")
        self.event(7,"s1","tp1")
        tc.plan_free(self.cur,"free")
        self.cur.execute("SELECT * FROM telegram_publications ORDER BY id")
        jobs = self.cur.fetchall()
        self.assertEqual(len(jobs),7)
        self.assertIn("FULL ACCESS",jobs[0]["body"]["text"])
        self.assertIn("HIDDEN",jobs[3]["body"]["text"])
        self.assertEqual(jobs[4]["parent_key"],"free:free:s1:entry")
        self.assertEqual(jobs[5]["parent_key"],"free:free:s4:entry")
        self.assertEqual(jobs[4]["method"],"copyMessage")
        self.conn.commit()
        with patch.object(tc,"call_telegram",return_value=("delivered",777,"confirmed")) as send:
            for _ in range(7):
                self.assertTrue(tc.deliver(self.conn))
            self.assertFalse(tc.deliver(self.conn))
            for call in send.call_args_list[4:]:
                self.assertEqual(call.args[1]["reply_parameters"]["message_id"],777)

    def test_daily_idempotent_order_and_pin(self):
        self.cur.execute("INSERT INTO telegram_channel_state VALUES ('daily_next:main','2026-10-01')")
        self.cur.execute("INSERT INTO sim_track_record VALUES (3,'SOLUSDT','LONG',100,98,20,true,true,false,101,105.25,110,'SL',-3,'2026-10-01T23:59:00+00:00')")
        now = datetime(2026,10,2,0,0,tzinfo=timezone.utc)
        tc.plan_daily(self.cur,"main","free",now)
        tc.plan_daily(self.cur,"main","free",now)
        self.cur.execute("SELECT * FROM telegram_publications ORDER BY id")
        jobs = self.cur.fetchall()
        self.assertEqual(len(jobs),1)
        self.assertIn("TP2 · +105.00%",jobs[0]["body"]["text"])
        self.assertTrue(jobs[0]["pin_after"])
        self.assertEqual(jobs[0]["chat_id"],"main")
        self.conn.commit()
        with patch.object(tc,"call_telegram",return_value=("delivered",777,"confirmed")) as send:
            self.assertTrue(tc.deliver(self.conn))
            self.assertTrue(tc.deliver(self.conn))
            self.assertEqual(send.call_args.args[0],"pinChatMessage")
        self.cur.execute("SELECT value FROM telegram_channel_state WHERE name='pinned:main'")
        self.assertEqual(self.cur.fetchone()["value"],"777")

    def test_unknown_entry_prevents_unlinked_followup(self):
        self.event(1,"s1","entry")
        tc.plan_free(self.cur,"free")
        self.event(2,"s1","tp1")
        tc.plan_free(self.cur,"free")
        self.conn.commit()
        with patch.object(tc,"call_telegram",return_value=("unknown",None,"timeout")) as send:
            self.assertTrue(tc.deliver(self.conn))
            self.assertFalse(tc.deliver(self.conn))
            self.assertEqual(send.call_count,1)

    def test_weekly_closed_trades_utc_bounds_and_deduplication(self):
        self.cur.execute("INSERT INTO telegram_channel_state VALUES ('weekly_next:free','2026-09-28')")
        self.cur.execute("INSERT INTO sim_track_record VALUES (3,'SOLUSDT','LONG',100,98,20,true,true,false,101,105.25,110,'SL',-3,'2026-10-04T23:59:00+00:00')")
        self.cur.execute("INSERT INTO sim_track_record VALUES (4,'EXCLUDED','LONG',100,98,20,false,false,false,101,105,110,'SL',-40,'2026-10-05T00:00:00+00:00')")
        tc.plan_weekly(self.cur,"free",datetime(2026,10,4,23,59,tzinfo=timezone.utc))
        self.cur.execute("SELECT count(*) AS n FROM telegram_publications")
        self.assertEqual(self.cur.fetchone()["n"],0)
        tc.plan_weekly(self.cur,"free",datetime(2026,10,5,0,0,tzinfo=timezone.utc))
        tc.plan_weekly(self.cur,"free",datetime(2026,10,5,0,1,tzinfo=timezone.utc))
        self.cur.execute("SELECT * FROM telegram_publications")
        jobs=self.cur.fetchall()
        self.assertEqual(len(jobs),1)
        text=jobs[0]["body"]["text"]
        self.assertIn("WEEKLY RESULTS",text)
        self.assertIn("TP2 · +105.00%",text)
        self.assertNotIn("EXCLUDED",text)
