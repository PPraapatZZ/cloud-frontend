import { useState }   from "react";
import { Modal }   from "../ui/Modal";
import { Input }   from "../ui/Input";
import { Select }  from "../ui/Select";
import { Button as Btn2 } from "../ui/Button";

export function CreateInstanceModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", cpu: "4", ram: "8", gpu: false, gpuMem: "16" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    // ส่งแค่ spec — ไม่มี platform (Backend ตัดสินใจ)
    onCreate({
      name:   form.name.trim(),
      cpu:    parseInt(form.cpu),
      ram:    parseInt(form.ram),
      gpu:    form.gpu,
      gpuMem: form.gpu ? parseInt(form.gpuMem) : 0,
    });
    onClose();
  };

  return (
    <Modal title="Create New Instance" onClose={onClose}>
      <Input label="Instance Name *" placeholder="e.g. trainer-01"
        value={form.name} onChange={e => set("name", e.target.value)} />
      <Select label="CPU Cores" value={form.cpu} onChange={e => set("cpu", e.target.value)}>
        {[1,2,4,8,16,32].map(n => <option key={n} value={n}>{n} Cores</option>)}
      </Select>
      <Select label="RAM (GB)" value={form.ram} onChange={e => set("ram", e.target.value)}>
        {[4,8,16,32,64,128].map(n => <option key={n} value={n}>{n} GB</option>)}
      </Select>

      {/* GPU Toggle */}
      <div className="mb-5">
        <div
          className="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer"
          style={{ borderColor: form.gpu ? "#3b82f6" : "#e5e7eb", background: form.gpu ? "#eff6ff" : "#f9fafb" }}
          onClick={() => set("gpu", !form.gpu)}
        >
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
              {[8,16,24,40,80].map(n => <option key={n} value={n}>{n} GB VRAM</option>)}
            </Select>
          </div>
        )}
      </div>

      {/* Platform Preview (UI hint เท่านั้น) */}
      <div className={`p-3 rounded-lg mb-5 text-sm flex items-center gap-2 ${form.gpu ? "bg-blue-50 border border-blue-100" : "bg-orange-50 border border-orange-100"}`}>
        <span>{form.gpu ? "☸️" : "☁️"}</span>
        <span className={form.gpu ? "text-blue-700" : "text-orange-700"}>
          Will be deployed on <strong>{form.gpu ? "Kubernetes (k8s)" : "OpenStack"}</strong>
          {form.gpu ? " — GPU workload detected" : " — CPU/RAM only workload"}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <Btn2 variant="secondary" onClick={onClose}>Cancel</Btn2>
        <Btn2 variant="primary" onClick={handleSubmit} disabled={!form.name.trim()}>Create Instance</Btn2>
      </div>
    </Modal>
  );
}