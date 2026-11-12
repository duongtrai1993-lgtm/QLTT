import React, { useState } from 'react';
import { X, Printer, FileSpreadsheet, Sliders, Check, ZoomIn, ZoomOut, RotateCcw, LayoutTemplate } from 'lucide-react';
import { formatVND, formatNumber, formatDate, numberToVietnameseWords, storageService } from '../services/storageService';
import { exportService } from '../services/exportService';
import { SAMPLE_FORM_03A_SECTIONS } from '../data/sampleData';

export function Form03aModal({ isOpen, onClose, payment, contract, project }) {
  if (!isOpen || !payment) return null;

  // Print & Layout Customization States
  const [paperSize, setPaperSize] = useState('a4'); // 'a4' | 'a3'
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' | 'portrait'
  const [marginSize, setMarginSize] = useState('4mm'); // '3mm', '4mm', '5mm', '8mm', '10mm'
  const [fontSize, setFontSize] = useState('7pt'); // '6.5pt', '7pt', '7.5pt', '8pt', '8.5pt', '9pt'
  const [zoomLevel, setZoomLevel] = useState(100); // 75, 90, 100, 110, 125 (%)
  const [breakSummaryPage, setBreakSummaryPage] = useState(false);
  const [showConfig, setShowConfig] = useState(true);

  // Quick Presets
  const applyPreset = (preset) => {
    if (preset === 'a4-landscape') {
      setPaperSize('a4');
      setOrientation('landscape');
      setMarginSize('4mm');
      setFontSize('7pt');
    } else if (preset === 'a3-landscape') {
      setPaperSize('a3');
      setOrientation('landscape');
      setMarginSize('8mm');
      setFontSize('9pt');
    } else if (preset === 'a4-portrait') {
      setPaperSize('a4');
      setOrientation('portrait');
      setMarginSize('3mm');
      setFontSize('6.5pt');
    }
  };

  const sections = storageService.getSectionsForPayment(contract?.id, payment) || SAMPLE_FORM_03A_SECTIONS;
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

  // Tính chiều rộng trang xem thử trên màn hình
  const getPaperWidthPx = () => {
    if (orientation === 'landscape') {
      return paperSize === 'a3' ? 1580 : 1180;
    }
    return paperSize === 'a3' ? 1120 : 840;
  };

  return (
    <div
      id="form-03a-modal-container"
      className="fixed inset-0 z-[100] overflow-hidden bg-slate-950/95 flex flex-col justify-between"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      
      {/* Dynamic CSS injected for exact print layout & multi-page pagination */}
      <style>{`
        @page {
          size: ${paperSize.toUpperCase()} ${orientation};
          margin: ${marginSize};
        }
        @media print {
          /* 1. Global Reset for multi-page flow */
          html, body {
            overflow: visible !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            display: block !important;
            position: static !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 2. Hide all other application components and modals */
          body > #root > div > *:not(#form-03a-modal-container),
          .no-print {
            display: none !important;
          }

          /* 3. Neutralize modal wrappers to prevent single-page clipping */
          #form-03a-modal-container,
          #form-03a-modal-workspace {
            position: static !important;
            inset: auto !important;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            display: block !important;
            transform: none !important;
          }

          /* 4. The actual printable document flows across multiple pages */
          #printable-form-03a {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: #000000 !important;
            display: block !important;
            font-size: ${fontSize} !important;
            line-height: 1.25 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }

          /* 5. Fixed-layout 100% width table guarantees zero right-edge clipping */
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            page-break-inside: auto !important;
          }
          
          .print-table thead {
            display: table-header-group !important; /* Lặp lại tiêu đề 20 cột trên mỗi trang */
          }

          .print-table tbody {
            page-break-inside: auto !important;
          }

          .print-table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: auto !important;
          }

          .print-table td, 
          .print-table th {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            word-break: normal !important;
            overflow: hidden !important;
          }

          /* 6. Summary and signature blocks */
          .summary-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            ${breakSummaryPage ? 'page-break-before: always !important; break-before: always !important;' : ''}
          }

          .signature-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Controls Bar (no-print) */}
      <div className="bg-slate-900 border-b border-slate-700 text-white px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 no-print z-20 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold">📋</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Bảng Xác Định Giá Trị Khối Lượng Hoàn Thành (Phụ lục 03.a/TT)
              </h2>
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                Nghị định 254/2025/NĐ-CP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Biểu mẫu chuẩn 20 cột • Đúng quy cách Bộ Xây dựng & Kho bạc • Cố định 100% không tràn lề
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs text-slate-300">
            <button
              onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
              className="p-1 hover:text-white rounded hover:bg-slate-700 transition"
              title="Thu nhỏ xem thử"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-semibold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
              className="p-1 hover:text-white rounded hover:bg-slate-700 transition"
              title="Phóng to xem thử"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:text-white rounded hover:bg-slate-700 transition ml-0.5"
              title="Tỉ lệ gốc 100%"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition ${
              showConfig ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Ẩn bảng chỉnh' : 'Hiệu chỉnh trang in'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/70 rounded-lg flex items-center gap-1.5 transition shadow-sm"
            title="Xuất file Excel đầy đủ 20 cột và 6 mục tổng hợp"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg flex items-center gap-1.5 transition shadow-md shadow-blue-500/25"
            title="Mở hộp thoại In hoặc Lưu file PDF"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Print Configuration Ribbon (no-print) */}
      {showConfig && (
        <div className="bg-slate-900/95 border-b border-slate-800 px-5 py-2.5 text-white text-xs shrink-0 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Presets Nhanh */}
              <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" /> Mẫu in:
                </span>
                <button
                  type="button"
                  onClick={() => applyPreset('a4-landscape')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                    paperSize === 'a4' && orientation === 'landscape'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="A4 Ngang, lề 4mm, chữ 7pt - Vừa vặn 100% khổ A4"
                >
                  A4 Ngang (Khuyên dùng)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('a3-landscape')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                    paperSize === 'a3' && orientation === 'landscape'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="A3 Ngang, chữ 9pt - Rất rộng rãi, phù hợp Ban QLDA & Kho bạc"
                >
                  A3 Ngang (Trình ký)
                </button>
              </div>

              {/* 1. Hướng in */}
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-400">Hướng:</span>
                <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                      orientation === 'landscape' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ngang
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                      orientation === 'portrait' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Đứng
                  </button>
                </div>
              </div>

              {/* 2. Khổ giấy */}
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-400">Khổ:</span>
                <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPaperSize('a4')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                      paperSize === 'a4' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    A4
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSize('a3')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                      paperSize === 'a3' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    A3
                  </button>
                </div>
              </div>

              {/* 3. Căn lề */}
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-400">Lề:</span>
                <select
                  value={marginSize}
                  onChange={(e) => setMarginSize(e.target.value)}
                  className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="3mm">3mm (Cực hẹp)</option>
                  <option value="4mm">4mm (Chuẩn A4 20 cột)</option>
                  <option value="5mm">5mm (Hẹp)</option>
                  <option value="8mm">8mm (Vừa vặn A3)</option>
                  <option value="12mm">12mm (Tiêu chuẩn)</option>
                </select>
              </div>

              {/* 4. Cỡ chữ bảng in */}
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-400">Cỡ chữ:</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="6.5pt">6.5pt (Siêu gọn)</option>
                  <option value="7pt">7pt (Chuẩn A4 Ngang - Đề xuất)</option>
                  <option value="7.5pt">7.5pt (Vừa vặn)</option>
                  <option value="8pt">8pt</option>
                  <option value="8.5pt">8.5pt</option>
                  <option value="9pt">9pt (Chuẩn A3 Ngang)</option>
                </select>
              </div>

              {/* 5. Tách trang chữ ký */}
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-300 hover:text-white select-none pl-2 border-l border-slate-700">
                <input
                  type="checkbox"
                  checked={breakSummaryPage}
                  onChange={(e) => setBreakSummaryPage(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-[11px]">Ngắt trang trước Tổng hợp & Chữ ký</span>
              </label>

            </div>

            <div className="text-[11px] text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded border border-emerald-700/60 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đã căn chuẩn 20 cột (Đơn giá 2 cột, Giá trị 7 cột) - Không cắt mép phải</span>
            </div>

          </div>
        </div>
      )}

      {/* Main Preview Workspace - Scrollable Center Sheet */}
      <div
        id="form-03a-modal-workspace"
        className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 bg-slate-900/90 flex justify-center items-start"
      >
        
        {/* Printable Paper Canvas - Exact A4/A3 Aspect Sheet */}
        <div
          id="printable-form-03a"
          className="bg-white text-black shadow-2xl p-4 sm:p-6 font-['Times_New_Roman',Times,serif] leading-tight transition-transform duration-100 origin-top shrink-0"
          style={{
            width: `${getPaperWidthPx()}px`,
            minHeight: orientation === 'landscape' ? (paperSize === 'a3' ? '1120px' : '820px') : (paperSize === 'a3' ? '1580px' : '1180px'),
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : 'none',
            fontSize: fontSize,
            color: '#000000'
          }}
        >
          
          {/* Header Title theo đúng mẫu gốc Phụ lục 03.a/TT */}
          <div className="text-center space-y-1 pb-3 text-black">
            <h1 className="text-[12pt] font-bold uppercase tracking-wide text-black leading-snug">
              BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH
            </h1>
            <p className="italic text-[9pt] text-black">
              (Căn cứ theo Nghị định 254/2025/NĐ-CP ngày 26/9/2025 của Chính Phủ - Phụ lục 03.a/TT)
            </p>
            <p className="font-bold uppercase text-[9pt] pt-0.5 text-black">
              CÔNG TRÌNH: {contract?.packageName || project?.name}
            </p>
            <p className="font-bold uppercase text-[9pt] text-black">
              HẠNG MỤC: Hạng mục 1
            </p>
          </div>

          {/* Metadata Section - 100% black administrative font */}
          <div className="space-y-0.5 text-[8.5pt] text-black leading-normal pb-2">
            <div><span className="font-bold">Tên dự án:</span> {project?.name}</div>
            <div><span className="font-bold">Mã dự án:</span> {project?.code}</div>
            <div><span className="font-bold">Căn cứ Bảng thông tin của Hợp đồng số:</span> {contract?.code} ngày {formatDate(contract?.signDate)}</div>
            <div><span className="font-bold">Căn cứ Bảng thông tin Dự toán số:</span> DT-{project?.code || '01'}</div>
            <div><span className="font-bold">Chủ đầu tư:</span> {project?.owner}</div>
            <div><span className="font-bold">Nhà thầu (đơn vị thực hiện trong trường hợp thực hiện không thông qua hợp đồng):</span> {contract?.contractor}</div>
            <div><span className="font-bold">Thanh toán lần thứ:</span> {payment.stageNumber}</div>
            <div><span className="font-bold">Căn cứ Biên bản nghiệm thu số:</span> 0{payment.stageNumber}/NT-GĐ/2026 &nbsp;&nbsp;&nbsp;&nbsp; Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</div>
          </div>

          {/* 20-Column Table with Colgroup Fixed Widths (Guaranteed Zero Overflow) */}
          <div className="w-full">
            <table
              className="print-table w-full border-collapse border border-black text-black"
              style={{
                tableLayout: 'fixed',
                width: '100%',
                fontSize: fontSize
              }}
            >
              <colgroup>
                <col style={{ width: '2.5%' }} />  {/* 1. STT */}
                <col style={{ width: '4.5%' }} />  {/* 2. Mã hiệu CV */}
                <col style={{ width: '16.5%' }} /> {/* 3. Chỉ tiêu */}
                <col style={{ width: '2.8%' }} />  {/* 4. ĐVT */}
                <col style={{ width: '4.5%' }} />  {/* 5. KL HĐ */}
                <col style={{ width: '4.0%' }} />  {/* 6. KL chưa TT trước */}
                <col style={{ width: '4.4%' }} />  {/* 7. KL đã TT trước */}
                <col style={{ width: '4.5%' }} />  {/* 8. KL nghiệm thu kỳ này */}
                <col style={{ width: '4.8%' }} />  {/* 9. KL lũy kế */}
                <col style={{ width: '4.5%' }} />  {/* 10. KL đề nghị TT */}
                <col style={{ width: '5.5%' }} />  {/* 11. Đơn giá HĐ */}
                <col style={{ width: '3.8%' }} />  {/* 12. Đơn giá BS */}
                <col style={{ width: '6.8%' }} />  {/* 13. Giá trị HĐ */}
                <col style={{ width: '4.2%' }} />  {/* 14. Giá trị chưa TT trước */}
                <col style={{ width: '6.0%' }} />  {/* 15. Giá trị NT kỳ này */}
                <col style={{ width: '6.0%' }} />  {/* 16. Giá trị đề nghị TT */}
                <col style={{ width: '4.2%' }} />  {/* 17. Giá trị chưa TT nay */}
                <col style={{ width: '6.0%' }} />  {/* 18. Lũy kế đã TT trước */}
                <col style={{ width: '6.5%' }} />  {/* 19. Lũy kế đã TT nay */}
                <col style={{ width: '3.2%' }} />  {/* 20. Ghi chú */}
              </colgroup>

              <thead className="text-center font-bold text-black bg-white">
                {/* Header Row 1 */}
                <tr>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">STT</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Mã hiệu công việc</th>
                  <th rowSpan="2" className="border border-black px-1 py-0.5 text-left align-middle">Chỉ tiêu</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Đơn vị tính</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">KL theo hợp đồng /dự toán</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">KLHT chưa thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">KLHT đã thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">KLHT nghiệm thu trong kỳ này</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">KLHT lũy kế đến hết kỳ này</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">KLHT đề nghị thanh toán kỳ này</th>
                  <th colSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Đơn giá thanh toán</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Giá trị hợp đồng /dự toán</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Giá trị KLHT chưa thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Giá trị KLHT nghiệm thu trong kỳ này</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Giá trị KLHT đề nghị thanh toán kỳ này</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Giá trị KLHT chưa thanh toán đến hết kỳ này</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Lũy kế giá trị KLHT đã thanh toán đến hết kỳ trước</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Lũy kế giá trị KLHT đã thanh toán đến hết kỳ này</th>
                  <th rowSpan="2" className="border border-black px-0.5 py-0.5 align-middle">Ghi chú</th>
                </tr>
                {/* Header Row 2 */}
                <tr>
                  <th className="border border-black px-0.5 py-0.5 align-middle">Theo hợp đồng</th>
                  <th className="border border-black px-0.5 py-0.5 align-middle">Đơn giá bổ sung</th>
                </tr>
                {/* Header Row 3: Official Column Numbering & Formulas */}
                <tr className="text-[6.5pt] font-normal text-black bg-slate-50/50">
                  <th className="border border-black px-0.5 py-0.5 text-center">(1)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(2)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(3)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(4)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(5)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(6)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(7)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(8)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(9)=(7)+(8)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(10)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(11)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(12)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(13)=(5)x(11)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(14)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(15)=(8)x(11)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(16)=(10)x(11)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(17)=(15)-(16)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(18)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(19)=(18)+(16)</th>
                  <th className="border border-black px-0.5 py-0.5 text-center">(20)</th>
                </tr>
              </thead>

              <tbody>
                {sections.map(section => (
                  <React.Fragment key={section.sectionCode}>
                    {/* Section Header Row */}
                    <tr className="font-bold bg-slate-100/60">
                      <td className="border border-black px-0.5 py-0.5 text-center">{section.sectionCode}</td>
                      <td className="border border-black px-0.5 py-0.5"></td>
                      <td colSpan="18" className="border border-black px-1.5 py-0.5 text-left uppercase">
                        {section.sectionName}
                      </td>
                    </tr>

                    {/* Section Items */}
                    {section.items.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        <td className="border border-black px-0.5 py-0.5 text-center">{row.stt}</td>
                        <td className="border border-black px-0.5 py-0.5 text-center font-mono text-[6.5pt]">{row.jobCode}</td>
                        <td className="border border-black px-1 py-0.5 text-left">{row.name}</td>
                        <td className="border border-black px-0.5 py-0.5 text-center">{row.unit}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.contractQty)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.prevUnpaidQty)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.prevPaidQty)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.thisPeriodAcceptedQty)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.totalCumulativeQty)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono font-semibold">{formatNumber(row.thisPeriodRequestedQty)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.unitPriceContract)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.unitPriceAdditional)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.contractVal)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.prevUnpaidVal)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.thisPeriodAcceptedVal)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono font-bold">{formatNumber(row.thisPeriodRequestedVal)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.thisPeriodUnpaidVal)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono">{formatNumber(row.prevPaidVal)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-right font-mono font-bold">{formatNumber(row.totalPaidToDateVal)}</td>
                        <td className="border border-black px-0.5 py-0.5 text-center text-[6.5pt]">{row.note}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                {/* Hàng Tổng số */}
                <tr className="font-bold border-t-2 border-black bg-slate-100/60">
                  <td colSpan="4" className="border border-black px-1 py-1 text-center uppercase tracking-wider font-extrabold">
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
                  <td className="border border-black px-0.5 py-1 text-right font-mono font-extrabold">{formatNumber(totalContractVal)}</td>
                  <td className="border border-black px-0.5 py-1 text-right font-mono font-extrabold">{formatNumber(totalPrevUnpaidVal)}</td>
                  <td className="border border-black px-0.5 py-1 text-right font-mono font-extrabold">{formatNumber(totalThisPeriodAcceptedVal)}</td>
                  <td className="border border-black px-0.5 py-1 text-right font-mono font-extrabold">{formatNumber(totalThisPeriodRequestedVal)}</td>
                  <td className="border border-black px-0.5 py-1 text-right font-mono font-extrabold">{formatNumber(totalThisPeriodUnpaidVal)}</td>
                  <td className="border border-black px-0.5 py-1 text-right font-mono font-extrabold">{formatNumber(totalPrevPaidVal)}</td>
                  <td className="border border-black px-0.5 py-1 text-right font-mono font-extrabold">{formatNumber(totalPaidToDateVal)}</td>
                  <td className="border border-black"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6 Mục Tổng Hợp Số Liệu - Định Dạng Chuẩn Văn Bản Hành Chính (100% Chữ Đen, Không Dùng Khung Màu Web) */}
          <div className="pt-4 text-[8.5pt] leading-normal text-black summary-block space-y-1 font-['Times_New_Roman',Times,serif]">
            <p>
              <strong>1. Giá trị tạm ứng còn lại chưa thu hồi đến hết kỳ trước:</strong> {formatNumber(advanceRemainingPrev)} đồng
            </p>
            <p>
              <strong>2. Số tiền đã thanh toán khối lượng hoàn thành đến hết kỳ trước:</strong> {formatNumber(prevCompletedPaidTotal)} đồng
            </p>
            <p className="pl-6">
              2.1. Thanh toán cho nhà thầu: {formatNumber(prevPaidContractor)} đồng
            </p>
            <p className="pl-6">
              2.2. Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình): {formatNumber(prevRetentionFund)} đồng
            </p>
            <p className="pl-6">
              2.3. Chuyển vào tài khoản tạm giữ chờ quyết toán: 0 đồng
            </p>
            <p>
              <strong>3. Luỹ kế giá trị khối lượng thực hiện đến hết kỳ này:</strong> {formatNumber(cumulativeWorkCompleted)} đồng
            </p>
            <p>
              <strong>4. Thanh toán để thu hồi tạm ứng:</strong> {formatNumber(advanceRecoveryThisPeriod)} đồng
            </p>
            <p>
              <strong>5. Giá trị đề nghị giải ngân kỳ này:</strong> <strong>{formatNumber(totalDisbursementRequestedThisPeriod)} đồng</strong>
            </p>
            <p className="italic pl-6 text-black">
              Số tiền bằng chữ: <strong className="not-italic">{wordsAmount}</strong> (là số tiền đề nghị giải ngân kỳ này), trong đó:
            </p>
            <p className="pl-8">- Tạm ứng: 0 đồng</p>
            <p className="pl-8">- Thanh toán khối lượng hoàn thành: {formatNumber(totalDisbursementRequestedThisPeriod)} đồng</p>
            <p className="pl-12">+ Thanh toán cho nhà thầu: <strong>{formatNumber(netPaidToContractorThisPeriod)} đồng</strong></p>
            <p className="pl-12">+ Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình): <strong>{formatNumber(retentionThisPeriod)} đồng</strong></p>
            <p className="pl-12">+ Chuyển vào tài khoản tạm giữ chờ quyết toán: 0 đồng</p>
            <p>
              <strong>6. Luỹ kế giá trị giải ngân:</strong> <strong>{formatNumber(grandTotalDisbursedCum)} đồng</strong>, trong đó:
            </p>
            <p className="pl-6">6.1. Tạm ứng: {formatNumber(totalAdvanceDisbursedCum)} đồng</p>
            <p className="pl-6">6.2. Thanh toán khối lượng hoàn thành: {formatNumber(totalCompletedDisbursedCum)} đồng</p>
            <p className="pl-10">- Thanh toán cho nhà thầu: {formatNumber(Math.round(totalCompletedDisbursedCum * 0.95))} đồng</p>
            <p className="pl-10">- Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình): {formatNumber(Math.round(totalCompletedDisbursedCum * 0.05))} đồng</p>
            <p className="pl-10">- Chuyển vào tài khoản tạm giữ chờ quyết toán: 0 đồng</p>
          </div>

          {/* Exact Legal Signature Block - Căn Chỉnh Cân Bằng Tuyệt Đối Chuẩn Văn Thư Nhà Nước */}
          <div className="pt-8 grid grid-cols-2 text-center text-[8.5pt] gap-10 font-['Times_New_Roman',Times,serif] signature-block leading-normal text-black">
            
            {/* Cột Trái: ĐẠI DIỆN NHÀ THẦU */}
            <div className="flex flex-col justify-between min-h-[190px] h-[190px]">
              <div>
                {/* Dòng đệm ẩn tương ứng với dòng Ngày tháng bên phải để 2 chức danh ngang bằng nhau tuyệt đối */}
                <p className="italic text-[8.5pt] pb-0.5 invisible select-none" aria-hidden="true">
                  ................., Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </p>
                <p className="font-bold uppercase text-[9pt] leading-snug">
                  ĐẠI DIỆN NHÀ THẦU (ĐƠN VỊ THỰC HIỆN)
                </p>
                <p className="italic text-[8pt] text-black pt-0.5">
                  (Ký, ghi rõ họ tên, chức vụ, đóng dấu)
                </p>
              </div>

              {/* Tên đơn vị / Họ tên người ký ở đáy - Đồng bộ chân đế thẳng hàng ngang tuyệt đối */}
              <div className="min-h-[44px] flex items-end justify-center">
                <p className="font-bold uppercase text-black text-[9pt] leading-tight">
                  {contract?.contractor}
                </p>
              </div>
            </div>

            {/* Cột Phải: CHỦ ĐẦU TƯ / BAN QLDA */}
            <div className="flex flex-col justify-between min-h-[190px] h-[190px]">
              <div>
                <p className="italic text-black pb-0.5 text-[8.5pt]">
                  ................., Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </p>
                <p className="font-bold uppercase leading-snug text-black text-[9pt]">
                  CHỦ ĐẦU TƯ/BAN QUẢN LÝ DỰ ÁN/<br />
                  ĐƠN VỊ, TỔ CHỨC LÀM NHIỆM VỤ<br />
                  BỒI THƯỜNG, HỖ TRỢ TÁI ĐỊNH CƯ
                </p>
                <p className="italic text-[8pt] text-black pt-0.5">
                  (Ký, ghi rõ họ tên và đóng dấu)
                </p>
              </div>

              {/* Tên chủ đầu tư ở đáy - Căn đồng bộ chân đế thẳng hàng ngang tuyệt đối */}
              <div className="min-h-[44px] flex items-end justify-center">
                <p className="font-bold uppercase text-black text-[9pt] leading-tight">
                  {project?.owner}
                </p>
              </div>
            </div>

          </div>

          {/* Page Footer */}
          <div className="pt-6 mt-6 border-t border-slate-300 text-center text-[7.5pt] italic text-slate-500 signature-block">
            Trang 1/1 - Mẫu Phụ lục 03.a/TT ban hành kèm theo Nghị định số 254/2025/NĐ-CP của Chính phủ
          </div>

        </div>

      </div>
    </div>
  );
}
