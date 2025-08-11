// src/pages/Dashboard.jsx
import React from "react";
import { useKpis } from "../features/dashboard/hooks/useKpis";

// opcional: helper local para € bonito
const formatCurrency = (v) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v || 0);

export default function Dashboard() {
  const {
    loading,
    totalClients,
    activeDeals,
    pipelineValue,
    pendingTasks,
    highPriorityTasks,
    newLeadsThisMonth,
    conversionRate,
    completedDealsThisMonth,
  } = useKpis();

  // 👉 mantém TODO o teu markup existente; só troca os números hardcoded por estas variáveis
  // Exemplo (adaptar aos teus elementos):
  return (
    <div className="dashboard-wrapper">
      {/* ... header/toolbar igual ... */}

      {/* Card: Total Clients */}
      <div className="card kpi">
        <div className="kpi-title">Total Clients</div>
        <div className="kpi-value">{loading ? "…" : totalClients}</div>
        <div className="kpi-sub">Avg. Health: 75%</div>
      </div>

      {/* Card: Active Deals */}
      <div className="card kpi">
        <div className="kpi-title">Active Deals</div>
        <div className="kpi-value">
          {loading ? "…" : activeDeals}
        </div>
        <div className="kpi-sub">{loading ? "…" : formatCurrency(pipelineValue)}</div>
      </div>

      {/* Card: Pending Tasks */}
      <div className="card kpi">
        <div className="kpi-title">Pending Tasks</div>
        <div className="kpi-value">{loading ? "…" : pendingTasks}</div>
        <div className="kpi-sub">{loading ? "…" : `${highPriorityTasks} high priority`}</div>
      </div>

      {/* Card: New Leads */}
      <div className="card kpi">
        <div className="kpi-title">New Leads</div>
        <div className="kpi-value">{loading ? "…" : newLeadsThisMonth}</div>
        <div className="kpi-sub">This month</div>
      </div>

      {/* ... Recent Activity e Quick Actions ficam iguais ... */}

      {/* Performance Overview (ex.: 3 métricas) */}
      <div className="card performance">
        <div className="perf-item">
          <div className="perf-value">{loading ? "…" : completedDealsThisMonth}</div>
          <div className="perf-label">Completed Deals</div>
          <div className="perf-sub">This month</div>
        </div>
        <div className="perf-item">
          <div className="perf-value">{loading ? "…" : `${conversionRate}%`}</div>
          <div className="perf-label">Conversion Rate</div>
          <div className="perf-sub">Deals closed</div>
        </div>
        <div className="perf-item">
          <div className="perf-value">{loading ? "…" : formatCurrency(pipelineValue)}</div>
          <div className="perf-label">Pipeline Value</div>
          <div className="perf-sub">Active deals</div>
        </div>
      </div>

      {/* Quick Access (grelha de atalhos) */}
<div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Link to="/leads">
    <Card title="Leads">Funil rápido (New→Contacted→Qualified→Converted)</Card>
  </Link>
  <Link to="/clients">
    <Card title="Clients">Atalhos por papel (Buyer/Seller/Investor/Landlord/Tenant)</Card>
  </Link>
  <Link to="/tasks">
    <Card title="Tasks">Próximas tarefas e follow-ups</Card>
  </Link>
  <Link to="/calendar">
    <Card title="Calendar">Eventos próximos (visitas, CPCV, escritura)</Card>
  </Link>
  <Link to="/market">
    <Card title="Market">€/m² por zona (últimas atualizações)</Card>
  </Link>
  <Link to="/deals">
    <Card title="Deals">Pipeline (Qualificação→Visita→Proposta→CPCV→Escritura)</Card>
  </Link>
</div>

    </div>
  );
}
