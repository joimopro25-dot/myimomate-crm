// pages/DashboardPage.jsx
import React from 'react';
import Card from '../shared/components/ui/Card';
export default function DashboardPage(){
  return (
    <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card title="Leads">Funil rápido (New→Contacted→Qualified→Converted)</Card>
      <Card title="Clients">Atalhos por papel (Buyer/Seller/Investor/Landlord/Tenant)</Card>
      <Card title="Tasks">Próximas tarefas e follow‑ups</Card>
      <Card title="Calendar">Eventos próximos (visitas, CPCV, escritura)</Card>
      <Card title="Market">€/m² por zona (últimas atualizações)</Card>
    </div>
  );
}