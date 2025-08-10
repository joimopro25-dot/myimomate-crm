// features/calculators/components/CalculatorFixFlip.jsx
import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import { computeFixFlip } from '../utils/calc.fixflip';
import { saveScenario } from '../../../services/clients.api';
export default function CalculatorFixFlip({ clientId }){
  const [i,setI]=useState({ buy:0, rehab:0, sell:0, buyCostsPct:6, sellCostsPct:6, months:6 });
  const o = computeFixFlip(i);
  const save=()=> saveScenario(clientId,{ strategy:'FIXFLIP', inputs:i, outputs:o, createdAt:Date.now() });
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Compra" type="number" onChange={e=>setI({...i,buy:+e.target.value})}/>
        <input className="border rounded px-2 py-1" placeholder="Obras" type="number" onChange={e=>setI({...i,rehab:+e.target.value})}/>
      </div>
      <div className="text-sm">Lucro: <b>{o.profit?.toFixed(0)}€</b> · ROI: <b>{o.roiPct?.toFixed(2)}%</b> · ROI anualizado: <b>{o.roiAnnPct?.toFixed(2)}%</b></div>
      <Button onClick={save}>Guardar cenário</Button>
    </div>
  );
}