// ==========================================
// DỮ LIỆU GỐC HỆ THỐNG QUẢN LÝ THANH TOÁN (QLTT)
// 1 DỰ ÁN DUY NHẤT & 2 TỔ ĐỘI THI CÔNG TINH GỌN
// ==========================================

// 1. Dự án duy nhất: Khu căn hộ cao tầng Newtown
export const INITIAL_PROJECTS = [
  {
    id: "proj-newtown",
    code: "2469E11000",
    name: "Khu căn hộ cao tầng Newtown",
    owner: "Công ty TNHH Phát triển Đô thị Newtown",
    mainContractor: "Tập đoàn Xây dựng Hòa Bình",
    location: "Trường Sa, Ngũ Hành Sơn, TP. Đà Nẵng",
    category: "Công trình Dân dụng cấp I",
    budget: 1500000000000, // 1.500 tỷ
    capitalSource: "Vốn Chủ đầu tư & Thương mại",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    status: "in_progress",
    description: "Tổ hợp 2 tòa tháp cao tầng M1 và M2 cao 35 tầng với hơn 1.200 căn hộ cao cấp và khối đế thương mại."
  }
];

// 2. Hợp đồng Thầu phụ với Tổng thầu Hòa Bình
export const INITIAL_CONTRACTS = [
  {
    id: "cont-newtown",
    projectId: "proj-newtown",
    code: "0103/NEWTOWN/NAMKHOI/2026",
    subcontractorCode: "TC000056",
    contractor: "Công ty TNHH MTV XD và TM Nam Khôi",
    subcontractorName: "Công ty TNHH MTV XD và TM Nam Khôi",
    packageName: "Thi công kết cấu BTCT Tòa M1, M2 - Dự án Newtown",
    mainScope: "Thi công toàn bộ kết cấu bê tông cốt thép, ván khuôn Tòa M1, M2 (Tầng hầm đến Tầng 35)",
    contractorTaxCode: "0401892837",
    contractorAccount: "19036582910012 - Techcombank Chi nhánh Đà Nẵng",
    bankName: "Techcombank Chi nhánh Đà Nẵng",
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
  }
];

// 3. Các đợt Đề nghị thanh toán Đầu vào với Hòa Bình
export const INITIAL_PAYMENTS = [
  {
    id: "pay-newtown-12",
    contractId: "cont-newtown",
    stageNumber: 12,
    paymentId: "20260918041200",
    title: "Thanh toán Đợt 12: Nghiệm thu hoàn thành sàn tầng 15 đến tầng 18 Tòa M1, M2",
    paymentType: "progress",
    dateRequested: "2026-09-18",
    periodFrom: "2026-08-01",
    periodTo: "2026-08-31",
    dueDate: "2026-09-30",
    status: "disbursed",
    disbursedDate: "2026-09-28",
    workCompletedValue: 5200000000,
    requestedAmount: 4850000000,
    approvedAmount: 4850000000,
    actualPaidToDate: 41250000000,
    advanceDeduction: 0,
    retentionDeduction: 260000000,
    amountInWords: "Bốn tỷ tám trăm năm mươi triệu đồng chẵn",
    notes: "Đã hoàn tất thanh toán & chuyển khoản ngân hàng ngày 28/09/2026."
  },
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
    prevPaidVal: 37400000000,       // [2] LK đề nghị TT kỳ trước
    prevDeductMat: 1850000000,      // [3] LK trừ vật tư kỳ trước
    prevDeductPpe: 180000000,       // [4] LK trừ BHLĐ kỳ trước
    prevDeductOther: 125000000,     // [5] LK trừ khác kỳ trước
    prevHoldAmount: 1000000000,     // [6] LK tạm giữ kỳ trước
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
    
    // Thuộc tính tương thích Form 03.a/TT
    cum_accepted_val_1: 48950000000,
    prev_requested_val_2: 37400000000,
    prev_deduct_material_3: 1850000000,
    prev_deduct_ppe_4: 180000000,
    prev_deduct_other_5: 125000000,
    prev_hold_6: 1000000000,
    cum_retention_7: 2447500000,
    cum_adv_recovery_8: 0,
    cum_mat_adv_recovery_9: 0,
    curr_deduct_material_12a: 320000000,
    curr_deduct_ppe_12b: 45000000,
    curr_deduct_other_12c: 15000000,
    curr_hold_12d: 100000000,
    
    workCompletedValue: 5506944444, // Giá trị chưa VAT
    advanceDeduction: 0,
    retentionDeduction: 275347222, // 5% bảo lưu kỳ này
    requestedAmount: 5467500000,    // Thực nhận = [11] - [12]
    netPayable: 5467500000,
    amountInWords: "Năm tỷ bốn trăm sáu mươi bảy triệu năm trăm nghìn đồng chẵn",
    notes: "Nghiệm thu đổ bê tông sàn tầng 20, 21, 22. Đã đối chiếu khối lượng thép với Ban Chỉ Huy Hòa Bình."
  }
];

// Danh mục hồ sơ pháp lý kiểm tra
export const INITIAL_CHECKLIST_TEMPLATE = [
  { id: "chk-1", name: "Giấy đề nghị thanh toán vốn đầu tư (Mẫu 04a/TT hoặc Mẫu Trang 1 Hòa Bình)", required: true },
  { id: "chk-2", name: "Bảng xác định giá trị khối lượng công việc hoàn thành (Mẫu số 03.a/TT)", required: true },
  { id: "chk-3", name: "Biên bản nghiệm thu công việc / giai đoạn hoàn thành có chữ ký A-B-TVGS", required: true },
  { id: "chk-4", name: "Hóa đơn Giá trị gia tăng (VAT 8%) điện tử hợp lệ của Nam Khôi", required: true },
  { id: "chk-5", name: "Bảng tính chi tiết khối lượng nghiệm thu A-B và hồ sơ chất lượng đi kèm", required: true },
  { id: "chk-6", name: "Chứng chỉ xuất xưởng, chứng nhận hợp quy / CO-CQ của cốt thép và bê tông", required: true },
  { id: "chk-7", name: "Thư bảo lãnh tạm ứng / Bảo lãnh thực hiện HĐ (bản hợp lệ từ Ngân hàng)", required: false },
  { id: "chk-8", name: "Nhật ký thi công công trình và kết quả thí nghiệm nén mẫu kiểm tra R28", required: true }
];

export const INITIAL_DOCUMENTS = {
  "pay-newtown-12": [
    { id: "doc-12-1", templateId: "chk-1", status: "passed", notes: "Đầy đủ dấu đỏ Hòa Bình & Nam Khôi" },
    { id: "doc-12-2", templateId: "chk-2", status: "passed", notes: "Mẫu 03.a/TT Đợt 12 nghiệm thu tầng 15-18" },
    { id: "doc-12-3", templateId: "chk-3", status: "passed", notes: "BBNT giai đoạn hoàn thành có chữ ký TVGS" },
    { id: "doc-12-4", templateId: "chk-4", status: "passed", notes: "Hóa đơn VAT Nam Khôi đã xuất đầy đủ" }
  ],
  "pay-newtown-13": [
    { id: "doc-13-1", templateId: "chk-1", status: "passed", notes: "Giấy đề nghị TT số 13/ĐNTT-NK" },
    { id: "doc-13-2", templateId: "chk-2", status: "passed", notes: "Bảng xác định khối lượng Mẫu 03.a/TT Đợt 13" },
    { id: "doc-13-3", templateId: "chk-3", status: "passed", notes: "Biên bản nghiệm thu công việc xây dựng tầng 18-22" },
    { id: "doc-13-4", templateId: "chk-4", status: "pending", notes: "Chờ phê duyệt xong số tiền thực nhận để xuất HĐ điện tử" },
    { id: "doc-13-5", templateId: "chk-5", status: "passed", notes: "Bảng tính chi tiết khối lượng cốt thép, coffa, bê tông" },
    { id: "doc-13-6", templateId: "chk-6", status: "passed", notes: "Chứng chỉ thí nghiệm nén mẫu bê tông B35 đạt mác R28" },
    { id: "doc-13-8", templateId: "chk-8", status: "passed", notes: "Nhật ký thi công điện tử đầy đủ xác nhận CHT Hòa Bình" }
  ]
};

// ==========================================
// PHẦN 3: TỔ ĐỘI THI CÔNG (2 TỔ ĐỘI TINH GỌN, DỄ XEM & CHỈNH SỬA)
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
  }
];

// Bảng đơn giá vào (Hòa Bình trả) vs đơn giá ra (Giao khoán cho 2 Tổ đội)
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
    note: "Gia công tại bãi, vận chuyển cẩu tháp, buộc kẽm hoàn thiện"
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
    note: "Ván khuôn nhôm phụ kiện nguyên khối, chu kỳ 5 ngày/sàn"
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
  }
];

// Sổ nhật ký Tạm ứng tiền mặt & Phạt hiện trường cho 2 tổ
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
  }
];

// Bảng 9 (Sửa lại): ĐỀ NGHỊ THANH TOÁN TỔ ĐỘI (Bước 3 - Trang 1)
export const INITIAL_TEAM_PAYMENTS = [
  {
    team_pay_id: "TD01-20261019-13",
    team_contract_id: 1,
    payment_id: "20261019054706",
    period_no: 13,
    period_name: "Thanh toán Đợt 13 (Kỳ tháng 09/2026)",
    team_code: "TD-THEP-01",
    team_name: "Tổ Thép - Đội Tuấn",
    leader_name: "Nguyễn Văn Tuấn",
    from_date: "2026-09-01",
    to_date: "2026-09-30",
    status: "APPROVED", // DRAFT, QS_CHECKED, APPROVED, PAID

    // Các chỉ tiêu tài chính y hệt Trang 1 Hồ sơ Thầu phụ
    cum_accepted_val: 15440000000,    // [1] Lũy kế GT nghiệm thu đến nay (từ Bước 2)
    prev_paid_val: 11850000000,       // [2] LK đề nghị TT các kỳ trước
    prev_deduct_mat: 280000000,       // [3] LK trừ vật tư kỳ trước
    prev_deduct_ppe: 65000000,        // [4] LK trừ BHLĐ kỳ trước
    prev_deduct_penalty: 20000000,    // [5] LK trừ phạt ATLĐ/kỹ thuật kỳ trước
    prev_hold_amount: 150000000,      // [6] LK tạm giữ kỳ trước
    cum_retention: 772000000,         // [7] LK % bảo lưu đến nay (5%)
    cum_cash_advance: 1200000000,     // [8] LK tạm ứng tiền mặt/lương tuần

    // Các khoản trừ kỳ này [12]
    curr_deduct_mat: 15000000,        // [12a] Trừ vật tư kỳ này
    curr_deduct_ppe: 8000000,         // [12b] Trừ BHLĐ kỳ này
    curr_deduct_penalty: 5000000,     // [12c] Trừ phạt kỳ này
    curr_hold_amount: 11000000,       // [12d] Tạm giữ kỳ này

    net_payable: 804000000,           // Giá trị thực thanh toán kỳ này
    amount_in_words: "Tám trăm linh bốn triệu đồng chẵn",
    created_at: "2026-10-19T14:00:00Z",

    // Tương thích thêm với các trường hiển thị cũ
    grossAmount: 1160000000,
    cashAdvance: 270000000,
    deductMaterial: 15000000,
    deductPpe: 8000000,
    deductViolation: 5000000,
    retentionAmount: 58000000,
    netPaid: 804000000
  },
  {
    team_pay_id: "TD02-20261019-13",
    team_contract_id: 2,
    payment_id: "20261019054706",
    period_no: 13,
    period_name: "Thanh toán Đợt 13 (Kỳ tháng 09/2026)",
    team_code: "TD-COFFA-02",
    team_name: "Tổ Coffa - Đội Hải",
    leader_name: "Trần Đình Hải",
    from_date: "2026-09-01",
    to_date: "2026-09-30",
    status: "APPROVED",

    // Các chỉ tiêu tài chính y hệt Trang 1 Hồ sơ Thầu phụ
    cum_accepted_val: 21350000000,    // [1] Lũy kế GT nghiệm thu đến nay (từ Bước 2)
    prev_paid_val: 16500000000,       // [2] LK đề nghị TT các kỳ trước
    prev_deduct_mat: 320000000,       // [3] LK trừ vật tư kỳ trước
    prev_deduct_ppe: 85000000,        // [4] LK trừ BHLĐ kỳ trước
    prev_deduct_penalty: 15000000,    // [5] LK trừ phạt ATLĐ/kỹ thuật kỳ trước
    prev_hold_amount: 200000000,      // [6] LK tạm giữ kỳ trước
    cum_retention: 1067500000,        // [7] LK % bảo lưu đến nay (5%)
    cum_cash_advance: 1800000000,     // [8] LK tạm ứng tiền mặt/lương tuần

    // Các khoản trừ kỳ này [12]
    curr_deduct_mat: 25000000,        // [12a] Trừ vật tư kỳ này
    curr_deduct_ppe: 12500000,        // [12b] Trừ BHLĐ kỳ này
    curr_deduct_penalty: 0,           // [12c] Trừ phạt kỳ này
    curr_hold_amount: 335000000,      // [12d] Tạm giữ kỳ này

    net_payable: 990000000,           // Giá trị thực thanh toán kỳ này
    amount_in_words: "Chín trăm chín mươi triệu đồng chẵn",
    created_at: "2026-10-19T14:30:00Z",

    grossAmount: 1450000000,
    cashAdvance: 350000000,
    deductMaterial: 25000000,
    deductPpe: 12500000,
    deductViolation: 0,
    retentionAmount: 72500000,
    netPaid: 990000000
  }
];

// Bảng 10 (Sửa lại): TỔNG HỢP KHỐI LƯỢNG & GIÁ TRỊ THANH TOÁN TỔ ĐỘI (Bước 1 & Bước 2)
export const INITIAL_TEAM_PAYMENT_DETAILS = [
  // 1. Tổ Thép - Đội Tuấn (TD01-20261019-13)
  {
    team_detail_id: 1,
    team_pay_id: "TD01-20261019-13",
    team_boq_id: "tboq-1",
    stt: 1,
    item_code: "2.1.1.1.2.10",
    description: "Gia công lắp dựng cốt thép dầm sàn Tòa M1, M2 (D10 - D32)",
    unit: "KG",
    unit_price_out: 2900,
    contract_qty: 4850000,
    
    // Bước 1: Khối lượng
    prev_qty: 3600000,
    curr_qty: 300000,
    cum_qty: 3900000,
    
    // Bước 2: Giá trị
    prev_val: 10440000000,
    curr_val: 870000000,
    cum_val: 11310000000,
    
    // Còn lại
    rem_qty: 950000,
    rem_val: 2755000000
  },
  {
    team_detail_id: 2,
    team_pay_id: "TD01-20261019-13",
    team_boq_id: "tboq-2",
    stt: 2,
    item_code: "2.1.1.1.2.11",
    description: "Gia công lắp dựng cốt thép cột vách lõi thang máy Tòa M1",
    unit: "KG",
    unit_price_out: 3200,
    contract_qty: 1650000,
    
    // Bước 1: Khối lượng
    prev_qty: 1200000,
    curr_qty: 90625,
    cum_qty: 1290625,
    
    // Bước 2: Giá trị
    prev_val: 3840000000,
    curr_val: 290000000,
    cum_val: 4130000000,
    
    // Còn lại
    rem_qty: 359375,
    rem_val: 1150000000
  },

  // 2. Tổ Coffa - Đội Hải (TD02-20261019-13)
  {
    team_detail_id: 3,
    team_pay_id: "TD02-20261019-13",
    team_boq_id: "tboq-3",
    stt: 1,
    item_code: "2.1.2.1.1.05",
    description: "Lắp dựng và tháo dỡ ván khuôn nhôm sàn căn hộ điển hình",
    unit: "m2",
    unit_price_out: 125000,
    contract_qty: 125000,
    
    // Bước 1: Khối lượng
    prev_qty: 92000,
    curr_qty: 8000,
    cum_qty: 100000,
    
    // Bước 2: Giá trị
    prev_val: 11500000000,
    curr_val: 1000000000,
    cum_val: 12500000000,
    
    // Còn lại
    rem_qty: 25000,
    rem_val: 3125000000
  },
  {
    team_detail_id: 4,
    team_pay_id: "TD02-20261019-13",
    team_boq_id: "tboq-4",
    stt: 2,
    item_code: "2.1.2.1.1.08",
    description: "Lắp dựng và tháo dỡ ván khuôn cột vách Tòa M1, M2",
    unit: "m2",
    unit_price_out: 140000,
    contract_qty: 85000,
    
    // Bước 1: Khối lượng
    prev_qty: 60000,
    curr_qty: 3214.2857,
    cum_qty: 63214.2857,
    
    // Bước 2: Giá trị
    prev_val: 8400000000,
    curr_val: 450000000,
    cum_val: 8850000000,
    
    // Còn lại
    rem_qty: 21785.7143,
    rem_val: 3050000000
  }
];

// Cấu hình Google Sheets cho Newtown
export const INITIAL_GSHEET_CONFIGS = [
  {
    id: "cfg-newtown-01",
    configId: "gsheet-01",
    tab_name: "DeNghiTT_HB",
    description: "Đề nghị thanh toán Đầu vào với Hòa Bình (Trang 1)",
    target_table: "payment_requests",
    range_cells: "A1:N50",
    sync_direction: "2 Chiều (App ↔ Sheet)",
    last_synced: "2026-11-13T07:30:00Z",
    sync_status: "SUCCESS"
  },
  {
    id: "cfg-newtown-02",
    configId: "gsheet-02",
    tab_name: "ThanhToan_ToDoi",
    description: "Bảng lương & quyết toán 2 Tổ đội thi công",
    target_table: "team_payments",
    range_cells: "A1:K30",
    sync_direction: "Xuất (App → Sheet)",
    last_synced: "2026-11-13T07:30:00Z",
    sync_status: "SUCCESS"
  },
  {
    id: "cfg-newtown-03",
    configId: "gsheet-03",
    tab_name: "SoTamUng_Phat",
    description: "Sổ nhật ký tạm ứng tiền mặt & phạt ATLĐ hiện trường",
    target_table: "team_transactions",
    range_cells: "A1:H100",
    sync_direction: "2 Chiều (App ↔ Sheet)",
    last_synced: "2026-11-13T07:30:00Z",
    sync_status: "SUCCESS"
  }
];

export const INITIAL_GSHEET_SYNC_LOGS = [
  {
    id: "log-01",
    sync_time: "2026-11-13T07:30:15Z",
    direction: "APP_TO_SHEET",
    target_table: "DeNghiTT_HB",
    rows_synced: 1,
    status: "SUCCESS",
    synced_by: "Dương Văn Trãi",
    error_message: null
  },
  {
    id: "log-02",
    sync_time: "2026-11-13T07:30:20Z",
    direction: "APP_TO_SHEET",
    target_table: "ThanhToan_ToDoi",
    rows_synced: 2,
    status: "SUCCESS",
    synced_by: "Dương Văn Trãi",
    error_message: null
  },
  {
    id: "log-03",
    sync_time: "2026-11-13T07:30:25Z",
    direction: "APP_TO_SHEET",
    target_table: "SoTamUng_Phat",
    rows_synced: 5,
    status: "SUCCESS",
    synced_by: "Dương Văn Trãi",
    error_message: null
  }
];

// Danh mục BOQ của HĐ 0103/NEWTOWN/NAMKHOI/2026
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

// Mẫu phụ fallback
export const SAMPLE_FORM_03A_SECTIONS = NEWTOWN_BOQ_SECTIONS;
