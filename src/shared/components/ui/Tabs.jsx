// shared/components/ui/Tabs.jsx
import React from 'react';
export default function Tabs({ tabs, value, onChange }){
  return (
    <div>
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {tabs.map(t=> (
          <button key={t.key} onClick={()=>onChange(t.key)} className={`px-3 py-2 rounded-xl ${value===t.key? 'bg-black text-white':'bg-white shadow'}`}>{t.label}</button>
        ))}
      </div>
      <div>{tabs.find(t=>t.key===value)?.node}</div>
    </div>
  );
}
