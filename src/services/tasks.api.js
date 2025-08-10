// services/tasks.api.js
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, setDoc, deleteDoc, orderBy } from 'firebase/firestore';
const base=()=>collection(db,'users',auth.currentUser.uid,'tasks');
export async function listTasks({ status, from, to }={}){
  let q = base();
  // filtros simples (status, due range)
  const filters=[];
  if(status) filters.push(where('status','==',status));
  if(from) filters.push(where('dueAt','>=',from));
  if(to) filters.push(where('dueAt','<=',to));
  if(filters.length){ q=query(q, ...filters); }
  const s=await getDocs(q); return s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.dueAt||0)-(b.dueAt||0));
}
export async function createTask(data){ return addDoc(base(),{...data, status: data.status||'todo', createdAt:Date.now()}); }
export async function updateTask(id,data){ const r=doc(base(),id); return setDoc(r,{...data, updatedAt:Date.now()},{merge:true}); }
export async function toggleTask(id, done){ return updateTask(id,{ status: done? 'done':'todo' }); }
export async function deleteTask(id){ const r=doc(base(),id); return deleteDoc(r); }
