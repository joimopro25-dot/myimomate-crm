// src/services/clients.api.js
import { db, auth } from '../firebase';
import { collection, doc, getDocs, getDoc, addDoc, setDoc } from 'firebase/firestore';

function requireUserId() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  return uid;
}

function clientsCol() {
  const uid = requireUserId();
  return collection(db, 'users', uid, 'clients');
}

export async function listClients() {
  const snap = await getDocs(clientsCol());
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getClient(id) {
  const ref = doc(clientsCol(), id);
  const s = await getDoc(ref);
  return s.exists() ? { id: s.id, ...s.data() } : null;
}

export async function createClient(data) {
  return addDoc(clientsCol(), { ...data, createdAt: Date.now() });
}

export async function updateClient(id, data) {
  const ref = doc(clientsCol(), id);
  return setDoc(ref, { ...data, updatedAt: Date.now() }, { merge: true });
}

// ---- Subcoleções do cliente ----
export async function listLinks(clientId) {
  const uid = requireUserId();
  const col = collection(db, 'users', uid, 'clients', clientId, 'links');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addLink(clientId, link) {
  const uid = requireUserId();
  const col = collection(db, 'users', uid, 'clients', clientId, 'links');
  return addDoc(col, link);
}

export async function saveScenario(clientId, scenario) {
  const uid = requireUserId();
  const col = collection(db, 'users', uid, 'clients', clientId, 'scenarios');
  return addDoc(col, scenario);
}
