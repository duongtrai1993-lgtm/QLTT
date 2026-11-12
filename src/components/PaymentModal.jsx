import React, { useState, useEffect } from 'react';
import { X, Calculator, Calendar, DollarSign, FileCheck } from 'lucide-react';
import { formatVND } from '../services/storageService';

export function PaymentModal({ isOpen, onClose, onSave, contracts = [], projects = [], editingPayment = null }) {
  if (!isOpen) return null;

  const [contractId, setContractId] = useState(editingPayment?.contractId || contracts[0]?.id || '');
  const [stageNumber, setStageNumber] = useState(editingPayment?.stageNumber || 1);
  const [title, setTitle] = useState(editingPayment?.title || '');
  const [paymentType, setPaymentType] = useState(editingPayment?.paymentType || 'progress');
  const [periodFrom, setPeriodFrom] = useState(editingPayment?.periodFrom || new Date().toISOString().slice(0, 10));
  const [periodTo, setPeriodTo] = useState(editingPayment?.periodTo || new Date().toISOString().slice(0, 10));
  const [dateRequested, setDateRequested] = useState(editingPayment?.dateRequested || new Date().toISOString().slice(0, 10));
  
  const [workCompletedValue, setWorkCompletedValue] = useState(editingPayment?.workCompletedValue || 0);
  const [advanceDeduction, setAdvanceDeduction] = useState(editingPayment?.advanceDeduction || 0);
  const [retentionDeduction, setRetentionDeduction] = useState(editingPayment?.retentionDeduction || 0);
  const [penaltyDeduction, setPenaltyDeduction] = useState(editingPayment?.penaltyDeduction || 0);
  const [notes, setNotes] = useState(editingPayment?.notes || '');

  const selectedContract = contracts.find(c => c.id === contractId);
  const selectedProject = projects.find(p => p.id === selectedContract?.projectId);

  // Auto calculate when values change
  useEffect(() => {
    if (paymentType === 'advance') {
      setAdvanceDeduction(0);
      setRetentionDeduction(0);
      if (!editingPayment && selectedContract) {
        const advVal = Math.round((Number(selectedContract.adjustedValue || selectedContract.originalValue || 0) * (selectedContract.advanceRate || 20)) / 100);
        setWorkCompletedValue(0);
        setTitle(`Thanh toán Đợt ${stageNumber}: Tạm ứng hợp đồng (${selectedContract.advanceRate || 20}%)`);
      }
    } else {
      // For progress payment under ND 254/2025, auto calculate 20% advance recovery and 5% retention
      const workVal = Number(workCompletedValue) || 0;
      const advRec = Math.round(workVal * 0.2); // 20%
      const retVal = Math.round(workVal * ((selectedContract?.retentionRate || 5) / 100)); // 5%

      setAdvanceDeduction(advRec);
      setRetentionDeduction(retVal);
      if (!editingPayment) {
        setTitle(`Thanh toán Đợt ${stageNumber}: Khối lượng hoàn thành kỳ ${stageNumber - 1}`);
      }
    }
  }, [paymentType, workCompletedValue, contractId, stageNumber]);

  // Net payable calculation
  const calculatedRequestedAmount = paymentType === 'advance'
    ? Number(workCompletedValue) || (selectedContract ? Math.round((Number(selectedContract.adjustedValue) * selectedContract.advanceRate) / 100) : 0)
    : Math.max(0, Number(workCompletedValue) - Number(advanceDeduction) - Number(retentionDeduction) - Number(penaltyDeduction));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contractId || !title) return;

    const payload = {
      id: editingPayment?.id || `pay-${Date.now()}`,
      contractId,
      stageNumber: Number(stageNumber),
      title,
      paymentType,
      periodFrom,
      periodTo,
      dateRequested,
      workCompletedValue: Number(workCompletedValue),
      advanceDeduction: Number(advanceDeduction),
      retentionDeduction: Number(retentionDeduction),
      penaltyDeduction: Number(penaltyDeduction),
      requestedAmount: calculatedRequestedAmount,
      approvedAmount: editingPayment?.approvedAmount || calculatedRequestedAmount,
      status: editingPayment?.status || 'draft',
      disbursedDate: editingPayment?.disbursedDate || null,
      notes
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <FileCheck className="w-4 h-4" />
              </span>
              {editingPayment ? 'Chỉnh Sửa Hồ Sơ Thanh Toán' : 'Lập Đợt Đề Nghị Thanh Toán Mới'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng mẫu biểu Mẫu 03.a/TT theo Nghị định số 254/2025/NĐ-CP của Chính phủ
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thuộc Hợp Đồng / Gói Thầu *</label>
              <select
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                required
              >
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.packageName.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loại Thanh Toán *</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-blue-800 bg-blue-50/50"
              >
                <option value="progress">Khối lượng hoàn thành (Mẫu số 03.a/TT - NĐ 254/2025)</option>
                <option value="advance">Tạm ứng hợp đồng</option>
                <option value="final">Quyết toán hoàn thành (A-B)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Đợt Số</label>
              <input
                type="number"
                min="1"
                value={stageNumber}
                onChange={(e) => setStageNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-center"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">Tiêu Đề / Nội Dung Hồ Sơ *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Thanh toán đợt 2: Xong phần thô..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Từ ngày</label>
              <input
                type="date"
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Đến ngày</label>
              <input
                type="date"
                value={periodTo}
                onChange={(e) => setPeriodTo(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Ngày lập hồ sơ</label>
              <input
                type="date"
                value={dateRequested}
                onChange={(e) => setDateRequested(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Tài chính & Tính toán tự động theo NĐ 254/2025/NĐ-CP */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-3">
            <h4 className="font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-700" />
              Bảng Tính Giá Trị Thanh Toán Theo NĐ 254/2025/NĐ-CP (VNĐ)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {paymentType === 'advance' ? 'Số tiền tạm ứng đề nghị (VNĐ) *' : '1. Giá trị khối lượng thực hiện kỳ này *'}
                </label>
                <input
                  type="number"
                  value={workCompletedValue}
                  onChange={(e) => setWorkCompletedValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="text-[10px] text-slate-500 font-medium">{formatVND(workCompletedValue)}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. Khấu trừ thu hồi tạm ứng kỳ này (VNĐ)
                </label>
                <input
                  type="number"
                  value={advanceDeduction}
                  onChange={(e) => setAdvanceDeduction(e.target.value)}
                  disabled={paymentType === 'advance'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-rose-600 disabled:bg-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-medium">{formatVND(advanceDeduction)}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  3. Khấu trừ giữ lại bảo hành ({selectedContract?.retentionRate || 5}%)
                </label>
                <input
                  type="number"
                  value={retentionDeduction}
                  onChange={(e) => setRetentionDeduction(e.target.value)}
                  disabled={paymentType === 'advance'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-amber-700 disabled:bg-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-medium">{formatVND(retentionDeduction)}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  4. Khấu trừ vi phạm / khác (VNĐ)
                </label>
                <input
                  type="number"
                  value={penaltyDeduction}
                  onChange={(e) => setPenaltyDeduction(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-700"
                />
                <span className="text-[10px] text-slate-500 font-medium">{formatVND(penaltyDeduction)}</span>
              </div>
            </div>

            {/* Net Amount Box */}
            <div className="bg-white p-3.5 rounded-lg border border-blue-300 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold text-blue-900 block">
                  Số Tiền Đề Nghị Kho Bạc Thanh Toán Kỳ Này:
                </span>
                <span className="text-[10px] text-slate-500">
                  Công thức: (1) - (2) - (3) - (4)
                </span>
              </div>
              <span className="text-xl font-black text-emerald-600">
                {formatVND(calculatedRequestedAmount)}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghi Chú Hồ Sơ</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Đã nộp chứng thư bảo lãnh ngân hàng, hồ sơ nghiệm thu..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
            >
              {editingPayment ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ Mới'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}