// src/services/clients.api.js
import { db } from "../firebase";
import {
  collection, addDoc, getDocs, getDoc,
  doc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy
} from "firebase/firestore";

const coll = collection(db, "clients");

export async function listClients() {
  // tenta ordenar por createdAt; se não existir índice, cai para getDocs simples
  try {
    const q = query(coll, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await getDocs(coll);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

export async function createClient(data) {
  const ref = await addDoc(coll, {
    name: "",
    email: "",
    phone: "",
    roles: [],              // ["Buyer","Seller","Investor","Landlord","Tenant"]
    createdAt: serverTimestamp(),
    ...data,
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function getClient(id) {
  const snap = await getDoc(doc(db, "clients", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateClient(id, data) {
  await updateDoc(doc(db, "clients", id), data);
}

export async function deleteClient(id) {
  await deleteDoc(doc(db, "clients", id));
}
// Helpers para subcoleção 'links' de cada cliente
const clientLinksColl = (clientId) => collection(db, "clients", clientId, "links");

// Listar links de um cliente
export async function listClientLinks(clientId) {
  const snap = await getDocs(clientLinksColl(clientId));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Adicionar link a um cliente
export async function addLink(clientId, data) {
  // data: { label, url }
  const ref = await addDoc(clientLinksColl(clientId), {
    label: "",
    url: "",
    createdAt: serverTimestamp(),
    ...data,
  });
  return ref.id;
}

// Atualizar um link
export async function updateClientLink(clientId, linkId, data) {
  await updateDoc(doc(db, "clients", clientId, "links", linkId), data);
}

// Apagar um link
export async function deleteClientLink(clientId, linkId) {
  await deleteDoc(doc(db, "clients", clientId, "links", linkId));
}
