import React from 'react';
import { X, Printer, FileSpreadsheet } from 'lucide-react';
import { formatVND, formatNumber, formatDate } from '../services/storageService';
import { exportService } from '../services/exportService';
import { SAMPLE_FORM_03A_ITEMS } from '../data/sampleData';

export function Form03aModal({ isOpen, onClose, payment, contract, project }) {
  if (!isOpen || !payment) return null;

  const items = SAMPLE_FORM_03A_ITEMS;

  const totalContract = items.reduce((s, i) => s + (Number(i.contractAmount) || 0), 0);
  const totalPrev = items.reduce((s, i) => s + (Number(i.prevCumulativeAmount) || 0), 0);
  const totalThis = items.reduce((s, i) => s + (Number(i.thisPeriodAmount) || 0), 0);
  const totalCum = items.reduce((s, i) => s + (Number(i.totalCumulativeAmount) || 0), 0);

  // Tính toán số liệu tạm ứng theo NĐ 254/2025/NĐ-CP
  const contractVal = Number(contract?.adjustedValue || contract?.originalValue || 0);
  const totalAdvancePaid = contractVal * ((contract?.advanceRate || 20) / 100);
  const advanceDeductedThisPeriod = Number(payment?.advanceDeduction || 0);
  const retentionThisPeriod = Number(payment?.retentionDeduction || 0);
  const penaltyThisPeriod = Number(payment?.penaltyDeduction || 0);
  const netPayableAmount = Number(payment?.requestedAmount || (totalThis - advanceDeductedThisPeriod - retentionThisPeriod - penaltyThisPeriod));

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportService.exportForm03aExcel(project, contract, payment, items);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Header no-print */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">📋</span>
              <h2 className="text-base font-bold text-slate-800">
                Bảng Xác Định Giá Trị Khối Lượng Hoàn Thành (Mẫu số 03.a/TT)
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-extrabold border border-emerald-300">
                Nghị định 254/2025/NĐ-CP
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ban hành kèm theo Nghị định số 254/2025/NĐ-CP ngày 26/09/2025 của Chính phủ (thay thế Nghị định 99/2021/NĐ-CP)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition"
              title="Xuất bảng tính đầy đủ sang Excel chuẩn NĐ 254/2025"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Xuất Excel (.xlsx)
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition"
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

        {/* Printable Paper Area */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6 text-slate-900 bg-white" id="printable-form-03a">
          
          {/* Header Văn Bản Chuẩn */}
          <div className="grid grid-cols-2 text-center text-xs pb-4 border-b border-slate-300">
            <div>
              <p className="font-semibold uppercase tracking-wider">{project?.owner || "BAN QUẢN LÝ DỰ ÁN"}</p>
              <p className="font-bold text-sm uppercase mt-1">{contract?.packageName || "GÓI THẦU XÂY LẮP"}</p>
              <p className="text-slate-500 mt-1">Hợp đồng số: {contract?.code} ngày {formatDate(contract?.signDate)}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-medium underline underline-offset-4">Độc lập - Tự do - Hạnh phúc</p>
              <p className="italic text-slate-500 mt-2">Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
            </div>
          </div>

          <div className="text-center space-y-1">
            <span className="inline-block px-3 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
              Mẫu số 03.a/TT - Nghị định số 254/2025/NĐ-CP
            </span>
            <h1 className="text-base font-extrabold uppercase text-slate-900 tracking-wide pt-1">
              BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH
            </h1>
            <p className="text-xs font-semibold uppercase text-blue-800">
              {payment.title}
            </p>
            <p className="text-xs text-slate-500 italic">
              (Giai đoạn thi công từ ngày {formatDate(payment.periodFrom)} đến ngày {formatDate(payment.periodTo)})
            </p>
          </div>

          {/* Căn cứ pháp lý & Thông tin hợp đồng theo NĐ 254/2025/NĐ-CP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div><span className="font-semibold text-slate-700">• Căn cứ pháp lý:</span> Nghị định số 254/2025/NĐ-CP của Chính phủ</div>
            <div><span className="font-semibold text-slate-700">• Tên dự án:</span> {project?.name}</div>
            <div><span className="font-semibold text-slate-700">• Chủ đầu tư:</span> {project?.owner}</div>
            <div><span className="font-semibold text-slate-700">• Nhà thầu thi công:</span> {contract?.contractor}</div>
            <div><span className="font-semibold text-slate-700">• Giá trị hợp đồng ký kết:</span> {formatVND(contract?.adjustedValue || contract?.originalValue)}</div>
            <div><span className="font-semibold text-slate-700">• Tỷ lệ tạm ứng theo HĐ:</span> {contract?.advanceRate}% ({formatVND(totalAdvancePaid)})</div>
          </div>

          {/* Table 12 columns */}
          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-[11px] border-collapse border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold text-center">
                <tr>
                  <th rowSpan="2" className="border border-slate-300 px-2 py-1 w-8">STT</th>
                  <th rowSpan="2" className="border border-slate-300 px-3 py-1 min-w-[200px]">Nội dung công việc</th>
                  <th rowSpan="2" className="border border-slate-300 px-2 py-1 w-12">ĐVT</th>
                  <th colSpan="3" className="border border-slate-300 px-2 py-1 bg-blue-50">Theo Hợp đồng</th>
                  <th colSpan="2" className="border border-slate-300 px-2 py-1">Lũy kế hết kỳ trước</th>
                  <th colSpan="2" className="border border-slate-300 px-2 py-1 bg-emerald-50">Thực hiện kỳ này</th>
                  <th colSpan="2" className="border border-slate-300 px-2 py-1 bg-amber-50">Lũy kế hết kỳ này</th>
                </tr>
                <tr className="text-[10px]">
                  <th className="border border-slate-300 px-2 py-1">Khối lượng</th>
                  <th className="border border-slate-300 px-2 py-1">Đơn giá (đ)</th>
                  <th className="border border-slate-300 px-2 py-1">Thành tiền (đ)</th>
                  <th className="border border-slate-300 px-2 py-1">Khối lượng</th>
                  <th className="border border-slate-300 px-2 py-1">Thành tiền (đ)</th>
                  <th className="border border-slate-300 px-2 py-1">Khối lượng</th>
                  <th className="border border-slate-300 px-2 py-1">Thành tiền (đ)</th>
                  <th className="border border-slate-300 px-2 py-1">Khối lượng</th>
                  <th className="border border-slate-300 px-2 py-1">Thành tiền (đ)</th>
                </tr>
                <tr className="text-[9px] bg-slate-200 text-slate-600">
                  <th className="border border-slate-300 py-0.5">1</th>
                  <th className="border border-slate-300 py-0.5">2</th>
                  <th className="border border-slate-300 py-0.5">3</th>
                  <th className="border border-slate-300 py-0.5">4</th>
                  <th className="border border-slate-300 py-0.5">5</th>
                  <th className="border border-slate-300 py-0.5">6 = 4 x 5</th>
                  <th className="border border-slate-300 py-0.5">7</th>
                  <th className="border border-slate-300 py-0.5">8</th>
                  <th className="border border-slate-300 py-0.5">9</th>
                  <th className="border border-slate-300 py-0.5">10 = 9 x 5</th>
                  <th className="border border-slate-300 py-0.5">11 = 7 + 9</th>
                  <th className="border border-slate-300 py-0.5">12 = 8 + 10</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-2 py-1.5 text-center font-medium">{row.stt}</td>
                    <td className="border border-slate-300 px-2.5 py-1.5 font-medium text-slate-800">{row.name}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center text-slate-600">{row.unit}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right">{formatNumber(row.contractQty)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right">{formatNumber(row.unitPrice)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-semibold">{formatNumber(row.contractAmount)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right text-slate-600">{formatNumber(row.prevCumulativeQty)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right text-slate-600">{formatNumber(row.prevCumulativeAmount)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-semibold text-emerald-700 bg-emerald-50/40">{formatNumber(row.thisPeriodQty)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-bold text-emerald-700 bg-emerald-50/40">{formatNumber(row.thisPeriodAmount)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-semibold text-amber-800 bg-amber-50/30">{formatNumber(row.totalCumulativeQty)}</td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-bold text-amber-800 bg-amber-50/30">{formatNumber(row.totalCumulativeAmount)}</td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-400">
                  <td colSpan="3" className="border border-slate-300 px-3 py-2 text-center uppercase tracking-wide">
                    TỔNG CỘNG (VNĐ)
                  </td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-2 py-2 text-right">{formatNumber(totalContract)}</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-2 py-2 text-right">{formatNumber(totalPrev)}</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-2 py-2 text-right text-emerald-700">{formatNumber(totalThis)}</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-2 py-2 text-right text-amber-800">{formatNumber(totalCum)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bảng tổng hợp các chỉ tiêu chuẩn theo Nghị định 254/2025/NĐ-CP */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide">
                TỔNG HỢP CÁC CHỈ TIÊU THANH TOÁN (THEO NGHỊ ĐỊNH SỐ 254/2025/NĐ-CP)
              </h3>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Đợt {payment.stageNumber}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">I. Lũy kế giá trị khối lượng thực hiện đến hết kỳ này:</span>
                  <span className="font-bold text-slate-900">{formatVND(totalCum)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 pl-3 text-slate-600">
                  <span>- Lũy kế đến hết kỳ trước:</span>
                  <span>{formatVND(totalPrev)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 pl-3 text-slate-600">
                  <span>- Khối lượng hoàn thành phát sinh kỳ này:</span>
                  <span className="font-semibold text-slate-800">{formatVND(payment.workCompletedValue || totalThis)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-rose-700">
                  <span className="font-medium">II. Khấu trừ thu hồi tạm ứng kỳ này:</span>
                  <span className="font-bold">- {formatVND(advanceDeductedThisPeriod)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-amber-700">
                  <span className="font-medium">III. Khấu trừ giữ lại bảo hành ({contract?.retentionRate || 5}%):</span>
                  <span className="font-bold">- {formatVND(retentionThisPeriod)}</span>
                </div>
                {penaltyThisPeriod > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700">
                    <span className="font-medium">IV. Khấu trừ vi phạm / khác:</span>
                    <span className="font-bold">- {formatVND(penaltyThisPeriod)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between bg-emerald-50/70 p-4 rounded-lg border border-emerald-300">
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-600 block">
                    Cơ quan kiểm soát, thanh toán: Kho bạc Nhà nước
                  </span>
                  <span className="text-xs uppercase font-extrabold text-emerald-900 block mt-2">
                    SỐ TIỀN ĐỀ NGHỊ KHO BẠC THANH TOÁN KỲ NÀY:
                  </span>
                  <span className="text-2xl font-black text-emerald-700 mt-1 block">
                    {formatVND(netPayableAmount)}
                  </span>
                </div>

                <div className="pt-3 border-t border-emerald-200/80 text-[11px] text-slate-600 space-y-0.5">
                  <p>• Thanh toán thu hồi tạm ứng: <strong>{formatVND(advanceDeductedThisPeriod)}</strong></p>
                  <p>• Thanh toán khối lượng hoàn thành: <strong>{formatVND(netPayableAmount)}</strong></p>
                  <p className="italic text-slate-500 mt-1">
                    (Kê khai chuẩn theo Phụ lục Mẫu 03.a/TT Nghị định 254/2025/NĐ-CP)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Signature Block */}
          <div className="grid grid-cols-3 text-center text-xs pt-6 gap-4">
            <div className="space-y-16">
              <div>
                <p className="font-bold uppercase text-slate-800">ĐẠI DIỆN NHÀ THẦU</p>
                <p className="italic text-slate-500 text-[11px]">(Ký, ghi rõ họ tên và đóng dấu)</p>
              </div>
              <p className="font-semibold text-slate-700">{contract?.contractor}</p>
            </div>

            <div className="space-y-16">
              <div>
                <p className="font-bold uppercase text-slate-800">TƯ VẤN GIÁM SÁT TRƯỞNG</p>
                <p className="italic text-slate-500 text-[11px]">(Ký, ghi rõ họ tên và đóng dấu)</p>
              </div>
              <p className="font-semibold text-slate-700">Kỹ sư trưởng TVGS</p>
            </div>

            <div className="space-y-16">
              <div>
                <p className="font-bold uppercase text-slate-800">ĐẠI DIỆN CHỦ ĐẦU TƯ / BAN QLDA</p>
                <p className="italic text-slate-500 text-[11px]">(Ký, ghi rõ họ tên và đóng dấu)</p>
              </div>
              <p className="font-semibold text-slate-700">Giám đốc Ban QLDA</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}