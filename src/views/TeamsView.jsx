import React, { useState } from 'react';
import { 
  Users, HardHat, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, 
  Plus, Calendar, AlertTriangle, ShieldCheck, FileSpreadsheet, CheckCircle2, 
  Filter, Search, ArrowRight, Printer, Receipt, Wallet, Layers, Eye, FileText, ChevronRight
} from 'lucide-react';
import { storageService, formatVND, formatNumber, formatDate } from '../services/storageService';
import { FormTeamPaymentTrang1Modal } from '../components/FormTeamPaymentTrang1Modal';

export function TeamsView({ projects = [], contracts = [] }) {
  const [teams, setTeams] = useState(() => storageService.getTeams());
  const [teamBOQ, setTeamBOQ] = useState(() => storageService.getTeamBOQ());
  const [transactions, setTransactions] = useState(() => storageService.getTeamTransactions());
  const [teamPayments, setTeamPayments] = useState(() => storageService.getTeamPayments());
  const [teamPaymentDetails, setTeamPaymentDetails] = useState(() => storageService.getTeamPaymentDetails());

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'boq_margin' | 'transactions' | 'payments'
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [paymentSubView, setPaymentSubView] = useState('trang1'); // 'trang1' (Bước 3) | 'details' (Bước 1 & 2)
  const [selectedTeamPaymentForModal, setSelectedTeamPaymentForModal] = useState(null);

  // Sổ khấu trừ đầu vào [12a, 12b, 12c, 12d]
  const [deductions, setDeductions] = useState(() => storageService.getDeductionEntries());
  const [transSubView, setTransSubView] = useState('deductions'); // 'deductions' (Bảng 11) | 'advances' (Sổ tạm ứng tuần)
  const [deductCategoryFilter, setDeductCategoryFilter] = useState('all'); // 'all' | '12a' | '12b' | '12c' | '12d'
  const [deductLevelFilter, setDeductLevelFilter] = useState('all'); // 'all' | 'SUBCONTRACTOR' | 'TEAM'
  const [deductStatusFilter, setDeductStatusFilter] = useState('all'); // 'all' | 'CONFIRMED' | 'PENDING' | 'RELEASED'

  // Form thêm khoản trừ mới [12a-12d]
  const [showAddDeduct, setShowAddDeduct] = useState(false);
  const [newDeductCat, setNewDeductCat] = useState('12a');
  const [newDeductLevel, setNewDeductLevel] = useState('TEAM');
  const [newDeductTeam, setNewDeductTeam] = useState(teams[0]?.teamCode || '');
  const [newDeductDate, setNewDeductDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDeductVoucher, setNewDeductVoucher] = useState('');
  const [newDeductItemName, setNewDeductItemName] = useState('');
  const [newDeductUnit, setNewDeductUnit] = useState('Bộ');
  const [newDeductQty, setNewDeductQty] = useState('1');
  const [newDeductUnitPrice, setNewDeductUnitPrice] = useState('');
  const [newDeductParentId, setNewDeductParentId] = useState('');
  const [newDeductNote, setNewDeductNote] = useState('');

  // Form thêm giao dịch ứng/phạt
  const [showAddTrans, setShowAddTrans] = useState(false);
  const [newTransTeam, setNewTransTeam] = useState(teams[0]?.teamCode || '');
  const [newTransType, setNewTransType] = useState('ADVANCE');
  const [newTransAmount, setNewTransAmount] = useState('');
  const [newTransDate, setNewTransDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTransNote, setNewTransNote] = useState('');

  // Form thêm tổ đội
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newMembersCount, setNewMembersCount] = useState(25);
  const [newBankAccount, setNewBankAccount] = useState('');

  // Thống kê nhanh
  const totalTeams = teams.length;
  const totalWorkers = teams.reduce((s, t) => s + (Number(t.membersCount) || 0), 0);
  const totalGrossLabor = teamPayments.reduce((s, p) => s + (Number(p.grossAmount) || 0), 0);
  const totalCashAdvances = transactions.filter(t => t.transType === 'ADVANCE').reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalNetPaidLabor = teamPayments.reduce((s, p) => s + (Number(p.netPaid) || 0), 0);

  // Xử lý thêm giao dịch ứng/phạt
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransAmount || Number(newTransAmount) <= 0) return;

    const team = teams.find(t => t.teamCode === newTransTeam);
    const transTypeNames = {
      ADVANCE: 'Tạm ứng tiền mặt lương tuần',
      PENALTY: 'Phạt vi phạm an toàn lao động',
      PPE: 'Trừ tiền mua đồ BHLĐ / Đồng phục',
      MATERIAL: 'Trừ tiền vật tư hao hụt vượt định mức'
    };

    const newTrans = {
      transId: `tr-${Date.now()}`,
      teamCode: newTransTeam,
      teamName: team?.teamName || newTransTeam,
      transDate: newTransDate,
      transType: newTransType,
      transTypeName: transTypeNames[newTransType] || 'Khác',
      amount: Number(newTransAmount),
      note: newTransNote.trim()
    };

    const updated = [newTrans, ...transactions];
    setTransactions(updated);
    storageService.saveTeamTransactions(updated);

    setNewTransAmount('');
    setNewTransNote('');
    setShowAddTrans(false);
  };

  // Xử lý thêm khoản khấu trừ mới [12a - 12d]
  const handleAddDeduction = (e) => {
    e.preventDefault();
    const qty = Number(newDeductQty) || 1;
    const price = Number(newDeductUnitPrice) || 0;
    if (price <= 0 || !newDeductItemName.trim()) return;

    const matchedTeam = teams.find(t => t.teamCode === newDeductTeam);
    const newEntry = {
      entry_id: Date.now(),
      deduct_category: newDeductCat,
      target_level: newDeductLevel,
      payment_id: "20261019054706",
      team_pay_id: newDeductLevel === 'TEAM' ? (newDeductTeam === 'TD-THEP-01' ? 'TD01-20261019-13' : 'TD02-20261019-13') : null,
      team_id: newDeductLevel === 'TEAM' ? (matchedTeam ? matchedTeam.teamId : 1) : null,
      entry_date: newDeductDate,
      voucher_no: newDeductVoucher.trim() || `PKT-${Date.now()}`,
      item_name: newDeductItemName.trim(),
      unit: newDeductUnit.trim() || 'Lần',
      qty: qty,
      unit_price: price,
      total_amount: qty * price,
      parent_entry_id: newDeductParentId ? Number(newDeductParentId) : null,
      evidence_url: null,
      status: 'CONFIRMED',
      note: newDeductNote.trim(),
      created_by: 'Dương Văn Trãi',
      created_at: new Date().toISOString()
    };

    const updated = [newEntry, ...deductions];
    setDeductions(updated);
    storageService.saveDeductionEntries(updated);

    setShowAddDeduct(false);
    setNewDeductItemName('');
    setNewDeductVoucher('');
    setNewDeductUnitPrice('');
    setNewDeductNote('');
  };

  const handleUpdateDeductStatus = (entryId, newStatus) => {
    const updated = storageService.updateDeductionEntryStatus(entryId, newStatus);
    setDeductions(updated);
  };

  // Xử lý thêm tổ đội mới
  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newLeaderName.trim()) return;

    const nextIdx = teams.length + 1;
    const newTeam = {
      teamId: `team-${Date.now()}`,
      teamCode: `TD-${String(nextIdx).padStart(2, '0')}`,
      teamName: newTeamName.trim(),
      leaderName: newLeaderName.trim(),
      phone: newPhone.trim(),
      idCard: 'Đang cập nhật',
      bankAccount: newBankAccount.trim() || 'Chưa có',
      bankName: 'Vietcombank',
      specialty: newSpecialty.trim() || 'Xây lắp chung',
      membersCount: Number(newMembersCount) || 20,
      status: 'ACTIVE'
    };

    const updated = [...teams, newTeam];
    setTeams(updated);
    storageService.saveTeams(updated);

    setNewTeamName('');
    setNewLeaderName('');
    setNewPhone('');
    setNewSpecialty('');
    setNewBankAccount('');
    setShowAddTeam(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl shadow-xs">
              <HardHat className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Quản Lý Tổ Đội & Chi Tiền (Đầu Ra)
                </h2>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded">
                  Hòa Bình • Nam Khôi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý khoán việc tổ đội • So sánh đơn giá vào/ra tính độ dôi • Sổ ứng lương & Quyết toán theo kỳ
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddTrans(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Wallet className="w-4 h-4" />
            <span>+ Ghi Sổ Ứng / Phạt</span>
          </button>

          <button
            onClick={() => setShowAddTeam(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm Tổ Đội Mới</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổ Đội Thi Công</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">{totalTeams} Tổ</span>
            <span className="text-xs text-slate-500">({totalWorkers} nhân sự)</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">100% đang hoạt động tại Newtown</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Giá Trị Nghiệm Thu Kỳ Này</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 text-xl font-extrabold text-slate-900">
            {formatVND(totalGrossLabor)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Đợt 13 (Tháng 09/2026)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Đã Tạm Ứng Tiền Mặt</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Wallet className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 text-xl font-extrabold text-amber-600">
            {formatVND(totalCashAdvances)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Đã khấu trừ trực tiếp vào kỳ lương</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Thực Chi Lương Cho Tổ</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 text-xl font-extrabold text-indigo-700">
            {formatVND(totalNetPaidLabor)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sau khi trừ ứng, BHLĐ, 5% bảo lưu</p>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 rounded-t-xl px-4 flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Tổ Đội ({teams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('boq_margin')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'boq_margin'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Đơn Giá Giao Khoán & Độ Dôi Lợi Nhuận</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px]">Tự động so khớp</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'transactions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Sổ Khấu Trừ [12a - 12d] & Tạm Ứng ({deductions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'payments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Bảng Lương & Quyết Toán Đợt 13</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: DANH SÁCH TỔ ĐỘI */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(team => (
            <div key={team.teamId} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono text-xs font-bold rounded">
                      {team.teamCode}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{team.teamName}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Chuyên môn: <strong className="text-slate-700">{team.specialty}</strong></p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                  Đang thi công
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400">Đội trưởng:</span>
                  <p className="font-bold text-slate-800">{team.leaderName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Điện thoại:</span>
                  <p className="font-bold text-blue-600">{team.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Số nhân công:</span>
                  <p className="font-bold text-slate-800">{team.membersCount} người</p>
                </div>
                <div>
                  <span className="text-slate-400">Số tài khoản:</span>
                  <p className="font-bold text-slate-800 truncate">{team.bankAccount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Hợp đồng giao khoán: <strong>Newtown Tòa M1, M2</strong></span>
                <button
                  onClick={() => {
                    setSelectedTeamFilter(team.teamCode);
                    setActiveTab('boq_margin');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <span>Xem đơn giá khoán</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ĐƠN GIÁ GIAO KHOÁN & ĐỘ DÔI LỢI NHUẬN */}
      {activeTab === 'boq_margin' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Lọc theo Tổ:</span>
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
              >
                <option value="all">Tất cả tổ đội ({teams.length})</option>
                {teams.map(t => (
                  <option key={t.teamCode} value={t.teamCode}>{t.teamName}</option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Độ dôi lợi nhuận = Đơn giá Hòa Bình trả (Vào) trừ Đơn giá giao khoán Tổ đội (Ra)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 text-center">STT</th>
                  <th className="px-3 py-3">Mã Công Việc</th>
                  <th className="px-4 py-3">Nội Dung Chi Tiết</th>
                  <th className="px-3 py-3 text-center">ĐVT</th>
                  <th className="px-3 py-3">Tổ Đội Thực Hiện</th>
                  <th className="px-3 py-3 text-right">Đơn Giá Vào (Hòa Bình)</th>
                  <th className="px-3 py-3 text-right">Đơn Giá Ra (Tổ Đội)</th>
                  <th className="px-3 py-3 text-right">Độ Dôi Lợi Nhuận</th>
                  <th className="px-3 py-3 text-right">Tỷ Lệ Lãi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teamBOQ
                  .filter(b => selectedTeamFilter === 'all' || b.teamCode === selectedTeamFilter)
                  .map((item, idx) => {
                    const diffPrice = item.unitPriceIn - item.unitPriceOut;
                    const marginPercent = ((diffPrice / item.unitPriceIn) * 100).toFixed(1);

                    return (
                      <tr key={item.teamBoqId} className="hover:bg-slate-50 transition">
                        <td className="px-3 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-3 font-mono font-bold text-blue-700">{item.itemCode}</td>
                        <td className="px-4 py-3 font-medium text-slate-900 max-w-sm">
                          <div>{item.description}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{item.note}</div>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-slate-600">{item.unit}</td>
                        <td className="px-3 py-3 font-semibold text-slate-700">{item.teamName}</td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">
                          {formatNumber(item.unitPriceIn)} đ
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-amber-700">
                          {formatNumber(item.unitPriceOut)} đ
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-extrabold text-emerald-700 bg-emerald-50/40">
                          +{formatNumber(diffPrice)} đ
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded text-[11px]">
                            +{marginPercent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SỔ KHẤU TRỪ [12a - 12d] & TẠM ỨNG HIỆN TRƯỜNG */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
          
          {/* Header & Sub-view Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded">Đợt 13</span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Bảng Nhập Liệu Khấu Trừ [12a, 12b, 12c, 12d] & Sổ Tạm Ứng
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cung cấp chi tiết chứng từ đối chiếu đầu vào cho Trang 1 (Thầu chính Hòa Bình & Tổ đội)
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setTransSubView('deductions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  transSubView === 'deductions'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Chi Tiết Khoản Trừ [12a - 12d] ({deductions.length})</span>
              </button>

              <button
                onClick={() => setTransSubView('advances')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  transSubView === 'advances'
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Sổ Tạm Ứng Lương Tuần ({transactions.length})</span>
              </button>
            </div>
          </div>

          {/* SUB-VIEW 1: BẢNG NHẬP LIỆU ĐẦU VÀO KHOẢN TRỪ [12a, 12b, 12c, 12d] */}
          {transSubView === 'deductions' && (
            <div className="space-y-4">
              
              {/* 4 Summary Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <span>[12a] Vật Tư Cấp</span>
                    <span className="px-1.5 py-0.2 bg-rose-200 text-rose-900 rounded text-[10px]">Kho</span>
                  </div>
                  <p className="text-base font-black text-rose-900 mt-1 font-mono">
                    {formatVND(deductions.filter(d => d.deduct_category === '12a' && d.status !== 'RELEASED').reduce((s, d) => s + Number(d.total_amount), 0))}
                  </p>
                  <p className="text-[10px] text-rose-600 mt-0.5">Bê tông, thép, que hàn, ty ren</p>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                    <span>[12b] BHLĐ & Điện Nước</span>
                    <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded text-[10px]">An Toàn</span>
                  </div>
                  <p className="text-base font-black text-amber-900 mt-1 font-mono">
                    {formatVND(deductions.filter(d => d.deduct_category === '12b' && d.status !== 'RELEASED').reduce((s, d) => s + Number(d.total_amount), 0))}
                  </p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Đồng phục, ủng, trạm biến áp</p>
                </div>

                <div className="bg-purple-50/70 border border-purple-200 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-800">
                    <span>[12c] Phạt Vi Phạm</span>
                    <span className="px-1.5 py-0.2 bg-purple-200 text-purple-900 rounded text-[10px]">HSE</span>
                  </div>
                  <p className="text-base font-black text-purple-900 mt-1 font-mono">
                    {formatVND(deductions.filter(d => d.deduct_category === '12c' && d.status !== 'RELEASED').reduce((s, d) => s + Number(d.total_amount), 0))}
                  </p>
                  <p className="text-[10px] text-purple-600 mt-0.5">Lưới chắn bụi, dây an toàn</p>
                </div>

                <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-800">
                    <span>[12d] Tạm Giữ Kỹ Thuật</span>
                    <span className="px-1.5 py-0.2 bg-blue-200 text-blue-900 rounded text-[10px]">KCS</span>
                  </div>
                  <p className="text-base font-black text-blue-900 mt-1 font-mono">
                    {formatVND(deductions.filter(d => d.deduct_category === '12d' && d.status !== 'RELEASED').reduce((s, d) => s + Number(d.total_amount), 0))}
                  </p>
                  <p className="text-[10px] text-blue-600 mt-0.5">Hoàn trả khi nghiệm thu đạt</p>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={deductCategoryFilter}
                    onChange={(e) => setDeductCategoryFilter(e.target.value)}
                    className="p-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="all">Tất cả hạng mục [12]</option>
                    <option value="12a">[12a] Trừ Vật tư</option>
                    <option value="12b">[12b] Trừ BHLĐ / Điện nước</option>
                    <option value="12c">[12c] Trừ Phạt vi phạm</option>
                    <option value="12d">[12d] Tạm giữ kỹ thuật</option>
                  </select>

                  <select
                    value={deductLevelFilter}
                    onChange={(e) => setDeductLevelFilter(e.target.value)}
                    className="p-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="all">Tất cả cấp áp dụng</option>
                    <option value="SUBCONTRACTOR">Hòa Bình trừ Nam Khôi</option>
                    <option value="TEAM">Nam Khôi trừ Tổ đội</option>
                  </select>

                  <select
                    value={deductStatusFilter}
                    onChange={(e) => setDeductStatusFilter(e.target.value)}
                    className="p-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="CONFIRMED">Đã chốt trừ (CONFIRMED)</option>
                    <option value="PENDING">Chờ đối chiếu (PENDING)</option>
                    <option value="RELEASED">Đã hoàn trả 12d (RELEASED)</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddDeduct(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nhập Khoản Trừ Mới</span>
                </button>
              </div>

              {/* Table deduction_entries */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="border border-slate-200 px-3 py-2.5 text-center">Mục</th>
                      <th className="border border-slate-200 px-3 py-2.5">Cấp & Đối Tượng</th>
                      <th className="border border-slate-200 px-3 py-2.5">Số Chứng Từ & Ngày</th>
                      <th className="border border-slate-200 px-4 py-2.5">Tên Vật Tư / Nội Dung Phạt / Tạm Giữ</th>
                      <th className="border border-slate-200 px-2 py-2.5 text-center">ĐVT</th>
                      <th className="border border-slate-200 px-2 py-2.5 text-right">SL</th>
                      <th className="border border-slate-200 px-3 py-2.5 text-right">Đơn Giá</th>
                      <th className="border border-slate-200 px-3 py-2.5 text-right font-black">Thành Tiền (VND)</th>
                      <th className="border border-slate-200 px-3 py-2.5 text-center">Gốc Trừ</th>
                      <th className="border border-slate-200 px-3 py-2.5 text-center">Trạng Thái</th>
                      <th className="border border-slate-200 px-3 py-2.5 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {deductions
                      .filter(d => {
                        if (deductCategoryFilter !== 'all' && d.deduct_category !== deductCategoryFilter) return false;
                        if (deductLevelFilter !== 'all' && d.target_level !== deductLevelFilter) return false;
                        if (deductStatusFilter !== 'all' && d.status !== deductStatusFilter) return false;
                        return true;
                      })
                      .map((d) => {
                        const isSub = d.target_level === 'SUBCONTRACTOR';
                        const team = teams.find(t => t.teamId === d.team_id || t.teamCode === d.team_id);

                        return (
                          <tr key={d.entry_id} className="hover:bg-slate-50 transition">
                            <td className="border border-slate-200 px-3 py-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] font-mono ${
                                d.deduct_category === '12a' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                                d.deduct_category === '12b' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                d.deduct_category === '12c' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                                'bg-blue-100 text-blue-800 border border-blue-300'
                              }`}>
                                {d.deduct_category}
                              </span>
                            </td>

                            <td className="border border-slate-200 px-3 py-2.5">
                              {isSub ? (
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                                  Hòa Bình ➔ Nam Khôi
                                </span>
                              ) : (
                                <span className="font-bold text-indigo-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                  Nam Khôi ➔ {d.team_pay_id?.includes('TD01') ? 'Tổ Thép' : 'Tổ Coffa'}
                                </span>
                              )}
                            </td>

                            <td className="border border-slate-200 px-3 py-2.5">
                              <p className="font-mono font-bold text-slate-800 text-[11px]">{d.voucher_no || '---'}</p>
                              <p className="text-[10px] text-slate-500">{formatDate(d.entry_date)}</p>
                            </td>

                            <td className="border border-slate-200 px-4 py-2.5 text-slate-900">
                              <p className="font-semibold">{d.item_name}</p>
                              {d.note && <p className="text-[10px] text-slate-500 italic mt-0.5">{d.note}</p>}
                            </td>

                            <td className="border border-slate-200 px-2 py-2.5 text-center font-bold text-slate-600">{d.unit || 'Lần'}</td>
                            <td className="border border-slate-200 px-2 py-2.5 text-right font-mono font-bold">{formatNumber(d.qty)}</td>
                            <td className="border border-slate-200 px-3 py-2.5 text-right font-mono text-slate-700">{formatNumber(d.unit_price)}</td>
                            
                            <td className="border border-slate-200 px-3 py-2.5 text-right font-mono font-black text-rose-700 bg-rose-50/20">
                              {formatVND(d.total_amount)}
                            </td>

                            <td className="border border-slate-200 px-3 py-2.5 text-center text-[10px]">
                              {d.parent_entry_id ? (
                                <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  Từ mục #{d.parent_entry_id}
                                </span>
                              ) : (
                                <span className="text-slate-400">---</span>
                              )}
                            </td>

                            <td className="border border-slate-200 px-3 py-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                d.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                                d.status === 'RELEASED' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {d.status === 'CONFIRMED' ? 'Đã chốt trừ' :
                                 d.status === 'RELEASED' ? 'Đã hoàn trả' : 'Chờ đối chiếu'}
                              </span>
                            </td>

                            <td className="border border-slate-200 px-3 py-2.5 text-center">
                              {d.deduct_category === '12d' && d.status === 'CONFIRMED' ? (
                                <button
                                  onClick={() => handleUpdateDeductStatus(d.entry_id, 'RELEASED')}
                                  title="Đã sửa xong lỗi / Nộp đủ chứng chỉ ➔ Hoàn trả khoản tạm giữ 12d"
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition shadow-xs"
                                >
                                  Hoàn trả 12d
                                </button>
                              ) : d.deduct_category === '12d' && d.status === 'RELEASED' ? (
                                <span className="text-[10px] text-emerald-700 font-bold">✓ Đã trả</span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Đã chốt</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* SUB-VIEW 2: SỔ NHẬT KÝ TẠM ỨNG LƯƠNG TUẦN */}
          {transSubView === 'advances' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Sổ Nhật Ký Tạm Ứng Tiền Mặt Lương Tuần</h4>
                  <p className="text-xs text-slate-500">Ghi nhận các đợt ứng tiền mặt trực tiếp cho công nhân tổ đội hàng tuần</p>
                </div>
                <button
                  onClick={() => setShowAddTrans(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ghi phiếu ứng mới</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-3 text-center">Ngày</th>
                      <th className="px-3 py-3">Tổ Đội</th>
                      <th className="px-3 py-3">Loại Giao Dịch</th>
                      <th className="px-4 py-3">Nội Dung & Căn Cứ</th>
                      <th className="px-3 py-3 text-right">Số Tiền (VND)</th>
                      <th className="px-3 py-3 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {transactions.map(tr => (
                      <tr key={tr.transId} className="hover:bg-slate-50 transition">
                        <td className="px-3 py-3 font-mono font-bold text-slate-600 text-center">{formatDate(tr.transDate)}</td>
                        <td className="px-3 py-3 font-bold text-slate-800">{tr.teamName}</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tr.transType === 'ADVANCE' ? 'bg-amber-100 text-amber-800' :
                            tr.transType === 'PENALTY' ? 'bg-rose-100 text-rose-800' :
                            tr.transType === 'PPE' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {tr.transTypeName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 max-w-md">{tr.note}</td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">
                          {formatVND(tr.amount)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                            Đã chốt Đợt 13
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: QUY TRÌNH THANH TOÁN TỔ ĐỘI 3 BƯỚC */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
          
          {/* Header & Sub-tab navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded">Đợt 13</span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Quy Trình Thanh Toán Lương Khoán Tổ Đội (Tháng 09/2026)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Gắn liền với kỳ thanh toán Hòa Bình số 20261019054706 • Chuẩn hóa theo Quy trình 3 Bước
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPaymentSubView('trang1')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  paymentSubView === 'trang1'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Bước 3: Đề Nghị Thanh Toán (Trang 1)</span>
              </button>

              <button
                onClick={() => setPaymentSubView('details')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  paymentSubView === 'details'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Bước 1 & 2: Tổng Hợp Khối Lượng & Giá Trị</span>
              </button>
            </div>
          </div>

          {/* SUB-VIEW 1: BƯỚC 3 - TRANG 1 ĐỀ NGHỊ THANH TOÁN (BẢNG 9) */}
          {paymentSubView === 'trang1' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3 py-3 text-center">Mã Đợt (team_pay_id)</th>
                      <th className="px-3 py-3">Tổ Đội & Đội Trưởng</th>
                      <th className="px-3 py-3 text-right">[1] Lũy Kế Nghiệm Thu (VND)</th>
                      <th className="px-3 py-3 text-right">[2] LK Đã Đề Nghị Trước</th>
                      <th className="px-3 py-3 text-right">Tổng Khấu Trừ Đến Trước [10]</th>
                      <th className="px-3 py-3 text-right">[11] Đề Nghị Kỳ Này</th>
                      <th className="px-3 py-3 text-right">[12] Khấu Trừ Kỳ Này</th>
                      <th className="px-4 py-3 text-right bg-emerald-50 text-emerald-900">THỰC THANH TOÁN KỲ NÀY</th>
                      <th className="px-3 py-3 text-center">Trạng Thái</th>
                      <th className="px-3 py-3 text-center w-28">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {teamPayments.map(p => {
                      const totalPrevDeduct = 
                        (p.prev_deduct_mat || 0) + 
                        (p.prev_deduct_ppe || 0) + 
                        (p.prev_deduct_penalty || 0) + 
                        (p.prev_hold_amount || 0) + 
                        (p.cum_retention || 0) + 
                        (p.cum_cash_advance || 0) +
                        (p.prev_paid_val || 0);

                      const currTotalDeduct = 
                        (p.curr_deduct_mat || 0) + 
                        (p.curr_deduct_ppe || 0) + 
                        (p.curr_deduct_penalty || 0) + 
                        (p.curr_hold_amount || 0);

                      const currGross = Math.max(0, (p.cum_accepted_val || 0) - totalPrevDeduct);

                      return (
                        <tr key={p.team_pay_id || p.teamPayId} className="hover:bg-slate-50 transition">
                          <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-700">
                            {p.team_pay_id || p.teamPayId}
                          </td>
                          <td className="px-3 py-3.5">
                            <p className="font-bold text-slate-900">{p.team_name || p.teamName}</p>
                            <p className="text-[11px] text-slate-500">Đội trưởng: {p.leader_name || p.leaderName}</p>
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono font-bold text-indigo-700">
                            {formatVND(p.cum_accepted_val || p.grossAmount)}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono text-slate-600">
                            {formatVND(p.prev_paid_val || 0)}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono text-slate-600">
                            -{formatVND(totalPrevDeduct)}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono font-semibold text-blue-700">
                            {formatVND(currGross || p.grossAmount)}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono text-rose-600">
                            -{formatVND(currTotalDeduct || (p.cashAdvance + p.deductMaterial + p.deductPpe))}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-black text-sm text-emerald-700 bg-emerald-50/50">
                            {formatVND(p.net_payable || p.netPaid)}
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                              {p.status || 'APPROVED'}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedTeamPaymentForModal(p)}
                                title="Xem & In Bảng Đề Nghị Thanh Toán (Trang 1 - A4)"
                                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold transition flex items-center gap-1 shadow-sm"
                              >
                                <Printer className="w-3.5 h-3.5 text-indigo-700" />
                                <span className="text-[10px]">Trang 1</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: BƯỚC 1 & 2 - TỔNG HỢP KHỐI LƯỢNG & GIÁ TRỊ (BẢNG 10) */}
          {paymentSubView === 'details' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-semibold">
                  Bảng tổng hợp chi tiết theo từng đầu việc giao khoán (team_payment_details)
                </span>
                <span className="font-bold text-indigo-700">
                  Tổng 4 công việc hoàn thành kỳ này
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="border border-slate-200 px-3 py-2 text-center" rowSpan={2}>STT</th>
                      <th className="border border-slate-200 px-3 py-2 text-center" rowSpan={2}>Mã Hiệu</th>
                      <th className="border border-slate-200 px-4 py-2" rowSpan={2}>Tên Nội Dung Công Việc Giao Khoán</th>
                      <th className="border border-slate-200 px-2 py-2 text-center" rowSpan={2}>ĐVT</th>
                      <th className="border border-slate-200 px-3 py-2 text-right" rowSpan={2}>Đơn Giá Giao Khoán</th>
                      <th className="border border-slate-200 px-3 py-2 text-center bg-blue-50 text-blue-900" colSpan={3}>
                        Bước 1: Khối Lượng Nghiệm Thu
                      </th>
                      <th className="border border-slate-200 px-3 py-2 text-center bg-emerald-50 text-emerald-900" colSpan={3}>
                        Bước 2: Giá Trị Nghiệm Thu (VND)
                      </th>
                      <th className="border border-slate-200 px-3 py-2 text-center bg-amber-50 text-amber-900" colSpan={2}>
                        Phần Còn Lại Của HĐ
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-slate-200 px-2 py-1.5 text-right bg-blue-50/60 text-blue-900">LK Trước</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-right bg-blue-100 text-blue-950 font-black">Kỳ Này</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-right bg-blue-50/60 text-blue-900">LK Đến Nay</th>

                      <th className="border border-slate-200 px-3 py-1.5 text-right bg-emerald-50/60 text-emerald-900">GT LK Trước</th>
                      <th className="border border-slate-200 px-3 py-1.5 text-right bg-emerald-100 text-emerald-950 font-black">GT Kỳ Này</th>
                      <th className="border border-slate-200 px-3 py-1.5 text-right bg-emerald-50/60 text-emerald-900">GT LK Đến Nay</th>

                      <th className="border border-slate-200 px-2 py-1.5 text-right bg-amber-50/60 text-amber-900">KL Còn Lại</th>
                      <th className="border border-slate-200 px-3 py-1.5 text-right bg-amber-50/60 text-amber-900">GT Còn Lại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {teamPaymentDetails.map((det) => (
                      <tr key={det.team_detail_id} className="hover:bg-slate-50 transition">
                        <td className="border border-slate-200 px-3 py-2 text-center">{det.stt}</td>
                        <td className="border border-slate-200 px-3 py-2 text-center font-mono font-bold text-slate-700">{det.item_code}</td>
                        <td className="border border-slate-200 px-4 py-2 font-semibold text-slate-800">{det.description}</td>
                        <td className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-600">{det.unit}</td>
                        <td className="border border-slate-200 px-3 py-2 text-right font-mono font-bold text-slate-900">
                          {formatNumber(det.unit_price_out)}
                        </td>

                        {/* Bước 1: Khối lượng */}
                        <td className="border border-slate-200 px-2 py-2 text-right font-mono text-slate-600">{formatNumber(det.prev_qty)}</td>
                        <td className="border border-slate-200 px-2 py-2 text-right font-mono font-bold text-blue-700 bg-blue-50/30">{formatNumber(det.curr_qty)}</td>
                        <td className="border border-slate-200 px-2 py-2 text-right font-mono font-bold text-slate-800">{formatNumber(det.cum_qty)}</td>

                        {/* Bước 2: Giá trị */}
                        <td className="border border-slate-200 px-3 py-2 text-right font-mono text-slate-600">{formatVND(det.prev_val)}</td>
                        <td className="border border-slate-200 px-3 py-2 text-right font-mono font-black text-emerald-700 bg-emerald-50/30">{formatVND(det.curr_val)}</td>
                        <td className="border border-slate-200 px-3 py-2 text-right font-mono font-black text-slate-900">{formatVND(det.cum_val)}</td>

                        {/* Còn lại */}
                        <td className="border border-slate-200 px-2 py-2 text-right font-mono text-amber-700">{formatNumber(det.rem_qty)}</td>
                        <td className="border border-slate-200 px-3 py-2 text-right font-mono font-bold text-amber-800">{formatVND(det.rem_val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Modal: Nhập Khoản Khấu Trừ Mới [12a - 12d] (Bảng 11) */}
      {showAddDeduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  12
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Nhập Chứng Từ Khấu Trừ [12a - 12d]</h3>
                  <p className="text-[11px] text-slate-500">Khớp chuẩn 4 ô khấu trừ Trang 1 và đối chiếu nguồn gốc</p>
                </div>
              </div>
              <button onClick={() => setShowAddDeduct(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddDeduction} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">1. Nhóm Khấu Trừ [12]:</label>
                  <select
                    value={newDeductCat}
                    onChange={(e) => setNewDeductCat(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-indigo-700"
                  >
                    <option value="12a">[12a] Vật Tư Thi Công</option>
                    <option value="12b">[12b] Bảo Hộ Lao Động (BHLĐ)</option>
                    <option value="12c">[12c] Phạt Vi Phạm ATLĐ / Kỹ Thuật</option>
                    <option value="12d">[12d] Tạm Giữ Kỹ Thuật / Chứng Chỉ</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">2. Cấp Áp Dụng:</label>
                  <select
                    value={newDeductLevel}
                    onChange={(e) => setNewDeductLevel(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                  >
                    <option value="TEAM">Khấu trừ Tổ Đội (Nam Khôi trừ Đội)</option>
                    <option value="SUBCONTRACTOR">Cấp Thầu Phụ (Hòa Bình trừ Nam Khôi)</option>
                  </select>
                </div>
              </div>

              {newDeductLevel === 'TEAM' && (
                <div>
                  <label className="font-bold text-slate-700">Đích Danh Tổ Đội Bị Trừ:</label>
                  <select
                    value={newDeductTeam}
                    onChange={(e) => setNewDeductTeam(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-700"
                  >
                    {teams.map(t => (
                      <option key={t.teamCode} value={t.teamCode}>{t.teamName} ({t.leaderName})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Ngày Lập Biên Bản / Phiếu:</label>
                  <input
                    type="date"
                    value={newDeductDate}
                    onChange={(e) => setNewDeductDate(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Số Phiếu Xuất / Biên Bản:</label>
                  <input
                    type="text"
                    value={newDeductVoucher}
                    onChange={(e) => setNewDeductVoucher(e.target.value)}
                    placeholder="VD: PXK-NK-102, BB-ATLD-05"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Tên Vật Tư / Nội Dung Phạt / Tạm Giữ:</label>
                <input
                  type="text"
                  value={newDeductItemName}
                  onChange={(e) => setNewDeductItemName(e.target.value)}
                  placeholder="VD: Đồ BHLĐ cấp phát 15 bộ, Bê tông hao hụt..."
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Đơn Vị Tính:</label>
                  <input
                    type="text"
                    value={newDeductUnit}
                    onChange={(e) => setNewDeductUnit(e.target.value)}
                    placeholder="Bộ, Cái, Lần..."
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Số Lượng:</label>
                  <input
                    type="number"
                    step="any"
                    value={newDeductQty}
                    onChange={(e) => setNewDeductQty(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-right font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Đơn Giá Trừ (₫):</label>
                  <input
                    type="number"
                    value={newDeductUnitPrice}
                    onChange={(e) => setNewDeductUnitPrice(e.target.value)}
                    placeholder="0"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-right font-bold text-rose-700"
                    required
                  />
                </div>
              </div>

              {/* Thành tiền tính tự động */}
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-rose-800">Tổng Thành Tiền Khấu Trừ:</span>
                <span className="font-black text-rose-700 text-sm font-mono">
                  {formatVND((Number(newDeductQty) || 1) * (Number(newDeductUnitPrice) || 0))}
                </span>
              </div>

              {/* Truy vết nguồn gốc Hòa Bình */}
              {newDeductLevel === 'TEAM' && (
                <div>
                  <label className="font-bold text-slate-700">Nguồn Gốc Chuyển Trừ Từ Hòa Bình (ID Gốc - Nếu có):</label>
                  <select
                    value={newDeductParentId}
                    onChange={(e) => setNewDeductParentId(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="">-- Khoản trừ nội bộ độc lập (Không qua HB) --</option>
                    {deductions
                      .filter(d => d.target_level === 'SUBCONTRACTOR')
                      .map(d => (
                        <option key={d.entry_id} value={d.entry_id}>
                          #{d.entry_id} - [{d.deduct_category}] {d.item_name} ({formatVND(d.total_amount)})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700">Ghi Chú & Căn Cứ Đối Chiếu:</label>
                <input
                  type="text"
                  value={newDeductNote}
                  onChange={(e) => setNewDeductNote(e.target.value)}
                  placeholder="Ký nhận bàn giao / Biên bản vi phạm..."
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddDeduct(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Lưu Khoản Trừ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ghi sổ tạm ứng & phạt */}
      {showAddTrans && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Ghi Sổ Tạm Ứng / Phạt Hiện Trường</h3>
              <button onClick={() => setShowAddTrans(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Chọn Tổ Đội:</label>
                <select
                  value={newTransTeam}
                  onChange={(e) => setNewTransTeam(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                >
                  {teams.map(t => (
                    <option key={t.teamCode} value={t.teamCode}>{t.teamName} ({t.leaderName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Loại Giao Dịch:</label>
                <select
                  value={newTransType}
                  onChange={(e) => setNewTransType(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="ADVANCE">Tạm ứng tiền mặt lương tuần</option>
                  <option value="PENALTY">Phạt vi phạm an toàn lao động / kỹ thuật</option>
                  <option value="PPE">Trừ tiền mua đồ BHLĐ / Đồng phục</option>
                  <option value="MATERIAL">Trừ tiền vật tư hao hụt vượt định mức</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Số Tiền (VND):</label>
                <input
                  type="number"
                  value={newTransAmount}
                  onChange={(e) => setNewTransAmount(e.target.value)}
                  placeholder="VD: 50000000"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Ngày Ghi Sổ:</label>
                <input
                  type="date"
                  value={newTransDate}
                  onChange={(e) => setNewTransDate(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Nội Dung & Căn Cứ:</label>
                <textarea
                  value={newTransNote}
                  onChange={(e) => setNewTransNote(e.target.value)}
                  placeholder="Ghi rõ lý do ứng hoặc số biên bản phạt..."
                  rows={2}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddTrans(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  Lưu Vào Sổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Thêm tổ đội mới */}
      {showAddTeam && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Thêm Tổ Đội Thi Công Mới</h3>
              <button onClick={() => setShowAddTeam(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddTeam} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Tên Tổ Đội:</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="VD: Tổ Thép - Đội Tuấn"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Họ Tên Đội Trưởng:</label>
                <input
                  type="text"
                  value={newLeaderName}
                  onChange={(e) => setNewLeaderName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Tuấn"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Số Điện Thoại:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="VD: 0905.123.456"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Số Nhân Công:</label>
                  <input
                    type="number"
                    value={newMembersCount}
                    onChange={(e) => setNewMembersCount(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700">Chuyên Môn Thi Công:</label>
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="VD: Cốt thép, Coffa nhôm, Bê tông, Xây trát..."
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Số Tài Khoản Ngân Hàng:</label>
                <input
                  type="text"
                  value={newBankAccount}
                  onChange={(e) => setNewBankAccount(e.target.value)}
                  placeholder="Số tài khoản - Tên ngân hàng"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddTeam(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Lưu Tổ Đội
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Đề Nghị Thanh Toán Tổ Đội (Bước 3 - Trang 1 A4) */}
      <FormTeamPaymentTrang1Modal
        isOpen={Boolean(selectedTeamPaymentForModal)}
        onClose={() => setSelectedTeamPaymentForModal(null)}
        teamPayment={selectedTeamPaymentForModal}
        onNavigateToDetails={() => {
          setSelectedTeamPaymentForModal(null);
          setPaymentSubView('details');
        }}
      />

    </div>
  );
}
