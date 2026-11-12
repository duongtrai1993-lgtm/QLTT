import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, Printer, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatVND, formatDate } from '../services/storageService';

export function PaymentDetailDrawer({
  isOpen,
  onClose,
  payment,
  contract,
  project,
  documents,
  checklistTemplates,
  onUpdatePaymentStatus,
  onUpdateDocumentStatus,
  onOpenForm03a,
  onDeletePayment
}) {
  if (!isOpen || !payment) return null;

  const currentDocs = documents[payment.id] || [];

  // Tính số lượng chứng từ đạt
  const totalRequired = checklistTemplates.filter(t => t.required).length;
  const passedCount = checklistTemplates.filter(t => {
    const doc = currentDocs.find(d => d.templateId === t.id);
    return doc?.status === 'passed';
  }).length;

  const completionRate = Math.round((passedCount / totalRequired) * 100);

  const handleDocStatusChange = (templateId, newStatus) => {
    onUpdateDocumentStatus(payment.id, templateId, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end no-print">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">
                Đợt {payment.stageNumber}
              </span>
              <StatusBadge status={payment.paymentType} type="paymentType" />
              <StatusBadge status={payment.status} type="payment" />
            </div>
            <h2 className="text-base font-bold text-slate-800 leading-snug">
              {payment.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              HĐ: <span className="font-semibold text-slate-700">{contract?.code}</span> • {project?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Card Tài chính đợt thanh toán */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div>
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wider block">
                  Số Tiền Đề Nghị Thanh Toán Kỳ Này
                </span>
                <span className="text-[10px] text-emerald-300">
                  Chuẩn Nghị định 254/2025/NĐ-CP
                </span>
              </div>
              <span className="text-2xl font-black text-emerald-400">
                {formatVND(payment.requestedAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div>
                <p className="text-slate-400">Khối lượng thực hiện:</p>
                <p className="font-bold text-white text-sm mt-0.5">{formatVND(payment.workCompletedValue)}</p>
              </div>
              <div>
                <p className="text-slate-400">Thu hồi tạm ứng:</p>
                <p className="font-bold text-rose-400 text-sm mt-0.5">- {formatVND(payment.advanceDeduction)}</p>
              </div>
              <div>
                <p className="text-slate-400">Giữ lại bảo hành (5%):</p>
                <p className="font-bold text-amber-400 text-sm mt-0.5">- {formatVND(payment.retentionDeduction)}</p>
              </div>
              <div>
                <p className="text-slate-400">Kỳ thanh toán:</p>
                <p className="font-medium text-white mt-0.5">{formatDate(payment.periodFrom)} - {formatDate(payment.periodTo)}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenForm03a}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <FileText className="w-4 h-4" />
                Xem Bảng Xác Định Khối Lượng (Mẫu số 03.a/TT - NĐ 254/2025)
              </button>
            </div>
          </div>

          {/* Quy trình phê duyệt (Workflow Transition) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Quy Trình Xử Lý & Phê Duyệt Hồ Sơ
            </h3>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {payment.status === 'draft' && (
                <button
                  onClick={() => onUpdatePaymentStatus(payment.id, 'under_review')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shadow-sm"
                >
                  Gửi TVGS thẩm tra <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {payment.status === 'under_review' && (
                <>
                  <button
                    onClick={() => onUpdatePaymentStatus(payment.id, 'pending_approval')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shadow-sm"
                  >
                    TVGS xác nhận đạt → Trình CĐT <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdatePaymentStatus(payment.id, 'rejected')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition"
                  >
                    Trả hồ sơ yêu cầu sửa
                  </button>
                </>
              )}

              {payment.status === 'pending_approval' && (
                <>
                  <button
                    onClick={() => onUpdatePaymentStatus(payment.id, 'approved')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shadow-sm"
                  >
                    ✓ Ban QLDA Phê Duyệt Thanh Toán
                  </button>
                  <button
                    onClick={() => onUpdatePaymentStatus(payment.id, 'rejected')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition"
                  >
                    Yêu cầu điều chỉnh
                  </button>
                </>
              )}

              {payment.status === 'approved' && (
                <button
                  onClick={() => onUpdatePaymentStatus(payment.id, 'disbursed')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shadow-sm"
                >
                  ✓ Xác nhận Kho bạc đã giải ngân chuyển khoản
                </button>
              )}

              {payment.status === 'rejected' && (
                <button
                  onClick={() => onUpdatePaymentStatus(payment.id, 'under_review')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shadow-sm"
                >
                  Nhà thầu đã nộp lại → Thẩm tra lại
                </button>
              )}

              {payment.status === 'disbursed' && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Đã hoàn tất thanh toán & chuyển tiền ngày {formatDate(payment.disbursedDate || payment.dateRequested)}
                </div>
              )}
            </div>
          </div>

          {/* Legal Document Checklist theo ND 254/2025/ND-CP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Danh Mục Hồ Sơ & Chứng Từ Pháp Lý Bắt Buộc
                </h3>
                <p className="text-xs text-slate-500">
                  Kiểm soát theo Nghị định số 254/2025/NĐ-CP của Chính phủ
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-700">
                  {passedCount}/{totalRequired} chứng từ hợp lệ
                </span>
                <div className="w-28 bg-slate-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${completionRate === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {checklistTemplates.map((tpl, index) => {
                const doc = currentDocs.find(d => d.templateId === tpl.id) || { status: 'not_submitted', notes: '' };

                return (
                  <div key={tpl.id} className="p-3.5 hover:bg-slate-50 transition flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                          {index + 1}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                          {tpl.name}
                        </p>
                        {tpl.required && (
                          <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                            Bắt buộc
                          </span>
                        )}
                      </div>
                      {doc.notes && (
                        <p className="text-[11px] text-slate-500 pl-7 italic">
                          Ghi chú: {doc.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <select
                        value={doc.status}
                        onChange={(e) => handleDocStatusChange(tpl.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition focus:outline-none ${
                          doc.status === 'passed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          doc.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          doc.status === 'rejected' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          'bg-slate-50 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="not_submitted">Chưa nộp</option>
                        <option value="pending">⏳ Đang bổ sung</option>
                        <option value="passed">✓ Hợp lệ / Đạt</option>
                        <option value="rejected">✕ Không đạt</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ghi chú hồ sơ */}
          {payment.notes && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Ghi chú nội bộ:
              </span>
              <p>{payment.notes}</p>
            </div>
          )}

          {/* Delete Payment Button */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-400">ID Hồ sơ: {payment.id}</span>
            <button
              onClick={() => onDeletePayment(payment.id)}
              className="text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa đợt thanh toán này
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}