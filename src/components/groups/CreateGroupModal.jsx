import { useState }  from "react";
import { Modal }  from "../ui/Modal";
import { Input }  from "../ui/Input";
import { Button as Btn2 } from "../ui/Button";
import { Badge as B } from "../ui/Badge";

export function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: desc.trim() });
    onClose();
  };

  return (
    <Modal title="Create New Group" onClose={onClose}>
      <Input label="Group Name *" placeholder="e.g. ML Research Group" value={name} onChange={e => setName(e.target.value)} />
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3} placeholder="Optional description..."
          value={desc} onChange={e => setDesc(e.target.value)}
        />
      </div>
      <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 mb-5 text-xs text-gray-500">
        <span className="font-medium text-gray-600">Note:</span> Instances with GPU →
        <B className="bg-blue-100 text-blue-700 mx-1">☸️ k8s</B>
        Instances without GPU →
        <B className="bg-orange-100 text-orange-700 mx-1">☁️ OpenStack</B>
      </div>
      <div className="flex justify-end gap-2">
        <Btn2 variant="secondary" onClick={onClose}>Cancel</Btn2>
        <Btn2 variant="primary" onClick={handleSubmit} disabled={!name.trim()}>Create Group</Btn2>
      </div>
    </Modal>
  );
}