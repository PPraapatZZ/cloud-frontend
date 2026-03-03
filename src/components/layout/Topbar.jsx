export function Topbar() {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          CE
        </div>
        <div>
          <div className="font-semibold text-gray-800 text-sm">CE Cloud</div>
          <div className="text-xs text-gray-400">Heterogeneous Cloud Manager</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        System Online
      </div>
    </header>
  );
}