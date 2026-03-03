// src/data/mockData.js
// ── ลบไฟล์นี้ทิ้งได้ทันทีที่ Backend พร้อม ──────────────────────

export const mockGroups = [
  {
    id: "g1",
    name: "ML Research Group",
    description: "Machine Learning research workloads",
    instances: [
      { id: "i1", name: "trainer-01", cpu: 8, ram: 32, gpu: true,  gpuMem: 16, status: "Running", platform: "k8s",       created: "2026-03-01" },
      { id: "i2", name: "preprocessor-01", cpu: 4, ram: 16, gpu: false, gpuMem: 0, status: "Running", platform: "openstack", created: "2026-03-02" },
    ],
  },
  {
    id: "g2",
    name: "Image Processing Lab",
    description: "Image processing experiments",
    instances: [
      { id: "i3", name: "cv-worker-01", cpu: 4, ram: 8, gpu: false, gpuMem: 0, status: "Pending", platform: "openstack", created: "2026-03-03" },
    ],
  },
  {
    id: "g3",
    name: "Deep Learning Studio",
    description: "GPU-heavy model training",
    instances: [],
  },
];