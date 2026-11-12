import React, { useState } from 'react';
import { X, Printer, Sliders, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { formatNumber, formatDate, numberToVietnameseWords } from '../services/storageService';

/**
 * Mẫu số 04.a/TT - Giấy đề nghị thanh toán vốn đầu tư (Tạm ứng / Thanh toán khối lượng hoàn thành)
 * Ban hành kèm theo Nghị định số 254/2025/NĐ-CP ngày 26/9/2025 của Chính phủ
 */
export function Form04aModal({ isOpen, onClose, payment, contract, project }) {
  if (!isOpen || !payment) return null;

  const [paperSize, setPaperSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait'); // Giấy đề nghị thường dùng khổ Đứng A4
  const [marginSize, setMarginSize] = useState('8mm');
  const [fontSize, setFontSize] = useState('9pt');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showConfig, setShowConfig] = useState(true);

  const isAdvance = payment.paymentType === 'advance';
  const isFinal = payment.paymentType === 'final';

  const contractTotal = Number(contract?.adjustedValue || contract?.originalValue || 0);
  const advanceRate = contract?.advanceRate || 20;
  const requestedAmt = Number(payment.requestedAmount || 0);
  const wordsAmount = numberToVietnameseWords(requestedAmt);

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
      id="form-04a-modal-container"
      className="fixed inset-0 z-[100] overflow-hidden bg-slate-950/95 flex flex-col justify-between"
      style={{ backdropFilter: 'blur(8px)' }}
    >
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
          body > #root > div > *:not(#form-04a-modal-container),
          .no-print {
            display: none !important;
          }
          #form-04a-modal-container,
          #form-04a-modal-workspace {
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
          #printable-form-04a {
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
            line-height: 1.35 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
          .print-table-04a {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            page-break-inside: auto !important;
          }
          .print-table-04a thead {
            display: table-header-group !important;
          }
          .print-table-04a tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .signature-block-04a {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Controls Bar */}
      <div className="bg-slate-900 border-b border-slate-700 text-white px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 no-print z-20 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-emerald-600 text-white rounded-lg text-sm font-bold">📄</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                {isAdvance ? 'Giấy Đề Nghị Thanh Toán Vốn Tạm Ứng (Mẫu 04.a/TT)' : 'Giấy Đề Nghị Thanh Toán Vốn Đầu Tư (Mẫu 04.a/TT)'}
              </h2>
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                {isAdvance ? 'Tạm ứng hợp đồng' : (isFinal ? 'Quyết toán' : 'Thanh toán KL')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Căn cứ Nghị định 254/2025/NĐ-CP • Kính gửi Kho bạc Nhà nước
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
              showConfig ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Ẩn bảng chỉnh' : 'Hiệu chỉnh'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 transition shadow-md"
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
                <button type="button" onClick={() => setOrientation('portrait')} className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${orientation === 'portrait' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Đứng (Khuyên dùng)</button>
                <button type="button" onClick={() => setOrientation('landscape')} className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${orientation === 'landscape' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Ngang</button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Khổ:</span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
                <button type="button" onClick={() => setPaperSize('a4')} className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${paperSize === 'a4' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>A4</button>
                <button type="button" onClick={() => setPaperSize('a3')} className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${paperSize === 'a3' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>A3</button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Lề:</span>
              <select value={marginSize} onChange={(e) => setMarginSize(e.target.value)} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-[11px] font-semibold">
                <option value="5mm">5mm (Hẹp)</option>
                <option value="8mm">8mm (Chuẩn)</option>
                <option value="12mm">12mm (Rộng)</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Cỡ chữ:</span>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-[11px] font-semibold">
                <option value="8pt">8pt</option>
                <option value="8.5pt">8.5pt</option>
                <option value="9pt">9pt (Chuẩn)</option>
                <option value="9.5pt">9.5pt</option>
                <option value="10pt">10pt</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Preview Workspace */}
      <div id="form-04a-modal-workspace" className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 bg-slate-900/90 flex justify-center items-start">
        <div
          id="printable-form-04a"
          className="bg-white text-black shadow-2xl p-8 sm:p-12 font-['Times_New_Roman',Times,serif] leading-normal transition-transform duration-100 origin-top shrink-0"
          style={{
            width: `${getPaperWidthPx()}px`,
            minHeight: orientation === 'portrait' ? '1180px' : '820px',
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : 'none',
            fontSize: fontSize,
            color: '#000000'
          }}
        >
          {/* Header Quốc hiệu / Đơn vị */}
          <div className="grid grid-cols-2 text-center pb-4 text-black text-[9.5pt]">
            <div>
              <p className="font-bold uppercase">{project?.owner}</p>
              <p className="font-bold">BAN QUẢN LÝ DỰ ÁN</p>
              <p className="text-[8.5pt]">Số: 0{payment.stageNumber}/GĐNTT-2026</p>
            </div>
            <div>
              <p className="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold">Độc lập - Tự do - Hạnh phúc</p>
              <p className="italic text-[8.5pt] pt-1">
                ........., Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Tiêu đề biểu mẫu */}
          <div className="text-center space-y-1 py-4 text-black">
            <h1 className="text-[13pt] font-bold uppercase tracking-wide text-black leading-snug">
              GIẤY ĐỀ NGHỊ THANH TOÁN VỐN ĐẦU TƯ
            </h1>
            <p className="italic text-[9pt] text-black">
              (Mẫu số 04.a/TT - Ban hành kèm theo Nghị định số 254/2025/NĐ-CP ngày 26/9/2025 của Chính phủ)
            </p>
            <div className="pt-2 font-bold text-[10pt]">
              <span>Loại đề nghị: </span>
              <span className="border-b-2 border-black px-2 pb-0.5">
                {isAdvance ? '☑ TẠM ỨNG VỐN' : '☑ THANH TOÁN KHỐI LƯỢNG HOÀN THÀNH'}
              </span>
            </div>
          </div>

          {/* Kính gửi */}
          <div className="text-center font-bold text-[9.5pt] pb-3 text-black">
            Kính gửi: Kho bạc Nhà nước tỉnh / thành phố
          </div>

          {/* Thông tin hành chính */}
          <div className="space-y-1 text-[9pt] text-black leading-relaxed pb-3">
            <div><strong>Tên dự án:</strong> {project?.name}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Mã dự án:</strong> {project?.code}</div>
              <div><strong>Mã ĐVSDNS:</strong> 1084920</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Năm ngân sách:</strong> {new Date().getFullYear()}</div>
              <div><strong>Nguồn vốn:</strong> {project?.capitalSource || 'Ngân sách Nhà nước'}</div>
            </div>
            <div><strong>Số tài khoản Chủ đầu tư:</strong> 3713.0.1084920 tại Kho bạc Nhà nước</div>
            <div><strong>Căn cứ Hợp đồng số:</strong> {contract?.code} ngày {formatDate(contract?.signDate)}</div>
            <div><strong>Gói thầu:</strong> {contract?.packageName}</div>
            <div><strong>Đơn vị thụ hưởng (Nhà thầu):</strong> {contract?.contractor}</div>
            <div><strong>Tài khoản đơn vị thụ hưởng:</strong> {contract?.contractorAccount || '118000028999 tại VietinBank'}</div>
            {isAdvance && (
              <div><strong>Bảo lãnh tạm ứng số:</strong> BL-48929/2024 ngày {formatDate(contract?.signDate)} do {contract?.bankName || 'Ngân hàng'} phát hành</div>
            )}
          </div>

          {/* Bảng chi tiết kinh phí đề nghị theo Mẫu 04.a/TT */}
          <div className="w-full pt-2">
            <table className="print-table-04a w-full border-collapse border border-black text-black" style={{ tableLayout: 'fixed', width: '100%', fontSize: fontSize }}>
              <colgroup>
                <col style={{ width: '6%' }} />
                <col style={{ width: '44%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '25%' }} />
              </colgroup>
              <thead className="text-center font-bold text-black bg-white">
                <tr>
                  <th className="border border-black px-1 py-1.5">STT</th>
                  <th className="border border-black px-2 py-1.5 text-left">Nội dung</th>
                  <th className="border border-black px-2 py-1.5 text-right">Giá trị hợp đồng (đồng)</th>
                  <th className="border border-black px-2 py-1.5 text-right">Số đề nghị kỳ này (đồng)</th>
                </tr>
                <tr className="text-[7pt] font-normal bg-slate-50/50">
                  <th className="border border-black px-0.5 py-0.5">(1)</th>
                  <th className="border border-black px-0.5 py-0.5">(2)</th>
                  <th className="border border-black px-0.5 py-0.5">(3)</th>
                  <th className="border border-black px-0.5 py-0.5">(4)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-1 py-1 text-center font-bold">I</td>
                  <td className="border border-black px-2 py-1 font-bold">
                    {contract?.packageName}
                  </td>
                  <td className="border border-black px-2 py-1 text-right font-mono font-bold">
                    {formatNumber(contractTotal)}
                  </td>
                  <td className="border border-black px-2 py-1 text-right font-mono font-bold">
                    {formatNumber(requestedAmt)}
                  </td>
                </tr>
                {isAdvance ? (
                  <tr>
                    <td className="border border-black px-1 py-1 text-center">1</td>
                    <td className="border border-black px-2 py-1">
                      Tạm ứng hợp đồng đợt {payment.stageNumber} ({advanceRate}% giá trị hợp đồng)
                    </td>
                    <td className="border border-black px-2 py-1 text-right font-mono">
                      {formatNumber(contractTotal)}
                    </td>
                    <td className="border border-black px-2 py-1 text-right font-mono font-semibold">
                      {formatNumber(requestedAmt)}
                    </td>
                  </tr>
                ) : (
                  <>
                    <tr>
                      <td className="border border-black px-1 py-1 text-center">1</td>
                      <td className="border border-black px-2 py-1">
                        Khối lượng công việc hoàn thành đề nghị thanh toán (theo Mẫu 03.a/TT)
                      </td>
                      <td className="border border-black px-2 py-1 text-right font-mono">
                        {formatNumber(contractTotal)}
                      </td>
                      <td className="border border-black px-2 py-1 text-right font-mono font-semibold">
                        {formatNumber(payment.workCompletedValue || requestedAmt)}
                      </td>
                    </tr>
                    {payment.advanceDeduction > 0 && (
                      <tr>
                        <td className="border border-black px-1 py-1 text-center">2</td>
                        <td className="border border-black px-2 py-1">
                          Khấu trừ thu hồi vốn tạm ứng kỳ này
                        </td>
                        <td className="border border-black px-2 py-1 text-right font-mono">-</td>
                        <td className="border border-black px-2 py-1 text-right font-mono text-rose-700">
                          - {formatNumber(payment.advanceDeduction)}
                        </td>
                      </tr>
                    )}
                    {payment.retentionDeduction > 0 && (
                      <tr>
                        <td className="border border-black px-1 py-1 text-center">3</td>
                        <td className="border border-black px-2 py-1">
                          Khấu trừ giữ lại bảo hành công trình (5%)
                        </td>
                        <td className="border border-black px-2 py-1 text-right font-mono">-</td>
                        <td className="border border-black px-2 py-1 text-right font-mono text-amber-700">
                          - {formatNumber(payment.retentionDeduction)}
                        </td>
                      </tr>
                    )}
                  </>
                )}
                {/* Tổng cộng */}
                <tr className="font-bold bg-slate-100/60 border-t-2 border-black">
                  <td colSpan="2" className="border border-black px-2 py-1.5 text-center uppercase font-extrabold">
                    TỔNG CỘNG SỐ TIỀN ĐỀ NGHỊ THANH TOÁN
                  </td>
                  <td className="border border-black px-2 py-1.5 text-right font-mono font-extrabold">
                    {formatNumber(contractTotal)}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-right font-mono font-extrabold text-[10pt]">
                    {formatNumber(requestedAmt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Số tiền bằng chữ */}
          <div className="pt-3 text-[9pt] leading-normal text-black space-y-1">
            <p>
              <strong>Tổng số tiền đề nghị thanh toán bằng chữ:</strong> <span className="font-bold italic">{wordsAmount}</span>
            </p>
            <p>
              Chủ đầu tư cam kết các thông tin, hồ sơ, chứng từ đề nghị thanh toán nêu trên là hoàn toàn chính xác, hợp pháp, hợp lệ theo đúng quy định hiện hành của Nhà nước và chịu trách nhiệm trước pháp luật.
            </p>
          </div>

          {/* Khối chữ ký 2 bên: Chủ đầu tư & Kho bạc Nhà nước */}
          <div className="pt-8 grid grid-cols-2 text-center text-[9pt] gap-8 font-['Times_New_Roman',Times,serif] signature-block-04a leading-normal text-black">
            {/* Phía Chủ đầu tư */}
            <div className="space-y-16">
              <div>
                <p className="font-bold uppercase text-[9.5pt]">KẾ TOÁN TRƯỞNG</p>
                <p className="italic text-[8pt] text-black">(Ký, ghi rõ họ tên)</p>
              </div>
              <p className="font-bold text-[9pt]">&nbsp;</p>
            </div>

            <div className="space-y-16">
              <div>
                <p className="font-bold uppercase text-[9.5pt]">THỦ TRƯỞNG ĐƠN VỊ</p>
                <p className="italic text-[8pt] text-black">(Ký, ghi rõ họ tên và đóng dấu)</p>
              </div>
              <p className="font-bold uppercase text-[9pt]">{project?.owner}</p>
            </div>
          </div>

          {/* Phần dành riêng cho Kho bạc Nhà nước */}
          <div className="pt-6 mt-6 border-t-2 border-dashed border-black signature-block-04a text-[8.5pt]">
            <p className="font-bold uppercase text-center pb-2">PHẦN DÀNH CHO CƠ QUAN KIỂM SOÁT THANH TOÁN (KHO BẠC NHÀ NƯỚC)</p>
            <div className="grid grid-cols-3 text-center gap-4 pt-2">
              <div className="space-y-14">
                <p className="font-bold">KIỂM SOÁT VIÊN</p>
                <p className="italic text-[7.5pt]">(Ký, ghi rõ họ tên)</p>
              </div>
              <div className="space-y-14">
                <p className="font-bold">KẾ TOÁN TRƯỞNG KHO BẠC</p>
                <p className="italic text-[7.5pt]">(Ký, ghi rõ họ tên)</p>
              </div>
              <div className="space-y-14">
                <p className="font-bold">GIÁM ĐỐC KBNN</p>
                <p className="italic text-[7.5pt]">(Ký, đóng dấu)</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 text-center text-[7.5pt] italic text-slate-500 signature-block-04a">
            Mẫu số 04.a/TT ban hành kèm theo Nghị định số 254/2025/NĐ-CP của Chính phủ
          </div>
        </div>
      </div>
    </div>
  );
}
