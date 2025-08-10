// app/router/useAuthState.js (helper)
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
export function useAuthState(){
  const [user,setUser]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ const u=onAuthStateChanged(auth,(x)=>{setUser(x);setLoading(false);}); return ()=>u&&u(); },[]);
  return { user, loading };
}