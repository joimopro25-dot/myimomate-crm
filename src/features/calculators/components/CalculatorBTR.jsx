/ features/calculators/components/CalculatorBTR.jsx
import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import { computeBTR } from '../utils/calc.btr';
import { saveScenario } from '../../../services/clients.api';
export default function CalculatorBTR({ clientId }){
  const [i,setI]=useState({ price:0, costsPct:6, rent:0, imi:0, insure:0, maintPct:8, vacancyPct:5, ltv:0, rate:4, years:30 });
  const o = computeBTR(i);
  const save=()=> saveScenario(clientId,{ strategy:'BTR', inputs:i, outputs:o, createdAt:Date.now() });
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Preço" type="number" onChange={e=>setI({...i,price:+e.target.value})}/>
        <input className="border rounded px-2 py-1" placeholder="Renda/mês" type="number" onChange={e=>setI({...i,rent:+e.target.value})}/>
      </div>
      <div className="text-sm">Yield bruto: <b>{o.grossYield?.toFixed(2)}%</b> · Yield líquido: <b>{o.netYield?.toFixed(2)}%</b> · CoC: <b>{o.coc?.toFixed(2)}%</b></div>
      <Button onClick={save}>Guardar cenário</Button>
    </div>
  );
}