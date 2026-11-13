export const INITIAL_PROJECTS = [
  {
    id: "proj-newtown",
    code: "2469E11000",
    name: "Khu căn hộ cao tầng Newtown",
    owner: "Tập đoàn Xây dựng Hòa Bình",
    mainContractor: "Tập đoàn Xây dựng Hòa Bình",
    location: "Trường Sa, Ngũ Hành Sơn, TP. Đà Nẵng",
    category: "Công trình Dân dụng cấp I",
    budget: 1500000000000, // 1.500 tỷ
    capitalSource: "Vốn Chủ đầu tư & Thương mại",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    status: "in_progress",
    description: "Tổ hợp 2 tòa tháp cao tầng M1 và M2 cao 35 tầng với hơn 1.200 căn hộ cao cấp và khối đế thương mại."
  },
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
    id: "cont-newtown",
    projectId: "proj-newtown",
    code: "0103/NEWTOWN/NAMKHOI/2026",
    subcontractorCode: "TC000056",
    contractor: "Công ty TNHH MTV XD và TM Nam Khôi",
    subcontractorName: "Công ty TNHH MTV XD và TM Nam Khôi",
    packageName: "Thi công kết cấu BTCT Tòa M1, M2 - Dự án Newtown",
    mainScope: "Thi công kết cấu BTCT Tòa M1, M2",
    contractorTaxCode: "0401892837",
    contractorAccount: "0041000345678 - Vietcombank Chi nhánh Đà Nẵng",
    bankName: "Vietcombank Chi nhánh Đà Nẵng",
    contractType: "Đơn giá cố định",
    signDate: "2024-01-10",
    durationDays: 730,
    originalValue: 60168402240, // 60.168.402.240 đ
    adjustedValue: 60168402240,
    advanceRate: 0,
    retentionRate: 5, // 5% bảo lưu
    advanceRecoveryRate: 0,
    vatRate: 8, // 8% VAT
    guaranteeExpiry: "2026-12-31",
    status: "active"
  },
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
    id: "pay-newtown-13",
    contractId: "cont-newtown",
    stageNumber: 13,
    paymentId: "20261019054706",
    title: "Đề nghị thanh toán Đợt 13: Thi công kết cấu sàn tầng 18-22 Tòa M1 & M2",
    paymentType: "progress",
    dateRequested: "2026-10-19",
    periodFrom: "2026-09-01",
    periodTo: "2026-09-30",
    dueDate: "2026-10-30",
    status: "pending_approval",
    
    // 12 chỉ tiêu tài chính chi tiết theo Form Hòa Bình:
    actualPaidToDate: 41250000000,
    cumAcceptedVal: 48950000000,    // [1] Lũy kế GT nghiệm thu (đã VAT 8%)
    prevPaidVal: 38500000000,       // [2] LK đề nghị TT kỳ trước
    prevDeductMat: 1250000000,      // [3] LK trừ vật tư kỳ trước
    prevDeductPpe: 185000000,       // [4] LK trừ BHLĐ kỳ trước
    prevDeductOther: 120000000,     // [5] LK trừ khác kỳ trước
    prevHoldAmount: 500000000,      // [6] LK tạm giữ kỳ trước
    cumRetention: 2447500000,       // [7] LK 5% bảo lưu đến nay
    cumRecAdvance: 0,               // [8] LK thu hồi tạm ứng HĐ
    cumRecMat: 0,                   // [9] LK thu hồi tạm ứng vật tư
    totalDeductedPrev: 43002500000, // [10] = SUM([2]..[9])
    currGrossPayable: 5947500000,   // [11] = [1] - [10]
    
    // Khấu trừ kỳ này [12]:
    currDeductMat: 320000000,       // [12a] Trừ vật tư kỳ này
    currDeductPpe: 45000000,        // [12b] Trừ BHLĐ kỳ này
    currDeductOther: 15000000,      // [12c] Trừ khác kỳ này
    currHoldAmount: 100000000,      // [12d] Tạm giữ kỳ này
    currTotalDeduct: 480000000,     // [12] = SUM(12a..12d)
    
    workCompletedValue: 5506944444, // Giá trị chưa VAT
    advanceDeduction: 0,
    retentionDeduction: 275347222, // 5% bảo lưu kỳ này
    requestedAmount: 5467500000,    // Thực nhận = [11] - [12]
    netPayable: 5467500000,
    amountInWords: "Năm tỷ bốn trăm sáu mươi bảy triệu năm trăm nghìn đồng chẵn",
    notes: "Nghiệm thu đổ bê tông sàn tầng 20, 21, 22. Đã đối chiếu khối lượng thép với Ban Chỉ Huy Hòa Bình."
  },
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
];// Dữ liệu chi tiết chuẩn theo Phụ lục 03.a/TT Nghị định 254/2025/NĐ-CP
export const SAMPLE_FORM_03A_SECTIONS = [
  {
    sectionCode: "I",
    sectionName: "Công việc thực hiện thông qua hợp đồng",
    items: [
      {
        stt: "1",
        jobCode: "AF.11111",
        name: "Đào đất cấp 3 nền đường bằng máy đào 1.25m3, đổ lên ô tô tự đổ",
        unit: "m3",
        contractQty: 185000,
        prevUnpaidQty: 0,
        prevPaidQty: 145000,
        thisPeriodAcceptedQty: 25000,
        totalCumulativeQty: 170000,
        thisPeriodRequestedQty: 25000,
        unitPriceContract: 42500,
        unitPriceAdditional: 0,
        contractVal: 7862500000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 1062500000,
        thisPeriodRequestedVal: 1062500000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 6162500000,
        totalPaidToDateVal: 7225000000,
        note: "Nghiệm thu đạt K98"
      },
      {
        stt: "2",
        jobCode: "AF.12211",
        name: "Đắp đất nền đường K98 bằng đất đồi chọn lọc vận chuyển 5km",
        unit: "m3",
        contractQty: 120000,
        prevUnpaidQty: 0,
        prevPaidQty: 85000,
        thisPeriodAcceptedQty: 18000,
        totalCumulativeQty: 103000,
        thisPeriodRequestedQty: 18000,
        unitPriceContract: 85000,
        unitPriceAdditional: 0,
        contractVal: 10200000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 1530000000,
        thisPeriodRequestedVal: 1530000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 7225000000,
        totalPaidToDateVal: 8755000000,
        note: ""
      },
      {
        stt: "3",
        jobCode: "AD.21122",
        name: "Móng cấp phối đá dăm loại 1, chiều dày lu lèn 15cm",
        unit: "m2",
        contractQty: 95000,
        prevUnpaidQty: 0,
        prevPaidQty: 55000,
        thisPeriodAcceptedQty: 22000,
        totalCumulativeQty: 77000,
        thisPeriodRequestedQty: 22000,
        unitPriceContract: 165000,
        unitPriceAdditional: 0,
        contractVal: 15675000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 3630000000,
        thisPeriodRequestedVal: 3630000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 9075000000,
        totalPaidToDateVal: 12705000000,
        note: "Mỏ đá Tân Thành"
      },
      {
        stt: "4",
        jobCode: "AD.32111",
        name: "Tưới nhựa dính bám tiêu chuẩn 0.5 kg/m2",
        unit: "m2",
        contractQty: 90000,
        prevUnpaidQty: 0,
        prevPaidQty: 30000,
        thisPeriodAcceptedQty: 35000,
        totalCumulativeQty: 65000,
        thisPeriodRequestedQty: 35000,
        unitPriceContract: 18500,
        unitPriceAdditional: 0,
        contractVal: 1665000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 647500000,
        thisPeriodRequestedVal: 647500000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 555000000,
        totalPaidToDateVal: 1202500000,
        note: "Nhựa Petrolimex 60/70"
      },
      {
        stt: "5",
        jobCode: "AD.41212",
        name: "Bê tông nhựa hạt trung C19 rải thảm dày 7cm (hàm lượng nhựa 5.2%)",
        unit: "m2",
        contractQty: 88000,
        prevUnpaidQty: 0,
        prevPaidQty: 0,
        thisPeriodAcceptedQty: 48000,
        totalCumulativeQty: 48000,
        thisPeriodRequestedQty: 48000,
        unitPriceContract: 358000,
        unitPriceAdditional: 0,
        contractVal: 31504000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 17184000000,
        thisPeriodRequestedVal: 17184000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 0,
        totalPaidToDateVal: 17184000000,
        note: "Trạm trộn Km15"
      },
      {
        stt: "6",
        jobCode: "AF.23114",
        name: "Bê tông cốt thép móng và thân cống hộp đôi 2x(2x2)m M300",
        unit: "m3",
        contractQty: 4500,
        prevUnpaidQty: 0,
        prevPaidQty: 2800,
        thisPeriodAcceptedQty: 850,
        totalCumulativeQty: 3650,
        thisPeriodRequestedQty: 850,
        unitPriceContract: 2850000,
        unitPriceAdditional: 0,
        contractVal: 12825000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 2422500000,
        thisPeriodRequestedVal: 2422500000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 7980000000,
        totalPaidToDateVal: 10402500000,
        note: ""
      },
      {
        stt: "7",
        jobCode: "AF.31215",
        name: "Gia công lắp dựng cốt thép móng cống đường kính <= 18mm",
        unit: "tấn",
        contractQty: 420,
        prevUnpaidQty: 0,
        prevPaidQty: 260,
        thisPeriodAcceptedQty: 80,
        totalCumulativeQty: 340,
        thisPeriodRequestedQty: 80,
        unitPriceContract: 24500000,
        unitPriceAdditional: 0,
        contractVal: 10290000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 1960000000,
        thisPeriodRequestedVal: 1960000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 6370000000,
        totalPaidToDateVal: 8330000000,
        note: "Thép Hòa Phát"
      }
    ]
  },
  {
    sectionCode: "II",
    sectionName: "Công việc thực hiện không thông qua hợp đồng (không bao gồm kinh phí bồi thường, hỗ trợ, tái định cư, không bao gồm chi phí quản lý dự án)",
    items: [
      {
        stt: "1",
        jobCode: "KT.01",
        name: "Quan trắc biến dạng công trình và cắm mốc ranh giới giải phóng mặt bằng",
        unit: "Điểm",
        contractQty: 120,
        prevUnpaidQty: 0,
        prevPaidQty: 60,
        thisPeriodAcceptedQty: 30,
        totalCumulativeQty: 90,
        thisPeriodRequestedQty: 30,
        unitPriceContract: 12500000,
        unitPriceAdditional: 0,
        contractVal: 1500000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 375000000,
        thisPeriodRequestedVal: 375000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 750000000,
        totalPaidToDateVal: 1125000000,
        note: "Tự thực hiện"
      }
    ]
  },
  {
    sectionCode: "III",
    sectionName: "Chi phí đảm bảo cho việc tổ chức thực hiện bồi thường, hỗ trợ, tái định cư",
    items: [
      {
        stt: "1",
        jobCode: "BT.01",
        name: "Chi phí đo đạc, kiểm đếm hiện trạng đất đai và tài sản trên đất giải phóng mặt bằng",
        unit: "Ha",
        contractQty: 45,
        prevUnpaidQty: 0,
        prevPaidQty: 30,
        thisPeriodAcceptedQty: 15,
        totalCumulativeQty: 45,
        thisPeriodRequestedQty: 15,
        unitPriceContract: 28000000,
        unitPriceAdditional: 0,
        contractVal: 1260000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 420000000,
        thisPeriodRequestedVal: 420000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 840000000,
        totalPaidToDateVal: 1260000000,
        note: "Hội đồng GPMB huyện"
      }
    ]
  },
  {
    sectionCode: "IV",
    sectionName: "Chi phí quản lý dự án",
    items: [
      {
        stt: "1",
        jobCode: "QL.01",
        name: "Kinh phí quản lý dự án theo định mức tỷ lệ Bộ Xây dựng (giai đoạn thi công)",
        unit: "Tháng",
        contractQty: 24,
        prevUnpaidQty: 0,
        prevPaidQty: 8,
        thisPeriodAcceptedQty: 3,
        totalCumulativeQty: 11,
        thisPeriodRequestedQty: 3,
        unitPriceContract: 95000000,
        unitPriceAdditional: 0,
        contractVal: 2280000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 285000000,
        thisPeriodRequestedVal: 285000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 760000000,
        totalPaidToDateVal: 1045000000,
        note: "Ban QLDA chuyên ngành"
      }
    ]
  }
];

// ==========================================
// PHẦN 3: DỮ LIỆU TỔ ĐỘI THI CÔNG (ĐẦU RA - CHI TIỀN)
// Dự án: Khu căn hộ cao tầng Newtown (Hòa Bình - Nam Khôi)
// ==========================================

export const INITIAL_TEAMS = [
  {
    teamId: "team-1",
    teamCode: "TD-THEP-01",
    teamName: "Tổ Thép - Đội Tuấn",
    leaderName: "Nguyễn Văn Tuấn",
    phone: "0905.123.456",
    idCard: "201847589",
    bankAccount: "1028374659 - VietinBank Đà Nẵng",
    bankName: "VietinBank",
    specialty: "Cốt thép kết cấu dầm sàn, cột vách",
    membersCount: 38,
    status: "ACTIVE"
  },
  {
    teamId: "team-2",
    teamCode: "TD-COFFA-02",
    teamName: "Tổ Coffa - Đội Hải",
    leaderName: "Trần Đình Hải",
    phone: "0914.789.012",
    idCard: "201938472",
    bankAccount: "0041000889977 - Vietcombank Đà Nẵng",
    bankName: "Vietcombank",
    specialty: "Ván khuôn nhôm & Hệ giàn giáo leo",
    membersCount: 45,
    status: "ACTIVE"
  },
  {
    teamId: "team-3",
    teamCode: "TD-BETONG-03",
    teamName: "Tổ Bê Tông - Đội Dũng",
    leaderName: "Lê Văn Dũng",
    phone: "0988.345.678",
    idCard: "201478562",
    bankAccount: "5601000123456 - BIDV Hải Châu",
    bankName: "BIDV",
    specialty: "Đổ bê tông thương phẩm & Vận hành bơm cần",
    membersCount: 26,
    status: "ACTIVE"
  },
  {
    teamId: "team-4",
    teamCode: "TD-HOANTHIEN-04",
    teamName: "Tổ Xây Trát - Đội Cường",
    leaderName: "Phạm Quốc Cường",
    phone: "0935.678.901",
    idCard: "201789234",
    bankAccount: "190345678910 - Techcombank Đà Nẵng",
    bankName: "Techcombank",
    specialty: "Xây tường ngăn & Trát hoàn thiện căn hộ",
    membersCount: 32,
    status: "ACTIVE"
  }
];

// Bảng đơn giá vào (Hòa Bình trả) vs đơn giá ra (Giao khoán cho Tổ đội)
// Tự động tính chênh lệch độ dôi lợi nhuận
export const INITIAL_TEAM_BOQ = [
  {
    teamBoqId: "tboq-1",
    teamCode: "TD-THEP-01",
    teamName: "Tổ Thép - Đội Tuấn",
    itemCode: "2.1.1.1.2.10",
    description: "Gia công lắp dựng cốt thép dầm sàn Tòa M1, M2 (D10 - D32)",
    unit: "KG",
    contractQty: 4850000,
    unitPriceIn: 3850,       // Đơn giá Hòa Bình trả (chưa VAT)
    unitPriceOut: 2900,      // Đơn giá giao khoán cho Tổ Thép Tuấn
    assignedQty: 4850000,
    note: "Bao gồm gia công tại bãi, vận chuyển cẩu tháp, buộc kẽm hoàn thiện"
  },
  {
    teamBoqId: "tboq-2",
    teamCode: "TD-THEP-01",
    teamName: "Tổ Thép - Đội Tuấn",
    itemCode: "2.1.1.1.2.11",
    description: "Gia công lắp dựng cốt thép cột vách lõi thang máy Tòa M1",
    unit: "KG",
    contractQty: 1650000,
    unitPriceIn: 4200,
    unitPriceOut: 3200,
    assignedQty: 1650000,
    note: "Thép vách nối coupler và buộc đai dày"
  },
  {
    teamBoqId: "tboq-3",
    teamCode: "TD-COFFA-02",
    teamName: "Tổ Coffa - Đội Hải",
    itemCode: "2.1.2.1.1.05",
    description: "Lắp dựng và tháo dỡ ván khuôn nhôm sàn căn hộ điển hình",
    unit: "m2",
    contractQty: 125000,
    unitPriceIn: 165000,
    unitPriceOut: 125000,
    assignedQty: 125000,
    note: "Ván khuôn nhôm phụ kiện nhôm nguyên khối, chu kỳ 5 ngày/sàn"
  },
  {
    teamBoqId: "tboq-4",
    teamCode: "TD-COFFA-02",
    teamName: "Tổ Coffa - Đội Hải",
    itemCode: "2.1.2.1.1.08",
    description: "Lắp dựng và tháo dỡ ván khuôn cột vách Tòa M1, M2",
    unit: "m2",
    contractQty: 85000,
    unitPriceIn: 185000,
    unitPriceOut: 140000,
    assignedQty: 85000,
    note: "Hệ giàn giáo bao che và giằng chống an toàn"
  },
  {
    teamBoqId: "tboq-5",
    teamCode: "TD-BETONG-03",
    teamName: "Tổ Bê Tông - Đội Dũng",
    itemCode: "2.1.3.1.1.01",
    description: "Đổ và đầm bê tông thương phẩm sàn dầm Tòa M1 (B35)",
    unit: "m3",
    contractQty: 42000,
    unitPriceIn: 145000,
    unitPriceOut: 110000,
    assignedQty: 42000,
    note: "Đổ ca đêm, hoàn thiện mặt xoa phẳng bằng máy, bảo dưỡng nilon"
  },
  {
    teamBoqId: "tboq-6",
    teamCode: "TD-HOANTHIEN-04",
    teamName: "Tổ Xây Trát - Đội Cường",
    itemCode: "3.1.1.1.1.02",
    description: "Xây tường ngăn căn hộ bằng gạch bê tông nhẹ AAC dày 100mm",
    unit: "m2",
    contractQty: 68000,
    unitPriceIn: 185000,
    unitPriceOut: 140000,
    assignedQty: 68000,
    note: "Bao gồm râu thép liên kết cột vách và lưới chống nứt"
  }
];

// Sổ nhật ký Tạm ứng tiền mặt & Phạt hiện trường hàng ngày
export const INITIAL_TEAM_TRANSACTIONS = [
  {
    transId: "tr-01",
    teamCode: "TD-THEP-01",
    teamName: "Tổ Thép - Đội Tuấn",
    transDate: "2026-09-08",
    transType: "ADVANCE",
    transTypeName: "Tạm ứng tiền mặt lương tuần",
    amount: 150000000,
    note: "Ứng lương tuần 1 tháng 9 cho 38 công nhân tổ thép"
  },
  {
    transId: "tr-02",
    teamCode: "TD-THEP-01",
    teamName: "Tổ Thép - Đội Tuấn",
    transDate: "2026-09-15",
    transType: "ADVANCE",
    transTypeName: "Tạm ứng tiền mặt lương tuần",
    amount: 120000000,
    note: "Ứng lương tuần 2 tháng 9"
  },
  {
    transId: "tr-03",
    teamCode: "TD-THEP-01",
    teamName: "Tổ Thép - Đội Tuấn",
    transDate: "2026-09-22",
    transType: "PENALTY",
    transTypeName: "Phạt vi phạm an toàn lao động",
    amount: 5000000,
    note: "Hòa Bình lập biên bản: 2 công nhân không đeo dây an toàn khi buộc thép mép biên tầng 21"
  },
  {
    transId: "tr-04",
    teamCode: "TD-COFFA-02",
    teamName: "Tổ Coffa - Đội Hải",
    transDate: "2026-09-10",
    transType: "ADVANCE",
    transTypeName: "Tạm ứng tiền mặt lương tuần",
    amount: 180000000,
    note: "Ứng tiền lương tuần cho 45 công nhân tổ coffa"
  },
  {
    transId: "tr-05",
    teamCode: "TD-COFFA-02",
    teamName: "Tổ Coffa - Đội Hải",
    transDate: "2026-09-18",
    transType: "PPE",
    transTypeName: "Trừ tiền mua đồ BHLĐ / Đồng phục",
    amount: 12500000,
    note: "Cấp phát 45 bộ quần áo Hòa Bình và ủng cao su chuyên dụng"
  },
  {
    transId: "tr-06",
    teamCode: "TD-BETONG-03",
    teamName: "Tổ Bê Tông - Đội Dũng",
    transDate: "2026-09-12",
    transType: "ADVANCE",
    transTypeName: "Tạm ứng tiền mặt",
    amount: 90000000,
    note: "Ứng chi phí ca đêm đổ bê tông sàn tầng 21"
  },
  {
    transId: "tr-07",
    teamCode: "TD-BETONG-03",
    teamName: "Tổ Bê Tông - Đội Dũng",
    transDate: "2026-09-25",
    transType: "MATERIAL",
    transTypeName: "Trừ tiền vật tư hao hụt vượt định mức",
    amount: 8500000,
    note: "Hao hụt bê tông vung vãi chân bơm tầng 20"
  }
];

// Bảng thanh toán lương Tổ đội theo Đợt 13
export const INITIAL_TEAM_PAYMENTS = [
  {
    teamPayId: "tpay-13-thep",
    paymentId: "20261019054706",
    periodNo: 13,
    periodName: "Thanh toán Đợt 13 (Kỳ tháng 09/2026)",
    teamCode: "TD-THEP-01",
    teamName: "Tổ Thép - Đội Tuấn",
    leaderName: "Nguyễn Văn Tuấn",
    fromDate: "2026-09-01",
    toDate: "2026-09-30",
    grossAmount: 1160000000,     // Tổng giá trị nghiệm thu kỳ này (400 tấn thép x 2.900đ)
    cashAdvance: 270000000,     // Tổng tạm ứng tiền mặt trong kỳ
    deductMaterial: 15000000,   // Trừ que hàn, đá cắt, kẽm buộc
    deductPpe: 8000000,         // Trừ BHLĐ
    deductViolation: 5000000,   // Trừ phạt vi phạm ATLĐ
    retentionAmount: 58000000,  // Giữ lại bảo hành 5%
    netPaid: 804000000,         // Thực chi cho Đội trưởng Tuấn
    status: "APPROVED"
  },
  {
    teamPayId: "tpay-13-coffa",
    paymentId: "20261019054706",
    periodNo: 13,
    periodName: "Thanh toán Đợt 13 (Kỳ tháng 09/2026)",
    teamCode: "TD-COFFA-02",
    teamName: "Tổ Coffa - Đội Hải",
    leaderName: "Trần Đình Hải",
    fromDate: "2026-09-01",
    toDate: "2026-09-30",
    grossAmount: 1450000000,     // Nghiệm thu 11.600m2 ván khuôn x 125.000đ
    cashAdvance: 350000000,
    deductMaterial: 25000000,
    deductPpe: 12500000,
    deductViolation: 0,
    retentionAmount: 72500000,
    netPaid: 990000000,
    status: "APPROVED"
  },
  {
    teamPayId: "tpay-13-betong",
    paymentId: "20261019054706",
    periodNo: 13,
    periodName: "Thanh toán Đợt 13 (Kỳ tháng 09/2026)",
    teamCode: "TD-BETONG-03",
    teamName: "Tổ Bê Tông - Đội Dũng",
    leaderName: "Lê Văn Dũng",
    fromDate: "2026-09-01",
    toDate: "2026-09-30",
    grossAmount: 462000000,      // Nghiệm thu 4.200m3 bê tông x 110.000đ
    cashAdvance: 90000000,
    deductMaterial: 8500000,
    deductPpe: 4500000,
    deductViolation: 0,
    retentionAmount: 23100000,
    netPaid: 335900000,
    status: "APPROVED"
  }
];

// Cấu hình kết nối Google Sheets & Nhật ký đồng bộ
export const INITIAL_GSHEET_CONFIGS = [
  {
    configId: "gsheet-01",
    contractNo: "0103/NEWTOWN/NAMKHOI/2026",
    contractTitle: "Newtown - Hòa Bình (Nam Khôi)",
    spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit",
    syncMode: "REALTIME",
    isActive: true,
    lastSyncedAt: "2026-11-13 07:30:00"
  }
];

export const INITIAL_GSHEET_SYNC_LOGS = [
  {
    logId: "log-01",
    configId: "gsheet-01",
    targetSheetName: "DeNghiTT_HB",
    recordRefId: "20261019054706",
    description: "Đồng bộ Đợt 13: Đề nghị thanh toán với Hòa Bình (Trang 1)",
    syncStatus: "SUCCESS",
    syncedAt: "2026-11-13 07:30:15",
    errorMessage: null
  },
  {
    logId: "log-02",
    configId: "gsheet-01",
    targetSheetName: "ThanhToan_ToDoi",
    recordRefId: "TPAY-13-ALL",
    description: "Đồng bộ Bảng lương & quyết toán 3 Tổ đội Đợt 13",
    syncStatus: "SUCCESS",
    syncedAt: "2026-11-13 07:30:20",
    errorMessage: null
  },
  {
    logId: "log-03",
    configId: "gsheet-01",
    targetSheetName: "SoTamUng",
    recordRefId: "TR-ALL-SEP",
    description: "Đồng bộ Sổ nhật ký ứng tiền mặt & phạt tháng 9/2026",
    syncStatus: "SUCCESS",
    syncedAt: "2026-11-13 07:30:25",
    errorMessage: null
  }
];

// Danh mục BOQ 115 đầu việc chuẩn cho HĐ 0103/NEWTOWN/NAMKHOI/2026
export const NEWTOWN_BOQ_SECTIONS = [
  {
    sectionCode: "I",
    sectionName: "Công tác Bê tông, Cốt thép & Ván khuôn Tòa M1 (Tầng 1 đến Tầng 35)",
    items: [
      {
        stt: "1",
        jobCode: "2.1.1.1.2.10",
        name: "Gia công lắp dựng cốt thép dầm sàn Tòa M1 (D10 - D32)",
        unit: "KG",
        contractQty: 2450000,
        prevUnpaidQty: 0,
        prevPaidQty: 1850000,
        thisPeriodAcceptedQty: 250000,
        totalCumulativeQty: 2100000,
        thisPeriodRequestedQty: 250000,
        unitPriceContract: 3850,
        unitPriceAdditional: 0,
        contractVal: 9432500000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 962500000,
        thisPeriodRequestedVal: 962500000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 7122500000,
        totalPaidToDateVal: 8085000000,
        note: "Đã KCS nghiệm thu"
      },
      {
        stt: "2",
        jobCode: "2.1.1.1.2.11",
        name: "Gia công lắp dựng cốt thép cột vách lõi thang máy Tòa M1",
        unit: "KG",
        contractQty: 850000,
        prevUnpaidQty: 0,
        prevPaidQty: 620000,
        thisPeriodAcceptedQty: 95000,
        totalCumulativeQty: 715000,
        thisPeriodRequestedQty: 95000,
        unitPriceContract: 4200,
        unitPriceAdditional: 0,
        contractVal: 3570000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 399000000,
        thisPeriodRequestedVal: 399000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 2604000000,
        totalPaidToDateVal: 3003000000,
        note: "Nghiệm thu tầng 20-22"
      },
      {
        stt: "3",
        jobCode: "2.1.2.1.1.05",
        name: "Lắp dựng và tháo dỡ ván khuôn nhôm sàn căn hộ điển hình Tòa M1",
        unit: "m2",
        contractQty: 65000,
        prevUnpaidQty: 0,
        prevPaidQty: 48000,
        thisPeriodAcceptedQty: 7500,
        totalCumulativeQty: 55500,
        thisPeriodRequestedQty: 7500,
        unitPriceContract: 165000,
        unitPriceAdditional: 0,
        contractVal: 10725000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 1237500000,
        thisPeriodRequestedVal: 1237500000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 7920000000,
        totalPaidToDateVal: 9157500000,
        note: "Chu kỳ nhôm 5 ngày"
      },
      {
        stt: "4",
        jobCode: "2.1.3.1.1.01",
        name: "Đổ và đầm bê tông thương phẩm sàn dầm Tòa M1 (B35)",
        unit: "m3",
        contractQty: 22000,
        prevUnpaidQty: 0,
        prevPaidQty: 16200,
        thisPeriodAcceptedQty: 2400,
        totalCumulativeQty: 18600,
        thisPeriodRequestedQty: 2400,
        unitPriceContract: 145000,
        unitPriceAdditional: 0,
        contractVal: 3190000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 348000000,
        thisPeriodRequestedVal: 348000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 2349000000,
        totalPaidToDateVal: 2697000000,
        note: "Bê tông thương phẩm B35"
      }
    ]
  },
  {
    sectionCode: "II",
    sectionName: "Công tác Bê tông, Cốt thép & Ván khuôn Tòa M2 (Tầng 1 đến Tầng 35)",
    items: [
      {
        stt: "1",
        jobCode: "2.2.1.1.2.10",
        name: "Gia công lắp dựng cốt thép dầm sàn Tòa M2 (D10 - D32)",
        unit: "KG",
        contractQty: 2400000,
        prevUnpaidQty: 0,
        prevPaidQty: 1780000,
        thisPeriodAcceptedQty: 260000,
        totalCumulativeQty: 2040000,
        thisPeriodRequestedQty: 260000,
        unitPriceContract: 3850,
        unitPriceAdditional: 0,
        contractVal: 9240000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 1001000000,
        thisPeriodRequestedVal: 1001000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 6853000000,
        totalPaidToDateVal: 7854000000,
        note: "Đã KCS nghiệm thu"
      },
      {
        stt: "2",
        jobCode: "2.2.2.1.1.05",
        name: "Lắp dựng và tháo dỡ ván khuôn nhôm sàn căn hộ điển hình Tòa M2",
        unit: "m2",
        contractQty: 60000,
        prevUnpaidQty: 0,
        prevPaidQty: 44000,
        thisPeriodAcceptedQty: 6800,
        totalCumulativeQty: 50800,
        thisPeriodRequestedQty: 6800,
        unitPriceContract: 165000,
        unitPriceAdditional: 0,
        contractVal: 9900000000,
        prevUnpaidVal: 0,
        thisPeriodAcceptedVal: 1122000000,
        thisPeriodRequestedVal: 1122000000,
        thisPeriodUnpaidVal: 0,
        prevPaidVal: 7260000000,
        totalPaidToDateVal: 8382000000,
        note: "Ván khuôn nhôm đạt chuẩn"
      }
    ]
  }
];

