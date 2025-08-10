// features/calculators/components/CalculatorOffPlan.jsx — aceitar initial
import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import { computeOffPlan } from '../utils/calc.offplan.js';
import { saveScenario } from '../../../services/clients.api.js';
export default function CalculatorOffPlan({ clientId, initial }){
  const [i,setI]=useState({ deposit:0, installments:0, finalPrice:0, expectedPrice:0, months:18 });
  useEffect(()=>{ if(initial) setI(prev=>({ ...prev, ...initial })); },[initial]);
  const o = computeOffPlan(i);
  const save=()=> saveScenario(clientId,{ strategy:'OFFPLAN', inputs:i, outputs:o, createdAt:Date.now() });
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Sinal" type="number" value={i.deposit} onChange={e=>setI({...i,deposit:+e.target.value})}/>
        <input className="border rounded px-2 py-1" placeholder="Prestações" type="number" value={i.installments} onChange={e=>setI({...i,installments:+e.target.value})}/>
      </div>
      <div className="text-sm">ROI capital: <b>{o.roiPct?.toFixed(2)}%</b> · Caixa total: <b>{o.totalCash?.toFixed(0)}€</b></div>
      <Button onClick={save}>Guardar cenário</Button>
    </div>
  );
}