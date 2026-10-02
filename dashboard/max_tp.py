"""Read-only financial projection for the dashboard. Stored events stay intact."""
import re


def project_sql(sql, params, initial_balance):
    if not re.search(r"\bsim_track_record\b", sql) or "final_profit" not in sql:
        return sql, params
    cte = """WITH priced AS (
        SELECT r.*,
          CASE WHEN hit_tp3 THEN COALESCE(tp3_exit_price,tp3)
               WHEN hit_tp2 THEN COALESCE(tp2_exit_price,tp2)
               WHEN hit_tp1 THEN COALESCE(tp1_exit_price,tp1)
               ELSE exit_price END AS dashboard_exit
        FROM sim_track_record r
    ), valued AS (
        SELECT p.*, (CASE WHEN direction='LONG' THEN 1 ELSE -1 END)
            * (dashboard_exit-entry_price)/NULLIF(entry_price,0)*leverage*100 AS display_roi
        FROM priced p
    ), money AS (
        SELECT v.*, margin_used*display_roi/100 AS display_usdt FROM valued v
    ), dashboard_results AS (
        SELECT (jsonb_populate_record(NULL::sim_track_record, to_jsonb(m) || jsonb_build_object(
            'final_profit_pct',display_roi, 'final_profit_usdt',display_usdt,
            'balance_before',%s + COALESCE(SUM(display_usdt) OVER (ORDER BY closed_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),0),
            'balance_after',%s + SUM(display_usdt) OVER (ORDER BY closed_at,id)
        ))).*, final_profit_usdt AS recorded_final_profit_usdt,
            final_profit_pct AS recorded_final_profit_pct
        FROM money m
    ) """
    return cte + re.sub(r"\bsim_track_record\b", "dashboard_results", sql), (initial_balance,initial_balance,*params)
