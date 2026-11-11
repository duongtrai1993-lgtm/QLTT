import * as XLSX from 'xlsx';
import { formatVND, formatNumber, formatDate } from './storageService';

export const exportService = {
  // Xuất Bảng xác định giá trị khối lượng hoàn thành Mẫu 03a ra Excel
  exportForm03aExcel(project, contract, payment, items = []) {
    const wb = XLSX.utils.book_new();

    const headers = [
      ["BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH"],
      ["Theo Nghị định số 99/2021/NĐ-CP ngày 11/11/2021 của Chính phủ"],
      ["MẪU SỐ 03a"],
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
      ["TỔNG HỢP GIÁ TRỊ ĐỀ NGHỊ THANH TOÁN KỲ NÀY:"],
      ["1. Giá trị khối lượng hoàn thành kỳ này:", totalThis],
      ["2. Khấu trừ thu hồi tạm ứng:", payment?.advanceDeduction || 0],
      ["3. Khấu trừ giữ lại bảo hành (5%):", payment?.retentionDeduction || 0],
      ["4. Khấu trừ vi phạm / khác:", payment?.penaltyDeduction || 0],
      ["5. SỐ TIỀN ĐỀ NGHỊ THANH TOÁN KỲ NÀY (1 - 2 - 3 - 4):", payment?.requestedAmount || 0],
      [],
      ["ĐẠI DIỆN NHÀ THẦU", "", "", "TƯ VẤN GIÁM SÁT", "", "", "ĐẠI DIỆN CHỦ ĐẦU TƯ"],
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

    XLSX.utils.book_append_sheet(wb, ws, "Mau_03a");

    const fileName = `Mau_03a_${contract?.code || 'HD'}_Dot_${payment?.stageNumber || 1}.xlsx`;
    XLSX.writeFile(wb, fileName);
  },

  // Sao lưu toàn bộ dữ liệu ra file JSON
  exportBackupJSON(projects, contracts, payments, documents) {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects,
      contracts,
      payments,
      documents
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `QLTT_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};