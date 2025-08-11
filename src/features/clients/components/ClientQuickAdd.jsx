// src/features/clients/components/ClientQuickAdd.jsx
import React, { useState } from "react";
import Button from "../../../shared/components/ui/Button.jsx";
import { createClient } from "../../../services/clients.api";

export default function ClientQuickAdd({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole]   = useState("Buyer");
  const [saving, setSaving] = useState(false);
  const roles = ["Buyer","Seller","Investor","Landlord","Tenant"];

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createClient({ name, email, phone, roles: [role] });
      onCreated?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar cliente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      {/* modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-5">
        <h3 className="text-lg font-semibold mb-4">Add Client</h3>
        <form onSubmit={submit} className="grid gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Name *"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
          <input
            className="border rounded-lg px-3 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
