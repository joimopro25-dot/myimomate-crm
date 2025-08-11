import React, { useEffect, useState } from "react";
import Card from "../shared/components/ui/Card.jsx";
import Button from "../shared/components/ui/Button.jsx";
import { listClients, deleteClient } from "../services/clients.api.js";
import ClientQuickAdd from "../features/clients/components/ClientQuickAdd.jsx";

export default function ClientsPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listClients();
      setClients(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this client?")) return;
    await deleteClient(id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clients</h1>
        <Button onClick={()=>setOpenAdd(true)}>+ Add New</Button>
      </div>

      <Card>
        {loading && <div className="p-6 opacity-70">Loading…</div>}
        {!loading && clients.length === 0 && (
          <div className="p-10 text-center opacity-60">
            No clients yet. Add your first client to get started!
          </div>
        )}

        {!loading && clients.length > 0 && (
          <div className="divide-y">
            {clients.map(c => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="font-medium">{c.name || "Unnamed"}</div>
                  <div className="text-sm opacity-70">
                    {(c.roles?.join(", ") || "—")} · {c.email || "—"} · {c.phone || "—"}
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* TODO: Link para detalhe /clients/:id quando estiver ativo */}
                  <Button variant="danger" onClick={()=>remove(c.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ClientQuickAdd
        open={openAdd}
        onClose={()=>setOpenAdd(false)}
        onCreated={load}
      />
    </div>
  );
}
