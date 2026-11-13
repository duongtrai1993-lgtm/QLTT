import React, { useState } from 'react';
import { X, Printer, FileSpreadsheet, CheckCircle2, Clock, UserCheck, ChevronRight, ShieldCheck, Download, Edit3, ArrowRight } from 'lucide-react';
import { formatVND, formatDate, numberToVietnameseWords } from '../services/storageService';

export function FormHoaBinhTrang1Modal({ isOpen, onClose, payment, contract, project, onNavigateToDetails }) {
  if (!isOpen || !payment) return null;

  // Dữ liệu tài chính 12 chỉ tiêu (chuẩn hóa theo schema Trang 1 Hòa Bình - Nam Khôi)
  const isNewtown = contract?.code?.includes('NEWTOWN') || payment?.contractNo?.includes('NEWTOWN') || payment?.title?.includes('13');

  // Giá trị mặc định hoặc lấy từ payment
  const indicators = {
    cum_accepted_val_1: payment?.cum_accepted_val_1 || payment?.workCompletedValue || 48950000000,
    prev_requested_val_2: payment?.prev_requested_val_2 || payment?.prevPaidValue || 37400000000,
    prev_deduct_material_3: payment?.prev_deduct_material_3 || 1850000000,
    prev_deduct_ppe_4: payment?.prev_deduct_ppe_4 || 180000000,
    prev_deduct_other_5: payment?.prev_deduct_other_5 || 125000000,
    prev_hold_6: payment?.prev_hold_6 || 1000000000,
    cum_retention_7: payment?.cum_retention_7 || 2447500000,
    cum_adv_recovery_8: payment?.cum_adv_recovery_8 || 0,
    cum_mat_adv_recovery_9: payment?.cum_mat_adv_recovery_9 || 0,
    // [12] Khấu trừ kỳ này
    curr_deduct_material_12a: payment?.curr_deduct_material_12a || 320000000,
    curr_deduct_ppe_12b: payment?.curr_deduct_ppe_12b || 45000000,
    curr_deduct_other_12c: payment?.curr_deduct_other_12c || 15000000,
    curr_hold_12d: payment?.curr_hold_12d || 100000000
  };

  // Tính toán chỉ tiêu [10], [11], [12] và Thực nhận
  const total_deducted_prev_10 = 
    indicators.prev_requested_val_2 +
    indicators.prev_deduct_material_3 +
    indicators.prev_deduct_ppe_4 +
    indicators.prev_deduct_other_5 +
    indicators.prev_hold_6 +
    indicators.cum_retention_7 +
    indicators.cum_adv_recovery_8 +
    indicators.cum_mat_adv_recovery_9;

  const curr_gross_payable_11 = Math.max(0, indicators.cum_accepted_val_1 - total_deducted_prev_10);

  const curr_total_deduct_12 = 
    indicators.curr_deduct_material_12a +
    indicators.curr_deduct_ppe_12b +
    indicators.curr_deduct_other_12c +
    indicators.curr_hold_12d;

  const net_payable = Math.max(0, curr_gross_payable_11 - curr_total_deduct_12);
  const wordsAmount = numberToVietnameseWords(net_payable);

  // 7 chữ ký thẩm định
  const approvalSignatures = [
    { step: 1, role: 'Đại diện Thầu phụ', org: 'Cty Nam Khôi', name: 'Trần Nam Khôi', status: 'APPROVED', time: '18/10/2026 14:30', note: 'Đã hoàn thành NT' },
    { step: 2, role: 'Kỹ sư Giám sát', org: 'Tập đoàn Hòa Bình', name: 'Nguyễn Văn Bình', status: 'APPROVED', time: '19/10/2026 09:15', note: 'Khối lượng khớp biên bản NT' },
    { step: 3, role: 'Chỉ huy trưởng CT', org: 'Tập đoàn Hòa Bình', name: 'Lê Hoàng Long', status: 'APPROVED', time: '19/10/2026 11:00', note: 'Tiến độ đạt yêu cầu' },
    { step: 4, role: 'Giám đốc Dự án', org: 'Tập đoàn Hòa Bình', name: 'Vũ Mạnh Cường', status: 'APPROVED', time: '19/10/2026 15:45', note: 'Đồng ý trình P.QLCP' },
    { step: 5, role: 'Phòng Quản lý Chi phí', org: 'QS Hòa Bình', name: 'Đỗ Thị Mai', status: 'APPROVED', time: '20/10/2026 10:20', note: 'Đơn giá & khấu trừ chính xác' },
    { step: 6, role: 'Ban Tổng Giám đốc', org: 'Tập đoàn Hòa Bình', name: 'Phó TGĐ Kỹ thuật', status: 'APPROVED', time: '20/10/2026 16:30', note: 'Phê duyệt thanh toán' },
    { step: 7, role: 'TP. Kế toán TT', org: 'Kế toán Hòa Bình', name: 'Phạm Thị Nga', status: 'PENDING', time: 'Đang lập UNC', note: 'Lập lệnh chi ngân hàng' },
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
            <span className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-sm">
              HB
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-wide text-white">
                  MẪU ĐỀ NGHỊ THANH TOÁN (TRANG 1) - TỔNG THẦU HÒA BÌNH
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Chuẩn 12 Chỉ Tiêu & 7 Chữ Ký
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hợp đồng: {contract?.code || '0103/NEWTOWN/NAMKHOI/2026'} • Dự án Newtown • Đợt 13
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToDetails && (
              <button
                onClick={onNavigateToDetails}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                <span>Xem Khối Lượng (Trang 2-5)</span>
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
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800">TẬP ĐOÀN XÂY DỰNG HÒA BÌNH</p>
                <p className="text-[11px] text-slate-600 font-semibold">BAN CHỈ HUY CÔNG TRƯỜNG DỰ ÁN NEWTOWN</p>
                <p className="text-[10px] text-slate-500 italic">Mã dự án: 2469E11000 • Đường Trường Sa, Q. Ngũ Hành Sơn, TP. Đà Nẵng</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="text-[11px] font-semibold underline underline-offset-2">Độc lập - Tự do - Hạnh phúc</p>
                <p className="text-[10px] text-slate-500 italic mt-1">Đà Nẵng, ngày 19 tháng 10 năm 2026</p>
              </div>
            </div>

            <div className="text-center mt-6">
              <h1 className="text-lg font-black uppercase tracking-wide text-slate-900">
                BẢNG TỔNG HỢP GIÁ TRỊ ĐỀ NGHỊ THANH TOÁN (TRANG 1)
              </h1>
              <p className="text-xs font-bold text-blue-800 uppercase mt-1">
                LẦN ỨNG THỨ: {payment?.stageNumber || 13} - KỲ NGHIỆM THU: {formatDate(payment?.periodFrom || '2026-09-01')} ĐẾN {formatDate(payment?.periodTo || '2026-09-30')}
              </p>
              <p className="text-[11px] text-slate-600 italic">
                (Kèm theo Bảng tính chi tiết khối lượng nghiệm thu Mẫu 03.a/TT - Trang 2 đến Trang 5)
              </p>
            </div>
          </div>

          {/* Căn cứ pháp lý & Thông tin hợp đồng */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-xs space-y-1.5 print:bg-transparent print:p-2 print:border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div>
                <span className="font-bold text-slate-700">Chủ đầu tư: </span>
                <span className="font-semibold text-slate-900">Công ty TNHH Phát triển Đô thị Newtown</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Tổng thầu chính: </span>
                <span className="font-semibold text-slate-900">Tập đoàn Xây dựng Hòa Bình (HBC)</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Đơn vị thầu phụ: </span>
                <span className="font-bold text-blue-900">CÔNG TY TNHH MTV XD VÀ TM NAM KHÔI (Mã NCC: TC000056)</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Số Hợp đồng: </span>
                <span className="font-bold text-slate-900">0103/NEWTOWN/NAMKHOI/2026 ký ngày 01/03/2026</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Phạm vi công việc: </span>
                <span className="text-slate-800">Thi công kết cấu bê tông cốt thép Tòa M1, M2</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Giá trị hợp đồng: </span>
                <span className="font-black text-slate-900">{formatVND(60168402240)} (VAT 8%, Bảo lưu 5%)</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200 mt-1">
                <span className="font-bold text-slate-700">Tài khoản thanh toán Nam Khôi: </span>
                <span className="font-mono font-bold text-slate-900">19036582910012</span> tại <span className="font-semibold">Techcombank - Chi nhánh Đà Nẵng</span>
              </div>
            </div>
          </div>

          {/* Bảng 12 Chỉ tiêu tài chính chi tiết */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead className="bg-slate-100 font-bold text-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="border border-slate-400 px-3 py-2 text-center w-12">Mục</th>
                  <th className="border border-slate-400 px-4 py-2 text-left">Nội Dung Chỉ Tiêu Tài Chính</th>
                  <th className="border border-slate-400 px-3 py-2 text-center w-28">Ký Hiệu / Công Thức</th>
                  <th className="border border-slate-400 px-4 py-2 text-right w-44">Giá Trị (VNĐ)</th>
                  <th className="border border-slate-400 px-3 py-2 text-left w-36">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-medium">
                
                {/* [1] */}
                <tr className="bg-blue-50/40 font-bold">
                  <td className="border border-slate-400 px-3 py-2 text-center text-blue-900">[1]</td>
                  <td className="border border-slate-400 px-4 py-2 text-blue-900">
                    LŨY KẾ GIÁ TRỊ NGHIỆM THU ĐẾN NAY (ĐÃ BAO GỒM VAT 8%)
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-center font-mono text-[11px]">[1]</td>
                  <td className="border border-slate-400 px-4 py-2 text-right font-black text-blue-900 text-sm">
                    {formatVND(indicators.cum_accepted_val_1)}
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-slate-600 text-[11px]">Trang 2-5 Mẫu 03.a</td>
                </tr>

                {/* Các khoản khấu trừ đến kỳ trước */}
                <tr className="bg-slate-100/70 font-semibold text-slate-700">
                  <td className="border border-slate-400 px-3 py-1.5 text-center italic" colSpan={3}>
                    A. Các khoản đã đề nghị & khấu trừ đến hết kỳ trước:
                  </td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-mono text-slate-600" colSpan={2}>
                    Chi tiết từ [2] đến [9]
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[2]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế đề nghị thanh toán các kỳ trước</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[2]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold">{formatVND(indicators.prev_requested_val_2)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Đợt 1 đến Đợt 12</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[3]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế trừ vật tư đến kỳ trước (thép, bê tông HBC cấp)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[3]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-rose-700">{formatVND(indicators.prev_deduct_material_3)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Vật tư Hòa Bình cấp</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[4]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế trừ bảo hộ lao động, an toàn, điện nước đến kỳ trước</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[4]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-rose-700">{formatVND(indicators.prev_deduct_ppe_4)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">An toàn & BHLĐ</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[5]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế trừ khác đến kỳ trước (vệ sinh, cẩu tháp, phạt lỗi)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[5]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-rose-700">{formatVND(indicators.prev_deduct_other_5)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Khấu trừ khác</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[6]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế tạm giữ đến kỳ trước (chờ nghiệm thu mẫu, hồ sơ KCS)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[6]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right text-amber-700">{formatVND(indicators.prev_hold_6)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Tạm giữ kỹ thuật</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[7]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế 5% tiền bảo lưu chất lượng công trình đến nay</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[7] = 5% x [1]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-bold text-amber-800">{formatVND(indicators.cum_retention_7)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">5% BH công trình</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[8]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế thu hồi tiền tạm ứng Hợp đồng</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[8]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right">{formatVND(indicators.cum_adv_recovery_8)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Tạm ứng ban đầu 0%</td>
                </tr>

                <tr>
                  <td className="border border-slate-400 px-3 py-1.5 text-center">[9]</td>
                  <td className="border border-slate-400 px-4 py-1.5 pl-6">Lũy kế thu hồi tạm ứng vật tư</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono">[9]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right">{formatVND(indicators.cum_mat_adv_recovery_9)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Không có</td>
                </tr>

                {/* [10] */}
                <tr className="bg-slate-100 font-bold">
                  <td className="border border-slate-400 px-3 py-2 text-center text-slate-900">[10]</td>
                  <td className="border border-slate-400 px-4 py-2 text-slate-900">
                    TỔNG CỘNG CÁC KHOẢN KHẤU TRỪ ĐẾN KỲ TRƯỚC
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-center font-mono text-[11px]">[10] = ∑([2]..[9])</td>
                  <td className="border border-slate-400 px-4 py-2 text-right font-black text-slate-900">
                    {formatVND(total_deducted_prev_10)}
                  </td>
                  <td className="border border-slate-400 px-3 py-2 text-slate-600 text-[11px]">Cộng dồn</td>
                </tr>

                {/* [11] */}
                <tr className="bg-blue-100/50 font-bold">
                  <td className="border border-slate-400 px-3 py-2.5 text-center text-blue-900 font-extrabold">[11]</td>
                  <td className="border border-slate-400 px-4 py-2.5 text-blue-950 font-bold">
                    GIÁ TRỊ ĐỀ NGHỊ THANH TOÁN KỲ NÀY (TRƯỚC KHẤU TRỪ KỲ NÀY)
                  </td>
                  <td className="border border-slate-400 px-3 py-2.5 text-center font-mono text-[11px] text-blue-900">[11] = [1] - [10]</td>
                  <td className="border border-slate-400 px-4 py-2.5 text-right font-black text-blue-900 text-sm">
                    {formatVND(curr_gross_payable_11)}
                  </td>
                  <td className="border border-slate-400 px-3 py-2.5 text-blue-800 font-semibold text-[11px]">Đợt 13</td>
                </tr>

                {/* [12] */}
                <tr className="bg-rose-50/40">
                  <td className="border border-slate-400 px-3 py-2 text-center font-bold text-rose-900" rowSpan={5}>[12]</td>
                  <td className="border border-slate-400 px-4 py-2 font-bold text-rose-900" colSpan={4}>
                    CÁC KHOẢN GIẢM TRỪ / TẠM GIỮ TRONG KỲ NÀY:
                  </td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12a. Trừ tiền vật tư Hòa Bình cấp trong kỳ này (thép, bê tông thương phẩm)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12a]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-rose-700">{formatVND(indicators.curr_deduct_material_12a)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Theo đối chiếu kho</td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12b. Trừ chi phí an toàn, bảo hộ lao động, điện nước thi công</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12b]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-rose-700">{formatVND(indicators.curr_deduct_ppe_12b)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">BHLĐ & điện nước</td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12c. Trừ các khoản khác (vệ sinh công nghiệp, phạt vi phạm)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12c]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-rose-700">{formatVND(indicators.curr_deduct_other_12c)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Biên bản phạt</td>
                </tr>

                <tr className="bg-white">
                  <td className="border border-slate-400 px-4 py-1.5 pl-6 text-slate-700">12d. Tiền tạm giữ kỹ thuật kỳ này (chờ nộp chứng chỉ KCS cốt thép)</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-center font-mono text-[11px]">[12d]</td>
                  <td className="border border-slate-400 px-4 py-1.5 text-right font-semibold text-amber-700">{formatVND(indicators.curr_hold_12d)}</td>
                  <td className="border border-slate-400 px-3 py-1.5 text-slate-500 text-[11px]">Tạm giữ Đợt 13</td>
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

                {/* THỰC NHẬN KỲ NÀY */}
                <tr className="bg-emerald-100/70 border-2 border-emerald-600 font-black text-slate-900 text-sm">
                  <td className="border border-emerald-600 px-3 py-3 text-center text-emerald-950 font-black">★</td>
                  <td className="border border-emerald-600 px-4 py-3 text-emerald-950 uppercase tracking-wide">
                    SỐ TIỀN THỰC THANH TOÁN KỲ NÀY CHO NHÀ THẦU PHỤ (CHUYỂN KHOẢN)
                  </td>
                  <td className="border border-emerald-600 px-3 py-3 text-center font-mono text-xs text-emerald-900">
                    = [11] - [12]
                  </td>
                  <td className="border border-emerald-600 px-4 py-3 text-right text-emerald-900 text-base font-black">
                    {formatVND(net_payable)}
                  </td>
                  <td className="border border-emerald-600 px-3 py-3 text-emerald-950 text-xs font-bold">
                    Thực nhận kỳ này
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Số tiền bằng chữ */}
          <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg mb-8 text-xs font-medium">
            <span className="font-bold text-slate-800">Số tiền bằng chữ: </span>
            <span className="italic font-bold text-blue-900">{wordsAmount}</span>
          </div>

          {/* 7 Chữ ký Phê duyệt (payment_approvals) */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800 text-center mb-4">
              LƯU ĐỒ PHÊ DUYỆT THANH TOÁN (QUY TRÌNH 7 BƯỚC TẬP ĐOÀN XÂY DỰNG HÒA BÌNH)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
              {approvalSignatures.map((sig) => (
                <div key={sig.step} className="border border-slate-300 rounded-lg p-2.5 flex flex-col justify-between bg-slate-50/50 min-h-[140px]">
                  <div>
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] mb-1">
                      {sig.step}
                    </span>
                    <p className="font-bold text-slate-800 uppercase leading-tight">{sig.role}</p>
                    <p className="text-[9px] text-slate-500 italic mb-2">{sig.org}</p>
                  </div>

                  <div className="my-1">
                    {sig.status === 'APPROVED' ? (
                      <div className="text-emerald-600 font-bold flex flex-col items-center">
                        <CheckCircle2 className="w-4 h-4 mb-0.5" />
                        <span className="text-[9px] uppercase tracking-wide bg-emerald-100 px-1.5 py-0.2 rounded">Đã ký duyệt</span>
                      </div>
                    ) : (
                      <div className="text-amber-600 font-bold flex flex-col items-center">
                        <Clock className="w-4 h-4 mb-0.5" />
                        <span className="text-[9px] uppercase tracking-wide bg-amber-100 px-1.5 py-0.2 rounded">Đang xử lý</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-1 mt-1">
                    <p className="font-bold text-slate-900 truncate">{sig.name}</p>
                    <p className="text-[8px] text-slate-400">{sig.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ghi chú chân trang */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between italic">
            <span>Chứng từ kèm theo: Bảng nghiệm thu khối lượng chi tiết (Trang 2-5), Biên bản bàn giao, Nhật ký thi công.</span>
            <span>Hệ thống QLTT • Lưu hành nội bộ Hòa Bình & Nam Khôi</span>
          </div>

        </div>

      </div>

    </div>
  );
}
