import { useState, useEffect } from "react";
import { Topbar }              from "./components/layout/Topbar";
import { Sidebar }             from "./components/layout/Sidebar";
import { GroupList }           from "./components/groups/GroupList";
import { InstanceTable }       from "./components/instances/InstanceTable";
import { CreateGroupModal }    from "./components/groups/CreateGroupModal";
import { CreateInstanceModal } from "./components/instances/CreateInstanceModal";
import {
  getGroups, createGroup, deleteGroup,
  getInstances, createInstance, deleteInstance,
} from "./services/api";

export default function App() {
  const [groups,      setGroups]      = useState([]);
  const [selectedId,  setSelectedId]  = useState(null);
  const [showCG,      setShowCG]      = useState(false); // create group modal
  const [showCI,      setShowCI]      = useState(false); // create instance modal

  // Load groups on mount
  useEffect(() => { getGroups().then(setGroups); }, []);

  const currentGroup = groups.find(g => g.id === selectedId);

  // ── Group handlers ──────────────────────────────────────────
  const handleCreateGroup = async (payload) => {
    const g = await createGroup(payload);
    setGroups(gs => [...gs, g]);
  };

  const handleDeleteGroup = async (id) => {
    await deleteGroup(id);
    setGroups(gs => gs.filter(g => g.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // ── Instance handlers ───────────────────────────────────────
  const handleCreateInstance = async (payload) => {
    const inst = await createInstance(selectedId, payload);
    setGroups(gs => gs.map(g =>
      g.id === selectedId ? { ...g, instances: [...g.instances, inst] } : g
    ));
  };

  const handleDeleteInstance = async (instId) => {
    await deleteInstance(selectedId, instId);
    setGroups(gs => gs.map(g =>
      g.id === selectedId
        ? { ...g, instances: g.instances.filter(i => i.id !== instId) }
        : g
    ));
  };

  // ── Stats ───────────────────────────────────────────────────
  const stats = {
    groups:    groups.length,
    instances: groups.reduce((a, g) => a + g.instances.length, 0),
    k8s:       groups.reduce((a, g) => a + g.instances.filter(i => i.platform === "k8s").length, 0),
    openstack: groups.reduce((a, g) => a + g.instances.filter(i => i.platform === "openstack").length, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          groups={groups}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreateGroup={() => setShowCG(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedId ? (
            <GroupList
              groups={groups}
              stats={stats}
              onView={setSelectedId}
              onDelete={handleDeleteGroup}
              onCreateGroup={() => setShowCG(true)}
            />
          ) : currentGroup ? (
            <InstanceTable
              groupName={currentGroup.name}
              groupDesc={currentGroup.description}
              instances={currentGroup.instances}
              onDelete={handleDeleteInstance}
              onCreateInstance={() => setShowCI(true)}
              onBack={() => setSelectedId(null)}
            />
          ) : null}
        </main>
      </div>

      {showCG && <CreateGroupModal onClose={() => setShowCG(false)} onCreate={handleCreateGroup} />}
      {showCI && <CreateInstanceModal onClose={() => setShowCI(false)} onCreate={handleCreateInstance} />}
    </div>
  );
}