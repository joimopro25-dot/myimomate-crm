// 3) features/clients/components/ClientForm.Basic.jsx — editar dados base + papéis
import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import { getClient, updateClient } from '../../../services/clients.api.js';

const emptyRoles = { buyer:false, seller:false, investor:false, landlord:false, tenant:false };

export default function ClientFormBasic({ clientId }){
  const [form, setForm] = useState({ name:'', email:'', phone:'', roles: emptyRoles });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    let active=true;
    (async()=>{
      if(!clientId) return;
      const c = await getClient(clientId);
      if(active && c){
        setForm({
          name: c.name||'',
          email: c.email||'',
          phone: c.phone||'',
          roles: { ...emptyRoles, ...(c.roles||{}) }
        });
        setLoading(false);
      }
    })();
    return ()=>{ active=false };
  },[clientId]);

  const save = async()=>{
    setSaving(true);
    await updateClient(clientId, {
      name: form.name, email: form.email, phone: form.phone, roles: form.roles
    });
    setSaving(false);
  };

  if(loading) return <div>Loading…</div>;

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-2">
        <input className="border rounded px-3 py-2" placeholder="Nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Telefone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
      </div>
      <div className="flex flex-wrap gap-3">
        {Object.keys(emptyRoles).map(key => (
          <label key={key} className="inline-flex items-center gap-2">
            <input type="checkbox" checked={!!form.roles[key]} onChange={e=>setForm({...form, roles:{...form.roles, [key]: e.target.checked}})} />
            <span className="capitalize">{key}</span>
          </label>
        ))}
      </div>
      <Button onClick={save} disabled={saving}>{saving? 'A guardar…' : 'Guardar'}</Button>
    </div>
  );
}
