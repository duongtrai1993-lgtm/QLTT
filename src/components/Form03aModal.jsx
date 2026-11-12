import React, { useState } from 'react';
import { X, Printer, FileSpreadsheet, Sliders, Check, HelpCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { formatVND, formatNumber, formatDate, numberToVietnameseWords } from '../services/storageService';
import { exportService } from '../services/exportService';
import { SAMPLE_FORM_03A_SECTIONS } from '../data/sampleData';

export function Form03aModal({ isOpen, onClose, payment, contract, project }) {
  if (!isOpen || !payment) return null;

  // Print customization states
  const [paperSize, setPaperSize] = useState('a4'); // 'a4' | 'a3'
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' | 'portrait'
  const [marginSize, setMarginSize] = useState('5mm'); // '5mm' (hẹp), '10mm' (vừa), '15mm' (chuẩn)
  const [fontSize, setFontSize] = useState('8.5pt'); // '8pt' | '8.5pt' | '9.5pt' | '10.5pt'
  const [scalePercent, setScalePercent] = useState(100); // 70%, 80%, 90%, 100%
  const [showConfig, setShowConfig] = useState(true);

  const sections = SAMPLE_FORM_03A_SECTIONS;
  const allItems = sections.flatMap(s => s.items);

  const totalContractVal = allItems.reduce((s, i) => s + (Number(i.contractVal) || 0), 0);
  const totalPrevUnpaidVal = allItems.reduce((s, i) => s + (Number(i.prevUnpaidVal) || 0), 0);
  const totalThisPeriodAcceptedVal = allItems.reduce((s, i) => s + (Number(i.thisPeriodAcceptedVal) || 0), 0);
  const totalThisPeriodRequestedVal = allItems.reduce((s, i) => s + (Number(i.thisPeriodRequestedVal) || 0), 0);
  const totalThisPeriodUnpaidVal = allItems.reduce((s, i) => s + (Number(i.thisPeriodUnpaidVal) || 0), 0);
  const totalPrevPaidVal = allItems.reduce((s, i) => s + (Number(i.prevPaidVal) || 0), 0);
  const totalPaidToDateVal = allItems.reduce((s, i) => s + (Number(i.totalPaidToDateVal) || 0), 0);

  // Tính toán số liệu theo 6 mục chuẩn Nghị định 254/2025/NĐ-CP Phụ lục 03.a/TT
  const contractTotal = Number(contract?.adjustedValue || contract?.originalValue || totalContractVal);
  const advanceRate = contract?.advanceRate || 20;
  const totalAdvanceOriginally = Math.round(contractTotal * (advanceRate / 100));

  // 1. Giá trị tạm ứng còn lại chưa thu hồi đến hết kỳ trước
  const advanceDeductedPrev = Math.max(0, Math.round(totalPrevPaidVal * 0.2));
  const advanceRemainingPrev = Math.max(0, totalAdvanceOriginally - advanceDeductedPrev);

  // 2. Số tiền đã thanh toán khối lượng hoàn thành đến hết kỳ trước
  const prevCompletedPaidTotal = totalPrevPaidVal;
  const prevPaidContractor = Math.round(prevCompletedPaidTotal * 0.95);
  const prevRetentionFund = Math.round(prevCompletedPaidTotal * 0.05);
  const prevPendingEscrow = 0;

  // 3. Luỹ kế giá trị khối lượng thực hiện đến hết kỳ này
  const cumulativeWorkCompleted = totalPrevPaidVal + (payment.workCompletedValue || totalThisPeriodAcceptedVal);

  // 4. Thanh toán để thu hồi tạm ứng
  const advanceRecoveryThisPeriod = Number(payment.advanceDeduction || Math.round(totalThisPeriodRequestedVal * 0.2));

  // 5. Giá trị đề nghị giải ngân kỳ này
  const retentionThisPeriod = Number(payment.retentionDeduction || Math.round(totalThisPeriodRequestedVal * 0.05));
  const netPaidToContractorThisPeriod = Math.max(0, totalThisPeriodRequestedVal - advanceRecoveryThisPeriod - retentionThisPeriod);
  const totalDisbursementRequestedThisPeriod = Number(payment.requestedAmount || (totalThisPeriodRequestedVal - advanceRecoveryThisPeriod));

  const wordsAmount = numberToVietnameseWords(totalDisbursementRequestedThisPeriod);

  // 6. Luỹ kế giá trị giải ngân
  const totalAdvanceDisbursedCum = totalAdvanceOriginally;
  const totalCompletedDisbursedCum = prevCompletedPaidTotal + totalDisbursementRequestedThisPeriod;
  const grandTotalDisbursedCum = totalAdvanceDisbursedCum + totalCompletedDisbursedCum;

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportService.exportForm03aExcel(project, contract, payment, sections);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      
      {/* Dynamic CSS injected specifically for print adjustment */}
      <style>{`
        @page {
          size: ${paperSize.toUpperCase()} ${orientation};
          margin: ${marginSize};
        }
        @media print {
          html, body {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-form-03a, #printable-form-03a * {
            visibility: visible;
          }
          #printable-form-03a {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            font-size: ${fontSize} !important;
            line-height: 1.25 !important;
            transform: scale(${scalePercent / 100});
            transform-origin: top left;
          }
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .print-table thead {
            display: table-header-group !important;
          }
          .print-table tr {
            page-break-inside: avoid !important;
          }
          .signature-block, .summary-block {
            page-break-inside: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-xl shadow-2xl max-w-[97vw] w-full max-h-[96vh] flex flex-col border border-slate-300">
        
        {/* Header no-print */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-t-xl no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">📋</span>
              <h2 className="text-base font-bold text-slate-800">
                Bảng Xác Định Giá Trị Khối Lượng Công Việc Hoàn Thành (Phụ lục 03.a/TT)
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold border border-emerald-300">
                Nghị định 254/2025/NĐ-CP
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tùy chỉnh khổ giấy in ấn & xuất PDF chuẩn hóa trang tài liệu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition ${
                showConfig ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showConfig ? 'Ẩn cài đặt in' : 'Căn chỉnh trang in'}</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1.5 transition shadow-sm"
              title="Xuất Excel theo đúng 19 cột chuẩn NĐ 254/2025"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Xuất Excel (.xlsx)
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition shadow-sm"
              title="In ra giấy hoặc lưu thành file PDF"
            >
              <Printer className="w-4 h-4" />
              In / Xuất PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Configuration Toolbar (collapsible) */}
        {showConfig && (
          <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 px-6 py-3 border-b border-blue-100 no-print text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-5">
                {/* 1. Hướng giấy */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Hướng in:</span>
                  <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOrientation('landscape')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                        orientation === 'landscape' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Khổ Ngang (Khuyên dùng)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('portrait')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                        orientation === 'portrait' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Khổ Đứng
                    </button>
                  </div>
                </div>

                {/* 2. Khổ giấy */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Khổ giấy:</span>
                  <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setPaperSize('a4')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                        paperSize === 'a4' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      A4 (Chuẩn)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperSize('a3')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                        paperSize === 'a3' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      A3 (Rộng rãi)
                    </button>
                  </div>
                </div>

                {/* 3. Căn lề giấy */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Căn lề:</span>
                  <select
                    value={marginSize}
                    onChange={(e) => setMarginSize(e.target.value)}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="4mm">Siêu hẹp (4mm - Tối đa diện tích)</option>
                    <option value="6mm">Hẹp (6mm - Cân đối)</option>
                    <option value="10mm">Vừa (10mm)</option>
                    <option value="15mm">Chuẩn (15mm)</option>
                  </select>
                </div>

                {/* 4. Cỡ chữ bảng in */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Cỡ chữ bảng:</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="7.5pt">Rất nhỏ (7.5pt)</option>
                    <option value="8.5pt">Nhỏ gọn (8.5pt - Khuyên dùng A4)</option>
                    <option value="9.5pt">Tiêu chuẩn (9.5pt)</option>
                    <option value="10.5pt">Lớn (10.5pt - Khuyên dùng A3)</option>
                  </select>
                </div>

                {/* 5. Tỷ lệ thu phóng */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Tỷ lệ:</span>
                  <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white shadow-sm">
                    {[100, 90, 80, 75].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setScalePercent(pct)}
                        className={`px-2 py-1 rounded-md text-xs font-bold transition ${
                          scalePercent === pct ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="text-[11px] text-blue-800 bg-blue-100/70 px-3 py-1.5 rounded-lg border border-blue-200/80 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Đã cấu hình: <strong>{paperSize.toUpperCase()} {orientation === 'landscape' ? 'Ngang' : 'Đứng'}</strong>, lề <strong>{marginSize}</strong>, chữ <strong>{fontSize}</strong>. Bảng 19 cột sẽ tự động dàn đều không bị tràn trang.
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Printable Paper Area */}
        <div
          className="overflow-y-auto p-4 md:p-8 space-y-4 text-slate-900 bg-white text-xs font-['Times_New_Roman',serif] transition-all"
          id="printable-form-03a"
          style={{
            fontSize: fontSize,
            transform: scalePercent !== 100 ? `scale(${scalePercent / 100})` : undefined,
            transformOrigin: 'top center'
          }}
        >
          
          {/* Header Title theo mẫu chính xác */}
          <div className="text-center space-y-1">
            <h1 className="text-sm md:text-base font-bold uppercase tracking-wide text-slate-900">
              BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH
            </h1>
            <p className="italic text-[11px] text-slate-700">
              (Căn cứ theo Nghị định 254/2025/NĐ-CP ngày 26/9/2025 của Chính Phủ - Phụ lục 03.a/TT)
            </p>
            <p className="font-bold uppercase text-xs pt-1">
              CÔNG TRÌNH: {contract?.packageName || project?.name}
            </p>
            <p className="font-bold uppercase text-xs">
              HẠNG MỤC: Hạng mục 1
            </p>
          </div>

          {/* Metadata Section */}
          <div className="space-y-1 text-xs pt-2">
            <div><span className="font-bold">Tên dự án:</span> {project?.name}</div>
            <div><span className="font-bold">Mã dự án:</span> {project?.code}</div>
            <div><span className="font-bold">Căn cứ Bảng thông tin của Hợp đồng số:</span> {contract?.code} ngày {formatDate(contract?.signDate)}</div>
            <div><span className="font-bold">Căn cứ Bảng thông tin Dự toán số:</span> DT-{project?.code || '01'}</div>
            <div><span className="font-bold">Chủ đầu tư:</span> {project?.owner}</div>
            <div><span className="font-bold">Nhà thầu (đơn vị thực hiện trong trường hợp thực hiện không thông qua hợp đồng):</span> {contract?.contractor}</div>
            <div><span className="font-bold">Thanh toán lần thứ:</span> {payment.stageNumber}</div>
            <div><span className="font-bold">Căn cứ Biên bản nghiệm thu số:</span> 0{payment.stageNumber}/NT-GĐ/2026 &nbsp;&nbsp;&nbsp;&nbsp; Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</div>
          </div>

          {/* 19-Column Table */}
          <div className="overflow-x-auto border border-black pt-1">
            <table className="w-full text-[10px] border-collapse border border-black font-['Times_New_Roman',serif] print-table">
              <thead className="bg-slate-100 text-center font-bold">
                <tr>
                  <th rowSpan="2" className="border border-black px-1 py-1 w-6">STT</th>
                  <th rowSpan="2" className="border border-black px-1 py-1 w-14">Mã hiệu công việc</th>
                  <th rowSpan="2" className="border border-black px-2 py-1 min-w-[150px]">Chỉ tiêu</th>
                  <th rowSpan="2" className="border border-black px-1 py-1 w-8">Đơn vị tính</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">KL theo hợp đồng /dự toán</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">KLHT chưa thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">KLHT đã thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">KLHT nghiệm thu trong kỳ này</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">KLHT lũy kế đến hết kỳ này</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">KLHT đề nghị thanh toán kỳ này</th>
                  <th colSpan="2" className="border border-black px-1 py-0.5">Đơn giá thanh toán</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">Giá trị hợp đồng /dự toán</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">Giá trị KLHT chưa thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">Giá trị KLHT nghiệm thu trong kỳ này</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">Giá trị KLHT đề nghị thanh toán kỳ này</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">Giá trị KLHT chưa thanh toán đến hết kỳ này</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">Lũy kế giá trị KLHT đã thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-1 py-1">Lũy kế giá trị KLHT đã thanh toán đến hết kỳ này</th>
                  <th rowSpan="2" className="border border-black px-1 py-1 w-14">Ghi chú</th>
                </tr>
                <tr>
                  <th className="border border-black px-1 py-0.5">Theo hợp đồng</th>
                  <th className="border border-black px-1 py-0.5">Đơn giá bổ sung</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(section => (
                  <React.Fragment key={section.sectionCode}>
                    {/* Section Header Row */}
                    <tr className="bg-slate-200/80 font-bold">
                      <td className="border border-black px-1 py-1 text-center">{section.sectionCode}</td>
                      <td className="border border-black px-1 py-1"></td>
                      <td colSpan="17" className="border border-black px-2 py-1 text-left uppercase">
                        {section.sectionName}
                      </td>
                    </tr>

                    {/* Items */}
                    {section.items.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        <td className="border border-black px-1 py-1 text-center">{row.stt}</td>
                        <td className="border border-black px-1 py-1 text-center font-mono text-[9px]">{row.jobCode}</td>
                        <td className="border border-black px-1.5 py-1 text-left">{row.name}</td>
                        <td className="border border-black px-1 py-1 text-center">{row.unit}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.contractQty)}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.prevUnpaidQty)}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.prevPaidQty)}</td>
                        <td className="border border-black px-1 py-1 text-right font-medium">{formatNumber(row.thisPeriodAcceptedQty)}</td>
                        <td className="border border-black px-1 py-1 text-right font-medium">{formatNumber(row.totalCumulativeQty)}</td>
                        <td className="border border-black px-1 py-1 text-right font-semibold bg-emerald-50/50">{formatNumber(row.thisPeriodRequestedQty)}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.unitPriceContract)}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.unitPriceAdditional)}</td>
                        <td className="border border-black px-1 py-1 text-right font-medium">{formatNumber(row.contractVal)}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.prevUnpaidVal)}</td>
                        <td className="border border-black px-1 py-1 text-right font-medium">{formatNumber(row.thisPeriodAcceptedVal)}</td>
                        <td className="border border-black px-1 py-1 text-right font-bold text-emerald-800 bg-emerald-50/50">{formatNumber(row.thisPeriodRequestedVal)}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.thisPeriodUnpaidVal)}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatNumber(row.prevPaidVal)}</td>
                        <td className="border border-black px-1 py-1 text-right font-bold text-amber-900 bg-amber-50/40">{formatNumber(row.totalPaidToDateVal)}</td>
                        <td className="border border-black px-1 py-1 text-center text-[9px]">{row.note}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                {/* Tổng số row */}
                <tr className="bg-slate-200 font-bold border-t-2 border-black">
                  <td colSpan="4" className="border border-black px-2 py-1.5 text-center uppercase tracking-wider font-extrabold">
                    Tổng số:
                  </td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black px-1 py-1 text-right font-extrabold">{formatNumber(totalContractVal)}</td>
                  <td className="border border-black px-1 py-1 text-right font-extrabold">{formatNumber(totalPrevUnpaidVal)}</td>
                  <td className="border border-black px-1 py-1 text-right font-extrabold">{formatNumber(totalThisPeriodAcceptedVal)}</td>
                  <td className="border border-black px-1 py-1 text-right font-extrabold text-emerald-900 bg-emerald-100">{formatNumber(totalThisPeriodRequestedVal)}</td>
                  <td className="border border-black px-1 py-1 text-right font-extrabold">{formatNumber(totalThisPeriodUnpaidVal)}</td>
                  <td className="border border-black px-1 py-1 text-right font-extrabold">{formatNumber(totalPrevPaidVal)}</td>
                  <td className="border border-black px-1 py-1 text-right font-extrabold text-amber-900 bg-amber-100">{formatNumber(totalPaidToDateVal)}</td>
                  <td className="border border-black"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6 Mục Tổng Hợp Số Liệu Chuẩn Theo Phụ Lục 03.a/TT */}
          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-300 summary-block">
            <p>
              <strong>1. Giá trị tạm ứng còn lại chưa thu hồi đến hết kỳ trước:</strong> {formatVND(advanceRemainingPrev)}
            </p>
            <p>
              <strong>2. Số tiền đã thanh toán khối lượng hoàn thành đến hết kỳ trước:</strong> {formatVND(prevCompletedPaidTotal)}
            </p>
            <p className="pl-6">
              2.1. Thanh toán cho nhà thầu: {formatVND(prevPaidContractor)}
            </p>
            <p className="pl-6">
              2.2. Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình): {formatVND(prevRetentionFund)}
            </p>
            <p className="pl-6">
              2.3. Chuyển vào tài khoản tạm giữ chờ quyết toán: {formatVND(prevPendingEscrow)}
            </p>
            <p>
              <strong>3. Luỹ kế giá trị khối lượng thực hiện đến hết kỳ này:</strong> {formatVND(cumulativeWorkCompleted)}
            </p>
            <p>
              <strong>4. Thanh toán để thu hồi tạm ứng:</strong> {formatVND(advanceRecoveryThisPeriod)}
            </p>
            
            <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-300">
              <p>
                <strong>5. Giá trị đề nghị giải ngân kỳ này:</strong> <span className="font-bold text-sm text-blue-800">{formatVND(totalDisbursementRequestedThisPeriod)}</span>
              </p>
              <p className="italic pl-4 text-slate-700">
                • Số tiền bằng chữ: <strong>{wordsAmount}</strong> (là số tiền đề nghị giải ngân kỳ này), trong đó:
              </p>
              <p className="pl-8">- Tạm ứng: 0 ₫</p>
              <p className="pl-8">- Thanh toán khối lượng hoàn thành: {formatVND(totalDisbursementRequestedThisPeriod)}</p>
              <p className="pl-12">+ Thanh toán cho nhà thầu: <strong className="text-emerald-700">{formatVND(netPaidToContractorThisPeriod)}</strong></p>
              <p className="pl-12">+ Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình): <strong>{formatVND(retentionThisPeriod)}</strong></p>
              <p className="pl-12">+ Chuyển vào tài khoản tạm giữ chờ quyết toán: 0 ₫</p>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-300">
              <p>
                <strong>6. Luỹ kế giá trị giải ngân:</strong> <span className="font-bold text-sm text-slate-900">{formatVND(grandTotalDisbursedCum)}</span>, trong đó:
              </p>
              <p className="pl-6">6.1. Tạm ứng: {formatVND(totalAdvanceDisbursedCum)}</p>
              <p className="pl-6">6.2. Thanh toán khối lượng hoàn thành: {formatVND(totalCompletedDisbursedCum)}</p>
              <p className="pl-10">- Thanh toán cho nhà thầu: {formatVND(Math.round(totalCompletedDisbursedCum * 0.95))}</p>
              <p className="pl-10">- Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình): {formatVND(Math.round(totalCompletedDisbursedCum * 0.05))}</p>
              <p className="pl-10">- Chuyển vào tài khoản tạm giữ chờ quyết toán: 0 ₫</p>
            </div>
          </div>

          {/* Exact Legal Signature Block */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs gap-8 font-['Times_New_Roman',serif] signature-block">
            <div className="space-y-20">
              <div>
                <p className="font-bold uppercase">ĐẠI DIỆN NHÀ THẦU (ĐƠN VỊ THỰC HIỆN)</p>
                <p className="italic text-slate-500 text-[11px]">(Ký, ghi rõ họ tên, chức vụ, đóng dấu)</p>
              </div>
              <p className="font-bold uppercase text-slate-800">{contract?.contractor}</p>
            </div>

            <div className="space-y-20">
              <div>
                <p className="italic text-slate-600 pb-1">
                  ................., Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </p>
                <p className="font-bold uppercase leading-snug">
                  CHỦ ĐẦU TƯ/BAN QUẢN LÝ DỰ ÁN/<br />
                  ĐƠN VỊ, TỔ CHỨC LÀM NHIỆM VỤ BỒI THƯỜNG, HỖ TRỢ TÁI ĐỊNH CƯ
                </p>
                <p className="italic text-slate-500 text-[11px]">(Ký, ghi rõ họ tên và đóng dấu)</p>
              </div>
              <p className="font-bold uppercase text-slate-800">{project?.owner}</p>
            </div>
          </div>

          {/* Footer Page */}
          <div className="pt-6 text-center text-[11px] text-slate-400 no-print">
            Trang 1
          </div>

        </div>

      </div>
    </div>
  );
}