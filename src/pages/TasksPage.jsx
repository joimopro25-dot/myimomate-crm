// src/pages/TasksPage.jsx
import React, { useEffect, useState } from "react";
import TaskQuickAdd from "../features/tasks/components/TaskQuickAdd.jsx";
import Card from "../shared/components/ui/Card.jsx";
import Button from "../shared/components/ui/Button.jsx";
import { listTasks, toggleTask, deleteTask } from "../services/tasks.api.js";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await listTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Não foi possível carregar as tarefas.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (taskId) => {
    try {
      await toggleTask(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreated = () => {
    // quando o QuickAdd criar uma nova tarefa, recarrega
    load();
  };

  return (
    <div style={{ padding: 16, display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Tasks</h2>
          <TaskQuickAdd onCreated={handleCreated} />
        </div>
      </Card>

      <Card>
        {loading && <div>A carregar…</div>}
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        {!loading && tasks.length === 0 && <div>Sem tarefas por agora.</div>}

        <div style={{ display: "grid", gap: 8 }}>
          {tasks.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 8, border: "1px solid #eee", borderRadius: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={!!t.done}
                  onChange={() => handleToggle(t.id)}
                />
                <span style={{ textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 1 }}>
                  {t.title || t.name}
                </span>
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="ghost" onClick={() => handleToggle(t.id)}>
                  {t.done ? "Marcar por fazer" : "Marcar feita"}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(t.id)}>
                  Apagar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
