// features/deals/components/DealsBoard.jsx
import React, { useEffect, useState } from 'react';
import Card from '../../../shared/components/ui/Card.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import { db, auth } from '../../../firebase';
import { collection, onSnapshot, addDoc, doc, setDoc } from 'firebase/firestore';

const STAGES = ['Qualification','Tour','Offer','CPCV','Deed'];
const dealsCol = () => collection(db,'users',auth.currentUser.uid,'deals');

function Column({ title, children }){
  return (
    <div className="bg-white rounded-2xl shadow p-3 min-h-[200px]">
      <div className="font-semibold mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function DealCard({ deal }){
  const idx = STAGES.indexOf(deal.stage || 'Qualification');
  const prev = idx>0 ? STAGES[idx-1] : null;
  const next = idx<STAGES.length-1 ? STAGES[idx+1] : null;
  const go = async (stage)=>{ const r=doc(dealsCol(),deal.id); await setDoc(r,{stage},{merge:true}); };
  return (
    <div className="border rounded-xl p-3">
      <div className="font-medium">{deal.title || 'Deal'}</div>
      <div className="text-sm text-gray-600">{deal.role || 'buyer'}</div>
      <div className="mt-2 flex gap-2 flex-wrap">
        {prev && <Button onClick={()=>go(prev)} className="text-sm">← {prev}</Button>}
        {next && <Button onClick={()=>go(next)} className="text-sm">{next} →</Button>}
      </div>
    </div>
  );
}
export default function DealsBoard(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({ title:'', role:'buyer' });
  useEffect(()=>{ const u=onSnapshot(dealsCol(), (snap)=> setItems(snap.docs.map(d=>({id:d.id,...d.data()})))); return ()=>u(); },[]);
  const add= async()=>{ if(!form.title) return; await addDoc(dealsCol(),{...form, stage:'Qualification', createdAt:Date.now()}); setForm({ title:'', role:'buyer' }); };
  return (
    <div className="p-6 space-y-4">
      <Card title="Novo Deal">
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Título" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <select className="border rounded px-3 py-2" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <Button onClick={add}>Adicionar</Button>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STAGES.map(stage => (
          <Column key={stage} title={stage}>
            {items.filter(d => (d.stage||'Qualification')===stage).map(d => (
              <DealCard key={d.id} deal={d} />
            ))}
          </Column>
        ))}
      </div>
    </div>
  );
}
