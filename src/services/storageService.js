import { 
  INITIAL_PROJECTS, 
  INITIAL_CONTRACTS, 
  INITIAL_PAYMENTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_CHECKLIST_TEMPLATE, 
  SAMPLE_FORM_03A_SECTIONS,
  INITIAL_TEAMS,
  INITIAL_TEAM_BOQ,
  INITIAL_TEAM_TRANSACTIONS,
  INITIAL_TEAM_PAYMENTS,
  INITIAL_TEAM_PAYMENT_DETAILS,
  INITIAL_GSHEET_CONFIGS,
  INITIAL_GSHEET_SYNC_LOGS,
  NEWTOWN_BOQ_SECTIONS
} from '../data/sampleData';

const STORAGE_KEYS = {
  PROJECTS: 'qltt_projects_v2',
  CONTRACTS: 'qltt_contracts_v2',
  PAYMENTS: 'qltt_payments_v2',
  DOCUMENTS: 'qltt_documents_v2',
  CHECKLIST_TEMPLATE: 'qltt_checklist_template_v2',
  WORK_ITEMS_PREFIX: 'qltt_work_items_v2_',
  PAYMENT_ITEMS_PREFIX: 'qltt_pay_items_v2_',
  TEAMS: 'qltt_teams_v2',
  TEAM_BOQ: 'qltt_team_boq_v2',
  TEAM_TRANSACTIONS: 'qltt_team_transactions_v2',
  TEAM_PAYMENTS: 'qltt_team_payments_v2',
  TEAM_PAYMENT_DETAILS: 'qltt_team_payment_details_v2',
  GSHEET_CONFIGS: 'qltt_gsheet_configs_v2',
  GSHEET_SYNC_LOGS: 'qltt_gsheet_sync_logs_v2'
};

export const storageService = {
  getProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  },
  saveProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getContracts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
      return data ? JSON.parse(data) : INITIAL_CONTRACTS;
    } catch {
      return INITIAL_CONTRACTS;
    }
  },
  saveContracts(contracts) {
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
  },

  getPayments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  },
  savePayments(payments) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getDocuments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },
  saveDocuments(documents) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  },

  getChecklistTemplates() {
    return INITIAL_CHECKLIST_TEMPLATE;
  },

  // 1. Quản lý danh mục đầu việc theo hợp đồng
  getWorkItems(contractId) {
    if (!contractId) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS_PREFIX + contractId);
      if (data) return JSON.parse(data);

      // Nếu là gói thầu cont-newtown: khởi tạo từ NEWTOWN_BOQ_SECTIONS
      if (contractId === 'cont-newtown') {
        localStorage.setItem(STORAGE_KEYS.WORK_ITEMS_PREFIX + contractId, JSON.stringify(NEWTOWN_BOQ_SECTIONS));
        return NEWTOWN_BOQ_SECTIONS;
      }

      // Nếu là gói thầu cont-1 mẫu: khởi tạo từ SAMPLE_FORM_03A_SECTIONS
      if (contractId === 'cont-1') {
        localStorage.setItem(STORAGE_KEYS.WORK_ITEMS_PREFIX + contractId, JSON.stringify(SAMPLE_FORM_03A_SECTIONS));
        return SAMPLE_FORM_03A_SECTIONS;
      }

      // Khởi tạo 4 phân nhóm chuẩn Nghị định 254/2025/NĐ-CP
      const defaultSections = [
        { sectionCode: "I", sectionName: "Công việc thực hiện thông qua hợp đồng", items: [] },
        { sectionCode: "II", sectionName: "Công việc thực hiện không thông qua hợp đồng (không bao gồm kinh phí bồi thường, hỗ trợ, tái định cư, không bao gồm chi phí quản lý dự án)", items: [] },
        { sectionCode: "III", sectionName: "Chi phí đảm bảo cho việc tổ chức thực hiện bồi thường, hỗ trợ, tái định cư", items: [] },
        { sectionCode: "IV", sectionName: "Chi phí quản lý dự án", items: [] }
      ];
      return defaultSections;
    } catch {
      return contractId === 'cont-1' ? SAMPLE_FORM_03A_SECTIONS : [];
    }
  },

  saveWorkItems(contractId, sections) {
    if (!contractId) return;
    localStorage.setItem(STORAGE_KEYS.WORK_ITEMS_PREFIX + contractId, JSON.stringify(sections));
  },

  // 2. Quản lý chi tiết khối lượng nghiệm thu từng đợt thanh toán
  getPaymentWorkItems(paymentId) {
    if (!paymentId) return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_ITEMS_PREFIX + paymentId);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  savePaymentWorkItems(paymentId, items) {
    if (!paymentId) return;
    localStorage.setItem(STORAGE_KEYS.PAYMENT_ITEMS_PREFIX + paymentId, JSON.stringify(items));
  },

  // 3. Tính toán và hợp nhất dữ liệu cho Mẫu 03.a/TT và 03.c/QT
  getSectionsForPayment(contractId, payment) {
    const baseSections = this.getWorkItems(contractId);
    if (!baseSections || baseSections.length === 0) {
      return SAMPLE_FORM_03A_SECTIONS;
    }

    const paymentItems = payment?.id ? this.getPaymentWorkItems(payment.id) : null;

    // Nếu đợt này đã có dữ liệu khối lượng nghiệm thu nhập tay:
    if (paymentItems && Array.isArray(paymentItems)) {
      return baseSections.map(sec => ({
        ...sec,
        items: sec.items.map(it => {
          const matched = paymentItems.find(p => (p.jobCode === it.jobCode || p.stt === it.stt || p.id === it.id));
          if (!matched) return it;

          const acceptedQty = Number(matched.thisPeriodAcceptedQty) || 0;
          const unitPrice = Number(it.unitPriceContract) || 0;
          const acceptedVal = acceptedQty * unitPrice;
          const prevPaidQty = Number(it.prevPaidQty) || 0;
          const prevPaidVal = Number(it.prevPaidVal) || 0;
          const cumulativeQty = prevPaidQty + acceptedQty;
          const cumulativeVal = prevPaidVal + acceptedVal;

          return {
            ...it,
            thisPeriodAcceptedQty: acceptedQty,
            thisPeriodRequestedQty: acceptedQty,
            thisPeriodAcceptedVal: acceptedVal,
            thisPeriodRequestedVal: acceptedVal,
            totalCumulativeQty: cumulativeQty,
            totalPaidToDateVal: cumulativeVal,
            note: matched.note !== undefined ? matched.note : it.note
          };
        })
      }));
    }

    // Nếu chưa có dữ liệu riêng: trả về baseSections
    return baseSections;
  },

  // 1. Quản lý Tổ đội thi công
  getTeams() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
      return data ? JSON.parse(data) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  },
  saveTeams(teams) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  },

  // 2. Bảng BOQ đơn giá giao khoán tổ đội
  getTeamBOQ() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM_BOQ);
      return data ? JSON.parse(data) : INITIAL_TEAM_BOQ;
    } catch {
      return INITIAL_TEAM_BOQ;
    }
  },
  saveTeamBOQ(items) {
    localStorage.setItem(STORAGE_KEYS.TEAM_BOQ, JSON.stringify(items));
  },

  // 3. Sổ nhật ký tạm ứng & phạt hiện trường
  getTeamTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM_TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TEAM_TRANSACTIONS;
    } catch {
      return INITIAL_TEAM_TRANSACTIONS;
    }
  },
  saveTeamTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TEAM_TRANSACTIONS, JSON.stringify(transactions));
  },

  // 4. Thanh toán lương tổ đội theo kỳ
  getTeamPayments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM_PAYMENTS);
      return data ? JSON.parse(data) : INITIAL_TEAM_PAYMENTS;
    } catch {
      return INITIAL_TEAM_PAYMENTS;
    }
  },
  saveTeamPayments(payments) {
    localStorage.setItem(STORAGE_KEYS.TEAM_PAYMENTS, JSON.stringify(payments));
  },

  // 4b. Chi tiết nghiệm thu khối lượng & giá trị tổ đội (Bước 1 & Bước 2)
  getTeamPaymentDetails(teamPayId = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM_PAYMENT_DETAILS);
      const list = data ? JSON.parse(data) : INITIAL_TEAM_PAYMENT_DETAILS;
      return teamPayId ? list.filter(d => d.team_pay_id === teamPayId) : list;
    } catch {
      return teamPayId ? INITIAL_TEAM_PAYMENT_DETAILS.filter(d => d.team_pay_id === teamPayId) : INITIAL_TEAM_PAYMENT_DETAILS;
    }
  },
  saveTeamPaymentDetails(details) {
    localStorage.setItem(STORAGE_KEYS.TEAM_PAYMENT_DETAILS, JSON.stringify(details));
  },

  // 5. Cấu hình & Nhật ký Google Sheets
  getGSheetConfigs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GSHEET_CONFIGS);
      return data ? JSON.parse(data) : INITIAL_GSHEET_CONFIGS;
    } catch {
      return INITIAL_GSHEET_CONFIGS;
    }
  },
  saveGSheetConfigs(configs) {
    localStorage.setItem(STORAGE_KEYS.GSHEET_CONFIGS, JSON.stringify(configs));
  },

  getGSheetSyncLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GSHEET_SYNC_LOGS);
      return data ? JSON.parse(data) : INITIAL_GSHEET_SYNC_LOGS;
    } catch {
      return INITIAL_GSHEET_SYNC_LOGS;
    }
  },
  saveGSheetSyncLogs(logs) {
    localStorage.setItem(STORAGE_KEYS.GSHEET_SYNC_LOGS, JSON.stringify(logs));
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(INITIAL_CONTRACTS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(INITIAL_TEAMS));
    localStorage.setItem(STORAGE_KEYS.TEAM_BOQ, JSON.stringify(INITIAL_TEAM_BOQ));
    localStorage.setItem(STORAGE_KEYS.TEAM_TRANSACTIONS, JSON.stringify(INITIAL_TEAM_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.TEAM_PAYMENTS, JSON.stringify(INITIAL_TEAM_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.TEAM_PAYMENT_DETAILS, JSON.stringify(INITIAL_TEAM_PAYMENT_DETAILS));
    localStorage.setItem(STORAGE_KEYS.GSHEET_CONFIGS, JSON.stringify(INITIAL_GSHEET_CONFIGS));
    localStorage.setItem(STORAGE_KEYS.GSHEET_SYNC_LOGS, JSON.stringify(INITIAL_GSHEET_SYNC_LOGS));
    localStorage.removeItem(STORAGE_KEYS.WORK_ITEMS_PREFIX + 'cont-1');
    localStorage.removeItem(STORAGE_KEYS.WORK_ITEMS_PREFIX + 'cont-newtown');
  }
};

// Utilities for formatting currency and numbers
export function formatVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatBillion(amount) {
  if (!amount || isNaN(amount)) return '0 tỷ';
  const inBillion = amount / 1000000000;
  return `${inBillion.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`;
}

export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function formatDate(dateStr) {
  if (!dateStr) return '---';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  } catch {
    return dateStr;
  }
}

// Tính toán thống kê theo hợp đồng
export function calculateContractStats(contract, payments = []) {
  const contractPayments = payments.filter(p => p.contractId === contract.id);
  const contractVal = Number(contract.adjustedValue || contract.originalValue || 0);

  // Các đợt đã duyệt hoặc đã chi
  const effectivePayments = contractPayments.filter(p => ['disbursed', 'approved'].includes(p.status));
  const disbursedPayments = contractPayments.filter(p => p.status === 'disbursed');

  // Tổng tạm ứng đã cấp
  const totalAdvancePaid = contractPayments
    .filter(p => p.paymentType === 'advance' && ['disbursed', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + (Number(p.approvedAmount || p.requestedAmount || 0)), 0);

  // Tổng tạm ứng đã thu hồi
  const totalAdvanceRecovered = effectivePayments.reduce((sum, p) => sum + (Number(p.advanceDeduction || 0)), 0);

  // Dư nợ tạm ứng còn lại cần thu hồi
  const advanceRemaining = Math.max(0, totalAdvancePaid - totalAdvanceRecovered);

  // Tổng tiền bảo hành giữ lại
  const totalRetention = effectivePayments.reduce((sum, p) => sum + (Number(p.retentionDeduction || 0)), 0);

  // Tổng giá trị khối lượng thực hiện hoàn thành
  const totalWorkCompleted = effectivePayments.reduce((sum, p) => sum + (Number(p.workCompletedValue || 0)), 0);

  // Tổng tiền đã thực chi giải ngân
  const totalDisbursed = disbursedPayments.reduce((sum, p) => sum + (Number(p.approvedAmount || p.requestedAmount || 0)), 0);

  // Tỷ lệ giải ngân
  const disbursedRate = contractVal > 0 ? (totalDisbursed / contractVal) * 100 : 0;
  const workCompletedRate = contractVal > 0 ? (totalWorkCompleted / contractVal) * 100 : 0;

  return {
    contractVal,
    totalAdvancePaid,
    totalAdvanceRecovered,
    advanceRemaining,
    totalRetention,
    totalWorkCompleted,
    totalDisbursed,
    disbursedRate,
    workCompletedRate,
    pendingApprovalCount: contractPayments.filter(p => p.status === 'pending_approval' || p.status === 'under_review').length
  };
}// Chuyển đổi số tiền thành chữ tiếng Việt chuẩn văn bản hành chính
export function numberToVietnameseWords(amount) {
  if (!amount || isNaN(amount) || amount === 0) return 'Không đồng';
  const ChuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const Tien = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

  function docSo3ChuSo(baso) {
    let tram = Math.floor(baso / 100);
    let chuc = Math.floor((baso % 100) / 10);
    let donvi = baso % 10;
    let ketQua = '';

    if (tram === 0 && chuc === 0 && donvi === 0) return '';
    if (tram !== 0) {
      ketQua += ChuSo[tram] + ' trăm ';
      if (chuc === 0 && donvi !== 0) ketQua += 'lẻ ';
    }
    if (chuc !== 0 && chuc !== 1) {
      ketQua += ChuSo[chuc] + ' mươi';
      if (chuc === 0 && donvi !== 0) ketQua = ketQua + ' linh ';
    }
    if (chuc === 1) ketQua += 'mười';
    switch (donvi) {
      case 1:
        if (chuc !== 0 && chuc !== 1) ketQua += ' mốt';
        else ketQua += ' ' + ChuSo[donvi];
        break;
      case 5:
        if (chuc === 0) ketQua += ' ' + ChuSo[donvi];
        else ketQua += ' lăm';
        break;
      default:
        if (donvi !== 0) ketQua += ' ' + ChuSo[donvi];
        break;
    }
    return ketQua;
  }

  let so = Math.round(Math.abs(amount));
  let viTri = [];
  while (so > 0) {
    viTri.push(so % 1000);
    so = Math.floor(so / 1000);
  }

  let chuoi = '';
  for (let i = viTri.length - 1; i >= 0; i--) {
    let doc = docSo3ChuSo(viTri[i]);
    if (doc !== '') {
      chuoi += doc + Tien[i] + ' ';
    }
  }

  chuoi = chuoi.trim();
  if (!chuoi) return 'Không đồng';
  chuoi = chuoi.charAt(0).toUpperCase() + chuoi.slice(1) + ' đồng chẵn.';
  return chuoi;
}
