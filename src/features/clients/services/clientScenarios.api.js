// src/features/clients/services/clientScenarios.api.js
import { db } from "../../../firebase";
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

const scenariosColl = (clientId) => collection(db, "clients", clientId, "scenarios");

export async function listScenarios(clientId) {
  try {
    const snap = await getDocs(query(scenariosColl(clientId), orderBy("createdAt","desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await getDocs(scenariosColl(clientId));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

export async function saveScenario(clientId, scenario) {
  if (scenario?.id) {
    await updateDoc(doc(db, "clients", clientId, "scenarios", scenario.id), { ...scenario, updatedAt: serverTimestamp() });
    return scenario.id;
  }
  const ref = await addDoc(scenariosColl(clientId), {
    name: scenario?.name || "",
    inputs: scenario?.inputs || {},
    outputs: scenario?.outputs || {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...scenario,
  });
  return ref.id;
}

export async function getScenario(clientId, scenarioId) {
  const snap = await getDoc(doc(db, "clients", clientId, "scenarios", scenarioId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() }) : null;
}

export async function deleteScenario(clientId, scenarioId) {
  await deleteDoc(doc(db, "clients", clientId, "scenarios", scenarioId));
}
