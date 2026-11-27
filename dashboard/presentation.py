"""SQL projections for web presentation only. No updates or delivery calls."""
import re
from presentation_config import RISK_PER_TRADE


def project_sql(sql, params, initial_balance):
    amount = str(RISK_PER_TRADE)
    if re.search(r"\bFROM trades\b",sql) and "pnl_accumulated" in sql:
        # Existing signal margins remain stored unchanged; scale only the returned row.
        cte = f"""WITH presentation_open AS (
          SELECT (jsonb_populate_record(NULL::trades,to_jsonb(t)||jsonb_build_object(
            'pnl_accumulated',ROUND((CASE WHEN t.side='LONG' THEN 1 ELSE -1 END)*{amount}/NULLIF(ABS(t.entry::numeric-t.stop_loss::numeric),0)*(CASE WHEN t.tp1_filled THEN .4*(COALESCE(t.tp1_fill_price,t.tp1)::numeric-t.entry::numeric) ELSE 0 END+CASE WHEN t.tp2_filled THEN .4*(COALESCE(t.tp2_fill_price,t.tp2)::numeric-t.entry::numeric) ELSE 0 END+CASE WHEN t.tp3_filled THEN .2*(COALESCE(t.tp3_fill_price,t.tp3)::numeric-t.entry::numeric) ELSE 0 END),8),
            'be_active',COALESCE(t.tp1_filled,FALSE),
            'current_sl',CASE WHEN t.tp1_filled THEN t.entry ELSE t.stop_loss END
          ))).*,{amount}*t.entry::numeric/(NULLIF(ABS(t.entry::numeric-t.stop_loss::numeric),0)*t.leverage) AS display_margin_used
          FROM trades t JOIN tv_signals s ON s.id=t.message_id
        ) """
        sql = re.sub(r"\bFROM trades\b", "FROM presentation_open trades",sql)
        return cte+sql,params
    if not re.search(r"\bsim_track_record\b",sql) or "final_profit" not in sql:
        return sql,params
    cte = f"""WITH priced AS (
      SELECT r.*,
        COALESCE(hit_tp1,FALSE) AND NOT COALESCE(hit_tp3,FALSE) AND
          (CASE WHEN direction='LONG' THEN exit_price<=entry_price ELSE exit_price>=entry_price END) AS display_be,
        1-CASE WHEN hit_tp1 THEN .4 ELSE 0 END-CASE WHEN hit_tp2 THEN .4 ELSE 0 END-
          CASE WHEN hit_tp3 THEN .2 ELSE 0 END AS remaining
      FROM sim_track_record r
    ), valued AS (
      SELECT p.*,CASE WHEN display_be THEN entry_price ELSE exit_price END AS display_exit,
        (
          CASE WHEN hit_tp1 THEN .4*(COALESCE(tp1_exit_price,tp1)-entry_price) ELSE 0 END+
          CASE WHEN hit_tp2 THEN .4*(COALESCE(tp2_exit_price,tp2)-entry_price) ELSE 0 END+
          CASE WHEN hit_tp3 THEN .2*(COALESCE(tp3_exit_price,tp3)-entry_price) ELSE 0 END+
          remaining*(CASE WHEN display_be THEN 0 ELSE exit_price-entry_price END)
        ) AS display_move FROM priced p
    ), money AS (
      SELECT v.*,(CASE WHEN direction='LONG' THEN 1 ELSE -1 END)*leverage*display_move/NULLIF(entry_price,0) AS display_return,
        ROUND({amount}*(CASE WHEN direction='LONG' THEN 1 ELSE -1 END)*display_move/NULLIF(ABS(entry_price-stop_loss),0),2) AS display_usdt,
        {amount}*entry_price/(NULLIF(ABS(entry_price-stop_loss),0)*leverage) AS display_margin FROM valued v
    ), dashboard_results AS (
      SELECT (jsonb_populate_record(NULL::sim_track_record,to_jsonb(m)||jsonb_build_object(
        'margin_used',display_margin,'exit_price',display_exit,
        'close_reason',CASE WHEN display_be THEN 'BE_INFERRED' ELSE close_reason END,
        'final_profit_pct',ROUND(display_return*100,4),'final_profit_usdt',display_usdt,
        'balance_before',%s+COALESCE(SUM(display_usdt) OVER(ORDER BY closed_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),0),
        'balance_after',%s+SUM(display_usdt) OVER(ORDER BY closed_at,id)
      ))).*,display_usdt AS recorded_final_profit_usdt,ROUND(display_return*100,4) AS recorded_final_profit_pct,
        final_profit_usdt AS source_recorded_final_profit_usdt
      FROM money m
    ) """
    return cte+re.sub(r"\bsim_track_record\b","dashboard_results",sql),(initial_balance,initial_balance,*params)
