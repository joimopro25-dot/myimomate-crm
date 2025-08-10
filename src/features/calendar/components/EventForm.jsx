// features/calendar/components/EventForm.jsx
import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import { createEvent } from '../../../services/events.api.js';
import { toDateInputValue } from '../../../shared/utils/date.js';
export default function EventForm({ defaultDate, clientId, linkId, onCreated }){
  const [form,setForm]=useState({ title:'', type:'visit', date: toDateInputValue(defaultDate||Date.now()) });
  const submit=async()=>{
    const dateTs = new Date(form.date+'T00:00:00').getTime();
    await createEvent({ ...form, date: dateTs, clientId: clientId||null, linkId: linkId||null });
    setForm({ title:'', type:'visit', date: toDateInputValue(defaultDate||Date.now()) });
    onCreated && onCreated();
  };
  return (
    <div className="bg-white rounded-2xl shadow p-3">
      <div className="grid md:grid-cols-4 gap-2">
        <input className="border rounded px-3 py-2" placeholder="Título" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <select className="border rounded px-3 py-2" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          <option value="visit">Visita</option>
          <option value="followup">Follow‑up</option>
          <option value="cpcv">CPCV</option>
          <option value="deed">Escritura</option>
          <option value="deadline">Prazo</option>
        </select>
        <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        <Button onClick={submit}>Criar evento</Button>
      </div>
    </div>
  );
}