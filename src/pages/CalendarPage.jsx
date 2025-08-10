import React, { useEffect, useMemo, useState } from 'react';
import CalendarMonth from '../features/calendar/components/CalendarMonth.jsx';
import EventForm from '../features/calendar/components/EventForm.jsx';
import { watchEventsRange } from '../services/events.api.js';
import { startOfMonth, endOfMonth } from '../shared/utils/date.js';

export default function CalendarPage(){
  const [month,setMonth]=useState(Date.now());
  const [events,setEvents]=useState([]);
  useEffect(()=>{ const unsub = watchEventsRange(startOfMonth(new Date(month)), endOfMonth(new Date(month)), setEvents); return ()=>unsub&&unsub(); },[month]);
  const eventsByDay = useMemo(()=>{
    const map={};
    for(const ev of events){ const d=new Date(ev.date).getDate(); (map[d]=map[d]||[]).push(ev); }
    return map;
  },[events]);
  const prev=()=> setMonth(new Date(new Date(month).setMonth(new Date(month).getMonth()-1)).getTime());
  const next=()=> setMonth(new Date(new Date(month).setMonth(new Date(month).getMonth()+1)).getTime());
  return (
    <div className="p-6 space-y-4">
      <EventForm defaultDate={month}/>
      <CalendarMonth monthDate={month} eventsByDay={eventsByDay} onPrev={prev} onNext={next} />
    </div>
  );
}