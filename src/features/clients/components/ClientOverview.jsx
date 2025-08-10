import React, { useEffect, useState } from 'react';
import Card from '../../../shared/components/ui/Card.jsx';
import ClientFormBasic from './ClientForm.Basic.jsx';
import { db, auth } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ClientOverview({ clientId }){
  const [stats, setStats] = useState({ links: 0, scenarios: 0, tasks: 0 });

  useEffect(() => {
    async function load() {
      const uid = auth.currentUser?.uid; if (!uid || !clientId) return;
      const base = (sub) => collection(db, 'users', uid, 'clients', clientId, sub);
      const [l, s, t] = await Promise.all([
        getDocs(base('links')), getDocs(base('scenarios')), getDocs(base('tasks'))
      ]);
      setStats({ links: l.size, scenarios: s.size, tasks: t.size });
    }
    load();
  }, [clientId]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Perfil & Papéis">
        <ClientFormBasic clientId={clientId} />
      </Card>
      <Card title="Resumo">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><div className="text-2xl font-semibold">{stats.links}</div><div className="text-sm text-gray-600">Links</div></div>
          <div><div className="text-2xl font-semibold">{stats.scenarios}</div><div className="text-sm text-gray-600">Cenários</div></div>
          <div><div className="text-2xl font-semibold">{stats.tasks}</div><div className="text-sm text-gray-600">Tarefas</div></div>
        </div>
      </Card>
    </div>
  );
}
