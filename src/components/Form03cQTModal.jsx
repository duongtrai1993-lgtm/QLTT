import React, { useState } from 'react';
import { X, Printer, FileSpreadsheet, Sliders, Check, ZoomIn, ZoomOut, RotateCcw, LayoutTemplate } from 'lucide-react';
import { formatVND, formatNumber, formatDate, numberToVietnameseWords } from '../services/storageService';
import { SAMPLE_FORM_03A_SECTIONS } from '../data/sampleData';

/**
 * Mẫu số 03.c/QT - Bảng tính giá trị quyết toán hợp đồng giữa Chủ đầu tư và Nhà thầu (Quyết toán A - B)
 * Ban hành kèm theo Nghị định số 254/2025/NĐ-CP ngày 26/9/2025 của Chính phủ
 *
 * Cấu trúc 8 cột:
 *   (1) STT
 *   (2) Tên công việc (Nội dung chi tiết)
 *   (3) Đơn vị tính
 *   (4) Khối lượng theo HĐ/PLHĐ
 *   (5) Khối lượng quyết toán
 *   (6) Đơn giá theo HĐ/PLHĐ (đồng)
 *   (7) Giá trị đề nghị quyết toán (đồng) = (5) x (6)
 *   (8) Ghi chú
 */
export function Form03cQTModal({ isOpen, onClose, payment, contract, project }) {
  if (!isOpen || !payment) return null;

  // Print & Layout Customization States
  const [paperSize, setPaperSize] = useState('a4');
  const [orientation, setOrientation] = useState('landscape');
  const [marginSize, setMarginSize] = useState('5mm');
  const [fontSize, setFontSize] = useState('8pt');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showConfig, setShowConfig] = useState(true);

  // Lấy dữ liệu từ các mục 03.a có sẵn để tính quyết toán
  const sections = SAMPLE_FORM_03A_SECTIONS;
  const allItems = sections.flatMap(s => s.items);

  // Tổng hợp số liệu quyết toán
  const totalContractVal = allItems.reduce((s, i) => s + (Number(i.contractVal) || 0), 0);
  const totalSettlementVal = allItems.reduce((s, i) => s + (Number(i.totalPaidToDateVal) || 0), 0);
  const totalDiffVal = totalSettlementVal - totalContractVal;

  // Tính toán tổng hợp quyết toán
  const contractTotal = Number(contract?.adjustedValue || contract?.originalValue || totalContractVal);
  const advanceRate = contract?.advanceRate || 20;
  const totalAdvance = Math.round(contractTotal * (advanceRate / 100));
  const retentionRate = contract?.retentionRate || 5;

  // Tổng đã thanh toán qua các kỳ (giả lập)
  const totalPaidAllPeriods = allItems.reduce((s, i) => s + (Number(i.prevPaidVal) || 0), 0)
                            + allItems.reduce((s, i) => s + (Number(i.thisPeriodRequestedVal) || 0), 0);

  // Giá trị quyết toán ước tính
  const settlementValue = totalSettlementVal;
  const retentionHeld = Math.round(totalPaidAllPeriods * (retentionRate / 100));
  const advanceRecovered = totalAdvance; // Giả sử tạm ứng đã thu hồi hết tại lần quyết toán
  const remainingPayable = Math.max(0, settlementValue - totalPaidAllPeriods - retentionHeld);

  const wordsAmount = numberToVietnameseWords(settlementValue);

  const getPaperWidthPx = () => {
    if (orientation === 'landscape') {
      return paperSize === 'a3' ? 1580 : 1180;
    }
    return paperSize === 'a3' ? 1120 : 840;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="form-03c-modal-container"
      className="fixed inset-0 z-[100] overflow-hidden bg-slate-950/95 flex flex-col justify-between"
      style={{ backdropFilter: 'blur(8px)' }}
    >

      {/* Dynamic CSS for print */}
      <style>{`
        @page {
          size: ${paperSize.toUpperCase()} ${orientation};
          margin: ${marginSize};
        }
        @media print {
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
          body > #root > div > *:not(#form-03c-modal-container),
          .no-print {
            display: none !important;
          }
          #form-03c-modal-container,
          #form-03c-modal-workspace {
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
          #printable-form-03c {
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
            line-height: 1.3 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
          .print-table-qt {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            page-break-inside: auto !important;
          }
          .print-table-qt thead {
            display: table-header-group !important;
          }
          .print-table-qt tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .signature-block-qt {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Controls Bar */}
      <div className="bg-slate-900 border-b border-slate-700 text-white px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 no-print z-20 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-amber-600 text-white rounded-lg text-sm font-bold">📑</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Bảng Tính Giá Trị Quyết Toán Hợp Đồng A - B (Mẫu 03.c/QT)
              </h2>
              <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold">
                Quyết toán
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Nghị định 254/2025/NĐ-CP • 8 cột chuẩn • Quyết toán giữa Chủ đầu tư và Nhà thầu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs text-slate-300">
            <button onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))} className="p-1 hover:text-white rounded hover:bg-slate-700 transition">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-semibold">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))} className="p-1 hover:text-white rounded hover:bg-slate-700 transition">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoomLevel(100)} className="p-1 hover:text-white rounded hover:bg-slate-700 transition ml-0.5">
              <RotateCcw className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition ${
              showConfig ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Ẩn bảng chỉnh' : 'Hiệu chỉnh'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 transition shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu PDF</span>
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Config Ribbon */}
      {showConfig && (
        <div className="bg-slate-900/95 border-b border-slate-800 px-5 py-2.5 text-white text-xs shrink-0 no-print">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Hướng:</span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
                <button type="button" onClick={() => setOrientation('landscape')} className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${orientation === 'landscape' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Ngang</button>
                <button type="button" onClick={() => setOrientation('portrait')} className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${orientation === 'portrait' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Đứng</button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Khổ:</span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
                <button type="button" onClick={() => setPaperSize('a4')} className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${paperSize === 'a4' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>A4</button>
                <button type="button" onClick={() => setPaperSize('a3')} className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${paperSize === 'a3' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>A3</button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Lề:</span>
              <select value={marginSize} onChange={(e) => setMarginSize(e.target.value)} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-[11px] font-semibold">
                <option value="4mm">4mm</option>
                <option value="5mm">5mm</option>
                <option value="8mm">8mm</option>
                <option value="12mm">12mm</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Cỡ chữ:</span>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-[11px] font-semibold">
                <option value="7pt">7pt</option>
                <option value="7.5pt">7.5pt</option>
                <option value="8pt">8pt (Chuẩn)</option>
                <option value="9pt">9pt</option>
                <option value="10pt">10pt</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Preview */}
      <div id="form-03c-modal-workspace" className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 bg-slate-900/90 flex justify-center items-start">
        <div
          id="printable-form-03c"
          className="bg-white text-black shadow-2xl p-6 sm:p-8 font-['Times_New_Roman',Times,serif] leading-tight transition-transform duration-100 origin-top shrink-0"
          style={{
            width: `${getPaperWidthPx()}px`,
            minHeight: orientation === 'landscape' ? '820px' : '1180px',
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : 'none',
            fontSize: fontSize,
            color: '#000000'
          }}
        >

          {/* Header Title */}
          <div className="text-center space-y-1 pb-4 text-black">
            <h1 className="text-[13pt] font-bold uppercase tracking-wide text-black leading-snug">
              BẢNG TÍNH GIÁ TRỊ QUYẾT TOÁN HỢP ĐỒNG
            </h1>
            <h2 className="text-[12pt] font-bold uppercase text-black">
              GIỮA CHỦ ĐẦU TƯ VÀ NHÀ THẦU (QUYẾT TOÁN A - B)
            </h2>
            <p className="italic text-[9pt] text-black">
              (Mẫu số 03.c/QT - Ban hành kèm theo Nghị định số 254/2025/NĐ-CP ngày 26/9/2025 của Chính phủ)
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-0.5 text-[9pt] text-black leading-normal pb-3">
            <div><span className="font-bold">Tên dự án:</span> {project?.name}</div>
            <div><span className="font-bold">Mã dự án:</span> {project?.code}</div>
            <div><span className="font-bold">Chủ đầu tư:</span> {project?.owner}</div>
            <div><span className="font-bold">Nhà thầu:</span> {contract?.contractor}</div>
            <div><span className="font-bold">Hợp đồng số:</span> {contract?.code} ngày {formatDate(contract?.signDate)}</div>
            <div><span className="font-bold">Gói thầu:</span> {contract?.packageName}</div>
            <div><span className="font-bold">Loại hợp đồng:</span> {contract?.contractType}</div>
            <div><span className="font-bold">Giá trị hợp đồng đã ký:</span> {formatNumber(contractTotal)} đồng</div>
          </div>

          {/* 8-Column Table */}
          <div className="w-full">
            <table
              className="print-table-qt w-full border-collapse border border-black text-black"
              style={{ tableLayout: 'fixed', width: '100%', fontSize: fontSize }}
            >
              <colgroup>
                <col style={{ width: '4%' }} />   {/* 1. STT */}
                <col style={{ width: '30%' }} />  {/* 2. Tên công việc */}
                <col style={{ width: '5%' }} />   {/* 3. ĐVT */}
                <col style={{ width: '10%' }} />  {/* 4. KL theo HĐ */}
                <col style={{ width: '10%' }} />  {/* 5. KL quyết toán */}
                <col style={{ width: '13%' }} />  {/* 6. Đơn giá HĐ */}
                <col style={{ width: '18%' }} />  {/* 7. Giá trị QT */}
                <col style={{ width: '10%' }} />  {/* 8. Ghi chú */}
              </colgroup>

              <thead className="text-center font-bold text-black bg-white">
                <tr>
                  <th className="border border-black px-1 py-1.5 align-middle">STT</th>
                  <th className="border border-black px-1 py-1.5 align-middle text-left">Tên công việc</th>
                  <th className="border border-black px-1 py-1.5 align-middle">Đơn vị tính</th>
                  <th className="border border-black px-1 py-1.5 align-middle">Khối lượng theo HĐ/PLHĐ</th>
                  <th className="border border-black px-1 py-1.5 align-middle">Khối lượng quyết toán</th>
                  <th className="border border-black px-1 py-1.5 align-middle">Đơn giá theo HĐ/PLHĐ (đồng)</th>
                  <th className="border border-black px-1 py-1.5 align-middle">Giá trị đề nghị quyết toán (đồng)</th>
                  <th className="border border-black px-1 py-1.5 align-middle">Ghi chú</th>
                </tr>
                <tr className="text-[7pt] font-normal text-black bg-slate-50/50">
                  <th className="border border-black px-0.5 py-0.5">(1)</th>
                  <th className="border border-black px-0.5 py-0.5">(2)</th>
                  <th className="border border-black px-0.5 py-0.5">(3)</th>
                  <th className="border border-black px-0.5 py-0.5">(4)</th>
                  <th className="border border-black px-0.5 py-0.5">(5)</th>
                  <th className="border border-black px-0.5 py-0.5">(6)</th>
                  <th className="border border-black px-0.5 py-0.5">(7)=(5)×(6)</th>
                  <th className="border border-black px-0.5 py-0.5">(8)</th>
                </tr>
              </thead>

              <tbody>
                {/* A. THEO HỢP ĐỒNG / PHỤ LỤC HỢP ĐỒNG */}
                <tr className="font-bold bg-slate-100/50">
                  <td className="border border-black px-1 py-1 text-center">A</td>
                  <td colSpan="7" className="border border-black px-2 py-1 text-left uppercase">
                    THEO HỢP ĐỒNG / PHỤ LỤC HỢP ĐỒNG
                  </td>
                </tr>

                {/* 1. Trong hợp đồng ban đầu */}
                <tr className="font-bold">
                  <td className="border border-black px-1 py-0.5 text-center"></td>
                  <td colSpan="7" className="border border-black px-2 py-0.5 text-left italic">
                    1. Trong hợp đồng ban đầu
                  </td>
                </tr>

                {sections.map(section => (
                  <React.Fragment key={section.sectionCode}>
                    {/* Section Header */}
                    <tr className="font-bold bg-slate-50/40">
                      <td className="border border-black px-1 py-0.5 text-center">{section.sectionCode}</td>
                      <td colSpan="7" className="border border-black px-2 py-0.5 text-left uppercase text-[8pt]">
                        {section.sectionName}
                      </td>
                    </tr>

                    {/* Items */}
                    {section.items.map((row, rIdx) => {
                      // KL quyết toán = lũy kế đã nghiệm thu (dùng totalCumulativeQty)
                      const settlementQty = row.totalCumulativeQty || 0;
                      const settlementVal = settlementQty * (row.unitPriceContract || 0);

                      return (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          <td className="border border-black px-1 py-0.5 text-center">{row.stt}</td>
                          <td className="border border-black px-2 py-0.5 text-left">{row.name}</td>
                          <td className="border border-black px-1 py-0.5 text-center">{row.unit}</td>
                          <td className="border border-black px-1 py-0.5 text-right font-mono">{formatNumber(row.contractQty)}</td>
                          <td className="border border-black px-1 py-0.5 text-right font-mono font-semibold">{formatNumber(settlementQty)}</td>
                          <td className="border border-black px-1 py-0.5 text-right font-mono">{formatNumber(row.unitPriceContract)}</td>
                          <td className="border border-black px-1 py-0.5 text-right font-mono font-bold">{formatNumber(settlementVal)}</td>
                          <td className="border border-black px-1 py-0.5 text-center text-[7pt]">{row.note}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}

                {/* 2. Công việc phát sinh ngoài hợp đồng */}
                <tr className="font-bold">
                  <td className="border border-black px-1 py-0.5 text-center"></td>
                  <td colSpan="7" className="border border-black px-2 py-0.5 text-left italic">
                    2. Công việc phát sinh ngoài hợp đồng ban đầu (nếu có)
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1 py-0.5 text-center italic text-slate-400"></td>
                  <td colSpan="5" className="border border-black px-2 py-0.5 text-left italic text-slate-400 text-[8pt]">
                    (Không có phát sinh ngoài hợp đồng)
                  </td>
                  <td className="border border-black px-1 py-0.5 text-right font-mono">0</td>
                  <td className="border border-black px-1 py-0.5"></td>
                </tr>

                {/* B. ĐIỀU CHỈNH THEO QUY ĐỊNH NHÀ NƯỚC */}
                <tr className="font-bold bg-slate-100/50">
                  <td className="border border-black px-1 py-1 text-center">B</td>
                  <td colSpan="7" className="border border-black px-2 py-1 text-left uppercase">
                    ĐIỀU CHỈNH THEO QUY ĐỊNH CỦA NHÀ NƯỚC (nếu có)
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-1 py-0.5 text-center italic text-slate-400"></td>
                  <td colSpan="5" className="border border-black px-2 py-0.5 text-left italic text-slate-400 text-[8pt]">
                    (Không có điều chỉnh)
                  </td>
                  <td className="border border-black px-1 py-0.5 text-right font-mono">0</td>
                  <td className="border border-black px-1 py-0.5"></td>
                </tr>

                {/* TỔNG GIÁ TRỊ QUYẾT TOÁN */}
                <tr className="font-bold border-t-2 border-black bg-slate-100/70">
                  <td colSpan="2" className="border border-black px-2 py-1.5 text-center uppercase font-extrabold text-[10pt]">
                    TỔNG GIÁ TRỊ QUYẾT TOÁN HỢP ĐỒNG (A + B)
                  </td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black px-1 py-1.5 text-right font-mono font-extrabold text-[10pt]">
                    {formatNumber(totalSettlementVal)}
                  </td>
                  <td className="border border-black"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tổng hợp quyết toán bên dưới bảng */}
          <div className="pt-4 text-[9pt] leading-normal text-black space-y-1 font-['Times_New_Roman',Times,serif]">
            <p>
              <strong>I. Giá trị hợp đồng đã ký:</strong> {formatNumber(contractTotal)} đồng
            </p>
            <p>
              <strong>II. Giá trị quyết toán A - B:</strong> <strong>{formatNumber(totalSettlementVal)} đồng</strong>
            </p>
            <p className="italic pl-6">
              Bằng chữ: <strong className="not-italic">{wordsAmount}</strong>
            </p>
            <p>
              <strong>III. Giá trị tăng (+) / giảm (-) so với hợp đồng:</strong>{' '}
              <strong className={totalDiffVal >= 0 ? '' : 'text-black'}>{totalDiffVal >= 0 ? '+' : ''}{formatNumber(totalDiffVal)} đồng</strong>
            </p>
            <p>
              <strong>IV. Tổng số tiền đã thanh toán (bao gồm tạm ứng và thanh toán khối lượng):</strong> {formatNumber(totalPaidAllPeriods)} đồng
            </p>
            <p className="pl-6">
              1. Tạm ứng hợp đồng: {formatNumber(totalAdvance)} đồng
            </p>
            <p className="pl-6">
              2. Thanh toán khối lượng hoàn thành (đã khấu trừ thu hồi tạm ứng): {formatNumber(totalPaidAllPeriods - totalAdvance > 0 ? totalPaidAllPeriods - totalAdvance : 0)} đồng
            </p>
            <p>
              <strong>V. Giá trị giữ lại bảo hành công trình ({retentionRate}%):</strong> {formatNumber(retentionHeld)} đồng
            </p>
            <p>
              <strong>VI. Số tiền còn phải thanh toán / thu hồi:</strong> <strong>{formatNumber(remainingPayable)} đồng</strong>
            </p>
          </div>

          {/* Khối chữ ký 3 bên */}
          <div className="pt-8 grid grid-cols-3 text-center text-[8.5pt] gap-6 font-['Times_New_Roman',Times,serif] signature-block-qt leading-normal text-black">
            {/* Nhà thầu */}
            <div className="flex flex-col justify-between min-h-[180px] h-[180px]">
              <div>
                <p className="font-bold uppercase text-[9pt] leading-snug">
                  ĐẠI DIỆN NHÀ THẦU
                </p>
                <p className="italic text-[8pt] pt-0.5">(Ký, ghi rõ họ tên, chức vụ, đóng dấu)</p>
              </div>
              <div className="min-h-[40px] flex items-end justify-center">
                <p className="font-bold uppercase text-[8.5pt] leading-tight">{contract?.contractor}</p>
              </div>
            </div>

            {/* Tư vấn giám sát */}
            <div className="flex flex-col justify-between min-h-[180px] h-[180px]">
              <div>
                <p className="font-bold uppercase text-[9pt] leading-snug">
                  TƯ VẤN GIÁM SÁT
                </p>
                <p className="italic text-[8pt] pt-0.5">(Ký, ghi rõ họ tên, chức vụ)</p>
              </div>
              <div className="min-h-[40px] flex items-end justify-center">
                <p className="font-bold uppercase text-[8.5pt] leading-tight">&nbsp;</p>
              </div>
            </div>

            {/* Chủ đầu tư */}
            <div className="flex flex-col justify-between min-h-[180px] h-[180px]">
              <div>
                <p className="italic text-black pb-0.5 text-[8.5pt]">
                  ........, Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </p>
                <p className="font-bold uppercase text-[9pt] leading-snug">
                  CHỦ ĐẦU TƯ / BAN QLDA
                </p>
                <p className="italic text-[8pt] pt-0.5">(Ký, ghi rõ họ tên và đóng dấu)</p>
              </div>
              <div className="min-h-[40px] flex items-end justify-center">
                <p className="font-bold uppercase text-[8.5pt] leading-tight">{project?.owner}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-5 mt-5 border-t border-slate-300 text-center text-[7.5pt] italic text-slate-500">
            Mẫu số 03.c/QT ban hành kèm theo Nghị định số 254/2025/NĐ-CP của Chính phủ
          </div>

        </div>
      </div>
    </div>
  );
}
