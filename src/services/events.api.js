// services/events.api.js (enhance with range + realtime)
import { db, auth } from '../../shared/services/firebase.js';
import { collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
const base=()=>collection(db,'users',auth.currentUser.uid,'events');
export async function listEvents(){ const s=await getDocs(base()); return s.docs.map(d=>({id:d.id,...d.data()})); }
export async function createEvent(data){ return addDoc(base(),{...data,createdAt:Date.now()}); }
export function watchEventsRange(startTs,endTs,cb){
  const q=query(base(), where('date','>=',startTs), where('date','<=',endTs));
  return onSnapshot(q,(snap)=> cb(snap.docs.map(d=>({id:d.id,...d.data()}))));
}