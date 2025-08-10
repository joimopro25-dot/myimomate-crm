// features/clients/components/ClientTabs.jsx
import React, { useState } from 'react';
import Tabs from '../../../shared/components/ui/Tabs';
import ClientOverview from './ClientOverview';
import ClientLinks from './ClientLinks';
import ClientScenarios from './ClientScenarios';
import ClientTasks from './ClientTasks';
import ClientNotes from './ClientNotes';
export default function ClientTabs({ clientId }){
  const [tab,setTab]=useState('overview');
  const tabs=[
    {key:'overview',label:'Overview',node:<ClientOverview clientId={clientId}/>},
    {key:'buyer',label:'Buyer',node:<div className="p-4">Buyer prefs & pipeline</div>},
    {key:'seller',label:'Seller',node:<div className="p-4">Seller pricing helper</div>},
    {key:'investor',label:'Investor',node:<ClientScenarios clientId={clientId} />},
    {key:'landlord',label:'Landlord',node:<div className="p-4">Rent‑roll & KPIs</div>},
    {key:'tenant',label:'Tenant',node:<div className="p-4">Match & candidaturas</div>},
    {key:'links',label:'Links',node:<ClientLinks clientId={clientId}/>},
    {key:'tasks',label:'Tasks',node:<ClientTasks clientId={clientId}/>},
    {key:'notes',label:'Notes',node:<ClientNotes clientId={clientId}/>},
  ];
  return <Tabs tabs={tabs} value={tab} onChange={setTab}/>;
}