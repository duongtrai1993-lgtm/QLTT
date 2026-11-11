export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    code: "DA-2024-01",
    name: "Cải tạo & Nâng cấp Tuyến Đường Vành Đai Bắc (Km12 - Km35)",
    owner: "Ban Quản lý Dự án Đầu tư Xây dựng Công trình Giao thông",
    location: "Tỉnh Bình Định",
    category: "Công trình Giao thông cấp I",
    budget: 450000000000, // 450 tỷ
    capitalSource: "Ngân sách Trung ương & Địa phương",
    startDate: "2024-01-15",
    endDate: "2025-12-30",
    status: "in_progress", // in_progress, completed, paused, final_settlement
    description: "Nâng cấp mặt đường từ 2 làn lên 4 làn xe, xây dựng mới 3 cầu vượt khẩu độ trung bình và hệ thống thoát nước đồng bộ."
  },
  {
    id: "proj-2",
    code: "DA-2024-02",
    name: "Xây dựng Cầu Vượt Sông Trà Khúc và Đường Dẫn Hai Đầu Cầu",
    owner: "Sở Giao thông Vận tải",
    location: "Tỉnh Quảng Ngãi",
    category: "Cầu đường bộ cấp II",
    budget: 320000000000, // 320 tỷ
    capitalSource: "Vốn Trái phiếu Chính phủ",
    startDate: "2024-03-01",
    endDate: "2026-06-30",
    status: "in_progress",
    description: "Cầu bê tông cốt thép dự ứng lực chiều dài 850m, đường dẫn hai đầu cầu dài 2.5km."
  },
  {
    id: "proj-3",
    code: "DA-2024-03",
    name: "Trung Tâm Y Tế Đa Khoa Huyện - Khối Nhà Khám Chữa Bệnh 7 Tầng",
    owner: "Ban QLDA Đầu tư Xây dựng Khu vực Dân dụng & Công nghiệp",
    location: "Tỉnh Phú Thọ",
    category: "Công trình Dân dụng cấp II",
    budget: 185000000000, // 185 tỷ
    capitalSource: "Ngân sách Tỉnh & Vốn ODA",
    startDate: "2023-09-01",
    endDate: "2025-08-30",
    status: "in_progress",
    description: "Khối nhà điều trị 7 tầng diện tích sàn 18.500m2, quy mô 250 giường bệnh và hệ thống PCCC tiêu chuẩn."
  }
];

export const INITIAL_CONTRACTS = [
  {
    id: "cont-1",
    projectId: "proj-1",
    code: "HĐ-01/2024/XL-VDB",
    packageName: "Gói thầu số 05: Thi công xây lắp nền, mặt đường và công trình thoát nước (Km12 - Km25)",
    contractor: "Liên danh CIENCO 1 - Công ty CP Tập đoàn Đèo Cả",
    contractorTaxCode: "0100105847",
    contractorAccount: "118000028999 - VietinBank Chi nhánh Hà Nội",
    contractType: "Đơn giá điều chỉnh",
    signDate: "2024-02-10",
    durationDays: 650,
    originalValue: 215000000000, // 215 tỷ
    adjustedValue: 215000000000,
    advanceRate: 20, // 20% = 43 tỷ
    advanceRecoveryStart: 30, // bắt đầu thu hồi khi đạt 30% giá trị hợp đồng
    advanceRecoveryEnd: 80, // thu hồi hết khi đạt 80%
    retentionRate: 5, // 5% giữ lại bảo hành công trình
    guaranteeExpiry: "2025-10-15", // Cảnh báo bảo lãnh thực hiện HĐ
    advanceGuaranteeExpiry: "2025-06-30", // Cảnh báo bảo lãnh tạm ứng
    bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
    status: "active"
  },
  {
    id: "cont-2",
    projectId: "proj-1",
    code: "HĐ-02/2024/TVGS-VDB",
    packageName: "Gói thầu số 02: Tư vấn giám sát thi công xây dựng gói thầu số 05",
    contractor: "Công ty Cổ phần Tư vấn Thiết kế Cầu đường TEDECO",
    contractorTaxCode: "0102384729",
    contractorAccount: "0011004567890 - Vietcombank Sở Giao dịch",
    contractType: "Trọn gói",
    signDate: "2024-02-15",
    durationDays: 680,
    originalValue: 4850000000, // 4.85 tỷ
    adjustedValue: 4850000000,
    advanceRate: 15,
    advanceRecoveryStart: 30,
    advanceRecoveryEnd: 80,
    retentionRate: 3,
    guaranteeExpiry: "2025-12-31",
    advanceGuaranteeExpiry: "2025-08-31",
    bankName: "BIDV Chi nhánh Tây Hồ",
    status: "active"
  },
  {
    id: "cont-3",
    projectId: "proj-2",
    code: "HĐ-03/2024/XL-TK",
    packageName: "Gói thầu XL-01: Thi công toàn bộ kết cấu nhịp cầu chính và mố trụ",
    contractor: "Tổng Công ty Xây dựng Công trình Giao thông 4 (CIENCO 4)",
    contractorTaxCode: "0100108922",
    contractorAccount: "12310000889988 - BIDV Hà Nội",
    contractType: "Đơn giá cố định",
    signDate: "2024-03-20",
    durationDays: 720,
    originalValue: 198000000000, // 198 tỷ
    adjustedValue: 198000000000,
    advanceRate: 25,
    advanceRecoveryStart: 30,
    advanceRecoveryEnd: 80,
    retentionRate: 5,
    guaranteeExpiry: "2026-08-15",
    advanceGuaranteeExpiry: "2025-11-20",
    bankName: "Agribank Chi nhánh Mỹ Đình",
    status: "active"
  },
  {
    id: "cont-4",
    projectId: "proj-3",
    code: "HĐ-04/2023/XL-YT",
    packageName: "Gói thầu XL-02: Xây dựng hoàn thiện khối nhà 7 tầng và lắp đặt hệ thống cơ điện (MEP)",
    contractor: "Tổng Công ty Cổ phần Xuất nhập khẩu và Xây dựng Việt Nam (VINACONEX)",
    contractorTaxCode: "0100105398",
    contractorAccount: "0301000334455 - Vietcombank Hoàn Kiếm",
    contractType: "Trọn gói",
    signDate: "2023-09-15",
    durationDays: 580,
    originalValue: 125000000000, // 125 tỷ
    adjustedValue: 128500000000, // có phụ lục bổ sung 3.5 tỷ
    advanceRate: 20,
    advanceRecoveryStart: 25,
    advanceRecoveryEnd: 75,
    retentionRate: 5,
    guaranteeExpiry: "2025-09-30",
    advanceGuaranteeExpiry: "2025-03-31",
    bankName: "MB Bank Chi nhánh Ba Đình",
    status: "active"
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: "pay-1",
    contractId: "cont-1",
    stageNumber: 1,
    title: "Thanh toán Đợt 1: Tạm ứng hợp đồng đợt 1 (20% giá trị hợp đồng)",
    paymentType: "advance", // advance (tạm ứng), progress (khối lượng), final (quyết toán)
    dateRequested: "2024-02-20",
    periodFrom: "2024-02-10",
    periodTo: "2024-02-20",
    workCompletedValue: 0,
    advanceDeduction: 0,
    retentionDeduction: 0,
    penaltyDeduction: 0,
    requestedAmount: 43000000000, // 43 tỷ
    approvedAmount: 43000000000,
    status: "disbursed", // draft, under_review, pending_approval, approved, disbursed, rejected
    disbursedDate: "2024-02-28",
    notes: "Đã nộp bảo lãnh tạm ứng của Vietcombank số BL-48929/2024 giá trị 43 tỷ đồng."
  },
  {
    id: "pay-2",
    contractId: "cont-1",
    stageNumber: 2,
    title: "Thanh toán Đợt 2: Khối lượng hoàn thành kỳ 1 (Đào đắp nền đường Km12 - Km18 & cống hộp)",
    paymentType: "progress",
    dateRequested: "2024-07-15",
    periodFrom: "2024-03-01",
    periodTo: "2024-06-30",
    workCompletedValue: 48500000000, // 48.5 tỷ
    advanceDeduction: 9700000000, // Khấu trừ tạm ứng 20% = 9.7 tỷ
    retentionDeduction: 2425000000, // Giữ lại bảo hành 5% = 2.425 tỷ
    penaltyDeduction: 0,
    requestedAmount: 36375000000, // 48.5 - 9.7 - 2.425 = 36.375 tỷ
    approvedAmount: 36375000000,
    status: "disbursed",
    disbursedDate: "2024-07-28",
    notes: "Biên bản nghiệm thu giai đoạn hoàn thành ngày 28/06/2024. Đã đối chiếu Kho bạc Nhà nước."
  },
  {
    id: "pay-3",
    contractId: "cont-1",
    stageNumber: 3,
    title: "Thanh toán Đợt 3: Khối lượng hoàn thành kỳ 2 (Cấp phối đá dăm loại 1 & 2 cầu bản)",
    paymentType: "progress",
    dateRequested: "2024-11-05",
    periodFrom: "2024-07-01",
    periodTo: "2024-10-31",
    workCompletedValue: 56200000000, // 56.2 tỷ
    advanceDeduction: 11240000000, // Khấu trừ tạm ứng = 11.24 tỷ
    retentionDeduction: 2810000000, // Giữ lại bảo hành 5% = 2.81 tỷ
    penaltyDeduction: 0,
    requestedAmount: 42150000000, // 56.2 - 11.24 - 2.81 = 42.15 tỷ
    approvedAmount: 42150000000,
    status: "approved", // Đã duyệt, đang chờ kho bạc chuyển khoản
    disbursedDate: null,
    notes: "Hồ sơ đã qua kiểm soát chi, lệnh chuyển tiền đang trình Lãnh đạo Kho bạc ký."
  },
  {
    id: "pay-4",
    contractId: "cont-1",
    stageNumber: 4,
    title: "Thanh toán Đợt 4: Khối lượng thi công thảm bê tông nhựa hạt trung C19 (Km12 - Km20)",
    paymentType: "progress",
    dateRequested: "2026-11-02",
    periodFrom: "2026-08-01",
    periodTo: "2026-10-31",
    workCompletedValue: 38400000000, // 38.4 tỷ
    advanceDeduction: 7680000000, // Thu hồi tạm ứng
    retentionDeduction: 1920000000, // 5%
    penaltyDeduction: 0,
    requestedAmount: 28800000000,
    approvedAmount: 0,
    status: "pending_approval", // Chờ Ban QLDA duyệt
    disbursedDate: null,
    notes: "TVGS đã ký xác nhận bảng tính Mẫu 03a ngày 01/11/2026. Hồ sơ đang được Phòng Kế toán thẩm định."
  },
  {
    id: "pay-5",
    contractId: "cont-4",
    stageNumber: 1,
    title: "Thanh toán Đợt 1: Tạm ứng hợp đồng 20%",
    paymentType: "advance",
    dateRequested: "2023-10-01",
    periodFrom: "2023-09-15",
    periodTo: "2023-10-01",
    workCompletedValue: 0,
    advanceDeduction: 0,
    retentionDeduction: 0,
    penaltyDeduction: 0,
    requestedAmount: 25000000000, // 25 tỷ
    approvedAmount: 25000000000,
    status: "disbursed",
    disbursedDate: "2023-10-10",
    notes: "Đã nhận tiền tạm ứng đầy đủ."
  },
  {
    id: "pay-6",
    contractId: "cont-4",
    stageNumber: 2,
    title: "Thanh toán Đợt 2: Xong phần thô kết cấu bê tông tầng 1 đến tầng 7",
    paymentType: "progress",
    dateRequested: "2024-05-18",
    periodFrom: "2023-10-15",
    periodTo: "2024-05-10",
    workCompletedValue: 62000000000, // 62 tỷ
    advanceDeduction: 12400000000, // Khấu trừ tạm ứng 12.4 tỷ
    retentionDeduction: 3100000000, // Giữ lại 3.1 tỷ
    penaltyDeduction: 0,
    requestedAmount: 46500000000,
    approvedAmount: 46500000000,
    status: "disbursed",
    disbursedDate: "2024-05-30",
    notes: "Cất nóc khối nhà ngày 05/05/2024. Đạt mốc tiến độ cam kết."
  }
];

export const INITIAL_CHECKLIST_TEMPLATE = [
  { id: "chk-1", name: "Giấy đề nghị thanh toán vốn đầu tư (Mẫu 04a/TT 96/2021/TT-BTC)", required: true },
  { id: "chk-2", name: "Bảng xác định giá trị khối lượng công việc hoàn thành (Mẫu số 03.a/TT - Nghị định 254/2025/NĐ-CP)", required: true },
  { id: "chk-3", name: "Biên bản nghiệm thu công việc / giai đoạn hoàn thành có chữ ký A-B-TVGS", required: true },
  { id: "chk-4", name: "Hóa đơn Giá trị gia tăng (VAT) điện tử hợp lệ của Nhà thầu", required: true },
  { id: "chk-5", name: "Bảng tính chi tiết khối lượng nghiệm thu A-B và hồ sơ chất lượng đi kèm", required: true },
  { id: "chk-6", name: "Chứng chỉ xuất xưởng, chứng nhận hợp quy / CO-CQ của vật tư thiết bị chính", required: true },
  { id: "chk-7", name: "Thư bảo lãnh tạm ứng / Bảo lãnh thực hiện HĐ (bản hợp lệ từ Ngân hàng)", required: false },
  { id: "chk-8", name: "Nhật ký thi công công trình và kết quả thí nghiệm nén mẫu kiểm tra", required: true }
];

export const INITIAL_DOCUMENTS = {
  "pay-1": [
    { id: "doc-1-1", templateId: "chk-1", status: "passed", notes: "Ký ngày 20/02/2024 đầy đủ dấu đỏ" },
    { id: "doc-1-7", templateId: "chk-7", status: "passed", notes: "Thư bảo lãnh Vietcombank số BL-48929/2024 trị giá 43 tỷ" }
  ],
  "pay-2": [
    { id: "doc-2-1", templateId: "chk-1", status: "passed", notes: "Hợp lệ" },
    { id: "doc-2-2", templateId: "chk-2", status: "passed", notes: "Mẫu 03a lập ngày 15/07/2024" },
    { id: "doc-2-3", templateId: "chk-3", status: "passed", notes: "BBNT giai đoạn số 01/NTGĐ-2024" },
    { id: "doc-2-4", templateId: "chk-4", status: "passed", notes: "Hóa đơn số 0001289 ngày 16/07/2024" },
    { id: "doc-2-5", templateId: "chk-5", status: "passed", notes: "Khối lượng đào đắp 125.000 m3" },
    { id: "doc-2-6", templateId: "chk-6", status: "passed", notes: "Thép Hòa Phát, xi măng Nghi Sơn đầy đủ CO/CQ" },
    { id: "doc-2-8", templateId: "chk-8", status: "passed", notes: "Độ đầm chặt K98 đạt yêu cầu" }
  ],
  "pay-3": [
    { id: "doc-3-1", templateId: "chk-1", status: "passed", notes: "Hợp lệ" },
    { id: "doc-3-2", templateId: "chk-2", status: "passed", notes: "Mẫu 03a số 03/2024" },
    { id: "doc-3-3", templateId: "chk-3", status: "passed", notes: "BBNT số 02/NTGĐ" },
    { id: "doc-3-4", templateId: "chk-4", status: "passed", notes: "Hóa đơn số 0001452" },
    { id: "doc-3-5", templateId: "chk-5", status: "passed", notes: "Bảng tính chi tiết 15 trang" },
    { id: "doc-3-6", templateId: "chk-6", status: "passed", notes: "Hợp quy đá dăm mỏ đá Tân Thành" },
    { id: "doc-3-8", templateId: "chk-8", status: "passed", notes: "Nhật ký ghi chép hàng ngày đầy đủ" }
  ],
  "pay-4": [
    { id: "doc-4-1", templateId: "chk-1", status: "passed", notes: "Đã nộp bản gốc" },
    { id: "doc-4-2", templateId: "chk-2", status: "passed", notes: "Mẫu 03a TVGS đã ký nháy" },
    { id: "doc-4-3", templateId: "chk-3", status: "passed", notes: "BBNT thảm nhựa lớp 1" },
    { id: "doc-4-4", templateId: "chk-4", status: "pending", notes: "Đang chờ xuất hóa đơn điện tử chính thức" },
    { id: "doc-4-5", templateId: "chk-5", status: "passed", notes: "Diện tích thảm 48.000m2" },
    { id: "doc-4-6", templateId: "chk-6", status: "passed", notes: "Chứng chỉ nhựa đường Petrolimex 60/70" },
    { id: "doc-4-8", templateId: "chk-8", status: "passed", notes: "Kết quả khoan ép mẫu nhựa đạt độ rỗng dư" }
  ]
};

// Dữ liệu chi tiết khối lượng mẫu cho Form 03a của Đợt thanh toán số 4
export const SAMPLE_FORM_03A_ITEMS = [
  {
    stt: "1",
    name: "Đào đất cấp 3 nền đường bằng máy đào 1.25m3, đổ đất lên ô tô tự đổ",
    unit: "m3",
    contractQty: 185000,
    unitPrice: 42500,
    contractAmount: 7862500000,
    prevCumulativeQty: 145000,
    prevCumulativeAmount: 6162500000,
    thisPeriodQty: 25000,
    thisPeriodAmount: 1062500000,
    totalCumulativeQty: 170000,
    totalCumulativeAmount: 7225000000
  },
  {
    stt: "2",
    name: "Đắp đất nền đường độ đầm chặt K98 bằng đất đồi chọn lọc",
    unit: "m3",
    contractQty: 120000,
    unitPrice: 85000,
    contractAmount: 10200000000,
    prevCumulativeQty: 85000,
    prevCumulativeAmount: 7225000000,
    thisPeriodQty: 18000,
    thisPeriodAmount: 1530000000,
    totalCumulativeQty: 103000,
    totalCumulativeAmount: 8755000000
  },
  {
    stt: "3",
    name: "Móng cấp phối đá dăm loại 1, chiều dày lu lèn 15cm",
    unit: "m2",
    contractQty: 95000,
    unitPrice: 165000,
    contractAmount: 15675000000,
    prevCumulativeQty: 55000,
    prevCumulativeAmount: 9075000000,
    thisPeriodQty: 22000,
    thisPeriodAmount: 3630000000,
    totalCumulativeQty: 77000,
    totalCumulativeAmount: 12705000000
  },
  {
    stt: "4",
    name: "Tưới nhựa dính bám tiêu chuẩn 0.5 kg/m2",
    unit: "m2",
    contractQty: 90000,
    unitPrice: 18500,
    contractAmount: 1665000000,
    prevCumulativeQty: 30000,
    prevCumulativeAmount: 555000000,
    thisPeriodQty: 35000,
    thisPeriodAmount: 647500000,
    totalCumulativeQty: 65000,
    totalCumulativeAmount: 1202500000
  },
  {
    stt: "5",
    name: "Bê tông nhựa hạt trung C19 rải thảm dày 7cm (hàm lượng nhựa 5.2%)",
    unit: "m2",
    contractQty: 88000,
    unitPrice: 358000,
    contractAmount: 31504000000,
    prevCumulativeQty: 0,
    prevCumulativeAmount: 0,
    thisPeriodQty: 48000,
    thisPeriodAmount: 17184000000,
    totalCumulativeQty: 48000,
    totalCumulativeAmount: 17184000000
  },
  {
    stt: "6",
    name: "Bê tông cốt thép móng cống và thân cống hộp đôi 2x(2x2)m M300",
    unit: "m3",
    contractQty: 4500,
    unitPrice: 2850000,
    contractAmount: 12825000000,
    prevCumulativeQty: 2800,
    prevCumulativeAmount: 7980000000,
    thisPeriodQty: 850,
    thisPeriodAmount: 2422500000,
    totalCumulativeQty: 3650,
    totalCumulativeAmount: 10402500000
  },
  {
    stt: "7",
    name: "Gia công lắp dựng cốt thép móng cống đường kính <= 18mm",
    unit: "tấn",
    contractQty: 420,
    unitPrice: 24500000,
    contractAmount: 10290000000,
    prevCumulativeQty: 260,
    prevCumulativeAmount: 6370000000,
    thisPeriodQty: 80,
    thisPeriodAmount: 1960000000,
    totalCumulativeQty: 340,
    totalCumulativeAmount: 8330000000
  }
];