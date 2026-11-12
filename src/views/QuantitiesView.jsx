import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Check, RotateCcw, Calculator, Printer, FileSpreadsheet, 
  ArrowRight, Sparkles, Filter, ChevronRight, CheckCircle2, AlertCircle, Save
} from 'lucide-react';
import { storageService, formatVND, formatNumber, formatDate, numberToVietnameseWords } from '../services/storageService';
import { exportService } from '../services/exportService';

export function QuantitiesView({
  projects = [],
  contracts = [],
  payments = [],
  selectedPaymentId = null,
  onSelectPaymentId,
  onSavePaymentData,
  onOpenForm03a,
  onOpenNewPayment,
  onManageWorkItems
}) {
  // Chọn hợp đồng và đợt thanh toán
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id || '');
  const [activePaymentId, setActivePaymentId] = useState(selectedPaymentId || '');

  // Danh mục đầu việc và khối lượng nghiệm thu
  const [workSections, setWorkSections] = useState([]);
  const [acceptedQtys, setAcceptedQtys] = useState({}); // { [key]: number }
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Thêm nhanh đầu việc
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickSectionCode, setQuickSectionCode] = useState('I');
  const [quickCode, setQuickCode] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickUnit, setQuickUnit] = useState('m3');
  const [quickQty, setQuickQty] = useState('');
  const [quickPrice, setQuickPrice] = useState('');

  // Lọc các đợt thanh toán của hợp đồng được chọn
  const contractPayments = payments.filter(p => p.contractId === selectedContractId);
  const activeContract = contracts.find(c => c.id === selectedContractId);
  const activeProject = projects.find(p => p.id === activeContract?.projectId);

  // Khi selectedPaymentId từ ngoài truyền vào thay đổi
  useEffect(() => {
    if (selectedPaymentId) {
      const p = payments.find(pay => pay.id === selectedPaymentId);
      if (p) {
        setSelectedContractId(p.contractId);
        setActivePaymentId(p.id);
      }
    }
  }, [selectedPaymentId, payments]);

  // Khi đổi hợp đồng: tự động chọn đợt thanh toán đầu tiên (ưu tiên đợt khối lượng 'progress')
  useEffect(() => {
    const pays = payments.filter(p => p.contractId === selectedContractId);
    if (pays.length > 0) {
      const prog = pays.find(p => p.paymentType === 'progress') || pays[0];
      setActivePaymentId(prog.id);
    } else {
      setActivePaymentId('');
    }
  }, [selectedContractId]);

  const activePayment = payments.find(p => p.id === activePaymentId);

  // Load danh mục đầu việc của hợp đồng
  useEffect(() => {
    if (!selectedContractId) return;
    const loaded = storageService.getWorkItems(selectedContractId);
    setWorkSections(loaded);

    // Load khối lượng đã lưu của đợt thanh toán hiện tại
    if (activePaymentId) {
      const savedItems = storageService.getPaymentWorkItems(activePaymentId);
      if (savedItems && Array.isArray(savedItems)) {
        const qtyMap = {};
        savedItems.forEach(it => {
          const key = it.jobCode || it.stt || it.id;
          qtyMap[key] = Number(it.thisPeriodAcceptedQty) || 0;
        });
        setAcceptedQtys(qtyMap);
      } else {
        // Nếu đợt thanh toán chưa lưu chi tiết, lấy giá trị mặc định từ items
        const qtyMap = {};
        loaded.forEach(sec => {
          sec.items.forEach(it => {
            const key = it.jobCode || it.stt || it.id;
            qtyMap[key] = Number(it.thisPeriodAcceptedQty) || 0;
          });
        });
        setAcceptedQtys(qtyMap);
      }
    }
  }, [selectedContractId, activePaymentId]);

  // Cập nhật khối lượng khi người dùng gõ vào ô
  const handleQtyChange = (key, val) => {
    const num = Math.max(0, Number(val) || 0);
    const updated = { ...acceptedQtys, [key]: num };
    setAcceptedQtys(updated);
  };

  // Tính tổng giá trị nghiệm thu từ các đầu việc hiện tại
  const calculateTotalAcceptedValue = () => {
    let sum = 0;
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt || it.id;
        const q = Number(acceptedQtys[key]) || 0;
        const price = Number(it.unitPriceContract) || 0;
        sum += q * price;
      });
    });
    return sum;
  };

  const totalAcceptedValue = calculateTotalAcceptedValue();
  const advanceDeduction = Math.round(totalAcceptedValue * 0.2); // 20%
  const retentionDeduction = Math.round(totalAcceptedValue * ((activeContract?.retentionRate || 5) / 100)); // 5%
  const requestedPaymentAmount = Math.max(0, totalAcceptedValue - advanceDeduction - retentionDeduction);
  const wordsAmount = numberToVietnameseWords(requestedPaymentAmount);

  // Nút tiện ích: Nghiệm thu 100% số dư còn lại
  const handleAcceptAllRemaining = () => {
    const updated = {};
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt || it.id;
        const cQty = Number(it.contractQty) || 0;
        const prevQty = Number(it.prevPaidQty) || 0;
        updated[key] = Math.max(0, cQty - prevQty);
      });
    });
    setAcceptedQtys(updated);
  };

  // Nút tiện ích: Nghiệm thu 50% số dư còn lại
  const handleAcceptHalfRemaining = () => {
    const updated = {};
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt || it.id;
        const cQty = Number(it.contractQty) || 0;
        const prevQty = Number(it.prevPaidQty) || 0;
        const rem = Math.max(0, cQty - prevQty);
        updated[key] = Math.round(rem * 0.5 * 100) / 100;
      });
    });
    setAcceptedQtys(updated);
  };

  // Nút tiện ích: Đặt tất cả về 0
  const handleResetQtys = () => {
    const updated = {};
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt || it.id;
        updated[key] = 0;
      });
    });
    setAcceptedQtys(updated);
  };

  // Lưu khối lượng nghiệm thu và cập nhật đợt thanh toán
  const handleSaveData = () => {
    if (!activePaymentId || !activePayment) return;

    // 1. Chuẩn bị mảng chi tiết khối lượng từng đầu việc
    const itemsDetail = [];
    workSections.forEach(sec => {
      sec.items.forEach(it => {
        const key = it.jobCode || it.stt || it.id;
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
    storageService.savePaymentWorkItems(activePaymentId, itemsDetail);

    // 2. Cập nhật số tiền vào hồ sơ thanh toán
    const updatedPayment = {
      ...activePayment,
      workCompletedValue: totalAcceptedValue,
      advanceDeduction: advanceDeduction,
      retentionDeduction: retentionDeduction,
      requestedAmount: requestedPaymentAmount
    };

    if (onSavePaymentData) {
      onSavePaymentData(updatedPayment);
    }

    // Hiển thị thông báo lưu thành công
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  // Mở trực tiếp biểu mẫu Mẫu 03.a/TT với dữ liệu mới nhất
  const handleOpenForm03aModal = () => {
    // Tự động lưu trước khi mở biểu mẫu
    handleSaveData();

    const currentPay = activePayment ? {
      ...activePayment,
      workCompletedValue: totalAcceptedValue,
      advanceDeduction: advanceDeduction,
      retentionDeduction: retentionDeduction,
      requestedAmount: requestedPaymentAmount
    } : null;

    if (onOpenForm03a && currentPay) {
      onOpenForm03a(currentPay);
    }
  };

  // Xuất file Excel Mẫu 03.a/TT
  const handleExportExcel = () => {
    handleSaveData();
    const currentPay = activePayment ? {
      ...activePayment,
      workCompletedValue: totalAcceptedValue,
      advanceDeduction: advanceDeduction,
      retentionDeduction: retentionDeduction,
      requestedAmount: requestedPaymentAmount
    } : null;

    const sectionsForExport = storageService.getSectionsForPayment(selectedContractId, currentPay);
    exportService.exportForm03aExcel(activeProject, activeContract, currentPay, sectionsForExport);
  };

  // Thêm nhanh đầu việc mới
  const handleQuickAddWorkItem = (e) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const q = Number(quickQty) || 0;
    const p = Number(quickPrice) || 0;
    const targetSec = workSections.find(s => s.sectionCode === quickSectionCode) || workSections[0];
    const nextStt = (targetSec?.items?.length || 0) + 1;

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

    const updated = workSections.map(sec => {
      if (sec.sectionCode === quickSectionCode) {
        return { ...sec, items: [...sec.items, newItem] };
      }
      return sec;
    });

    setWorkSections(updated);
    storageService.saveWorkItems(selectedContractId, updated);

    setQuickName('');
    setQuickCode('');
    setQuickQty('');
    setQuickPrice('');
    setShowQuickAdd(false);
  };

  const allItems = workSections.flatMap(s => s.items);

  return (
    <div className="space-y-5">
      
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Trang Nhập Khối Lượng Nghiệm Thu
                </h2>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                  Liên kết Mẫu 03.a/TT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhập khối lượng nghiệm thu từng đầu việc ➔ Tự động tính thành tiền ➔ Mở ngay Bảng thanh toán Mẫu 03.a/TT
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSaveData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Save className="w-4 h-4 text-slate-300" />
            <span>Lưu Khối Lượng</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Xuất trực tiếp Bảng Mẫu 03.a/TT sang file Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          {/* NÚT LINK TRỰC TIẾP SANG MẪU 03.a/TT */}
          <button
            onClick={handleOpenForm03aModal}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition"
            title="Mở Bảng Xác Định Giá Trị Khối Lượng Hoàn Thành chuẩn Nghị định 254/2025/NĐ-CP"
          >
            <Printer className="w-4 h-4" />
            <span>Xem & In Bảng Mẫu 03.a/TT ➔</span>
          </button>
        </div>
      </div>

      {/* Thông báo lưu thành công */}
      {isSavedAlert && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công số liệu khối lượng nghiệm thu và cập nhật giá trị hồ sơ thanh toán!</span>
        </div>
      )}

      {/* 2. Bộ Lọc Hợp Đồng & Chọn Đợt Thanh Toán */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Chọn Hợp đồng */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Gói thầu:</span>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-blue-500"
            >
              {contracts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.packageName.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Đợt Thanh Toán */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Đợt thanh toán:</span>
            <select
              value={activePaymentId}
              onChange={(e) => setActivePaymentId(e.target.value)}
              className="px-3 py-1.5 bg-blue-50 border border-blue-300 rounded-lg text-blue-900 font-extrabold focus:ring-2 focus:ring-blue-500"
            >
              {contractPayments.length === 0 ? (
                <option value="">(Chưa có đợt thanh toán)</option>
              ) : (
                contractPayments.map(p => (
                  <option key={p.id} value={p.id}>
                    Đợt {p.stageNumber}: {p.title.slice(0, 45)} ({p.paymentType === 'advance' ? 'Tạm ứng' : (p.paymentType === 'final' ? 'Quyết toán' : 'KLHT')})
                  </option>
                ))
              )}
            </select>
          </div>

          {activePayment && (
            <div className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Kỳ TT: <strong>{formatDate(activePayment.periodFrom)} → {formatDate(activePayment.periodTo)}</strong>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onManageWorkItems(activeContract)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 transition"
          >
            <Filter className="w-3.5 h-3.5" /> Quản lý danh mục đầu việc HĐ
          </button>

          <button
            onClick={onOpenNewPayment}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center gap-1 transition border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" /> Lập đợt thanh toán mới
          </button>
        </div>
      </div>

      {/* 3. BẢNG TÍNH KHỐI LƯỢNG NGHIỆM THU CHI TIẾT (SPREADSHEET VIEW) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
        
        {/* Table Sub-header toolbar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">
              Chi Tiết Nghiệm Thu Khối Lượng ({allItems.length} đầu việc)
            </span>
            <span className="text-[11px] text-slate-500">
              • Nhập khối lượng vào ô màu trắng để tự động nhân đơn giá
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAcceptAllRemaining}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] flex items-center gap-1 transition shadow-xs"
              title="Điền 100% số lượng còn lại cho các công việc"
            >
              <Check className="w-3.5 h-3.5" /> Nghiệm thu 100% số dư
            </button>
            <button
              onClick={handleAcceptHalfRemaining}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded text-[11px] flex items-center gap-1 transition"
              title="Điền 50% số lượng còn lại"
            >
              Nghiệm thu 50%
            </button>
            <button
              onClick={handleResetQtys}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-[11px] flex items-center gap-1 transition"
              title="Đặt lại toàn bộ khối lượng kỳ này về 0"
            >
              <RotateCcw className="w-3 h-3" /> Đặt về 0
            </button>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[11px] flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm đầu việc
            </button>
          </div>
        </div>

        {/* Form thêm nhanh đầu việc */}
        {showQuickAdd && (
          <div className="p-4 bg-amber-50/80 border-b border-amber-200 animate-in fade-in duration-100 text-xs">
            <p className="font-bold text-amber-900 mb-2">Thêm nhanh đầu việc mới vào danh mục hợp đồng:</p>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
              <div>
                <select
                  value={quickSectionCode}
                  onChange={(e) => setQuickSectionCode(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700"
                >
                  <option value="I">I. Thông qua HĐ</option>
                  <option value="II">II. Không qua HĐ</option>
                  <option value="III">III. Bồi thường GPMB</option>
                  <option value="IV">IV. Quản lý dự án</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Mã hiệu (VD: AF.11111)"
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Tên nội dung công việc *"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="ĐVT (m3, tấn...)"
                  value={quickUnit}
                  onChange={(e) => setQuickUnit(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-center"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="KL HĐ"
                  value={quickQty}
                  onChange={(e) => setQuickQty(e.target.value)}
                  className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded font-bold text-right"
                />
                <input
                  type="number"
                  placeholder="Đơn giá"
                  value={quickPrice}
                  onChange={(e) => setQuickPrice(e.target.value)}
                  className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded font-bold text-right"
                />
                <button
                  type="button"
                  onClick={handleQuickAddWorkItem}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shrink-0"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spreadsheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10.5px]">
              <tr>
                <th className="px-3 py-3 text-center w-12 border-r border-slate-200">STT</th>
                <th className="px-3 py-3 w-28 border-r border-slate-200">Mã hiệu</th>
                <th className="px-3 py-3 border-r border-slate-200">Tên nội dung công việc</th>
                <th className="px-3 py-3 text-center w-16 border-r border-slate-200">ĐVT</th>
                <th className="px-3 py-3 text-right w-28 border-r border-slate-200">KL theo HĐ</th>
                <th className="px-3 py-3 text-right w-28 border-r border-slate-200">Đã TT kỳ trước</th>
                <th className="px-3 py-3 text-right w-28 border-r border-slate-200">Đơn giá HĐ (đồng)</th>
                <th className="px-3 py-3 text-center w-40 bg-blue-100 text-blue-900 border-r border-blue-200 font-extrabold">
                  KL Nghiệm Thu Kỳ Này *
                </th>
                <th className="px-3 py-3 text-right w-28 border-r border-slate-200">KL Lũy Kế</th>
                <th className="px-3 py-3 text-right w-36 bg-blue-50 text-blue-900 border-r border-slate-200 font-extrabold">
                  Thành Tiền Kỳ Này (đồng)
                </th>
                <th className="px-3 py-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {allItems.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-12 text-slate-400 italic">
                    Chưa có đầu việc nào trong hợp đồng này. Bấm nút "+ Thêm đầu việc" ở trên để nhập.
                  </td>
                </tr>
              ) : (
                workSections.map(sec => {
                  const secItems = sec.items;
                  const secTotalVal = secItems.reduce((sum, it) => {
                    const key = it.jobCode || it.stt || it.id;
                    const q = Number(acceptedQtys[key]) || 0;
                    return sum + q * (Number(it.unitPriceContract) || 0);
                  }, 0);

                  return (
                    <React.Fragment key={sec.sectionCode}>
                      {/* Section Title Row */}
                      <tr className="bg-slate-100/70 font-bold text-slate-800 text-[11px]">
                        <td className="px-3 py-2 text-center border-r border-slate-200">{sec.sectionCode}</td>
                        <td colSpan="8" className="px-3 py-2 uppercase border-r border-slate-200">
                          {sec.sectionName}
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-blue-800 border-r border-slate-200">
                          {formatNumber(secTotalVal)}
                        </td>
                        <td className="px-3 py-2"></td>
                      </tr>

                      {/* Items */}
                      {secItems.map((it, idx) => {
                        const key = it.jobCode || it.stt || it.id;
                        const currentQty = acceptedQtys[key] !== undefined ? acceptedQtys[key] : (it.thisPeriodAcceptedQty || 0);
                        const unitPrice = Number(it.unitPriceContract) || 0;
                        const lineTotal = currentQty * unitPrice;
                        const prevPaidQty = Number(it.prevPaidQty) || 0;
                        const cumulativeQty = prevPaidQty + currentQty;

                        return (
                          <tr key={idx} className="hover:bg-blue-50/25 transition group">
                            <td className="px-3 py-2 text-center font-bold text-slate-600 border-r border-slate-100">{it.stt}</td>
                            <td className="px-3 py-2 font-mono text-[11px] font-bold text-blue-800 border-r border-slate-100">{it.jobCode}</td>
                            <td className="px-3 py-2 font-medium text-slate-900 border-r border-slate-100">{it.name}</td>
                            <td className="px-3 py-2 text-center text-slate-600 border-r border-slate-100">{it.unit}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-800 border-r border-slate-100">{formatNumber(it.contractQty)}</td>
                            <td className="px-3 py-2 text-right font-mono text-slate-500 border-r border-slate-100">{formatNumber(prevPaidQty)}</td>
                            <td className="px-3 py-2 text-right font-mono text-slate-700 border-r border-slate-100">{formatNumber(unitPrice)}</td>
                            
                            {/* Ô NHẬP KHỐI LƯỢNG NGHIỆM THU */}
                            <td className="px-2 py-1 text-center bg-blue-50/40 border-r border-blue-200">
                              <input
                                type="number"
                                step="any"
                                min="0"
                                value={currentQty === 0 && !acceptedQtys[key] ? '' : currentQty}
                                onChange={(e) => handleQtyChange(key, e.target.value)}
                                placeholder="0"
                                className="w-full px-2.5 py-1.5 text-right font-mono font-extrabold text-blue-950 text-[13px] border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-xs"
                              />
                            </td>

                            {/* Lũy kế */}
                            <td className="px-3 py-2 text-right font-mono font-semibold text-slate-700 border-r border-slate-100">
                              {formatNumber(cumulativeQty)}
                            </td>

                            {/* Thành tiền kỳ này */}
                            <td className="px-3 py-2 text-right font-mono font-black text-blue-900 bg-blue-50/30 border-r border-slate-100 text-[12px]">
                              {formatNumber(lineTotal)}
                            </td>

                            {/* Ghi chú */}
                            <td className="px-3 py-2 text-slate-500 text-[11px] truncate max-w-xs">{it.note}</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

            {/* Total Row */}
            <tfoot className="border-t-2 border-slate-300 bg-slate-100/90 font-extrabold text-slate-900">
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center uppercase tracking-wider text-xs font-black border-r border-slate-200">
                  TỔNG CỘNG KHỐI LƯỢNG NGHIỆM THU:
                </td>
                <td className="border-r border-slate-200"></td>
                <td className="border-r border-slate-200"></td>
                <td className="border-r border-slate-200"></td>
                <td className="border-r border-blue-200 bg-blue-100 text-center text-xs font-bold text-blue-900">
                  {allItems.length} mục
                </td>
                <td className="border-r border-slate-200"></td>
                <td className="px-3 py-3 text-right font-mono text-sm font-black text-blue-900 bg-blue-100/60 border-r border-slate-200">
                  {formatNumber(totalAcceptedValue)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

      {/* 4. THANH TỔNG HỢP GIÁ TRỊ THANH TOÁN & LINK TRỰC TIẾP SANG MẪU 03.a/TT */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              Tổng Hợp Giá Trị Thanh Toán Kỳ Này (Căn cứ theo Nghị định số 254/2025/NĐ-CP)
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Số liệu dưới đây được tự động đồng bộ sang <strong>Mẫu số 03.a/TT</strong> và <strong>Giấy đề nghị thanh toán Mẫu 04.a/TT</strong>
            </p>
          </div>

          {/* NÚT TO NỔI BẬT LINK TRỰC TIẾP SANG MẪU 03.a/TT */}
          <button
            onClick={handleOpenForm03aModal}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-sm rounded-xl flex items-center gap-2.5 shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
          >
            <Printer className="w-5 h-5 text-white" />
            <span>MỞ BẢNG XÁC ĐỊNH GIÁ TRỊ MẪU 03.a/TT ➔</span>
          </button>
        </div>

        {/* 4 Chỉ tiêu tài chính theo chuẩn Nghị định 254 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10.5px] text-slate-400 uppercase font-bold block">1. Khối Lượng Nghiệm Thu</span>
            <span className="text-lg font-black text-white mt-1 block">{formatVND(totalAcceptedValue)}</span>
            <span className="text-[10px] text-slate-400">Từ các đầu việc đã nhập</span>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10.5px] text-slate-400 uppercase font-bold block">2. Thu Hồi Tạm Ứng (20%)</span>
            <span className="text-lg font-black text-rose-400 mt-1 block">- {formatVND(advanceDeduction)}</span>
            <span className="text-[10px] text-slate-400">Khấu trừ theo hợp đồng</span>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10.5px] text-slate-400 uppercase font-bold block">3. Giữ Lại Bảo Hành (5%)</span>
            <span className="text-lg font-black text-amber-400 mt-1 block">- {formatVND(retentionDeduction)}</span>
            <span className="text-[10px] text-slate-400">Tỷ lệ {activeContract?.retentionRate || 5}%</span>
          </div>

          <div className="bg-blue-950/80 p-3.5 rounded-xl border border-blue-500/50">
            <span className="text-[10.5px] text-blue-300 uppercase font-bold block">4. Thực Thanh Toán Kỳ Này</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{formatVND(requestedPaymentAmount)}</span>
            <span className="text-[10px] text-emerald-300">Đề nghị Kho bạc giải ngân</span>
          </div>
        </div>

        {/* Số tiền bằng chữ */}
        <div className="pt-2 text-xs text-slate-300 italic border-t border-slate-800/80">
          Số tiền đề nghị thanh toán bằng chữ: <strong className="text-white not-italic font-bold">{wordsAmount}</strong>
        </div>
      </div>

    </div>
  );
}
