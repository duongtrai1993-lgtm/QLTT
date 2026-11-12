import React, { useState, useEffect } from 'react';
import { X, Calculator, Calendar, DollarSign, FileCheck, Plus, Check, Trash2, RotateCcw, Sparkles } from 'lucide-react';
import { formatVND, formatNumber, storageService } from '../services/storageService';

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

  // State quản lý danh sách đầu việc nghiệm thu
  const [workSections, setWorkSections] = useState([]);
  const [acceptedQtys, setAcceptedQtys] = useState({}); // { [jobCode]: number }

  // State thêm nhanh đầu việc
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickCode, setQuickCode] = useState('');
  const [quickUnit, setQuickUnit] = useState('m3');
  const [quickQty, setQuickQty] = useState('');
  const [quickPrice, setQuickPrice] = useState('');

  const selectedContract = contracts.find(c => c.id === contractId);
  const selectedProject = projects.find(p => p.id === selectedContract?.projectId);

  // Load danh mục đầu việc khi đổi hợp đồng
  useEffect(() => {
    if (!contractId) return;
    const sections = storageService.getWorkItems(contractId);
    setWorkSections(sections);

    // Nếu đang sửa hồ sơ thanh toán: nạp khối lượng đã lưu
    if (editingPayment?.id) {
      const savedItems = storageService.getPaymentWorkItems(editingPayment.id);
      if (savedItems && Array.isArray(savedItems)) {
        const qtyMap = {};
        savedItems.forEach(it => {
          qtyMap[it.jobCode || it.stt] = Number(it.thisPeriodAcceptedQty) || 0;
        });
        setAcceptedQtys(qtyMap);
      }
    } else {
      // Đợt mới: khởi tạo khối lượng về 0
      setAcceptedQtys({});
    }
  }, [contractId, editingPayment]);

  // Cập nhật khối lượng nghiệm thu của một đầu việc
  const handleQtyChange = (key, val) => {
    const num = Math.max(0, Number(val) || 0);
    const updated = { ...acceptedQtys, [key]: num };
    setAcceptedQtys(updated);

    // Tính lại tổng giá trị nghiệm thu
    recalculateFromItems(updated);
  };

  const recalculateFromItems = (qtyMap) => {
    let sum = 0;
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt;
        const q = Number(qtyMap[key]) || 0;
        const price = Number(it.unitPriceContract) || 0;
        sum += q * price;
      });
    });

    setWorkCompletedValue(sum);
    const advRec = Math.round(sum * 0.2); // 20%
    const retVal = Math.round(sum * ((selectedContract?.retentionRate || 5) / 100)); // 5%
    setAdvanceDeduction(advRec);
    setRetentionDeduction(retVal);
  };

  // Nút tiện ích: Nghiệm thu 100% số lượng còn lại
  const handleAcceptAllRemaining = () => {
    const updated = {};
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt;
        const cQty = Number(it.contractQty) || 0;
        const prevQty = Number(it.prevPaidQty) || 0;
        const rem = Math.max(0, cQty - prevQty);
        updated[key] = rem;
      });
    });
    setAcceptedQtys(updated);
    recalculateFromItems(updated);
  };

  // Nút tiện ích: Đặt lại về 0
  const handleResetQtys = () => {
    const updated = {};
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt;
        updated[key] = 0;
      });
    });
    setAcceptedQtys(updated);
    recalculateFromItems(updated);
  };

  // Thêm nhanh đầu việc mới vào HĐ
  const handleQuickAddWorkItem = (e) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const q = Number(quickQty) || 0;
    const p = Number(quickPrice) || 0;
    const nextStt = (workSections[0]?.items?.length || 0) + 1;

    const newItem = {
      id: `item-${Date.now()}`,
      stt: String(nextStt),
      jobCode: quickCode.trim() || `CV.${nextStt}`,
      name: quickName.trim(),
      unit: quickUnit.trim() || 'cái',
      contractQty: q,
      prevUnpaidQty: 0,
      prevPaidQty: 0,
      thisPeriodAcceptedQty: 0,
      totalCumulativeQty: 0,
      thisPeriodRequestedQty: 0,
      unitPriceContract: p,
      unitPriceAdditional: 0,
      contractVal: q * p,
      prevUnpaidVal: 0,
      thisPeriodAcceptedVal: 0,
      thisPeriodRequestedVal: 0,
      thisPeriodUnpaidVal: 0,
      prevPaidVal: 0,
      totalPaidToDateVal: 0,
      note: ''
    };

    const updated = workSections.map((sec, idx) => {
      if (idx === 0) {
        return { ...sec, items: [...sec.items, newItem] };
      }
      return sec;
    });

    setWorkSections(updated);
    storageService.saveWorkItems(contractId, updated);

    // Reset quick form
    setQuickName('');
    setQuickCode('');
    setQuickQty('');
    setQuickPrice('');
    setShowQuickAdd(false);
  };

  // Tự động tính các giá trị khấu trừ khi thay đổi loại thanh toán
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
      const workVal = Number(workCompletedValue) || 0;
      const advRec = Math.round(workVal * 0.2); // 20%
      const retVal = Math.round(workVal * ((selectedContract?.retentionRate || 5) / 100)); // 5%
      setAdvanceDeduction(advRec);
      setRetentionDeduction(retVal);
      if (!editingPayment) {
        setTitle(`Thanh toán Đợt ${stageNumber}: Khối lượng hoàn thành kỳ ${stageNumber - 1}`);
      }
    }
  }, [paymentType, contractId, stageNumber]);

  // Net payable calculation
  const calculatedRequestedAmount = paymentType === 'advance'
    ? Number(workCompletedValue) || (selectedContract ? Math.round((Number(selectedContract.adjustedValue || selectedContract.originalValue) * selectedContract.advanceRate) / 100) : 0)
    : Math.max(0, Number(workCompletedValue) - Number(advanceDeduction) - Number(retentionDeduction) - Number(penaltyDeduction));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contractId || !title) return;

    const paymentId = editingPayment?.id || `pay-${Date.now()}`;

    const payload = {
      id: paymentId,
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

    // Chuẩn bị chi tiết khối lượng nghiệm thu từng đầu việc để lưu
    if (paymentType === 'progress') {
      const itemsDetail = [];
      workSections.forEach(sec => {
        sec.items.forEach(it => {
          const key = it.jobCode || it.stt;
          const acceptedQty = Number(acceptedQtys[key]) || 0;
          itemsDetail.push({
            id: it.id,
            stt: it.stt,
            jobCode: it.jobCode,
            name: it.name,
            unit: it.unit,
            contractQty: it.contractQty,
            unitPriceContract: it.unitPriceContract,
            prevPaidQty: it.prevPaidQty || 0,
            thisPeriodAcceptedQty: acceptedQty,
            note: it.note
          });
        });
      });
      storageService.savePaymentWorkItems(paymentId, itemsDetail);
    }

    onSave(payload);
    onClose();
  };

  const allItems = workSections.flatMap(s => s.items);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <FileCheck className="w-4 h-4" />
              </span>
              {editingPayment ? 'Chỉnh Sửa Hồ Sơ Thanh Toán' : 'Lập Đợt Đề Nghị Thanh Toán Mới'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chuẩn Nghị định 254/2025/NĐ-CP • Nhập trực tiếp khối lượng nghiệm thu từng đầu việc
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Hàng chọn HĐ và Loại thanh toán */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {c.code} - {c.packageName.slice(0, 40)}...
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
                <option value="advance">Tạm ứng hợp đồng (Mẫu số 04.a/TT)</option>
                <option value="final">Quyết toán hoàn thành A - B (Mẫu số 03.c/QT)</option>
              </select>
            </div>
          </div>

          {/* Đợt số & Tiêu đề */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="md:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">Tiêu Đề / Nội Dung Hồ Sơ *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Thanh toán đợt 2: Xong phần thô..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Kỳ thanh toán */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
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

          {/* BẢNG NHẬP KHỐI LƯỢNG NGHIỆM THU TỪNG ĐẦU VIỆC (Cho Khối lượng Mẫu 03.a) */}
          {paymentType === 'progress' && (
            <div className="border border-blue-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="px-4 py-3 bg-blue-50 flex flex-wrap items-center justify-between gap-2 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-blue-600 text-white rounded text-xs font-bold">📋</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase">
                      Bảng Nhập Khối Lượng Nghiệm Thu Kỳ Này ({allItems.length} đầu việc)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Nhập số lượng nghiệm thu vào ô màu trắng bên dưới. Thành tiền và tổng đề nghị sẽ tự động tính.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAllRemaining}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] flex items-center gap-1 transition shadow-xs"
                    title="Điền 100% số lượng còn lại cho các công việc"
                  >
                    <Check className="w-3.5 h-3.5" /> Nghiệm thu hết số dư
                  </button>
                  <button
                    type="button"
                    onClick={handleResetQtys}
                    className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded text-[11px] flex items-center gap-1 transition"
                    title="Đặt lại tất cả khối lượng kỳ này về 0"
                  >
                    <RotateCcw className="w-3 h-3" /> Đặt về 0
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px] flex items-center gap-1 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm đầu việc
                  </button>
                </div>
              </div>

              {/* Form thêm nhanh đầu việc */}
              {showQuickAdd && (
                <div className="p-3 bg-amber-50/70 border-b border-amber-200 animate-in fade-in duration-100">
                  <p className="font-bold text-amber-900 text-xs mb-2">Thêm nhanh đầu việc mới vào Hợp đồng:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      placeholder="Mã hiệu (VD: AF.999)"
                      value={quickCode}
                      onChange={(e) => setQuickCode(e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Tên công việc *"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      className="sm:col-span-2 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium"
                      required
                    />
                    <input
                      type="text"
                      placeholder="ĐVT (m3, tấn...)"
                      value={quickUnit}
                      onChange={(e) => setQuickUnit(e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        placeholder="Khối lượng HĐ"
                        value={quickQty}
                        onChange={(e) => setQuickQty(e.target.value)}
                        className="w-1/2 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Đơn giá"
                        value={quickPrice}
                        onChange={(e) => setQuickPrice(e.target.value)}
                        className="w-1/2 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleQuickAddWorkItem}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs shrink-0"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table of items */}
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 sticky top-0 z-10 text-[10.5px]">
                    <tr>
                      <th className="px-2.5 py-2 text-center w-10">STT</th>
                      <th className="px-2.5 py-2 w-24">Mã hiệu</th>
                      <th className="px-2.5 py-2">Tên đầu việc</th>
                      <th className="px-2 py-2 text-center w-14">ĐVT</th>
                      <th className="px-2.5 py-2 text-right w-24">Khối lượng HĐ</th>
                      <th className="px-2.5 py-2 text-right w-24">Đã TT kỳ trước</th>
                      <th className="px-2.5 py-2 text-right w-28">Đơn giá (VNĐ)</th>
                      <th className="px-2.5 py-2 text-center w-36 bg-blue-100 text-blue-900 font-bold">
                        KL Nghiệm Thu Kỳ Này *
                      </th>
                      <th className="px-2.5 py-2 text-right w-32 bg-blue-50 text-blue-900 font-bold">
                        Thành Tiền (VNĐ)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allItems.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-6 text-slate-400 italic">
                          Chưa có đầu việc nào. Bấm nút "+ Thêm đầu việc" ở trên để tạo.
                        </td>
                      </tr>
                    ) : (
                      workSections.map(sec => (
                        <React.Fragment key={sec.sectionCode}>
                          <tr className="bg-slate-100/60 font-bold text-slate-800 text-[11px]">
                            <td className="px-2.5 py-1 text-center">{sec.sectionCode}</td>
                            <td colSpan="8" className="px-2.5 py-1 uppercase">{sec.sectionName}</td>
                          </tr>
                          {sec.items.map((it, idx) => {
                            const key = it.jobCode || it.stt;
                            const curQty = acceptedQtys[key] !== undefined ? acceptedQtys[key] : (it.thisPeriodAcceptedQty || 0);
                            const unitPrice = Number(it.unitPriceContract) || 0;
                            const lineTotal = curQty * unitPrice;

                            return (
                              <tr key={idx} className="hover:bg-blue-50/20 transition">
                                <td className="px-2.5 py-1.5 text-center font-bold text-slate-600">{it.stt}</td>
                                <td className="px-2.5 py-1.5 font-mono text-[11px] text-blue-800">{it.jobCode}</td>
                                <td className="px-2.5 py-1.5 font-medium text-slate-800">{it.name}</td>
                                <td className="px-2 py-1.5 text-center text-slate-600">{it.unit}</td>
                                <td className="px-2.5 py-1.5 text-right font-mono text-slate-700">{formatNumber(it.contractQty)}</td>
                                <td className="px-2.5 py-1.5 text-right font-mono text-slate-500">{formatNumber(it.prevPaidQty || 0)}</td>
                                <td className="px-2.5 py-1.5 text-right font-mono text-slate-700">{formatNumber(unitPrice)}</td>
                                
                                {/* Ô nhập khối lượng nghiệm thu */}
                                <td className="px-2 py-1 text-center bg-blue-50/50">
                                  <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    value={curQty === 0 && !acceptedQtys[key] ? '' : curQty}
                                    onChange={(e) => handleQtyChange(key, e.target.value)}
                                    placeholder="0"
                                    className="w-full px-2 py-1 text-right font-mono font-bold text-blue-900 border border-blue-400 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                                  />
                                </td>

                                {/* Thành tiền tính tự động */}
                                <td className="px-2.5 py-1.5 text-right font-mono font-bold text-blue-800 bg-blue-50/30">
                                  {formatNumber(lineTotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bảng tính tài chính tự động theo Nghị định 254/2025/NĐ-CP */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-3">
            <h4 className="font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-700" />
              Tổng Hợp Giá Trị Thanh Toán Theo NĐ 254/2025/NĐ-CP (VNĐ)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {paymentType === 'advance' ? 'Số tiền tạm ứng đề nghị (VNĐ) *' : '1. Giá trị KL nghiệm thu kỳ này *'}
                </label>
                <input
                  type="number"
                  value={workCompletedValue}
                  onChange={(e) => setWorkCompletedValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{formatVND(workCompletedValue)}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. Khấu trừ thu hồi tạm ứng (20%)
                </label>
                <input
                  type="number"
                  value={advanceDeduction}
                  onChange={(e) => setAdvanceDeduction(e.target.value)}
                  disabled={paymentType === 'advance'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-rose-600 disabled:bg-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{formatVND(advanceDeduction)}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  3. Giữ lại bảo hành ({selectedContract?.retentionRate || 5}%)
                </label>
                <input
                  type="number"
                  value={retentionDeduction}
                  onChange={(e) => setRetentionDeduction(e.target.value)}
                  disabled={paymentType === 'advance'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-amber-700 disabled:bg-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{formatVND(retentionDeduction)}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  4. Khấu trừ vi phạm / khác
                </label>
                <input
                  type="number"
                  value={penaltyDeduction}
                  onChange={(e) => setPenaltyDeduction(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-700"
                />
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{formatVND(penaltyDeduction)}</span>
              </div>
            </div>

            {/* Net Amount Box */}
            <div className="bg-white p-3.5 rounded-lg border border-blue-300 flex items-center justify-between shadow-xs">
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
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5 shrink-0">
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
              {editingPayment ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ & Lưu Khối Lượng'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
