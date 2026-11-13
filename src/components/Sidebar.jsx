import React from 'react';
import { LayoutDashboard, Building2, FileSignature, Receipt, ShieldAlert, Users, FileSpreadsheet } from 'lucide-react';
import { formatBillion } from '../services/storageService';

export function Sidebar({ currentTab, onTabChange, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan & Báo Cáo', icon: LayoutDashboard },
    { id: 'payments', label: 'Hồ Sơ & Đợt Thanh Toán', icon: Receipt, badge: stats?.pendingCount },
    { id: 'teams', label: 'Quản Lý Tổ Đội & Chi Phí', icon: Users, badge: 4, badgeColor: 'bg-indigo-600' },
    { id: 'gsheets', label: 'Đồng Bộ Google Sheets', icon: FileSpreadsheet },
    { id: 'contracts', label: 'Hợp Đồng & Gói Thầu', icon: FileSignature, badge: stats?.contractCount },
    { id: 'projects', label: 'Dự Án Đầu Tư', icon: Building2, badge: stats?.projectCount },
    { id: 'guarantees', label: 'Cảnh Báo Bảo Lãnh', icon: ShieldAlert, badge: stats?.alertCount, badgeColor: 'bg-rose-500' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 no-print border-r border-slate-800">
      
      {/* Navigation links */}
      <div className="p-3 space-y-1">
        <p className="px-3 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Phân Hệ Quản Lý
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold text-white ${
                    item.badgeColor || (isActive ? 'bg-blue-800' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Stats Card */}
      <div className="mt-auto p-4 m-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Giải Ngân Lũy Kế
          </span>
          <span className="text-xs font-black text-emerald-400">
            {formatBillion(stats?.totalDisbursed)}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Tỷ lệ so với HĐ:</span>
            <span className="font-bold text-white">{stats?.disbursedRate?.toFixed(1) || 0}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats?.disbursedRate || 0)}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/60 flex justify-between text-[11px]">
          <span className="text-slate-400">Dư nợ tạm ứng:</span>
          <span className="font-bold text-amber-400">{formatBillion(stats?.advanceRemaining)}</span>
        </div>
      </div>

      {/* User Info / Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
          DT
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">DƯƠNG VĂN TRÃI</p>
          <p className="text-[10px] text-slate-400 truncate">Quản trị viên Dự án</p>
        </div>
      </div>

    </aside>
  );
}