// features/market/components/MarketTable.jsx
import React, { useEffect, useState } from 'react';
import Card from '../../../shared/components/ui/Card.jsx';
import { listAreas } from '../../../services/market.api.js';
export default function MarketTable(){
  const [areas,setAreas]=useState([]);
  useEffect(()=>{ listAreas().then(setAreas); },[]);
  return (
    <Card title="€/m² por área">
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Área</th><th className="p-2">€/m²</th><th className="p-2">Atualizado</th></tr></thead>
          <tbody>
            {areas.map(a=> (
              <tr key={a.id} className="border-t"><td className="p-2">{a.areaName}</td><td className="p-2">{a.pricePerM2}</td><td className="p-2">{a.updatedAt? new Date(a.updatedAt).toLocaleDateString(): '—'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}