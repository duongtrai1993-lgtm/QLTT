import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import {
  DollarSign, TrendingUp, AlertTriangle, ShieldCheck, FileCheck, ArrowUpRight, Clock
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatVND, formatBillion, formatDate, calculateContractStats } from '../services/storageService';

export function DashboardView({
  projects,
  contracts,
  payments,
  onSelectPayment,
  onNavigateTab
}) {
  // Aggregate system stats
  const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const totalContractVal = contracts.reduce((sum, c) => sum + (Number(c.adjustedValue || c.originalValue) || 0), 0);

  // Payments aggregate
  const disbursedPayments = payments.filter(p => p.status === 'disbursed');
  const totalDisbursed = disbursedPayments.reduce((sum, p) => sum + (Number(p.approvedAmount || p.requestedAmount) || 0), 0);
  const totalWorkCompleted = payments
    .filter(p => ['disbursed', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + (Number(p.workCompletedValue) || 0), 0);

  const totalAdvancePaid = payments
    .filter(p => p.paymentType === 'advance' && ['disbursed', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + (Number(p.approvedAmount || p.requestedAmount) || 0), 0);

  const totalAdvanceDeducted = payments
    .filter(p => ['disbursed', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + (Number(p.advanceDeduction) || 0), 0);

  const advanceRemaining = Math.max(0, totalAdvancePaid - totalAdvanceDeducted);
  const totalRetention = payments
    .filter(p => ['disbursed', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + (Number(p.retentionDeduction) || 0), 0);

  const pendingPayments = payments.filter(p => ['pending_approval', 'under_review'].includes(p.status));

  // Chart Data: Contract Progress
  const chartData = contracts.map(c => {
    const stats = calculateContractStats(c, payments);
    return {
      name: c.code,
      'Giá trị HĐ': Math.round(stats.contractVal / 1000000000),
      'Đã giải ngân': Math.round(stats.totalDisbursed / 1000000000),
      'Khối lượng HT': Math.round(stats.totalWorkCompleted / 1000000000)
    };
  });

  // Pie chart data: Cash Flow Allocation
  const remainingContractVal = Math.max(0, totalContractVal - totalDisbursed);
  const pieData = [
    { name: 'Đã giải ngân', value: totalDisbursed, color: '#10b981' },
    { name: 'Dư nợ tạm ứng', value: advanceRemaining, color: '#f59e0b' },
    { name: 'Tiền bảo hành giữ lại', value: totalRetention, color: '#8b5cf6' },
    { name: 'Còn lại của HĐ', value: remainingContractVal, color: '#94a3b8' }
  ];

  // Guarantee alerts (within 90 days)
  const today = new Date();
  const guaranteeAlerts = contracts.flatMap(c => {
    const alerts = [];
    if (c.advanceGuaranteeExpiry) {
      const expDate = new Date(c.advanceGuaranteeExpiry);
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 90) {
        alerts.push({
          contractCode: c.code,
          contractor: c.contractor,
          type: 'Bảo lãnh Tạm ứng',
          expiryDate: c.advanceGuaranteeExpiry,
          daysLeft: diffDays,
          bankName: c.bankName
        });
      }
    }
    if (c.guaranteeExpiry) {
      const expDate = new Date(c.guaranteeExpiry);
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 90) {
        alerts.push({
          contractCode: c.code,
          contractor: c.contractor,
          type: 'Bảo lãnh Thực hiện HĐ',
          expiryDate: c.guaranteeExpiry,
          daysLeft: diffDays,
          bankName: c.bankName
        });
      }
    }
    return alerts;
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Báo Cáo Tiến Độ Giải Ngân Dự Án Đầu Tư Xây Dựng
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Hệ Thống Theo Dõi Hồ Sơ & Quyết Toán Thanh Toán
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Quản lý đồng bộ giá trị hợp đồng, khối lượng nghiệm thu Mẫu 03a, thu hồi tạm ứng tự động và cảnh báo rủi ro bảo lãnh ngân hàng.
          </p>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Mức Đầu Tư</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatBillion(totalBudget)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Trên tổng số <span className="font-bold text-slate-700">{projects.length} dự án</span> trọng điểm
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Giá Trị Hợp Đồng</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatBillion(totalContractVal)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Gồm <span className="font-bold text-slate-700">{contracts.length} gói thầu</span> xây lắp & tư vấn
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Giải Ngân Lũy Kế</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-emerald-600">{formatBillion(totalDisbursed)}</p>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {totalContractVal > 0 ? ((totalDisbursed / totalContractVal) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Khối lượng hoàn thành: <span className="font-bold text-slate-700">{formatBillion(totalWorkCompleted)}</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Dư Nợ Tạm Ứng Còn Lại</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600">{formatBillion(advanceRemaining)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Đã thu hồi: <span className="font-bold text-slate-700">{formatBillion(totalAdvanceDeducted)}</span>
          </p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar chart: 2 columns */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                So Sánh Giá Trị Hợp Đồng & Giải Ngân Theo Gói Thầu
              </h3>
              <p className="text-xs text-slate-500">Đơn vị tính: Tỷ VNĐ</p>
            </div>
            <button
              onClick={() => onNavigateTab('contracts')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val} tỷ VNĐ`]}
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Giá trị HĐ" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Khối lượng HT" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã giải ngân" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: 1 column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              Cơ Cấu Dòng Tiền & Công Nợ Hợp Đồng
            </h3>
            <p className="text-xs text-slate-500">Phân bổ tỷ trọng trên toàn bộ dự án</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatVND(val)]}
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-slate-800">{formatBillion(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lower Section: Pending Approvals & Bank Guarantee Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending Dossiers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Hồ Sơ Chờ Phê Duyệt & Thẩm Định ({pendingPayments.length})
                </h3>
                <p className="text-xs text-slate-500">Hồ sơ cần TVGS / Ban QLDA xử lý</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Tất cả hồ sơ
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingPayments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                Hiện không có hồ sơ nào đang chờ duyệt.
              </p>
            ) : (
              pendingPayments.map(p => {
                const contract = contracts.find(c => c.id === p.contractId);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPayment(p)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700">{contract?.code}</span>
                        <StatusBadge status={p.status} type="payment" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{p.title}</p>
                      <p className="text-[11px] text-slate-400">Ngày lập: {formatDate(p.dateRequested)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">{formatVND(p.requestedAmount)}</p>
                      <span className="text-[10px] text-blue-600 font-bold hover:underline">
                        Chi tiết hồ sơ →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bank Guarantee Warnings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Cảnh Báo Hạn Bảo Lãnh Ngân Hàng ({guaranteeAlerts.length})
                </h3>
                <p className="text-xs text-slate-500">Bảo lãnh tạm ứng & thực hiện HĐ trong 90 ngày</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('guarantees')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {guaranteeAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                Không có thư bảo lãnh nào sắp hết hạn.
              </p>
            ) : (
              guaranteeAlerts.map((g, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between px-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{g.contractCode}</span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {g.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate max-w-xs">{g.contractor}</p>
                    <p className="text-[11px] text-slate-400">{g.bankName}</p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-xs font-black px-2 py-0.5 rounded ${
                      g.daysLeft <= 30 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      Còn {g.daysLeft} ngày
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Hết hạn: {formatDate(g.expiryDate)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}