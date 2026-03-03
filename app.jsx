const { useState } = React;

const mockGroups = [
  {
    id: "g1", name: "ML Research Group", description: "Machine Learning research workloads",
    instances: [
      { id: "i1", name: "trainer-01", cpu: 8, ram: 32, gpu: true, gpuMem: 16, status: "Running", platform: "k8s", created: "2026-03-01" },
      { id: "i2", name: "preprocessor-01", cpu: 4, ram: 16, gpu: false, gpuMem: 0, status: "Running", platform: "openstack", created: "2026-03-02" },
    ]
  },
  {
    id: "g2", name: "Image Processing Lab", description: "Image processing experiments",
    instances: [
      { id: "i3", name: "cv-worker-01", cpu: 4, ram: 8, gpu: false, gpuMem: 0, status: "Pending", platform: "openstack", created: "2026-03-03" },
    ]
  },
  {
    id: "g3", name: "Deep Learning Studio", description: "GPU-heavy model training",
    instances: []
  }
];

const statusColor = { Running: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700", Stopped: "bg-gray-100 text-gray-500", Error: "bg-red-100 text-red-600" };
const platformBadge = { k8s: "bg-blue-100 text-blue-700", openstack: "bg-orange-100 text-orange-700" };

function Badge({ children, className = "" }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>{children}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...props} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...props}>{children}</select>
    </div>
  );
}

function Btn({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
  };
  return <button className={base + variants[variant] + " " + className} {...props}>{children}</button>;
}

function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({ id: `g${Date.now()}`, name: name.trim(), description: desc.trim(), instances: [] });
    onClose();
  };
  return (
    <Modal title="Create New Group" onClose={onClose}>
      <Input label="Group Name *" placeholder="e.g. ML Research Group" value={name} onChange={e => setName(e.target.value)} />
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} placeholder="Optional description..." value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 mb-5 text-xs text-gray-500">
        <span className="font-medium text-gray-600">Note:</span> A group with GPU instances will be mapped to a <Badge className="bg-blue-100 text-blue-700 mx-1">k8s namespace</Badge>, and without GPU to an <Badge className="bg-orange-100 text-orange-700 mx-1">OpenStack project</Badge>.
      </div>
      <div className="flex justify-end gap-2">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={handleSubmit} disabled={!name.trim()}>Create Group</Btn>
      </div>
    </Modal>
  );
}

function CreateInstanceModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", cpu: "4", ram: "8", gpu: false, gpuMem: "16" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const platform = form.gpu ? "k8s" : "openstack";

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onCreate({
      id: `i${Date.now()}`, name: form.name.trim(),
      cpu: parseInt(form.cpu), ram: parseInt(form.ram),
      gpu: form.gpu, gpuMem: form.gpu ? parseInt(form.gpuMem) : 0,
      status: "Pending", platform, created: new Date().toISOString().slice(0, 10)
    });
    onClose();
  };

  return (
    <Modal title="Create New Instance" onClose={onClose}>
      <Input label="Instance Name *" placeholder="e.g. trainer-01" value={form.name} onChange={e => set("name", e.target.value)} />
      <Select label="CPU Cores" value={form.cpu} onChange={e => set("cpu", e.target.value)}>
        {[1,2,4,8,16,32].map(n => <option key={n} value={String(n)}>{n} Cores</option>)}
      </Select>
      <Select label="RAM (GB)" value={form.ram} onChange={e => set("ram", e.target.value)}>
        {[4,8,16,32,64,128].map(n => <option key={n} value={String(n)}>{n} GB</option>)}
      </Select>

      <div className="mb-5">
        <div className="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer"
          style={{ borderColor: form.gpu ? "#3b82f6" : "#e5e7eb", background: form.gpu ? "#eff6ff" : "#f9fafb" }}
          onClick={() => set("gpu", !form.gpu)}>
          <div className="flex items-center gap-3">
            <span className="text-xl">🖥️</span>
            <div>
              <div className="text-sm font-medium text-gray-800">GPU (Optional)</div>
              <div className="text-xs text-gray-500">Required for model training & deep learning</div>
            </div>
          </div>
          <div className={`w-11 h-6 rounded-full relative transition-colors ${form.gpu ? "bg-blue-500" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.gpu ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
        </div>
        {form.gpu && (
          <div className="mt-2">
            <Select label="GPU VRAM" value={form.gpuMem} onChange={e => set("gpuMem", e.target.value)}>
              {[8,16,24,40,80].map(n => <option key={n} value={String(n)}>{n} GB VRAM</option>)}
            </Select>
          </div>
        )}
      </div>

      <div className={`p-3 rounded-lg mb-5 text-sm flex items-center gap-2 ${form.gpu ? "bg-blue-50 border border-blue-100" : "bg-orange-50 border border-orange-100"}`}>
        <span>{form.gpu ? "☸️" : "☁️"}</span>
        <span className={form.gpu ? "text-blue-700" : "text-orange-700"}>
          This instance will be deployed on <strong>{form.gpu ? "Kubernetes (k8s)" : "OpenStack"}</strong>
          {form.gpu ? " — GPU workload detected" : " — CPU/RAM only workload"}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={handleSubmit} disabled={!form.name.trim()}>Create Instance</Btn>
      </div>
    </Modal>
  );
}

function InstanceRow({ inst, onDelete }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-sm font-medium text-gray-800">{inst.name}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{inst.cpu} Cores</td>
      <td className="py-3 px-4 text-sm text-gray-600">{inst.ram} GB</td>
      <td className="py-3 px-4 text-sm text-gray-600">{inst.gpu ? `${inst.gpuMem} GB` : <span className="text-gray-300">—</span>}</td>
      <td className="py-3 px-4">
        <Badge className={platformBadge[inst.platform]}>
          {inst.platform === "k8s" ? "☸️ k8s" : "☁️ OpenStack"}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Badge className={statusColor[inst.status] || "bg-gray-100 text-gray-500"}>{inst.status}</Badge>
      </td>
      <td className="py-3 px-4 text-xs text-gray-400">{inst.created}</td>
      <td className="py-3 px-4">
        <Btn variant="danger" className="py-1 px-2 text-xs" onClick={() => onDelete(inst.id)}>Delete</Btn>
      </td>
    </tr>
  );
}

function App() {
  const [groups, setGroups] = useState(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateInstance, setShowCreateInstance] = useState(false);

  const currentGroup = groups.find(g => g.id === selectedGroup);

  const addGroup = (g) => setGroups(gs => [...gs, g]);
  const deleteGroup = (id) => { setGroups(gs => gs.filter(g => g.id !== id)); setSelectedGroup(null); };

  const addInstance = (inst) => setGroups(gs => gs.map(g => g.id === selectedGroup ? { ...g, instances: [...g.instances, inst] } : g));
  const deleteInstance = (instId) => setGroups(gs => gs.map(g => g.id === selectedGroup ? { ...g, instances: g.instances.filter(i => i.id !== instId) } : g));

  const stats = {
    groups: groups.length,
    instances: groups.reduce((a, g) => a + g.instances.length, 0),
    k8s: groups.reduce((a, g) => a + g.instances.filter(i => i.platform === "k8s").length, 0),
    openstack: groups.reduce((a, g) => a + g.instances.filter(i => i.platform === "openstack").length, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">CE</div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">CE Cloud</div>
            <div className="text-xs text-gray-400">Heterogeneous Cloud Manager</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> System Online
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Groups</div>
            {groups.map(g => {
              const hasK8s = g.instances.some(i => i.platform === "k8s");
              const hasOS = g.instances.some(i => i.platform === "openstack");
              return (
                <button key={g.id}
                  onClick={() => setSelectedGroup(g.id)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 mb-1 transition-all text-sm ${selectedGroup === g.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="truncate">{g.name}</span>
                    <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{g.instances.length}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {hasK8s && <span className="text-xs text-blue-500">☸️</span>}
                    {hasOS && <span className="text-xs text-orange-500">☁️</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="p-3 border-t border-gray-100">
            <Btn variant="primary" className="w-full justify-center" onClick={() => setShowCreateGroup(true)}>
              + New Group
            </Btn>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          {!selectedGroup ? (
            <div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Groups", value: stats.groups, icon: "📁", color: "text-gray-700" },
                  { label: "Total Instances", value: stats.instances, icon: "💻", color: "text-gray-700" },
                  { label: "k8s Instances", value: stats.k8s, icon: "☸️", color: "text-blue-700" },
                  { label: "OpenStack Instances", value: stats.openstack, icon: "☁️", color: "text-orange-700" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-gray-800">All Groups</h1>
                <Btn variant="primary" onClick={() => setShowCreateGroup(true)}>+ New Group</Btn>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {groups.map(g => {
                  const gpuCount = g.instances.filter(i => i.gpu).length;
                  const cpuOnly = g.instances.filter(i => !i.gpu).length;
                  return (
                    <div key={g.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{g.name}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{g.description || "No description"}</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-gray-100 text-gray-600">{g.instances.length} instances</Badge>
                            {gpuCount > 0 && <Badge className={platformBadge.k8s}>☸️ {gpuCount} k8s (GPU)</Badge>}
                            {cpuOnly > 0 && <Badge className={platformBadge.openstack}>☁️ {cpuOnly} OpenStack</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Btn variant="secondary" onClick={() => setSelectedGroup(g.id)}>View</Btn>
                          <Btn variant="danger" onClick={() => deleteGroup(g.id)}>Delete</Btn>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {groups.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    <div className="font-medium">No groups yet</div>
                    <div className="text-sm mt-1">Create your first group to get started</div>
                  </div>
                )}
              </div>
            </div>
          ) : currentGroup ? (
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <button className="hover:text-blue-600 transition-colors" onClick={() => setSelectedGroup(null)}>Groups</button>
                <span>/</span>
                <span className="text-gray-800 font-medium">{currentGroup.name}</span>
              </div>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">{currentGroup.name}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">{currentGroup.description || "No description"}</p>
                </div>
                <Btn variant="primary" onClick={() => setShowCreateInstance(true)}>+ New Instance</Btn>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm flex gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 inline-block"></span><span>☸️ k8s — GPU workloads (Kubernetes Namespace)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-100 inline-block"></span><span>☁️ OpenStack — CPU/RAM only (OpenStack Project)</span></div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">Name</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">CPU</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">RAM</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">GPU VRAM</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">Platform</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">Status</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">Created</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentGroup.instances.map(inst => (
                      <InstanceRow key={inst.id} inst={inst} onDelete={deleteInstance} />
                    ))}
                  </tbody>
                </table>
                {currentGroup.instances.length === 0 && (
                  <div className="text-center py-14 text-gray-400">
                    <div className="text-3xl mb-2">🖥️</div>
                    <div className="font-medium text-sm">No instances in this group</div>
                    <div className="text-xs mt-1">Click "+ New Instance" to create one</div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={addGroup} />}
      {showCreateInstance && <CreateInstanceModal onClose={() => setShowCreateInstance(false)} onCreate={addInstance} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
