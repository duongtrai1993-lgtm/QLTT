import { INITIAL_PROJECTS, INITIAL_CONTRACTS, INITIAL_PAYMENTS, INITIAL_DOCUMENTS, INITIAL_CHECKLIST_TEMPLATE } from '../data/sampleData';

const STORAGE_KEYS = {
  PROJECTS: 'qltt_projects_v1',
  CONTRACTS: 'qltt_contracts_v1',
  PAYMENTS: 'qltt_payments_v1',
  DOCUMENTS: 'qltt_documents_v1',
  CHECKLIST_TEMPLATE: 'qltt_checklist_template_v1'
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

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(INITIAL_CONTRACTS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
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
}