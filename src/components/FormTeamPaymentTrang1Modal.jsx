import React from 'react';
import { X, Printer, FileSpreadsheet, CheckCircle2, Clock, UserCheck, ChevronRight, ShieldCheck, Download, Edit3, ArrowRight } from 'lucide-react';
import { formatVND, formatDate, numberToVietnameseWords } from '../services/storageService';

export function FormTeamPaymentTrang1Modal({ isOpen, onClose, teamPayment, onNavigateToDetails }) {
  if (!isOpen || !teamPayment) return null;

  // 12 chỉ tiêu tài chính chuẩn theo schema Bảng 9
  const cum_accepted_val_1 = Number(teamPayment.cum_accepted_val || 0);
  const prev_paid_val_2 = Number(teamPayment.prev_paid_val || 0);
  const prev_deduct_mat_3 = Number(teamPayment.prev_deduct_mat || 0);
  const prev_deduct_ppe_4 = Number(teamPayment.prev_deduct_ppe || 0);
  const prev_deduct_penalty_5 = Number(teamPayment.prev_deduct_penalty || 0);
  const prev_hold_amount_6 = Number(teamPayment.prev_hold_amount || 0);
  const cum_retention_7 = Number(teamPayment.cum_retention || 0);
  const cum_cash_advance_8 = Number(teamPayment.cum_cash_advance || 0);

  // Tổng cộng khấu trừ đến kỳ trước [10]
  const total_deducted_prev_10 = 
    prev_paid_val_2 +
    prev_deduct_mat_3 +
    prev_deduct_ppe_4 +
    prev_deduct_penalty_5 +
    prev_hold_amount_6 +
    cum_retention_7 +
    cum_cash_advance_8;

  // Đề nghị thanh toán kỳ này trước khấu trừ [11]
  const curr_gross_payable_11 = Math.max(0, cum_accepted_val_1 - total_deducted_prev_10);

  // Khấu trừ kỳ này [12]
  const curr_deduct_mat_12a = Number(teamPayment.curr_deduct_mat || 0);
  const curr_deduct_ppe_12b = Number(teamPayment.curr_deduct_ppe || 0);
  const curr_deduct_penalty_12c = Number(teamPayment.curr_deduct_penalty || 0);
  const curr_hold_amount_12d = Number(teamPayment.curr_hold_amount || 0);

  const curr_total_deduct_12 = 
    curr_deduct_mat_12a +
    curr_deduct_ppe_12b +
    curr_deduct_penalty_12c +
    curr_hold_amount_12d;

  const net_payable = Number(teamPayment.net_payable || (curr_gross_payable_11 - curr_total_deduct_12));
  const wordsAmount = teamPayment.amount_in_words || numberToVietnameseWords(net_payable);

  // 5 chữ ký nội bộ phê duyệt
  const approvals = [
    { step: 1, role: 'Đội Trưởng Tổ Đội', org: teamPayment.team_name, name: teamPayment.leader_name || 'Đội trưởng', status: 'APPROVED', time: '18/10/2026' },
    { step: 2, role: 'Kỹ Thuật Hiện Trường', org: 'BCH Nam Khôi', name: 'Nguyễn Văn Minh', status: 'APPROVED', time: '19/10/2026' },
    { step: 3, role: 'Kỹ Sư QS Chi Phí', org: 'Phòng QLCP Nam Khôi', name: 'Lê Thùy Dung', status: 'APPROVED', time: '19/10/2026' },
    { step: 4, role: 'Chỉ Huy Trưởng CT', org: 'BCH Dự án Newtown', name: 'Trần Văn Mạnh', status: 'APPROVED', time: '20/10/2026' },
    { step: 5, role: 'Giám Đốc Cty Nam Khôi', org: 'Ban Lãnh Đạo', name: 'Trần Nam Khôi', status: 'APPROVED', time: '20/10/2026' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-2 md:p-6">
      
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col overflow-hidden my-auto border border-slate-200">
        
        {/* Header Toolbar (Ẩn khi in) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-sm">
              TĐ
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-wide text-white">
                  ĐỀ NGHỊ THANH TOÁN TỔ ĐỘI (BƯỚC 3 - TRANG 1)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {teamPayment.team_pay_id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {teamPayment.team_name} • Đội trưởng: {teamPayment.leader_name} • Lần TT thứ {teamPayment.period_no}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToDetails && (
              <button
                onClick={onNavigateToDetails}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                <span>Xem Khối Lượng (Bước 1 & 2)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition border border-slate-700"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>In Văn Bản (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content (A4 Portrait Style) */}
        <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] bg-white text-slate-900 font-sans print:p-0 print:max-h-none print:overflow-visible">
          
          {/* Header Quốc hiệu & Thông tin 2 bên */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  CÔNG TY TNHH MTV XD VÀ TM NAM KHÔI
                </p>
                <p className="text-[11px] text-slate-700 font-semibold">BAN CHỈ HUY CÔNG TRƯỜNG DỰ ÁN NEWTOWN</p>
                <p className="text-[10px] text-slate-500 italic">Mã dự án: 2469E11000 • Đường Trường Sa, Q. Ngũ Hành Sơn, Đà Nẵng</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="text-[11px] font-semibold underline underline-offset-2">Độc lập - Tự do - Hạnh phúc</p>
                <p className="text-[10px] text-slate-500 italic mt-1">Đà Nẵng, ngày 19 tháng 10 năm 2026</p>
              </div>
            </div>

            <div className="text-center mt-6">
              <h1 className="text-lg font-black uppercase tracking-wide text-slate-900">
                BẢNG TỔNG HỢP GIÁ TRỊ ĐỀ NGHỊ THANH TOÁN TỔ ĐỘI (TRANG 1)
              </h1>
              <p className="text-xs font-bold text-indigo-900 uppercase mt-1">
                LẦN THANH TOÁN THỨ: {teamPayment.period_no} • KỲ NGHIỆM THU: {formatDate(teamPayment.from_date)} ĐẾN {formatDate(teamPayment.to_date)}
              </p>
              <p className="text-[11px] text-slate-600 italic">
                (Kèm theo Bảng Tổng hợp Khối lượng & Giá trị hoàn thành Bước 1 & Bước 2)
              </p>
            </div>
          </div>

          {/* Thông tin giao khoán */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-xs space-y-1.5 print:bg-transparent print:p-2 print:border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div>
                <span className="font-bold text-slate-700">Đơn vị giao khoán: </span>
                <span className="font-semibold text-slate-900">Công ty TNHH MTV XD và TM Nam Khôi</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Tổ đội nhận khoán: </span>
                <span className="font-bold text-indigo-900">{teamPayment.team_name}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Đội trưởng phụ trách: </span>
                <span className="font-semibold text-slate-900">{teamPayment.leader_name}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Mã đợt thanh toán: </span>
                <span className="font-mono font-bold text-slate-900">{teamPayment.team_pay_id}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Hạng mục công việc: </span>
                <span className="text-slate-800">Giao khoán nhân công kết cấu Tòa M1, M2</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Đợt đối soát với Hòa Bình: </span>
                <span className="font-semibold text-slate-900">Đợt 13 (Mã: {teamPayment.payment_id})</span>
              </div>
            </div>
          </div>

          {/* Bảng 12 Chỉ tiêu tài chính y hệt Trang 1 Thầu phụ */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead className="bg-slate-100 font-bold text-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="border border-slate-400 px-3 py-2 text-center w-12">Mục</th>
                  <th className="border border-slate-400 px-4 py-2 text-left">Nội Dung Chỉ Tiêu Tài Chính (Tổ Đội)</th>
                  <th className="border border-slate-400 px-3 py-2 text-center w-28">Ký Hiệu / Công Thức</th>
                  <th className="border border-slate-400 px-4 py-2 text-right w-44">Giá Trị (VNĐ)</th>
                  <th className="border border-slate-400 px-3 py-2 text-left w-36">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-medium">
                
                {/* [1] */}
                <tr className="bg-indigo-50/50 font-bold">
                  <td className="border border-slate-400 px-3 py-2 text-center text-indigo-900">[1]</td>
                  <td className="border border-slate-400 px-4 py-2 text-indigo-900">
                    LŨY KẾ GIÁ TRỊ NGHIỆM THU ĐẾN NAY (THEO ĐƠN GIÁ GIAO KHOÁN)
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-center font-mono text-[11px]">[1]</td>
                  <td className="border border-slate-400 px-4 py-2 text-right font-black text-indigo-900 text-sm">
                    {formatVND(cum_accepted_val_1)}
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-slate-600 text-[11px]">Tổng hợp Bước 2</td>
                </tr>

                {/* Các khoản khấu trừ đến kỳ trước */}
                <tr className="bg-slate-100/70 font-semibold text-slate-700">
                  <td className="border border-slate-400 px-3 py-1.5 text-center italic" colSpan={3}>
                    A. Các khoản đã đề nghị & khấu trừ đến hết kỳ trước:
                  </td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-mono text-slate-600" colSpan={2}>
                    Chi tiết từ [2] đến [8]
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[2]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế đề nghị thanh toán các kỳ trước</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[2]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold">{formatVND(prev_paid_val_2)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Đợt 1 đến Đợt 12</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[3]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế trừ vật tư đến kỳ trước (que hàn, đá mài, nilon...)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[3]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-rose-700">{formatVND(prev_deduct_mat_3)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Vật tư phụ cấp</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[4]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế trừ bảo hộ lao động đến kỳ trước</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[4]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-rose-700">{formatVND(prev_deduct_ppe_4)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Đồng phục & mũ/ủng</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[5]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế trừ phạt ATLĐ/kỹ thuật kỳ trước</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[5]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-rose-700">{formatVND(prev_deduct_penalty_5)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Biên bản an toàn</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[6]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế tạm giữ đến kỳ trước (chờ sửa lỗi KCS)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[6]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-amber-700">{formatVND(prev_hold_amount_6)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Tạm giữ chất lượng</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[7]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế 5% bảo lưu chất lượng công trình đến nay</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[7] = 5% x [1]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-bold text-amber-800">{formatVND(cum_retention_7)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">5% bảo hành khoán</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[8]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế tạm ứng tiền mặt / lương tuần cho tổ</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[8]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-rose-800">{formatVND(cum_cash_advance_8)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Sổ tạm ứng tuần</td>
                </tr>

                {/* [10] */}
                <tr className="bg-slate-100 font-bold">
                  <td className="border border-slate-400 px-3 py-2 text-center text-slate-900">[10]</td>
                  <td className="border border-slate-400 px-4 py-2 text-slate-900">
                    TỔNG CỘNG CÁC KHOẢN KHẤU TRỪ ĐẾN KỲ TRƯỚC
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-center font-mono text-[11px]">[10] = ∑([2]..[8])</td>
                  <td className="border border-slate-400 px-4 py-2 text-right font-black text-slate-900">
                    {formatVND(total_deducted_prev_10)}
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-slate-600 text-[11px]">Cộng dồn</td>
                </tr>

                {/* [11] */}
                <tr className="bg-indigo-100/50 font-bold">
                  <td className="border border-slate-400 px-3 py-2.5 text-center text-indigo-900 font-extrabold">[11]</td>
                  <td className="border border-slate-400 px-4 py-2.5 text-indigo-950 font-bold">
                    GIÁ TRỊ ĐỀ NGHỊ THANH TOÁN KỲ NÀY (TRƯỚC KHẤU TRỪ KỲ NÀY)
                  </td>
                  <td className="border border-slate-400 px-3 py-2.5 text-center font-mono text-[11px] text-indigo-900">[11] = [1] - [10]</td>
                  <td className="border border-slate-400 px-4 py-2.5 text-right font-black text-indigo-900 text-sm">
                    {formatVND(curr_gross_payable_11)}
                  </td>
                  <td className="border border-slate-400 px-3 py-2.5 text-indigo-800 font-semibold text-[11px]">Kỳ 13</td>
                </tr>

                {/* [12] */}
                <tr className="bg-rose-50/40">
                  <td className="border border-slate-400 px-3 py-2 text-center font-bold text-rose-900" rowSpan={5}>[12]</td>
                  <td className="border border-slate-400 px-4 py-2 font-bold text-rose-900" colSpan={4}>
                    CÁC KHOẢN GIẢM TRỪ / TẠM GIỮ TRONG KỲ NÀY:
                  </td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12a. Trừ vật tư phụ Nam Khôi cấp kỳ này</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12a]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-rose-700">{formatVND(curr_deduct_mat_12a)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Đối chiếu kho</td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12b. Trừ tiền mua BHLĐ / trang phục kỳ này</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12b]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-rose-700">{formatVND(curr_deduct_ppe_12b)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Cấp phát đợt 13</td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12c. Trừ phạt vi phạm an toàn lao động kỳ này</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12c]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-rose-700">{formatVND(curr_deduct_penalty_12c)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Biên bản hiện trường</td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12d. Tiền tạm giữ kỹ thuật kỳ này</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12d]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-amber-700">{formatVND(curr_hold_amount_12d)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Chờ hoàn thiện mối nối</td>
                </tr>

                <tr className="bg-rose-100/60 font-bold">
                  <td className="border border-slate-400 px-3 py-2 text-center text-rose-900 font-extrabold">[12]</td>
                  <td className="border border-slate-400 px-4 py-2 text-rose-950">
                    TỔNG CỘNG CÁC KHOẢN GIẢM TRỪ KỲ NÀY
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-center font-mono text-[11px] text-rose-900">[12] = ∑(12a..12d)</td>
                  <td className="border border-slate-400 px-4 py-2 text-right font-black text-rose-800 text-sm">
                    {formatVND(curr_total_deduct_12)}
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-rose-900 font-semibold text-[11px]">Khấu trừ kỳ 13</td>
                </tr>

                {/* THỰC THANH TOÁN KỲ NÀY */}
                <tr className="bg-emerald-100/70 border-2 border-emerald-600 font-black text-slate-900 text-sm">
                  <td className="border border-emerald-600 px-3 py-3 text-center text-emerald-950 font-black">★</td>
                  <td className="border border-emerald-600 px-4 py-3 text-emerald-950 uppercase tracking-wide">
                    SỐ TIỀN THỰC THANH TOÁN KỲ NÀY CHO TỔ ĐỘI THI CÔNG
                  </td>
                  <td className="border border-emerald-600 px-3 py-3 text-center font-mono text-xs text-emerald-900">
                    = [11] - [12]
                  </td>
                  <td className="border border-emerald-600 px-4 py-3 text-right text-emerald-900 text-base font-black">
                    {formatVND(net_payable)}
                  </td>
                  <td className="border border-emerald-600 px-3 py-3 text-emerald-950 text-xs font-bold">
                    Thực lĩnh
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Số tiền bằng chữ */}
          <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg mb-8 text-xs font-medium">
            <span className="font-bold text-slate-800">Số tiền bằng chữ: </span>
            <span className="italic font-bold text-indigo-900">{wordsAmount}</span>
          </div>

          {/* 5 Chữ ký Phê duyệt nội bộ Nam Khôi */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800 text-center mb-4">
              LƯU ĐỒ PHÊ DUYỆT THANH TOÁN TỔ ĐỘI (CÔNG TY NAM KHÔI)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-[10px]">
              {approvals.map((sig) => (
                <div key={sig.step} className="border border-slate-300 rounded-lg p-2.5 flex flex-col justify-between bg-slate-50/50 min-h-[140px]">
                  <div>
                    <span className="inline-block w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[9px] mb-1">
                      {sig.step}
                    </span>
                    <p className="font-bold text-slate-800 uppercase leading-tight">{sig.role}</p>
                    <p className="text-[9px] text-slate-500 italic mb-2">{sig.org}</p>
                  </div>

                  <div className="my-1">
                    <div className="text-emerald-600 font-bold flex flex-col items-center">
                      <CheckCircle2 className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] uppercase tracking-wide bg-emerald-100 px-1.5 py-0.2 rounded">Đã ký duyệt</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-1 mt-1">
                    <p className="font-bold text-slate-900 truncate">{sig.name}</p>
                    <p className="text-[8px] text-slate-400">{sig.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chân trang */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between italic">
            <span>Chứng từ kèm theo: Bảng nghiệm thu khối lượng & giá trị Bước 1 & Bước 2, Nhật ký ứng tiền tuần.</span>
            <span>Hệ thống QLTT • Lưu hành nội bộ BCH Nam Khôi</span>
          </div>

        </div>

      </div>

    </div>
  );
}
