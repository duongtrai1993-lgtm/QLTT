import React, { useState } from 'react';
import { Plus, Filter, FileText, CheckCircle, Clock, AlertCircle, Eye, Printer, Edit2, Trash2 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatVND, formatDate } from '../services/storageService';

export function PaymentsView({
  payments,
  contracts,
  projects,
  onOpenNewPayment,
  onSelectPayment,
  onOpenForm03a,
  onOpenForm03c,
  onOpenForm04a,
  onEditPayment,
  onDeletePayment
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');

  const filteredPayments = payments.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (typeFilter !== 'all' && p.paymentType !== typeFilter) return false;
    if (contractFilter !== 'all' && p.contractId !== contractFilter) return false;
    return true;
  });

  const totalRequested = filteredPayments.reduce((s, p) => s + (Number(p.requestedAmount) || 0), 0);
  const totalDisbursed = filteredPayments.filter(p => p.status === 'disbursed').reduce((s, p) => s + (Number(p.approvedAmount || p.requestedAmount) || 0), 0);

  return (
    <div className="space-y-5">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Hồ Sơ & Đợt Thanh Toán Dự Án
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý quy trình nghiệm thu, thẩm tra TVGS, phê duyệt và thanh toán vốn đầu tư
          </p>
        </div>

        <button
          onClick={onOpenNewPayment}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Lập Đợt Thanh Toán Mới
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Lọc:
        </span>

        {/* Contract filter */}
        <select
          value={contractFilter}
          onChange={(e) => setContractFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả gói thầu ({contracts.length})</option>
          {contracts.map(c => (
            <option key={c.id} value={c.id}>{c.code} - {c.packageName.slice(0, 25)}...</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="draft">Dự thảo</option>
          <option value="under_review">TVGS đang kiểm tra</option>
          <option value="pending_approval">Chờ CĐT duyệt</option>
          <option value="approved">Đã duyệt thanh toán</option>
          <option value="disbursed">Đã giải ngân (Kho bạc)</option>
          <option value="rejected">Yêu cầu hoàn thiện</option>
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả loại thanh toán</option>
          <option value="advance">Tạm ứng hợp đồng</option>
          <option value="progress">Khối lượng Mẫu 03.a/TT (NĐ 254/2025)</option>
          <option value="final">Quyết toán A-B</option>
        </select>

        <div className="ml-auto flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span>Tìm thấy: <strong className="text-slate-900">{filteredPayments.length}</strong> hồ sơ</span>
          <span className="hidden md:inline">Tổng đề nghị: <strong className="text-blue-700">{formatVND(totalRequested)}</strong></span>
          <span className="hidden md:inline">Đã giải ngân: <strong className="text-emerald-700">{formatVND(totalDisbursed)}</strong></span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5 text-center w-12">Đợt</th>
                <th className="px-4 py-3.5">Hồ Sơ & Tiêu Đề</th>
                <th className="px-4 py-3.5">Gói Thầu / Hợp Đồng</th>
                <th className="px-4 py-3.5">Loại TT</th>
                <th className="px-4 py-3.5 text-right">Khối Lượng HT</th>
                <th className="px-4 py-3.5 text-right">Thu Hồi Tạm Ứng</th>
                <th className="px-4 py-3.5 text-right">Giữ Lại BH 5%</th>
                <th className="px-4 py-3.5 text-right bg-blue-50/50">Thực Thanh Toán</th>
                <th className="px-4 py-3.5 text-center">Trạng Thái</th>
                <th className="px-4 py-3.5 text-center w-28">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-slate-400 italic">
                    Không tìm thấy hồ sơ thanh toán nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => {
                  const contract = contracts.find(c => c.id === p.contractId);
                  const project = projects.find(pr => pr.id === contract?.projectId);

                  return (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition group">
                      
                      {/* Đợt */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center mx-auto text-xs">
                          {p.stageNumber}
                        </span>
                      </td>

                      {/* Tiêu đề & Ngày */}
                      <td className="px-4 py-3.5">
                        <p
                          onClick={() => onSelectPayment(p)}
                          className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition leading-snug"
                        >
                          {p.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Kỳ TT: {formatDate(p.periodFrom)} → {formatDate(p.periodTo)}
                        </p>
                      </td>

                      {/* Hợp đồng */}
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-blue-700">{contract?.code}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{contract?.contractor}</p>
                      </td>

                      {/* Loại thanh toán */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={p.paymentType} type="paymentType" />
                      </td>

                      {/* Khối lượng thực hiện */}
                      <td className="px-4 py-3.5 text-right font-medium text-slate-700">
                        {p.workCompletedValue > 0 ? formatVND(p.workCompletedValue) : '---'}
                      </td>

                      {/* Thu hồi tạm ứng */}
                      <td className="px-4 py-3.5 text-right font-medium text-rose-600">
                        {p.advanceDeduction > 0 ? `- ${formatVND(p.advanceDeduction)}` : '0 ₫'}
                      </td>

                      {/* Giữ lại bảo hành */}
                      <td className="px-4 py-3.5 text-right font-medium text-amber-700">
                        {p.retentionDeduction > 0 ? `- ${formatVND(p.retentionDeduction)}` : '0 ₫'}
                      </td>

                      {/* Thực nhận */}
                      <td className="px-4 py-3.5 text-right font-black text-slate-900 bg-blue-50/40 text-[13px]">
                        {formatVND(p.requestedAmount)}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge status={p.status} type="payment" />
                      </td>

                      {/* Thao tác */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectPayment(p)}
                            title="Xem chi tiết hồ sơ & chứng từ"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (p.paymentType === 'advance') {
                                onOpenForm04a(p);
                              } else if (p.paymentType === 'final') {
                                onOpenForm03c(p);
                              } else {
                                onOpenForm03a(p);
                              }
                            }}
                            title={
                              p.paymentType === 'advance' ? 'Xem Mẫu 04.a/TT (Tạm ứng)' :
                              p.paymentType === 'final' ? 'Xem Mẫu 03.c/QT (Quyết toán A-B)' :
                              'Xem Mẫu 03.a/TT (Khối lượng hoàn thành)'
                            }
                            className={`p-1.5 rounded-lg transition ${
                              p.paymentType === 'advance' ? 'text-emerald-600 hover:bg-emerald-50' :
                              p.paymentType === 'final' ? 'text-amber-600 hover:bg-amber-50' :
                              'text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditPayment(p)}
                            title="Sửa thông tin hồ sơ"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeletePayment(p.id)}
                            title="Xóa hồ sơ này"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}