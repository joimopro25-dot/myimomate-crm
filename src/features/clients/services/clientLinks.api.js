// src/features/clients/services/clientLinks.api.js
import { db } from "../../../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

const linksColl = (clientId) => collection(db, "clients", clientId, "links");

export async function listClientLinks(clientId) {
  try {
    const snap = await getDocs(query(linksColl(clientId), orderBy("createdAt","desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await getDocs(linksColl(clientId));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

export async function addLink(clientId, data) {
  const ref = await addDoc(linksColl(clientId), { label:"", url:"", createdAt: serverTimestamp(), ...data });
  return ref.id;
}

export async function updateClientLink(clientId, linkId, data) {
  await updateDoc(doc(db, "clients", clientId, "links", linkId), data);
}

export async function deleteClientLink(clientId, linkId) {
  await deleteDoc(doc(db, "clients", clientId, "links", linkId));
}
