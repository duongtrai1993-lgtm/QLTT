import { INITIAL_PROJECTS, INITIAL_CONTRACTS, INITIAL_PAYMENTS, INITIAL_DOCUMENTS, INITIAL_CHECKLIST_TEMPLATE, SAMPLE_FORM_03A_SECTIONS } from '../data/sampleData';

const STORAGE_KEYS = {
  PROJECTS: 'qltt_projects_v1',
  CONTRACTS: 'qltt_contracts_v1',
  PAYMENTS: 'qltt_payments_v1',
  DOCUMENTS: 'qltt_documents_v1',
  CHECKLIST_TEMPLATE: 'qltt_checklist_template_v1',
  WORK_ITEMS_PREFIX: 'qltt_work_items_',
  PAYMENT_ITEMS_PREFIX: 'qltt_pay_items_'
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

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(INITIAL_CONTRACTS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.removeItem(STORAGE_KEYS.WORK_ITEMS_PREFIX + 'cont-1');
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
