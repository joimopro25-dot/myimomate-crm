// services/clients.api.js
import { db, auth } from '../firebase';
import { collection, doc, getDocs, getDoc, addDoc, setDoc } from 'firebase/firestore';
const base = () => collection(db, 'users', auth.currentUser.uid, 'clients');
export async function listClients(){ const snap=await getDocs(base()); return snap.docs.map(d=>({id:d.id,...d.data()})); }
export async function getClient(id){ const ref=doc(base(), id); const s=await getDoc(ref); return {id:s.id,...s.data()}; }
export async function createClient(data){ return addDoc(base(), { ...data, createdAt: Date.now() }); }
export async function updateClient(id,data){ const ref=doc(base(), id); return setDoc(ref,{...data, updatedAt:Date.now()},{merge:true}); }