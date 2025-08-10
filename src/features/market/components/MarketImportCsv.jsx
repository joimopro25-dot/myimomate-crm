// features/market/components/MarketImportCsv.jsx
import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import { parseCsv } from '../utils/csv.js';
import { upsertArea } from '../../../services/market.api.js';
export default function MarketImportCsv(){
  const [log,setLog]=useState('');
  const onFile=async(e)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const rows = await parseCsv(f); let ok=0;
    for(const r of rows){
      const areaName = r.area || r.areaName || r.Area || r['area name'];
      const pricePerM2 = parseFloat(String(r.eurPerM2 || r['€/m2'] || r.pricePerM2).replace(',','.'));
      if(areaName && !isNaN(pricePerM2)){
        await upsertArea({ areaName, pricePerM2 }); ok++;
      }
    }
    setLog(`Importadas ${ok}/${rows.length} linhas.`);
  };
  return (
    <div className="bg-white rounded-2xl shadow p-3">
      <div className="flex items-center gap-2">
        <input type="file" accept=".csv,text/csv" onChange={onFile} />
        <Button>Importar CSV</Button>
        <div className="text-sm text-gray-600">Esperado: colunas <code>area, eurPerM2</code></div>
      </div>
      {log && <div className="text-sm mt-2">{log}</div>}
    </div>
  );
}