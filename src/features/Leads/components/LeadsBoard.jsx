// features/leads/components/LeadsBoard.jsx
import React, { useEffect, useState } from 'react';
import Card from '../../../shared/components/ui/Card.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import { db, auth } from '../../../shared/services/firebase.js';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

const STAGES = ['New','Contacted','Qualified','Converted'];
const leadsCol = () => collection(db,'users',auth.currentUser.uid,'leads');

function Column({ title, children }){
  return (
    <div className="bg-white rounded-2xl shadow p-3 min-h-[200px]">
      <div className="font-semibold mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function LeadCard({ lead, refresh }){
  const idx = STAGES.indexOf(lead.stage || 'New');
  const prev = idx>0 ? STAGES[idx-1] : null;
  const next = idx<STAGES.length-1 ? STAGES[idx+1] : null;
  const go = async (stage)=>{ const r=doc(leadsCol(),lead.id); await setDoc(r,{stage},{merge:true}); };
  const convert = async ()=>{ /* aqui podes chamar createClient(...) e depois deleteDoc */ const r=doc(leadsCol(),lead.id); await deleteDoc(r); };
  return (
    <div className="border rounded-xl p-3">
      <div className="font-medium">{lead.name || 'Lead'}</div>
      <div className="text-sm text-gray-600">{lead.email || lead.phone || '—'}</div>
      <div className="mt-2 flex gap-2 flex-wrap">
        {prev && <Button onClick={()=>go(prev)} className="text-sm">← {prev}</Button>}
        {next && <Button onClick={()=>go(next)} className="text-sm">{next} →</Button>}
        <Button onClick={convert} className="text-sm">Converter p/ Cliente</Button>
      </div>
    </div>
  );
}
export default function LeadsBoard(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({ name:'', email:'', phone:'' });
  useEffect(()=>{ const u=onSnapshot(leadsCol(), (snap)=> setItems(snap.docs.map(d=>({id:d.id,...d.data()})))); return ()=>u(); },[]);
  const add=async()=>{ if(!form.name && !form.email && !form.phone) return; await addDoc(leadsCol(),{...form, stage:'New', createdAt:Date.now()}); setForm({name:'',email:'',phone:''}); };
  return (
    <div className="p-6 space-y-4">
      <Card title="Novo Lead">
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Telefone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <Button onClick={add}>Adicionar</Button>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAGES.map(stage => (
          <Column key={stage} title={stage}>
            {items.filter(l => (l.stage||'New')===stage).map(l => (
              <LeadCard key={l.id} lead={l} />
            ))}
          </Column>
        ))}
      </div>
    </div>
  );
}
