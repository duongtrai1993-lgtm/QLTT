import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { formatVND } from '../services/storageService';

export function ContractModal({ isOpen, onClose, onSave, projects = [], editingContract = null }) {
  if (!isOpen) return null;

  const [projectId, setProjectId] = useState(editingContract?.projectId || projects[0]?.id || '');
  const [code, setCode] = useState(editingContract?.code || `HĐ-0${Math.floor(Math.random() * 9) + 1}/2024/XL`);
  const [packageName, setPackageName] = useState(editingContract?.packageName || '');
  const [contractor, setContractor] = useState(editingContract?.contractor || '');
  const [contractorTaxCode, setContractorTaxCode] = useState(editingContract?.contractorTaxCode || '');
  const [contractorAccount, setContractorAccount] = useState(editingContract?.contractorAccount || '');
  const [contractType, setContractType] = useState(editingContract?.contractType || 'Đơn giá cố định');
  const [originalValue, setOriginalValue] = useState(editingContract?.originalValue || 50000000000);
  const [adjustedValue, setAdjustedValue] = useState(editingContract?.adjustedValue || editingContract?.originalValue || 50000000000);
  const [advanceRate, setAdvanceRate] = useState(editingContract?.advanceRate || 20);
  const [retentionRate, setRetentionRate] = useState(editingContract?.retentionRate || 5);
  const [signDate, setSignDate] = useState(editingContract?.signDate || new Date().toISOString().slice(0, 10));
  const [guaranteeExpiry, setGuaranteeExpiry] = useState(editingContract?.guaranteeExpiry || '2026-12-31');
  const [advanceGuaranteeExpiry, setAdvanceGuaranteeExpiry] = useState(editingContract?.advanceGuaranteeExpiry || '2025-12-31');
  const [bankName, setBankName] = useState(editingContract?.bankName || 'Vietcombank');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !packageName || !contractor) return;

    onSave({
      id: editingContract?.id || `cont-${Date.now()}`,
      projectId,
      code,
      packageName,
      contractor,
      contractorTaxCode,
      contractorAccount,
      contractType,
      originalValue: Number(originalValue),
      adjustedValue: Number(adjustedValue),
      advanceRate: Number(advanceRate),
      advanceRecoveryStart: 30,
      advanceRecoveryEnd: 80,
      retentionRate: Number(retentionRate),
      signDate,
      durationDays: editingContract?.durationDays || 600,
      guaranteeExpiry,
      advanceGuaranteeExpiry,
      bankName,
      status: 'active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {editingContract ? 'Chỉnh Sửa Hợp Đồng' : 'Thêm Hợp Đồng & Gói Thầu Mới'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thuộc Dự Án *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                required
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name.slice(0, 35)}...</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số / Mã Hợp Đồng *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tên Gói Thầu *</label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="VD: Gói thầu số 03: Thi công xây lắp..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nhà Thầu Thi Công / Tư Vấn *</label>
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hình Thức HĐ</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="Trọn gói">Trọn gói</option>
                <option value="Đơn giá cố định">Đơn giá cố định</option>
                <option value="Đơn giá điều chỉnh">Đơn giá điều chỉnh</option>
                <option value="Theo thời gian">Theo thời gian</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giá Trị Hợp Đồng Gốc (VNĐ) *</label>
              <input
                type="number"
                value={originalValue}
                onChange={(e) => {
                  setOriginalValue(e.target.value);
                  if (!editingContract) setAdjustedValue(e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                required
              />
              <span className="text-[10px] text-slate-500">{formatVND(originalValue)}</span>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giá Trị Sau Phụ Lục (nếu có)</label>
              <input
                type="number"
                value={adjustedValue}
                onChange={(e) => setAdjustedValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-blue-700"
              />
              <span className="text-[10px] text-slate-500">{formatVND(adjustedValue)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tỷ Lệ Tạm Ứng HĐ (%)</label>
              <input
                type="number"
                value={advanceRate}
                onChange={(e) => setAdvanceRate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-center"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tỷ Lệ Giữ Lại Bảo Hành (%)</label>
              <input
                type="number"
                value={retentionRate}
                onChange={(e) => setRetentionRate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-center"
              />
            </div>
          </div>

          {/* Bảo lãnh */}
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-900 uppercase tracking-wide">
              Thông Tin Bảo Lãnh Ngân Hàng
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngân Hàng Phát Hành</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hạn Bảo Lãnh Thực Hiện HĐ</label>
                <input
                  type="date"
                  value={guaranteeExpiry}
                  onChange={(e) => setGuaranteeExpiry(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hạn Bảo Lãnh Tạm Ứng</label>
                <input
                  type="date"
                  value={advanceGuaranteeExpiry}
                  onChange={(e) => setAdvanceGuaranteeExpiry(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
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
              {editingContract ? 'Lưu Thay Đổi' : 'Tạo Hợp Đồng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}