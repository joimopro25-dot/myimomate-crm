// features/clients/pages/ClientDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ClientTabs from '../components/ClientTabs';
export default function ClientDetailPage(){
  const { id } = useParams();
  return (
    <div className="p-6">
      <div className="mb-4"><h1 className="text-xl font-semibold">Cliente #{id}</h1></div>
      <ClientTabs clientId={id} />
    </div>
  );
}