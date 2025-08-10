// features/clients/components/ClientLinks.jsx
import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import { listLinks, addLink } from '../../../services/clients.api';
export default function ClientLinks({ clientId }){
  const [items,setItems]=useState([]);
  const [url,setUrl]=useState('');
  useEffect(()=>{ listLinks(clientId).then(setItems); },[clientId]);
  const onAdd=async()=>{ if(!url) return; await addLink(clientId,{ url, createdAt:Date.now() }); setUrl(''); setItems(await listLinks(clientId)); };
  return (
    <Card title="Imóveis (links externos)">
      <div className="flex gap-2 mb-3">
        <input className="border rounded px-3 py-2 flex-1" placeholder="https://…" value={url} onChange={e=>setUrl(e.target.value)} />
        <Button onClick={onAdd}>Adicionar</Button>
      </div>
      <ul className="space-y-2">
        {items.map((x)=> <li key={x.id}><a className="text-blue-600 underline" href={x.url} target="_blank" rel="noreferrer">{x.url}</a></li>)}
      </ul>
    </Card>
  );
}