import React, { useState } from 'react';
import { 
  Users, HardHat, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, 
  Plus, Calendar, AlertTriangle, ShieldCheck, FileSpreadsheet, CheckCircle2, 
  Filter, Search, ArrowRight, Printer, Receipt, Wallet, Layers, Eye
} from 'lucide-react';
import { storageService, formatVND, formatNumber, formatDate } from '../services/storageService';

export function TeamsView({ projects = [], contracts = [] }) {
  const [teams, setTeams] = useState(() => storageService.getTeams());
  const [teamBOQ, setTeamBOQ] = useState(() => storageService.getTeamBOQ());
  const [transactions, setTransactions] = useState(() => storageService.getTeamTransactions());
  const [teamPayments, setTeamPayments] = useState(() => storageService.getTeamPayments());

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'boq_margin' | 'transactions' | 'payments'
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');

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
          <Wallet className="w-4 h-4" />
          <span>Sổ Nhật Ký Ứng / Phạt ({transactions.length})</span>
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

      {/* TAB 3: SỔ NHẬT KÝ ỨNG / PHẠT HIỆN TRƯỜNG */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Sổ Nhật Ký Tạm Ứng Tiền Mặt & Phạt Hiện Trường</h3>
              <p className="text-xs text-slate-500">Cập nhật tức thời hàng ngày • Tự động trừ vào kỳ thanh toán của Tổ đội</p>
            </div>
            <button
              onClick={() => setShowAddTrans(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ghi sổ mới</span>
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

      {/* TAB 4: BẢNG LƯƠNG & QUYẾT TOÁN TỔ ĐỘI THEO KỲ */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">Đợt 13</span>
                <h3 className="font-extrabold text-slate-900 text-base">Bảng Quyết Toán Lương Tổ Đội (Tháng 09/2026)</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Gắn liền với kỳ thanh toán Hòa Bình số 20261019054706 • Đã trừ tiền ứng tuần & 5% bảo hành
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Tổng thực chi 3 tổ:</span>
              <span className="text-lg font-black text-blue-700">{formatVND(totalNetPaidLabor)}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3">Tổ Đội</th>
                  <th className="px-3 py-3">Đội Trưởng</th>
                  <th className="px-3 py-3 text-right">Tổng Khối Lượng (VND)</th>
                  <th className="px-3 py-3 text-right">Trừ Tạm Ứng Tuần</th>
                  <th className="px-3 py-3 text-right">Trừ Vật Tư & BHLĐ</th>
                  <th className="px-3 py-3 text-right">Trừ Phạt ATLĐ</th>
                  <th className="px-3 py-3 text-right">Giữ Lại 5% BH</th>
                  <th className="px-4 py-3 text-right">THỰC CHI ĐỢT NÀY</th>
                  <th className="px-3 py-3 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teamPayments.map(p => (
                  <tr key={p.teamPayId} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-3.5 font-bold text-slate-900">{p.teamName}</td>
                    <td className="px-3 py-3.5 text-slate-700">{p.leaderName}</td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-800">
                      {formatVND(p.grossAmount)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-amber-700">
                      -{formatVND(p.cashAdvance)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-slate-600">
                      -{formatVND(p.deductMaterial + p.deductPpe)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-rose-600">
                      {p.deductViolation > 0 ? `-${formatVND(p.deductViolation)}` : '0 đ'}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-slate-600">
                      -{formatVND(p.retentionAmount)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-black text-sm text-blue-700 bg-blue-50/40">
                      {formatVND(p.netPaid)}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                        Đã duyệt chi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

    </div>
  );
}
