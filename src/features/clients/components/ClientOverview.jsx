/ features/clients/components/ClientOverview.jsx
import React from 'react';
import Card from '../../../shared/components/ui/Card';
export default function ClientOverview(){
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Perfil">Dados principais, rating, tags</Card>
      <Card title="Resumo de Atividade">Últimas tarefas, eventos, cenários</Card>
    </div>
  );
}