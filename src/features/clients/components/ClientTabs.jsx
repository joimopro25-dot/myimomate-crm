import React, { useState } from 'react';
import Card from '../../../shared/components/ui/Card.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import ClientOverview from './ClientOverview.jsx';
import ClientLinks from './ClientLinks.jsx';
import ClientScenarios from './ClientScenarios.jsx';
import ClientTasks from './ClientTasks.jsx';
import ClientDeals from './ClientDeals.jsx';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'links', label: 'Links' },
  { key: 'scenarios', label: 'Scenarios' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'deals', label: 'Deals' },
];

export default function ClientTabs({ clientId }){
  const [tab, setTab] = useState('overview');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <Button key={t.key}
                  className={`text-sm ${tab===t.key ? 'bg-black text-white' : ''}`}
                  onClick={()=>setTab(t.key)}>
            {t.label}
          </Button>
        ))}
      </div>

      <Card>
        {tab==='overview' && <ClientOverview clientId={clientId} />}
        {tab==='links' && <ClientLinks clientId={clientId} />}
        {tab==='scenarios' && <ClientScenarios clientId={clientId} />}
        {tab==='tasks' && <ClientTasks clientId={clientId} />}
        {tab==='deals' && <ClientDeals clientId={clientId} />}
      </Card>
    </div>
  );
}