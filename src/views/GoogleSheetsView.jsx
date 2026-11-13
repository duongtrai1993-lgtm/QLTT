import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, 
  Settings, Database, ArrowUpDown, ArrowDownRight, ArrowUpRight, Clock, Plus, Trash2, Check
} from 'lucide-react';
import { storageService, formatDate } from '../services/storageService';

export function GoogleSheetsView() {
  const [configs, setConfigs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('sheets'); // 'sheets' | 'logs' | 'config'
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  useEffect(() => {
    setConfigs(storageService.getGSheetConfigs());
    setLogs(storageService.getGSheetSyncLogs());
  }, []);

  // Kích hoạt đồng bộ mô phỏng
  const handleTriggerSync = (configId = null) => {
    setIsSyncing(true);
    setSyncSuccessMsg('');

    setTimeout(() => {
      const now = new Date().toISOString();
      const newLog = {
        id: `sync-${Date.now()}`,
        sync_time: now,
        direction: 'APP_TO_SHEET',
        target_table: configId ? configs.find(c => c.id === configId)?.tab_name : 'ALL_TABS',
        rows_synced: 115,
        status: 'SUCCESS',
        synced_by: 'Dương Văn Trãi',
        error_message: null
      };

      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      storageService.saveGSheetSyncLogs(updatedLogs);

      // Cập nhật last_synced
      const updatedConfigs = configs.map(c => {
        if (!configId || c.id === configId) {
          return { ...c, last_synced: now, sync_status: 'SUCCESS' };
        }
        return c;
      });
      setConfigs(updatedConfigs);
      storageService.saveGSheetConfigs(updatedConfigs);

      setIsSyncing(false);
      setSyncSuccessMsg('Đã đồng bộ thành công dữ liệu sang Google Sheets!');
      setTimeout(() => setSyncSuccessMsg(''), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Google Sheets Sync API
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-400 text-slate-950 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Đang kết nối
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              Tích Hợp & Đồng Bộ Google Sheets 2 Chiều
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Tự động hóa đồng bộ hồ sơ Đề nghị thanh toán (Hòa Bình), Bảng lương khoán 4 Tổ đội thi công, và Sổ nhật ký tạm ứng hiện trường.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleTriggerSync()}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
                isSyncing 
                  ? 'bg-emerald-700 text-emerald-200 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ toàn bộ ngay'}</span>
            </button>

            <a
              href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition border border-white/20"
            >
              <span>Mở Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>
        </div>

        {syncSuccessMsg && (
          <div className="mt-4 p-2.5 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-xs font-bold text-emerald-200 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{syncSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'sheets'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Danh Sách Tab Đồng Bộ ({configs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'logs'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Nhật Ký Đồng Bộ ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'config'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Cài Đặt API & Webhook</span>
        </button>
      </div>

      {/* TAB 1: Danh sách các Tab trên Google Sheet */}
      {activeTab === 'sheets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {configs.map((cfg) => (
              <div 
                key={cfg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold rounded border border-emerald-200">
                      Tab: {cfg.tab_name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Tự động
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm mb-1">{cfg.description}</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Bảng đích: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">{cfg.target_table}</code>
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dải ô (Range):</span>
                      <span className="font-mono font-bold text-slate-700">{cfg.range_cells}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chiều sync:</span>
                      <span className="font-semibold text-blue-700 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> {cfg.sync_direction}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Đồng bộ gần nhất:</span>
                      <span className="font-medium text-slate-600">{formatDate(cfg.last_synced)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleTriggerSync(cfg.id)}
                    disabled={isSyncing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Đồng bộ Tab này</span>
                  </button>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                    title="Mở trên Google Sheet"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Nhật ký đồng bộ */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Lịch Sử Các Phiên Đồng Bộ Dữ Liệu</h3>
            <span className="text-xs text-slate-500 font-medium">Lưu trữ 30 ngày gần nhất</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Thời Điểm Sync</th>
                  <th className="px-4 py-3">Chiều Đồng Bộ</th>
                  <th className="px-4 py-3">Bảng / Tab Đích</th>
                  <th className="px-4 py-3 text-right">Số Dòng</th>
                  <th className="px-4 py-3 text-center">Trạng Thái</th>
                  <th className="px-4 py-3">Người Thao Tác</th>
                  <th className="px-4 py-3">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {new Date(log.sync_time).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        <ArrowUpRight className="w-3 h-3" /> {log.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{log.target_table}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                      {log.rows_synced} dòng
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" /> Thành công
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{log.synced_by}</td>
                    <td className="px-4 py-3 text-slate-500 italic">
                      {log.error_message || 'Đồng bộ hoàn tất 100%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Cài đặt Webhook & API */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Thông Số Kết Nối Google Spreadsheet</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google Spreadsheet ID</label>
              <input
                type="text"
                readOnly
                value="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
              />
              <p className="text-[11px] text-slate-500 mt-1">ID file trên Google Drive của ban quản lý dự án.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google Apps Script Webhook Endpoint (POST)</label>
              <input
                type="text"
                readOnly
                value="https://script.google.com/macros/s/AKfycbx_QLTT_NamKhoi_Sync2026/exec"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
              />
              <p className="text-[11px] text-slate-500 mt-1">Nhận trigger tự động khi có thanh toán mới hoặc điều chỉnh khối lượng.</p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert('Đã kiểm tra kết nối Google API: Phản hồi 200 OK!')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Kiểm Tra Kết Nối (Ping)
              </button>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Đã xác thực Service Account
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
