import React from 'react';
import { 
  Search, Plus, Download, RotateCcw, Building, 
  PanelLeftClose, PanelLeftOpen, LayoutDashboard, TableProperties, 
  Receipt, FileSignature, Building2, ShieldAlert 
} from 'lucide-react';

export function Navbar({
  projects,
  selectedProjectId,
  onSelectProject,
  searchTerm,
  onSearchChange,
  onOpenNewPayment,
  onExportBackup,
  onResetData,
  currentTab,
  onTabChange,
  isSidebarOpen,
  onToggleSidebar,
  sidebarStats
}) {
  const navTabs = [
    { id: 'dashboard', label: 'Tổng Quan & Báo Cáo', icon: LayoutDashboard },
    { id: 'quantities', label: 'Nhập Khối Lượng', icon: TableProperties, badge: 'Mẫu 03.a', badgeColor: 'bg-blue-600 text-white' },
    { id: 'payments', label: 'Hồ Sơ & Đợt Thanh Toán', icon: Receipt, badge: sidebarStats?.pendingCount },
    { id: 'contracts', label: 'Hợp Đồng & Gói Thầu', icon: FileSignature, badge: sidebarStats?.contractCount },
    { id: 'projects', label: 'Dự Án Đầu Tư', icon: Building2, badge: sidebarStats?.projectCount },
    { id: 'guarantees', label: 'Cảnh Báo Bảo Lãnh', icon: ShieldAlert, badge: sidebarStats?.alertCount, badgeColor: 'bg-rose-500 text-white' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs no-print">
      {/* Top Bar: Brand, Project Filter, Search & Global Actions */}
      <div className="px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-xl border transition flex items-center justify-center shrink-0 ${
              isSidebarOpen 
                ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
            title={isSidebarOpen ? "Ẩn cột quản lý bên trái (mở rộng tối đa bảng tính)" : "Hiện cột quản lý bên trái"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 text-slate-700" /> : <PanelLeftOpen className="w-4 h-4 text-blue-600" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <span className="font-black text-xs tracking-tighter">QLTT</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight tracking-tight">
                Quản Lý Hồ Sơ Thanh Toán Dự Án
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                NĐ 254/2025/NĐ-CP
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden md:block">
              Chuẩn Nghị định 254/2025/NĐ-CP & Mẫu số 03.a/TT
            </p>
          </div>
        </div>

        {/* Center: Project Filter & Quick Search */}
        <div className="flex-1 max-w-xl flex items-center gap-2">
          {/* Project Filter */}
          <div className="relative min-w-[170px] hidden md:block">
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
        <div className="flex items-center gap-1.5 shrink-0">
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
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Lập Hồ Sơ TT Mới</span>
          </button>
        </div>

      </div>

      {/* Row 2: Thanh Tác Vụ Điều Hướng Phân Hệ (Top Navigation Ribbon) */}
      <div className="px-4 lg:px-6 h-10 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-3 overflow-x-auto">
        <nav className="flex items-center gap-1">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge !== 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                      isActive ? 'bg-blue-800 text-white' : (tab.badgeColor || 'bg-slate-200 text-slate-700')
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <button
            onClick={onToggleSidebar}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 transition ${
              !isSidebarOpen 
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={isSidebarOpen ? "Ẩn cột quản lý bên trái để mở rộng không gian" : "Hiện lại cột quản lý bên trái"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            <span>{isSidebarOpen ? 'Ẩn Cột Quản Lý' : 'Hiện Cột Quản Lý'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
