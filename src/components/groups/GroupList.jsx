import { GroupCard } from "./GroupCard";
import { Button as Btn } from "../ui/Button";

export function GroupList({ groups, stats, onView, onDelete, onCreateGroup }) {
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Groups",        value: stats.groups,    icon: "📁", color: "text-gray-700"   },
          { label: "Total Instances",     value: stats.instances, icon: "💻", color: "text-gray-700"   },
          { label: "k8s Instances",       value: stats.k8s,       icon: "☸️", color: "text-blue-700"   },
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
        <Btn variant="primary" onClick={onCreateGroup}>+ New Group</Btn>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {groups.map(g => (
          <GroupCard key={g.id} group={g} onView={onView} onDelete={onDelete} />
        ))}
        {groups.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <div className="font-medium">No groups yet</div>
            <div className="text-sm mt-1">Create your first group to get started</div>
          </div>
        )}
      </div>
    </div>
  );
}