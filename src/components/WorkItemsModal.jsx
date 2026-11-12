import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check, AlertCircle, FileText, Download } from 'lucide-react';
import { storageService, formatVND, formatNumber } from '../services/storageService';
import { SAMPLE_FORM_03A_SECTIONS } from '../data/sampleData';

const SECTION_OPTIONS = [
  { code: 'I', name: 'I. Công việc thực hiện thông qua hợp đồng' },
  { code: 'II', name: 'II. Công việc thực hiện không thông qua hợp đồng' },
  { code: 'III', name: 'III. Chi phí bồi thường, hỗ trợ, tái định cư' },
  { code: 'IV', name: 'IV. Chi phí quản lý dự án' }
];

export function WorkItemsModal({ isOpen, onClose, contract, onSaved }) {
  if (!isOpen || !contract) return null;

  const [sections, setSections] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form input state
  const [sectionCode, setSectionCode] = useState('I');
  const [stt, setStt] = useState('');
  const [jobCode, setJobCode] = useState('');
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('m3');
  const [contractQty, setContractQty] = useState('');
  const [unitPriceContract, setUnitPriceContract] = useState('');
  const [unitPriceAdditional, setUnitPriceAdditional] = useState('0');
  const [note, setNote] = useState('');

  // Load contract work items on open
  useEffect(() => {
    const loaded = storageService.getWorkItems(contract.id);
    setSections(loaded);
  }, [contract.id]);

  const allItems = sections.flatMap(s => s.items);
  const totalCalculatedValue = allItems.reduce((sum, item) => sum + (Number(item.contractVal) || 0), 0);

  const resetForm = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setSectionCode('I');
    setStt('');
    setJobCode('');
    setName('');
    setUnit('m3');
    setContractQty('');
    setUnitPriceContract('');
    setUnitPriceAdditional('0');
    setNote('');
  };

  const handleStartAdd = (preselectedSection = 'I') => {
    resetForm();
    setSectionCode(preselectedSection);
    // Auto generate next STT in that section
    const sec = sections.find(s => s.sectionCode === preselectedSection);
    const nextStt = (sec?.items?.length || 0) + 1;
    setStt(String(nextStt));
    setShowAddForm(true);
  };

  const handleStartEdit = (secCode, item) => {
    setEditingItem({ ...item, originalSectionCode: secCode });
    setSectionCode(secCode);
    setStt(item.stt);
    setJobCode(item.jobCode || '');
    setName(item.name);
    setUnit(item.unit);
    setContractQty(String(item.contractQty));
    setUnitPriceContract(String(item.unitPriceContract));
    setUnitPriceAdditional(String(item.unitPriceAdditional || 0));
    setNote(item.note || '');
    setShowAddForm(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const qty = Number(contractQty) || 0;
    const price = Number(unitPriceContract) || 0;
    const addPrice = Number(unitPriceAdditional) || 0;
    const val = qty * price;

    const newItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      stt: stt || '1',
      jobCode: jobCode.trim() || `CV.${stt || '01'}`,
      name: name.trim(),
      unit: unit.trim() || 'cái',
      contractQty: qty,
      prevUnpaidQty: editingItem?.prevUnpaidQty || 0,
      prevPaidQty: editingItem?.prevPaidQty || 0,
      thisPeriodAcceptedQty: editingItem?.thisPeriodAcceptedQty || 0,
      totalCumulativeQty: editingItem?.totalCumulativeQty || 0,
      thisPeriodRequestedQty: editingItem?.thisPeriodRequestedQty || 0,
      unitPriceContract: price,
      unitPriceAdditional: addPrice,
      contractVal: val,
      prevUnpaidVal: editingItem?.prevUnpaidVal || 0,
      thisPeriodAcceptedVal: (editingItem?.thisPeriodAcceptedQty || 0) * price,
      thisPeriodRequestedVal: (editingItem?.thisPeriodAcceptedQty || 0) * price,
      thisPeriodUnpaidVal: editingItem?.thisPeriodUnpaidVal || 0,
      prevPaidVal: editingItem?.prevPaidVal || 0,
      totalPaidToDateVal: editingItem?.totalPaidToDateVal || 0,
      note: note.trim()
    };

    let updatedSections = [...sections];

    // Ensure 4 sections exist
    if (updatedSections.length === 0) {
      updatedSections = [
        { sectionCode: "I", sectionName: "Công việc thực hiện thông qua hợp đồng", items: [] },
        { sectionCode: "II", sectionName: "Công việc thực hiện không thông qua hợp đồng", items: [] },
        { sectionCode: "III", sectionName: "Chi phí bồi thường, hỗ trợ, tái định cư", items: [] },
        { sectionCode: "IV", sectionName: "Chi phí quản lý dự án", items: [] }
      ];
    }

    if (editingItem) {
      // Remove from old section
      updatedSections = updatedSections.map(s => {
        if (s.sectionCode === editingItem.originalSectionCode) {
          return { ...s, items: s.items.filter(i => (i.id ? i.id !== editingItem.id : i.jobCode !== editingItem.jobCode)) };
        }
        return s;
      });
      // Add to new section
      updatedSections = updatedSections.map(s => {
        if (s.sectionCode === sectionCode) {
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      });
    } else {
      // Add new
      updatedSections = updatedSections.map(s => {
        if (s.sectionCode === sectionCode) {
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      });
    }

    setSections(updatedSections);
    storageService.saveWorkItems(contract.id, updatedSections);
    if (onSaved) onSaved(updatedSections);
    resetForm();
  };

  const handleDeleteItem = (secCode, item) => {
    if (window.confirm(`Xóa đầu việc: "${item.name}"?`)) {
      const updated = sections.map(s => {
        if (s.sectionCode === secCode) {
          return {
            ...s,
            items: s.items.filter(i => (i.id ? i.id !== item.id : i.jobCode !== item.jobCode))
          };
        }
        return s;
      });
      setSections(updated);
      storageService.saveWorkItems(contract.id, updated);
      if (onSaved) onSaved(updated);
    }
  };

  const handleLoadSample = () => {
    if (window.confirm('Nạp danh mục đầu việc mẫu chuẩn (Nghị định 254/2025/NĐ-CP) vào hợp đồng này?')) {
      setSections(SAMPLE_FORM_03A_SECTIONS);
      storageService.saveWorkItems(contract.id, SAMPLE_FORM_03A_SECTIONS);
      if (onSaved) onSaved(SAMPLE_FORM_03A_SECTIONS);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Danh Mục Đầu Việc / Hạng Mục Công Việc Hợp Đồng
                </h2>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                  {allItems.length} đầu việc
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                HĐ: <span className="font-semibold text-slate-700">{contract.code}</span> • {contract.packageName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartAdd('I')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Thêm Đầu Việc
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-500">Giá trị hợp đồng đã ký:</span>
              <strong className="text-slate-900 text-sm ml-1.5">{formatVND(contract.adjustedValue || contract.originalValue)}</strong>
            </div>
            <div>
              <span className="text-slate-500">Tổng giá trị các đầu việc:</span>
              <strong className="text-blue-700 text-sm ml-1.5">{formatVND(totalCalculatedValue)}</strong>
            </div>
          </div>

          {allItems.length === 0 && (
            <button
              onClick={handleLoadSample}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs flex items-center gap-1 shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              Nạp dữ liệu đầu việc mẫu (NĐ 254)
            </button>
          )}
        </div>

        {/* Form Add / Edit */}
        {showAddForm && (
          <form onSubmit={handleSaveItem} className="p-5 bg-blue-50/60 border-b border-blue-200 text-xs shrink-0 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-200/80">
              <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                {editingItem ? '✏️ Chỉnh Sửa Đầu Việc' : '➕ Thêm Đầu Việc Mới Vào Hợp Đồng'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-500 hover:text-slate-700 text-xs underline"
              >
                Đóng form
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phân nhóm *</label>
                <select
                  value={sectionCode}
                  onChange={(e) => setSectionCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                >
                  {SECTION_OPTIONS.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">STT</label>
                <input
                  type="text"
                  value={stt}
                  onChange={(e) => setStt(e.target.value)}
                  placeholder="1"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã hiệu công việc</label>
                <input
                  type="text"
                  value={jobCode}
                  onChange={(e) => setJobCode(e.target.value)}
                  placeholder="VD: AF.11111"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đơn vị tính (ĐVT) *</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="m3, m2, tấn..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Tên đầu việc / Nội dung công việc *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Đào đất cấp 3 nền đường bằng máy đào 1.25m3..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khối lượng hợp đồng *</label>
                <input
                  type="number"
                  step="any"
                  value={contractQty}
                  onChange={(e) => setContractQty(e.target.value)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-right"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đơn giá hợp đồng (VNĐ) *</label>
                <input
                  type="number"
                  step="any"
                  value={unitPriceContract}
                  onChange={(e) => setUnitPriceContract(e.target.value)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-right"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú (tiêu chuẩn, vật tư, mỏ...)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Nghiệm thu đạt K98, mỏ đá Tân Thành..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-end justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  {editingItem ? 'Lưu Sửa Đổi' : 'Thêm Vào Danh Mục'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Work items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sections.map(section => (
            <div key={section.sectionCode} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2.5 bg-slate-100 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-800 text-sm">
                    {section.sectionCode}.
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs uppercase">
                    {section.sectionName}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    ({section.items.length} công việc)
                  </span>
                </div>

                <button
                  onClick={() => handleStartAdd(section.sectionCode)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 font-semibold rounded text-[11px] flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Thêm vào nhóm này
                </button>
              </div>

              {section.items.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 italic bg-white">
                  Chưa có đầu việc nào trong nhóm này. Bấm "Thêm vào nhóm này" để tạo.
                </div>
              ) : (
                <div className="overflow-x-auto bg-white">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-[11px]">
                      <tr>
                        <th className="px-3 py-2 text-center w-12">STT</th>
                        <th className="px-3 py-2 w-28">Mã hiệu</th>
                        <th className="px-3 py-2">Tên đầu việc</th>
                        <th className="px-3 py-2 text-center w-16">ĐVT</th>
                        <th className="px-3 py-2 text-right w-24">Khối lượng HĐ</th>
                        <th className="px-3 py-2 text-right w-28">Đơn giá (VNĐ)</th>
                        <th className="px-3 py-2 text-right w-32">Thành tiền (VNĐ)</th>
                        <th className="px-3 py-2">Ghi chú</th>
                        <th className="px-3 py-2 text-center w-20">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {section.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition">
                          <td className="px-3 py-2 text-center font-bold text-slate-700">{item.stt}</td>
                          <td className="px-3 py-2 font-mono text-[11px] text-blue-800">{item.jobCode}</td>
                          <td className="px-3 py-2 font-medium text-slate-800">{item.name}</td>
                          <td className="px-3 py-2 text-center text-slate-600">{item.unit}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">{formatNumber(item.contractQty)}</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-700">{formatNumber(item.unitPriceContract)}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-blue-700">
                            {formatNumber(Number(item.contractVal) || (Number(item.contractQty) * Number(item.unitPriceContract)))}
                          </td>
                          <td className="px-3 py-2 text-slate-500 text-[11px]">{item.note}</td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleStartEdit(section.sectionCode, item)}
                                title="Sửa đầu việc này"
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(section.sectionCode, item)}
                                title="Xóa đầu việc này"
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs shrink-0">
          <span className="text-slate-500">
            Dữ liệu đầu việc được lưu tự động và liên kết trực tiếp vào Bảng nghiệm thu Mẫu 03.a/TT và Mẫu 03.c/QT.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition"
          >
            Hoàn tất & Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
