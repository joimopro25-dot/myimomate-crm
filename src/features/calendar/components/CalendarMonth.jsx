// features/calendar/components/CalendarMonth.jsx
import React from 'react';
function range(n,start=0){ return Array.from({length:n},(_,i)=>i+start); }
const WEEK = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
export default function CalendarMonth({ monthDate, eventsByDay, onPrev, onNext }){
  const d = new Date(monthDate);
  const year=d.getFullYear(), month=d.getMonth();
  const first=new Date(year,month,1); const last=new Date(year,month+1,0);
  const padStart = (first.getDay()+6)%7; // semana começa em Seg
  const total = padStart + last.getDate(); const rows = Math.ceil(total/7);
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <button className="px-3 py-1 rounded-xl bg-white shadow" onClick={onPrev}>←</button>
        <div className="font-semibold">{d.toLocaleString('pt-PT',{month:'long', year:'numeric'})}</div>
        <button className="px-3 py-1 rounded-xl bg-white shadow" onClick={onNext}>→</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600 mb-2">
        {WEEK.map(w=> <div key={w}>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {range(padStart).map(i=> <div key={`pad-${i}`} />)}
        {range(last.getDate(),1).map(day=> (
          <div key={day} className="border rounded-xl p-2 min-h-[80px]">
            <div className="text-xs text-gray-500 mb-1">{day}</div>
            <div className="space-y-1">
              {(eventsByDay[day]||[]).slice(0,3).map(ev=> (
                <div key={ev.id} className="text-xs truncate">• {ev.title||ev.type}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
