import * as XLSX from 'xlsx';
import { formatVND, formatNumber, formatDate } from './storageService';

export const exportService = {
  // Xuất Bảng xác định giá trị khối lượng hoàn thành Mẫu 03.a/TT theo Nghị định số 254/2025/NĐ-CP
  exportForm03aExcel(project, contract, payment, items = []) {
    const wb = XLSX.utils.book_new();

    const headers = [
      ["BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH"],
      ["MẪU SỐ 03.a/TT"],
      ["Ban hành kèm theo Nghị định số 254/2025/NĐ-CP ngày 26/09/2025 của Chính phủ"],
      [],
      [`Tên dự án: ${project?.name || ''}`],
      [`Gói thầu: ${contract?.packageName || ''}`],
      [`Hợp đồng số: ${contract?.code || ''} ngày ${formatDate(contract?.signDate)}`],
      [`Chủ đầu tư: ${project?.owner || ''}`],
      [`Nhà thầu: ${contract?.contractor || ''}`],
      [`Đợt thanh toán: ${payment?.stageNumber ? `Đợt ${payment.stageNumber}` : ''} - ${payment?.title || ''}`],
      [`Giai đoạn thi công: Từ ${formatDate(payment?.periodFrom)} đến ${formatDate(payment?.periodTo)}`],
      [],
      [
        "STT",
        "Nội dung công việc",
        "Đơn vị tính",
        "Khối lượng theo HĐ",
        "Đơn giá theo HĐ (VNĐ)",
        "Thành tiền theo HĐ (VNĐ)",
        "Khối lượng lũy kế đến hết kỳ trước",
        "Thành tiền lũy kế đến hết kỳ trước (VNĐ)",
        "Khối lượng thực hiện kỳ này",
        "Thành tiền thực hiện kỳ này (VNĐ)",
        "Lũy kế khối lượng đến hết kỳ này",
        "Lũy kế thành tiền đến hết kỳ này (VNĐ)"
      ]
    ];

    const dataRows = items.map(item => [
      item.stt,
      item.name,
      item.unit,
      item.contractQty,
      item.unitPrice,
      item.contractAmount,
      item.prevCumulativeQty,
      item.prevCumulativeAmount,
      item.thisPeriodQty,
      item.thisPeriodAmount,
      item.totalCumulativeQty,
      item.totalCumulativeAmount
    ]);

    // Hàng tổng cộng
    const totalContract = items.reduce((s, i) => s + (Number(i.contractAmount) || 0), 0);
    const totalPrev = items.reduce((s, i) => s + (Number(i.prevCumulativeAmount) || 0), 0);
    const totalThis = items.reduce((s, i) => s + (Number(i.thisPeriodAmount) || 0), 0);
    const totalCum = items.reduce((s, i) => s + (Number(i.totalCumulativeAmount) || 0), 0);

    const totalRow = [
      "",
      "TỔNG CỘNG",
      "",
      "",
      "",
      totalContract,
      "",
      totalPrev,
      "",
      totalThis,
      "",
      totalCum
    ];

    const summaryRows = [
      [],
      ["TỔNG HỢP CÁC CHỈ TIÊU THANH TOÁN (THEO NGHỊ ĐỊNH SỐ 254/2025/NĐ-CP):"],
      ["I. Lũy kế giá trị khối lượng thực hiện đến hết kỳ này:", totalCum],
      ["   1. Lũy kế đến hết kỳ trước:", totalPrev],
      ["   2. Giá trị khối lượng hoàn thành kỳ này:", totalThis],
      ["II. Khấu trừ thu hồi tạm ứng kỳ này:", payment?.advanceDeduction || 0],
      ["III. Khấu trừ giữ lại bảo hành (5%):", payment?.retentionDeduction || 0],
      ["IV. Khấu trừ khác (nếu có):", payment?.penaltyDeduction || 0],
      ["V. SỐ TIỀN ĐỀ NGHỊ KHO BẠC THANH TOÁN KỲ NÀY:", payment?.requestedAmount || (totalThis - (payment?.advanceDeduction || 0) - (payment?.retentionDeduction || 0) - (payment?.penaltyDeduction || 0))],
      [],
      ["ĐẠI DIỆN NHÀ THẦU", "", "", "TƯ VẤN GIÁM SÁT TRƯỞNG", "", "", "ĐẠI DIỆN CHỦ ĐẦU TƯ / BAN QLDA"],
      ["(Ký, ghi rõ họ tên và đóng dấu)", "", "", "(Ký, ghi rõ họ tên và đóng dấu)", "", "", "(Ký, ghi rõ họ tên và đóng dấu)"]
    ];

    const fullSheetData = [...headers, ...dataRows, totalRow, ...summaryRows];

    const ws = XLSX.utils.aoa_to_sheet(fullSheetData);

    // Điều chỉnh độ rộng cột
    ws['!cols'] = [
      { wch: 6 },  // STT
      { wch: 45 }, // Nội dung
      { wch: 10 }, // ĐVT
      { wch: 15 }, // KL HĐ
      { wch: 18 }, // Đơn giá
      { wch: 22 }, // Thành tiền HĐ
      { wch: 16 }, // KL trước
      { wch: 22 }, // Tiền trước
      { wch: 16 }, // KL kỳ này
      { wch: 22 }, // Tiền kỳ này
      { wch: 16 }, // Lũy kế KL
      { wch: 24 }  // Lũy kế Tiền
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Mau_03a_TT_ND254");

    const fileName = `Mau_03a_TT_ND254_${contract?.code || 'HD'}_Dot_${payment?.stageNumber || 1}.xlsx`;
    XLSX.writeFile(wb, fileName);
  },

  // Sao lưu toàn bộ dữ liệu ra file JSON
  exportBackupJSON(projects, contracts, payments, documents) {
    const backupData = {
      version: '2.0',
      legalFramework: 'Nghị định 254/2025/NĐ-CP',
      exportedAt: new Date().toISOString(),
      projects,
      contracts,
      payments,
      documents
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `QLTT_Backup_ND254_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};