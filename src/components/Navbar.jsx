import React from 'react';
import { Search, Plus, Download, RotateCcw, Building } from 'lucide-react';

export function Navbar({
  projects,
  selectedProjectId,
  onSelectProject,
  searchTerm,
  onSearchChange,
  onOpenNewPayment,
  onExportBackup,
  onResetData
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm no-print">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <span className="font-black text-sm tracking-tighter">QLTT</span>
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight tracking-tight">
              Quản Lý Hồ Sơ Thanh Toán Dự Án
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Chuẩn Nghị định 99/2021/NĐ-CP & Thông tư 96/2021/TT-BTC
            </p>
          </div>
        </div>

        {/* Center: Project Filter & Search */}
        <div className="flex-1 max-w-xl flex items-center gap-2">
          {/* Project Filter */}
          <div className="relative min-w-[180px] hidden md:block">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả dự án ({projects.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm dự án, số HĐ, nhà thầu, đợt TT..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportBackup}
            title="Sao lưu dữ liệu ra file JSON"
            className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            <Download className="w-4 h-4" />
            <span className="hidden xl:inline">Sao lưu JSON</span>
          </button>

          <button
            onClick={onResetData}
            title="Đặt lại dữ liệu mẫu ban đầu"
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNewPayment}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Lập Hồ Sơ TT Mới</span>
          </button>
        </div>

      </div>
    </header>
  );
}