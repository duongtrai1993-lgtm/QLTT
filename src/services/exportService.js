import * as XLSX from 'xlsx';
import { formatVND, formatNumber, formatDate, numberToVietnameseWords } from './storageService';

export const exportService = {
  // Xuất Bảng xác định giá trị khối lượng hoàn thành Mẫu 03.a/TT chuẩn 100% Nghị định 254/2025/NĐ-CP
  exportForm03aExcel(project, contract, payment, sections = []) {
    const wb = XLSX.utils.book_new();

    const headers = [
      ["BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH"],
      ["(Căn cứ theo Nghị định 254/2025/NĐ-CP ngày 26/9/2025 của Chính Phủ - Phụ lục 03.a/TT)"],
      [`CÔNG TRÌNH: ${contract?.packageName || project?.name || ''}`],
      ["HẠNG MỤC: Hạng mục 1"],
      [],
      [`Tên dự án: ${project?.name || ''}`],
      [`Mã dự án: ${project?.code || ''}`],
      [`Căn cứ Bảng thông tin của Hợp đồng số: ${contract?.code || ''} ngày ${formatDate(contract?.signDate)}`],
      [`Căn cứ Bảng thông tin Dự toán số: DT-${project?.code || '01'}`],
      [`Chủ đầu tư: ${project?.owner || ''}`],
      [`Nhà thầu (đơn vị thực hiện trong trường hợp thực hiện không thông qua hợp đồng): ${contract?.contractor || ''}`],
      [`Thanh toán lần thứ: ${payment?.stageNumber || 1}`],
      [`Căn cứ Biên bản nghiệm thu số 0${payment?.stageNumber || 1}/NT-GĐ/2026 ngày ${formatDate(new Date())}`],
      [],
      [
        "STT",
        "Mã hiệu công việc",
        "Chỉ tiêu",
        "Đơn vị tính",
        "KL theo hợp đồng/dự toán",
        "KLHT chưa thanh toán đến hết kỳ trước",
        "KLHT đã thanh toán đến hết kỳ trước",
        "KLHT nghiệm thu trong kỳ này",
        "KLHT lũy kế đến hết kỳ này",
        "KLHT đề nghị thanh toán kỳ này",
        "Đơn giá theo hợp đồng (VNĐ)",
        "Đơn giá bổ sung (VNĐ)",
        "Giá trị hợp đồng/dự toán (VNĐ)",
        "Giá trị KLHT chưa thanh toán đến hết kỳ trước (VNĐ)",
        "Giá trị KLHT nghiệm thu trong kỳ này (VNĐ)",
        "Giá trị KLHT đề nghị thanh toán kỳ này (VNĐ)",
        "Giá trị KLHT chưa thanh toán đến hết kỳ này (VNĐ)",
        "Lũy kế giá trị KLHT đã thanh toán đến hết kỳ trước (VNĐ)",
        "Lũy kế giá trị KLHT đã thanh toán đến hết kỳ này (VNĐ)",
        "Ghi chú"
      ]
    ];

    const dataRows = [];
    let grandContractVal = 0;
    let grandPrevUnpaidVal = 0;
    let grandThisAcceptedVal = 0;
    let grandThisRequestedVal = 0;
    let grandThisUnpaidVal = 0;
    let grandPrevPaidVal = 0;
    let grandPaidToDateVal = 0;

    sections.forEach(sec => {
      // Section header
      dataRows.push([
        sec.sectionCode,
        "",
        sec.sectionName.toUpperCase(),
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
      ]);

      sec.items.forEach(it => {
        grandContractVal += Number(it.contractVal) || 0;
        grandPrevUnpaidVal += Number(it.prevUnpaidVal) || 0;
        grandThisAcceptedVal += Number(it.thisPeriodAcceptedVal) || 0;
        grandThisRequestedVal += Number(it.thisPeriodRequestedVal) || 0;
        grandThisUnpaidVal += Number(it.thisPeriodUnpaidVal) || 0;
        grandPrevPaidVal += Number(it.prevPaidVal) || 0;
        grandPaidToDateVal += Number(it.totalPaidToDateVal) || 0;

        dataRows.push([
          it.stt,
          it.jobCode,
          it.name,
          it.unit,
          it.contractQty,
          it.prevUnpaidQty,
          it.prevPaidQty,
          it.thisPeriodAcceptedQty,
          it.totalCumulativeQty,
          it.thisPeriodRequestedQty,
          it.unitPriceContract,
          it.unitPriceAdditional,
          it.contractVal,
          it.prevUnpaidVal,
          it.thisPeriodAcceptedVal,
          it.thisPeriodRequestedVal,
          it.thisPeriodUnpaidVal,
          it.prevPaidVal,
          it.totalPaidToDateVal,
          it.note || ""
        ]);
      });
    });

    // Total row
    const totalRow = [
      "",
      "",
      "TỔNG SỐ:",
      "",
      "", "", "", "", "", "", "", "",
      grandContractVal,
      grandPrevUnpaidVal,
      grandThisAcceptedVal,
      grandThisRequestedVal,
      grandThisUnpaidVal,
      grandPrevPaidVal,
      grandPaidToDateVal,
      ""
    ];

    // Tính toán số liệu theo 6 mục
    const advanceRate = contract?.advanceRate || 20;
    const totalAdvanceOriginally = Math.round(grandContractVal * (advanceRate / 100));
    const advanceRemainingPrev = Math.max(0, totalAdvanceOriginally - Math.round(grandPrevPaidVal * 0.2));
    const advanceRecoveryThisPeriod = Number(payment?.advanceDeduction || Math.round(grandThisRequestedVal * 0.2));
    const retentionThisPeriod = Number(payment?.retentionDeduction || Math.round(grandThisRequestedVal * 0.05));
    const totalDisbursementRequestedThisPeriod = Number(payment?.requestedAmount || (grandThisRequestedVal - advanceRecoveryThisPeriod));
    const wordsAmount = numberToVietnameseWords(totalDisbursementRequestedThisPeriod);

    const summaryRows = [
      [],
      ["1. Giá trị tạm ứng còn lại chưa thu hồi đến hết kỳ trước:", advanceRemainingPrev],
      ["2. Số tiền đã thanh toán khối lượng hoàn thành đến hết kỳ trước:", grandPrevPaidVal],
      ["   2.1. Thanh toán cho nhà thầu:", Math.round(grandPrevPaidVal * 0.95)],
      ["   2.2. Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình):", Math.round(grandPrevPaidVal * 0.05)],
      ["   2.3. Chuyển vào tài khoản tạm giữ chờ quyết toán:", 0],
      ["3. Luỹ kế giá trị khối lượng thực hiện đến hết kỳ này:", grandPrevPaidVal + grandThisAcceptedVal],
      ["4. Thanh toán để thu hồi tạm ứng:", advanceRecoveryThisPeriod],
      [`5. Giá trị đề nghị giải ngân kỳ này: ${formatVND(totalDisbursementRequestedThisPeriod)} Số tiền bằng chữ: ${wordsAmount} (là số tiền đề nghị giải ngân kỳ này), trong đó:`],
      ["   - Tạm ứng:", 0],
      ["   - Thanh toán khối lượng hoàn thành:", totalDisbursementRequestedThisPeriod],
      ["     + Thanh toán cho nhà thầu:", Math.max(0, grandThisRequestedVal - advanceRecoveryThisPeriod - retentionThisPeriod)],
      ["     + Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình):", retentionThisPeriod],
      ["     + Chuyển vào tài khoản tạm giữ chờ quyết toán:", 0],
      ["6. Luỹ kế giá trị giải ngân: (trong đó):", totalAdvanceOriginally + grandPrevPaidVal + totalDisbursementRequestedThisPeriod],
      ["   6.1. Tạm ứng:", totalAdvanceOriginally],
      ["   6.2. Thanh toán khối lượng hoàn thành:", grandPrevPaidVal + totalDisbursementRequestedThisPeriod],
      ["      - Thanh toán cho nhà thầu:", Math.round((grandPrevPaidVal + totalDisbursementRequestedThisPeriod) * 0.95)],
      ["      - Tiền bảo hành công trình (trong trường hợp không bảo lãnh bảo hành công trình):", Math.round((grandPrevPaidVal + totalDisbursementRequestedThisPeriod) * 0.05)],
      ["      - Chuyển vào tài khoản tạm giữ chờ quyết toán:", 0],
      [],
      ["", "", "ĐẠI DIỆN NHÀ THẦU (ĐƠN VỊ THỰC HIỆN)", "", "", "", "", "", "", "", "", "", "", "", "CHỦ ĐẦU TƯ/BAN QUẢN LÝ DỰ ÁN/ĐƠN VỊ TỔ CHỨC BỒI THƯỜNG"],
      ["", "", "(Ký, ghi rõ họ tên, chức vụ, đóng dấu)", "", "", "", "", "", "", "", "", "", "", "", "(Ký, ghi rõ họ tên và đóng dấu)"]
    ];

    const fullSheetData = [...headers, ...dataRows, totalRow, ...summaryRows];

    const ws = XLSX.utils.aoa_to_sheet(fullSheetData);

    ws['!cols'] = [
      { wch: 6 },  // STT
      { wch: 12 }, // Mã hiệu
      { wch: 40 }, // Chỉ tiêu
      { wch: 8 },  // ĐVT
      { wch: 14 }, // KL HĐ
      { wch: 14 }, // KL chưa TT kỳ trước
      { wch: 14 }, // KL đã TT kỳ trước
      { wch: 14 }, // KL nghiệm thu kỳ này
      { wch: 14 }, // KL lũy kế
      { wch: 14 }, // KL đề nghị TT
      { wch: 15 }, // Đơn giá HĐ
      { wch: 15 }, // Đơn giá BS
      { wch: 20 }, // Giá trị HĐ
      { wch: 20 }, // Giá trị chưa TT trước
      { wch: 20 }, // Giá trị NT kỳ này
      { wch: 20 }, // Giá trị đề nghị TT kỳ này
      { wch: 20 }, // Giá trị chưa TT kỳ này
      { wch: 20 }, // Lũy kế đã TT trước
      { wch: 20 }, // Lũy kế đã TT kỳ này
      { wch: 15 }  // Ghi chú
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Phu_luc_03a_TT_ND254");

    const fileName = `Phu_luc_03a_TT_ND254_${contract?.code || 'HD'}_Dot_${payment?.stageNumber || 1}.xlsx`;
    XLSX.writeFile(wb, fileName);
  },

  // Sao lưu toàn bộ dữ liệu ra file JSON
  exportBackupJSON(projects, contracts, payments, documents) {
    const backupData = {
      version: '2.5',
      legalFramework: 'Nghị định 254/2025/NĐ-CP - Phụ lục 03.a/TT',
      exportedAt: new Date().toISOString(),
      projects,
      contracts,
      payments,
      documents
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `QLTT_Backup_PhuLuc03a_ND254_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};