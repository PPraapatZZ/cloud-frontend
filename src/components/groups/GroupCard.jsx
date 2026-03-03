import { Badge }  from "../ui/Badge";
import { Button } from "../ui/Button";

export function GroupCard({ group, onView, onDelete }) {
  const gpuCount = group.instances.filter(i => i.gpu).length;
  const cpuOnly  = group.instances.filter(i => !i.gpu).length;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold text-gray-800 mb-1">{group.name}</div>
          <p className="text-sm text-gray-500 mb-3">{group.description || "No description"}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-gray-100 text-gray-600">{group.instances.length} instances</Badge>
            {gpuCount > 0 && <Badge className="bg-blue-100 text-blue-700">☸️ {gpuCount} k8s (GPU)</Badge>}
            {cpuOnly  > 0 && <Badge className="bg-orange-100 text-orange-700">☁️ {cpuOnly} OpenStack</Badge>}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="secondary" onClick={() => onView(group.id)}>View</Button>
          <Button variant="danger"    onClick={() => onDelete(group.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}