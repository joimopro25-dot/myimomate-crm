import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card.jsx';
import ClientTabs from '../components/ClientTabs.jsx';

export default function ClientDetailPage(){
  const { id } = useParams();
  if(!id) return <div className="p-6">Cliente não encontrado.</div>;
  return (
    <div className="p-6 space-y-4">
      <Card title={`Cliente: ${id}`}>
        <div className="text-sm text-gray-600">Detalhe do cliente e ferramentas</div>
      </Card>
      <ClientTabs clientId={id} />
    </div>
  );
}