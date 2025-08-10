// features/tasks/components/TaskQuickAdd.jsx
import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import { createTask } from '../../../services/tasks.api.js';
export default function TaskQuickAdd({ clientId, dealId, onCreated }){
  const [t,setT]=useState({ title:'', due:'' });
  const submit=async()=>{
    if(!t.title) return;
    const dueAt = t.due ? new Date(t.due+'T00:00:00').getTime() : null;
    await createTask({ title: t.title, dueAt, clientId: clientId||null, dealId: dealId||null });
    setT({ title:'', due:'' }); onCreated && onCreated();
  };
  return (
    <div className="bg-white rounded-2xl shadow p-3">
      <div className="grid md:grid-cols-4 gap-2">
        <input className="border rounded px-3 py-2" placeholder="Tarefa" value={t.title} onChange={e=>setT({...t,title:e.target.value})} />
        <input type="date" className="border rounded px-3 py-2" value={t.due} onChange={e=>setT({...t,due:e.target.value})} />
        <Button onClick={submit}>Adicionar</Button>
      </div>
    </div>
  );
}