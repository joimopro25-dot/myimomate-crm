// src/services/clients.api.js
import { db } from "../firebase";
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

const coll = collection(db, "clients");

export async function listClients() {
  try {
    const q = query(coll, orderBy("createdAt","desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await getDocs(coll);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

export async function createClient(data) {
  const ref = await addDoc(coll, { name:"", email:"", phone:"", roles:[], createdAt: serverTimestamp(), ...data });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}
export async function getClient(id) { const snap = await getDoc(doc(db, "clients", id)); return snap.exists() ? { id: snap.id, ...snap.data() } : null; }
export async function updateClient(id, data) { await updateDoc(doc(db, "clients", id), data); }
export async function deleteClient(id) { await deleteDoc(doc(db, "clients", id)); }

// 🔁 Reexports (compatibilidade com o que já tinhas):
export { listClientLinks, addLink, updateClientLink, deleteClientLink } from "../features/clients/services/clientLinks.api";
export { listScenarios, saveScenario, getScenario, deleteScenario } from "../features/clients/services/clientScenarios.api";
