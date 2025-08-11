// src/features/clients/components/ClientLinks.jsx
import React, { useEffect, useState } from "react";
import Button from "../../../shared/components/ui/Button.jsx";
import {
  listClientLinks,
  addLink,
  deleteClientLink,
} from "../../../services/clients.api.js";

export default function ClientLinks({ clientId }) {
  const [links, setLinks] = useState([]);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listClientLinks(clientId);
      setLinks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [clientId]);

  const add = async (e) => {
    e.preventDefault();
    await addLink(clientId, { label, url });
    setLabel(""); setUrl("");
    load();
  };

  const remove = async (id) => {
    await deleteClientLink(clientId, id);
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="grid gap-4">
      <form onSubmit={add} className="flex gap-2">
        <input className="border rounded px-3 py-2" placeholder="Label" value={label} onChange={e=>setLabel(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="https://…" value={url} onChange={e=>setUrl(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>

      {loading ? (
        <div className="opacity-60">Loading…</div>
      ) : links.length === 0 ? (
        <div className="opacity-60">No links yet.</div>
      ) : (
        <div className="divide-y">
          {links.map(l => (
            <div key={l.id} className="flex items-center justify-between py-2">
              <a href={l.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{l.label || l.url}</a>
              <Button variant="danger" onClick={()=>remove(l.id)}>Delete</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
