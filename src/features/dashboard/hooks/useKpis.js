// src/features/dashboard/hooks/useKpis.js
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
// CAMINHO CORRETO:
import { db } from "../../../../shared/services/firebase.js";// Helper para ler timestamp (Firestore Timestamp ou Date)
function toDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (ts instanceof Date) return ts;
  return null;
}

export function useKpis() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalClients: 0,
    activeDeals: 0,
    pipelineValue: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
    newLeadsThisMonth: 0,
    conversionRate: 0,
    completedDealsThisMonth: 0,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        // Coleções base (ajusta nomes se necessário)
        const clientsRef = collection(db, "clients");
        const dealsRef   = collection(db, "deals");
        const tasksRef   = collection(db, "tasks");
        const leadsRef   = collection(db, "leads");

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Carregamentos paralelos
        const [clientsSnap, activeDealsSnap, tasksSnap, leadsSnap, allDealsSnap] = await Promise.all([
          getDocs(clientsRef),
          getDocs(query(dealsRef, where("status", "==", "active"))),
          getDocs(tasksRef),
          getDocs(leadsRef),
          getDocs(dealsRef),
        ]);

        const totalClients = clientsSnap.size;

        // Deals ativos + pipeline €
        let activeDeals = 0;
        let pipelineValue = 0;
        activeDealsSnap.forEach((d) => {
          activeDeals += 1;
          pipelineValue += Number(d.data()?.value || 0);
        });

        // Tasks
        const tasks = tasksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const pendingTasks = tasks.filter((t) => !t.done).length;
        const highPriorityTasks = tasks.filter(
          (t) => !t.done && (t.priority === "high" || t.priority === "alta")
        ).length;

        // Leads do mês
        const leads = leadsSnap.docs.map((d) => d.data());
        const newLeadsThisMonth = leads.filter((l) => {
          const created = toDate(l.createdAt);
          return created && created >= monthStart;
        }).length;

        // Deals ganhos no mês + taxa de conversão geral
        let wonThisMonth = 0;
        let won = 0;
        let lost = 0;

        allDealsSnap.forEach((d) => {
          const data = d.data();
          const status = data.status;
          const wonAt = toDate(data.wonAt);
          if (status === "won") {
            won += 1;
            if (wonAt && wonAt >= monthStart) wonThisMonth += 1;
          }
          if (status === "lost") lost += 1;
        });

        const conversionRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;

        if (!alive) return;
        setKpis({
          totalClients,
          activeDeals,
          pipelineValue,
          pendingTasks,
          highPriorityTasks,
          newLeadsThisMonth,
          conversionRate,
          completedDealsThisMonth: wonThisMonth,
        });
      } catch (e) {
        console.error("[useKpis] erro a calcular KPIs:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { loading, ...kpis };
}
