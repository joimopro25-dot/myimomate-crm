// src/services/leads.api.js
import { db, auth } from '../firebase';
import {
  collection, addDoc, getDocs, doc, setDoc, deleteDoc, getDoc,
} from 'firebase/firestore';
import { createClient } from './clients.api.js';

const base = () => collection(db, 'users', auth.currentUser.uid, 'leads');

export async function listLeads() {
  const s = await getDocs(base());
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createLead(data) {
  return addDoc(base(), { ...data, createdAt: Date.now(), stage: data.stage || 'New' });
}

export async function updateLead(id, data) {
  const r = doc(base(), id);
  return setDoc(r, { ...data, updatedAt: Date.now() }, { merge: true });
}

export async function setLeadStage(id, stage) {
  return updateLead(id, { stage });
}

export async function deleteLead(id) {
  const r = doc(base(), id);
  return deleteDoc(r);
}

export async function convertLeadToClient(lead) {
  // garantir dados mais recentes do lead
  let data = lead;
  try {
    const r = doc(base(), lead.id);
    const s = await getDoc(r);
    if (s.exists()) data = s.data();
  } catch {}

  await createClient({
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    source: data.source || 'lead',
    roles: { buyer: true, seller: false, investor: false, landlord: false, tenant: false },
    createdFrom: 'lead',
    createdAt: Date.now(),
  });

  // apaga o lead depois de criar o cliente
  if (lead.id) await deleteLead(lead.id);
}
