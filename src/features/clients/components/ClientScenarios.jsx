// features/clients/components/ClientScenarios.jsx
import React from 'react';
import Card from '../../../shared/components/ui/Card';
import CalculatorBTR from '../../calculators/components/CalculatorBTR';
import CalculatorFixFlip from '../../calculators/components/CalculatorFixFlip';
import CalculatorOffPlan from '../../calculators/components/CalculatorOffPlan';
export default function ClientScenarios({ clientId }){
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Buy‑to‑Rent"><CalculatorBTR clientId={clientId}/></Card>
      <Card title="Fix & Flip"><CalculatorFixFlip clientId={clientId}/></Card>
      <Card title="Off‑Plan"><CalculatorOffPlan clientId={clientId}/></Card>
    </div>
  );
}