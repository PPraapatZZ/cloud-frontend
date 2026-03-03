// src/services/api.js
// ── ตอนนี้ใช้ mock, ตอน Backend พร้อม uncommment fetch แล้วลบ mock ──

import { mockGroups } from "../data/mockData";

// simulate network delay
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

let _groups = structuredClone(mockGroups);

// ── Groups ──────────────────────────────────────────────────────

export async function getGroups() {
  await delay();
  return _groups;
  // TODO: return fetch("/api/groups").then(r => r.json());
}

export async function createGroup(payload) {
  // payload: { name, description }
  await delay();
  const g = { id: `g${Date.now()}`, instances: [], ...payload };
  _groups.push(g);
  return g;
  // TODO: return fetch("/api/groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(r => r.json());
}

export async function deleteGroup(groupId) {
  await delay();
  _groups = _groups.filter(g => g.id !== groupId);
  // TODO: return fetch(`/api/groups/${groupId}`, { method: "DELETE" });
}

// ── Instances ───────────────────────────────────────────────────

export async function getInstances(groupId) {
  await delay();
  return _groups.find(g => g.id === groupId)?.instances ?? [];
  // TODO: return fetch(`/api/groups/${groupId}/instances`).then(r => r.json());
}

export async function createInstance(groupId, payload) {
  // payload: { name, cpu, ram, gpu, gpuMem }
  // platform ไม่ส่ง — ให้ Backend ตัดสินใจ
  await delay();
  const platform = payload.gpu ? "k8s" : "openstack"; // mock only
  const inst = {
    id: `i${Date.now()}`,
    status: "Pending",
    platform,                                          // จะมาจาก Backend response จริง
    created: new Date().toISOString().slice(0, 10),
    ...payload,
  };
  const grp = _groups.find(g => g.id === groupId);
  if (grp) grp.instances.push(inst);
  return inst;
  // TODO:
  // return fetch(`/api/groups/${groupId}/instances`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),   // ไม่มี platform
  // }).then(r => r.json());
}

export async function deleteInstance(groupId, instanceId) {
  await delay();
  const grp = _groups.find(g => g.id === groupId);
  if (grp) grp.instances = grp.instances.filter(i => i.id !== instanceId);
  // TODO: return fetch(`/api/groups/${groupId}/instances/${instanceId}`, { method: "DELETE" });
}