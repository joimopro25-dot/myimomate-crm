// services/market.api.js
import { db, auth } from '../../shared/services/firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
const base=()=>collection(db,'users',auth.currentUser.uid,'market');
export async function listAreas(){ const s=await getDocs(base()); return s.docs.map(d=>({id:d.id,...d.data()})); }
export async function upsertArea(area){ return addDoc(base(),{...area,updatedAt:Date.now()}); }
