import os
import unittest
from decimal import Decimal
import psycopg2
from dashboard.max_tp import project_sql


class ProjectionTests(unittest.TestCase):
    def test_unrelated_queries_are_untouched(self):
        self.assertEqual(project_sql('SELECT * FROM tv_events',(),1000),('SELECT * FROM tv_events',()))

    @unittest.skipUnless(os.getenv('ONZA_TEST_DATABASE_URL'), 'Requires temporary PostgreSQL tables')
    def test_projection_and_original_accounting_are_independent(self):
        conn=psycopg2.connect(os.environ['ONZA_TEST_DATABASE_URL'])
        try:
            with conn.cursor() as cur:
                cur.execute('CREATE TEMP TABLE sim_track_record (LIKE public.sim_track_record)')
                cur.execute("""INSERT INTO sim_track_record (id,symbol,direction,entry_price,exit_price,
                    tp1,tp2,tp3,hit_tp1,hit_tp2,hit_tp3,margin_used,leverage,final_profit_usdt,close_reason,closed_at)
                    VALUES (1,'A','LONG',100,95,102,104,108,true,false,false,5000,20,-2200,'SL','2026-10-01'),
                           (2,'B','SHORT',100,92,98,96,92,true,true,true,1000,20,900,'TP3','2026-10-02'),
                           (3,'C','LONG',100,95,102,104,108,false,false,false,100,20,-100,'SL','2026-10-03')""")
                sql,params=project_sql('SELECT final_profit_usdt,balance_after,recorded_final_profit_usdt,close_reason FROM sim_track_record ORDER BY id',(),100000)
                cur.execute(sql,params)
                rows=cur.fetchall()
                self.assertEqual(rows[0],(Decimal(2000),Decimal(102000),Decimal(-2200),'SL'))
                self.assertEqual(rows[1][0],Decimal(1600))
                self.assertEqual(rows[2][1],Decimal(103500))
                cur.execute('SELECT final_profit_usdt FROM sim_track_record ORDER BY id')
                self.assertEqual([r[0] for r in cur.fetchall()],[Decimal(-2200),Decimal(900),Decimal(-100)])
        finally:
            conn.rollback()
            conn.close()
