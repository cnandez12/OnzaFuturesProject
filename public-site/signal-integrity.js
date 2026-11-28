/* Shared web-only checks. A price crossing is an inconsistency, never a broker fill. */
function signalIntegrityIssue(row,mark){
 if(row.integrity_note)return row.integrity_note;
 if(row.closed)return null;
 mark=Number(mark);if(!(mark>0)||!Number.isFinite(mark))return null;
 const side=String(row.direction||row.side||'').toUpperCase();if(!['LONG','SHORT'].includes(side))return null;
 const long=side==='LONG',highest=Number(row.max_tp||0);
 const hits=[1,2,3].map(i=>!!(row['hit_tp'+i]||row['tp'+i+'_filled']||highest>=i));
 if(hits[2])return 'TP3 registrado sin cierre conciliado';
 const targets=row.targets||[row.tp1,row.tp2,row.tp3];
 for(let i=2;i>=0;i--){const target=Number(targets[i]);if(target>0&&!hits[i]&&(long?mark>=target:mark<=target))return 'Precio alcanza TP'+(i+1)+'; falta conciliar la actualización';}
 const entry=Number(row.entry_price??row.entry),be=row.be_active||row.be_activated;
 const stop=Number(be?entry:row.current_sl||row.original_stop||row.stop_loss);
 if(stop>0&&(long?mark<=stop:mark>=stop))return 'Precio alcanza el stop del escenario; salida sin conciliar';
 return null;
}
