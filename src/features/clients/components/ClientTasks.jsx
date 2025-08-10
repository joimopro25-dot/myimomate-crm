import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import { listTasks, createTask, toggleTask, deleteTask } from '../../../services/tasks.api.js';

export default function ClientTasks({ clientId }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');

  const load = async () => {
    const all = await listTasks();               // busca todas
    setItems(all.filter(x => x.clientId === clientId)); // filtra por cliente
  };

  useEffect(() => { load(); }, [clientId]);

  const add = async () => {
    if (!title) return;
    const dueAt = due ? new Date(due + 'T00:00:00').getTime() : null;
    await createTask({ title, dueAt, clientId });
    setTitle(''); setDue('');
    await load();
  };

  return (
    <Card title="Tarefas do cliente">
      <div className="grid md:grid-cols-4 gap-2 mb-3">
        <input className="border rounded px-3 py-2" placeholder="Tarefa"
               value={title} onChange={e => setTitle(e.target.value)} />
        <input type="date" className="border rounded px-3 py-2"
               value={due} onChange={e => setDue(e.target.value)} />
        <Button onClick={add}>Adicionar</Button>
      </div>

      <ul className="space-y-2">
        {items.map(t => (
          <li key={t.id} className="border rounded-xl p-3 flex items-center justify-between gap-2">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-gray-600">
                {t.dueAt ? new Date(t.dueAt).toLocaleDateString() : '—'}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="text-sm"
                      onClick={() => toggleTask(t.id, t.status !== 'done').then(load)}>
                {t.status === 'done' ? 'Desfazer' : 'Concluir'}
              </Button>
              <Button className="text-sm"
                      onClick={() => deleteTask(t.id).then(load)}>
                Apagar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
