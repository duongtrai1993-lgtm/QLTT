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
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">📋</span>
              Bảng Xác Định Giá Trị Khối Lượng Hoàn Thành (Mẫu số 03a)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ban hành kèm theo Nghị định số 99/2021/NĐ-CP ngày 11/11/2021 của Chính phủ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition"
              title="Xuất bảng tính đầy đủ sang Excel"
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
            <h1 className="text-base font-extrabold uppercase text-slate-900 tracking-wide">
              BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH
            </h1>
            <p className="text-xs font-semibold uppercase text-blue-800">
              {payment.title}
            </p>
            <p className="text-xs text-slate-500 italic">
              (Giai đoạn thi công từ ngày {formatDate(payment.periodFrom)} đến ngày {formatDate(payment.periodTo)})
            </p>
          </div>

          {/* Thông tin căn cứ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div><span className="font-semibold text-slate-700">• Tên dự án:</span> {project?.name}</div>
            <div><span className="font-semibold text-slate-700">• Chủ đầu tư:</span> {project?.owner}</div>
            <div><span className="font-semibold text-slate-700">• Nhà thầu thi công:</span> {contract?.contractor}</div>
            <div><span className="font-semibold text-slate-700">• Hình thức HĐ:</span> {contract?.contractType}</div>
            <div><span className="font-semibold text-slate-700">• Giá trị hợp đồng:</span> {formatVND(contract?.adjustedValue || contract?.originalValue)}</div>
            <div><span className="font-semibold text-slate-700">• Tỷ lệ tạm ứng theo HĐ:</span> {contract?.advanceRate}% (Đã tạm ứng: {formatVND(contract?.adjustedValue * (contract?.advanceRate / 100))})</div>
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

          {/* Bảng tổng hợp tính toán đề nghị thanh toán */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide border-b pb-1">
              TỔNG HỢP GIÁ TRỊ ĐỀ NGHỊ THANH TOÁN KỲ NÀY:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">1. Giá trị khối lượng hoàn thành kỳ này:</span>
                  <span className="font-bold text-slate-800">{formatVND(payment.workCompletedValue || totalThis)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">2. Khấu trừ thu hồi tạm ứng theo thỏa thuận:</span>
                  <span className="font-bold text-rose-600">- {formatVND(payment.advanceDeduction || 0)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">3. Khấu trừ giữ lại bảo hành ({contract?.retentionRate || 5}%):</span>
                  <span className="font-bold text-amber-700">- {formatVND(payment.retentionDeduction || 0)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">4. Khấu trừ vi phạm / khác:</span>
                  <span className="font-bold text-slate-600">- {formatVND(payment.penaltyDeduction || 0)}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-blue-50/70 p-4 rounded-lg border border-blue-200">
                <span className="text-xs uppercase font-extrabold text-blue-900">
                  5. SỐ TIỀN CHỦ ĐẦU TƯ THỰC THANH TOÁN KỲ NÀY:
                </span>
                <span className="text-2xl font-black text-blue-700 mt-1">
                  {formatVND(payment.requestedAmount)}
                </span>
                <p className="text-[11px] text-slate-500 italic mt-1">
                  (Bằng số tiền đã thẩm tra xác nhận trừ khấu trừ tạm ứng và bảo hành công trình)
                </p>
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