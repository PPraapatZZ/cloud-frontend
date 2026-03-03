import { InstanceRow } from "./InstanceRow";
import { Button as Btn } from "../ui/Button";

export function InstanceTable({ groupName, groupDesc, instances, onDelete, onCreateInstance, onBack }) {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button className="hover:text-blue-600 transition-colors" onClick={onBack}>Groups</button>
        <span>/</span>
        <span className="text-gray-800 font-medium">{groupName}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{groupName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{groupDesc || "No description"}</p>
        </div>
        <Btn variant="primary" onClick={onCreateInstance}>+ New Instance</Btn>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm flex gap-6 text-xs text-gray-600 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-100 inline-block" />
          ☸️ k8s — GPU workloads (Kubernetes Namespace)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-100 inline-block" />
          ☁️ OpenStack — CPU/RAM only (OpenStack Project)
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Name","CPU","RAM","GPU VRAM","Platform","Status","Created",""].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide py-3 px-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {instances.map(inst => (
              <InstanceRow key={inst.id} inst={inst} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
        {instances.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <div className="text-3xl mb-2">🖥️</div>
            <div className="font-medium text-sm">No instances in this group</div>
            <div className="text-xs mt-1">Click "+ New Instance" to create one</div>
          </div>
        )}
      </div>
    </div>
  );
}