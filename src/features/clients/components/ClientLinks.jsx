import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import { listLinks, addLink } from '../../../services/clients.api.js';
import { listAreas } from '../../../services/market.api.js';
import { createEvent } from '../../../services/events.api.js';

export default function ClientLinks({ clientId }){
  const [items,setItems]=useState([]);
  const [areas,setAreas]=useState([]);
  const [form,setForm]=useState({ url:'', price:'', areaM2:'', areaName:'' });
  const load=async()=>{ setItems(await listLinks(clientId)); setAreas(await listAreas()); };
  useEffect(()=>{ load(); },[clientId]);

  const onAdd=async()=>{
    if(!form.url) return;
    const price = parseFloat(form.price||'0');
    const areaM2 = parseFloat(form.areaM2||'0');
    const eurPerM2 = (price>0 && areaM2>0)? +(price/areaM2).toFixed(2) : null;
    await addLink(clientId,{ url: form.url, price, areaM2, eurPerM2, areaName: form.areaName||null, createdAt:Date.now() });
    setForm({ url:'', price:'', areaM2:'', areaName:'' });
    await load();
  };

  const scheduleVisit = async (link) => {
    const title = `Visita: ${link.url}`;
    const date = Date.now();
    await createEvent({ title, type:'visit', date, clientId, linkId: link.id });
    alert('Visita marcada para hoje (edita no Calendar).');
  };

  return (
    <Card title="Imóveis (links externos)">
      <div className="grid md:grid-cols-5 gap-2 mb-3">
        <input className="border rounded px-3 py-2" placeholder="https://…" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Preço (€)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Área (m²)" value={form.areaM2} onChange={e=>setForm({...form,areaM2:e.target.value})} />
        <select className="border rounded px-3 py-2" value={form.areaName} onChange={e=>setForm({...form,areaName:e.target.value})}>
          <option value="">— Área —</option>
          {areas.map(a=> <option key={a.id} value={a.areaName}>{a.areaName}</option>)}
        </select>
        <Button onClick={onAdd}>Adicionar</Button>
      </div>
      <ul className="space-y-2">
        {items.map((x)=> {
          const m = areas.find(a=>a.areaName===x.areaName);
          const diff = (x.eurPerM2 && m?.pricePerM2)? (((x.eurPerM2 - m.pricePerM2)/m.pricePerM2)*100).toFixed(1) : null;
          return (
            <li key={x.id} className="border rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <a className="text-blue-600 underline truncate" href={x.url} target="_blank" rel="noreferrer">{x.url}</a>
                <div className="text-sm text-gray-600">{x.areaName || '—'}</div>
              </div>
              <div className="text-sm mt-1">Preço: {x.price? `${x.price}€`:'—'} · Área: {x.areaM2? `${x.areaM2} m²`:'—'} · €/m²: {x.eurPerM2??'—'} {diff? `(${diff}% vs mercado)`:''}</div>
              <div className="mt-2"><Button className="text-sm" onClick={()=>scheduleVisit(x)}>Marcar visita</Button></div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}