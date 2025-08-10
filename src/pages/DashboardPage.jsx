import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../shared/components/ui/Card';

export default function DashboardPage(){
  return (
    <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/leads"><Card title="Leads">Funil rápido (New→Contacted→Qualified→Converted)</Card></Link>
      <Link to="/clients"><Card title="Clients">Atalhos por papel (Buyer/Seller/Investor/Landlord/Tenant)</Card></Link>
      <Link to="/tasks"><Card title="Tasks">Próximas tarefas e follow-ups</Card></Link>
      <Link to="/calendar"><Card title="Calendar">Eventos próximos (visitas, CPCV, escritura)</Card></Link>
      <Link to="/market"><Card title="Market">€/m² por zona (últimas atualizações)</Card></Link>
      <Link to="/deals"><Card title="Deals">Pipeline (Qualificação→Visita→Proposta→CPCV→Escritura)</Card></Link>
    </div>
  );
}
