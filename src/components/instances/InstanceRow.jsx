import { Badge }  from "../ui/Badge";
import { Button } from "../ui/Button";

const statusColor = {
  Running: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Stopped: "bg-gray-100 text-gray-500",
  Error:   "bg-red-100 text-red-600",
};
const platformBadge = {
  k8s:       "bg-blue-100 text-blue-700",
  openstack: "bg-orange-100 text-orange-700",
};

export function InstanceRow({ inst, onDelete }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-sm font-medium text-gray-800">{inst.name}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{inst.cpu} Cores</td>
      <td className="py-3 px-4 text-sm text-gray-600">{inst.ram} GB</td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {inst.gpu ? `${inst.gpuMem} GB` : <span className="text-gray-300">—</span>}
      </td>
      <td className="py-3 px-4">
        <Badge className={platformBadge[inst.platform]}>
          {inst.platform === "k8s" ? "☸️ k8s" : "☁️ OpenStack"}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Badge className={statusColor[inst.status] || "bg-gray-100 text-gray-500"}>
          {inst.status}
        </Badge>
      </td>
      <td className="py-3 px-4 text-xs text-gray-400">{inst.created}</td>
      <td className="py-3 px-4">
        <Button variant="danger" className="py-1 px-2 text-xs" onClick={() => onDelete(inst.id)}>
          Delete
        </Button>
      </td>
    </tr>
  );
}