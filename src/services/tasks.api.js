
// services/tasks.api.js
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
const base=()=>collection(db,'users',auth.currentUser.uid,'tasks');
export async function listTasks(){ const s=await getDocs(base()); return s.docs.map(d=>({id:d.id,...d.data()})); }
export async function createTask(data){ return addDoc(base(),{...data,createdAt:Date.now()}); }
