import { Button } from "../ui/Button";

export function Sidebar({ groups, selectedId, onSelect, onCreateGroup }) {
  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Groups
        </div>
        {groups.map(g => {
          const hasK8s = g.instances.some(i => i.platform === "k8s");
          const hasOS  = g.instances.some(i => i.platform === "openstack");
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              className={`w-full text-left rounded-lg px-3 py-2.5 mb-1 transition-all text-sm ${
                selectedId === g.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{g.name}</span>
                <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{g.instances.length}</span>
              </div>
              <div className="flex gap-1 mt-0.5">
                {hasK8s && <span className="text-xs text-blue-500">☸️</span>}
                {hasOS  && <span className="text-xs text-orange-500">☁️</span>}
              </div>
            </button>
          );
        })}
      </div>
      {/* <div className="p-3 border-t border-gray-100">
        <Button variant="primary" className="w-full justify-center" onClick={onCreateGroup}>
          + New Group
        </Button>
      </div> */}
    </aside>
  );
}