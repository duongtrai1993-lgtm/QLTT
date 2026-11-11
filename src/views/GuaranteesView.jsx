import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Building, Calendar, CheckCircle } from 'lucide-react';
import { formatDate } from '../services/storageService';

export function GuaranteesView({ contracts, projects }) {
  const today = new Date();

  const allGuarantees = contracts.flatMap(c => {
    const list = [];
    const project = projects.find(p => p.id === c.projectId);

    if (c.guaranteeExpiry) {
      const expDate = new Date(c.guaranteeExpiry);
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      list.push({
        id: `${c.id}-perf`,
        contractCode: c.code,
        packageName: c.packageName,
        projectName: project?.name,
        contractor: c.contractor,
        type: 'Bảo lãnh Thực hiện Hợp đồng',
        expiryDate: c.guaranteeExpiry,
        daysLeft: diffDays,
        bankName: c.bankName,
        status: diffDays <= 0 ? 'expired' : diffDays <= 30 ? 'critical' : diffDays <= 90 ? 'warning' : 'safe'
      });
    }

    if (c.advanceGuaranteeExpiry) {
      const expDate = new Date(c.advanceGuaranteeExpiry);
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      list.push({
        id: `${c.id}-adv`,
        contractCode: c.code,
        packageName: c.packageName,
        projectName: project?.name,
        contractor: c.contractor,
        type: 'Bảo lãnh Thu hồi Tạm ứng',
        expiryDate: c.advanceGuaranteeExpiry,
        daysLeft: diffDays,
        bankName: c.bankName,
        status: diffDays <= 0 ? 'expired' : diffDays <= 30 ? 'critical' : diffDays <= 90 ? 'warning' : 'safe'
      });
    }

    return list;
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  const criticalCount = allGuarantees.filter(g => g.status === 'critical' || g.status === 'expired').length;
  const warningCount = allGuarantees.filter(g => g.status === 'warning').length;
  const safeCount = allGuarantees.filter(g => g.status === 'safe').length;

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Theo Dõi & Cảnh Báo Bảo Lãnh Ngân Hàng
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kiểm soát thời hạn bảo lãnh tạm ứng và bảo lãnh thực hiện hợp đồng để tránh rủi ro pháp lý & tài chính
          </p>
        </div>
      </div>

      {/* Summary status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-rose-700 uppercase">Khẩn cấp (Hết hạn ≤ 30 ngày)</p>
            <p className="text-2xl font-black text-rose-900 mt-0.5">{criticalCount} thư bảo lãnh</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase">Cần gia hạn (31 - 90 ngày)</p>
            <p className="text-2xl font-black text-amber-900 mt-0.5">{warningCount} thư bảo lãnh</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase">An toàn (&gt; 90 ngày)</p>
            <p className="text-2xl font-black text-emerald-900 mt-0.5">{safeCount} thư bảo lãnh</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Hợp Đồng & Gói Thầu</th>
                <th className="px-5 py-3.5">Loại Bảo Lãnh</th>
                <th className="px-5 py-3.5">Nhà Thầu Thi Công</th>
                <th className="px-5 py-3.5">Ngân Hàng Phát Hành</th>
                <th className="px-5 py-3.5">Ngày Hết Hạn</th>
                <th className="px-5 py-3.5 text-center">Thời Gian Còn Lại</th>
                <th className="px-5 py-3.5 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allGuarantees.map(g => (
                <tr key={g.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-blue-700">{g.contractCode}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{g.packageName}</p>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    {g.type}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium truncate max-w-xs">
                    {g.contractor}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {g.bankName}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">
                    {formatDate(g.expiryDate)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block font-black px-2.5 py-1 rounded-lg text-xs ${
                      g.daysLeft <= 0 ? 'bg-slate-200 text-slate-700' :
                      g.daysLeft <= 30 ? 'bg-rose-100 text-rose-800 font-bold' :
                      g.daysLeft <= 90 ? 'bg-amber-100 text-amber-800 font-bold' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {g.daysLeft <= 0 ? 'Đã hết hạn' : `Còn ${g.daysLeft} ngày`}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {g.status === 'critical' ? (
                      <span className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Gửi văn bản yêu cầu gia hạn ngay
                      </span>
                    ) : g.status === 'warning' ? (
                      <span className="text-xs font-semibold text-amber-600 flex items-center justify-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Theo dõi gia hạn
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Đang hiệu lực
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}