// pages/MarketPage.jsx
import React from 'react';
import MarketImportCsv from '../features/market/components/MarketImportCsv.jsx';
import MarketTable from '../features/market/components/MarketTable.jsx';
export default function MarketPage(){
  return (
    <div className="p-6 space-y-4">
      <MarketImportCsv/>
      <MarketTable/>
    </div>
  );
}