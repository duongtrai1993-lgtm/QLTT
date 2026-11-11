import React, { useState } from 'react';
import { Plus, FileSignature, ShieldCheck, AlertCircle, Edit2, ArrowRight } from 'lucide-react';
import { formatVND, formatBillion, formatDate, calculateContractStats } from '../services/storageService';

export function ContractsView({
  contracts,
  projects,
  payments,
  onOpenNewContract,
  onEditContract,
  onNavigateToPayments
}) {
  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Hợp Đồng & Gói Thầu Xây Lắp
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi giá trị hợp đồng, phụ lục, điều khoản tạm ứng, khấu trừ bảo hành và thư bảo lãnh ngân hàng
          </p>
        </div>

        <button
          onClick={onOpenNewContract}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm Hợp Đồng Mới
        </button>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 gap-4">
        {contracts.map(contract => {
          const project = projects.find(p => p.id === contract.projectId);
          const stats = calculateContractStats(contract, payments);
          const contractPayments = payments.filter(p => p.contractId === contract.id);

          return (
            <div
              key={contract.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:border-blue-300 transition space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-100 text-indigo-800">
                      {contract.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {contract.contractType}
                    </span>
                    <span className="text-xs text-slate-400">• Dự án: <strong className="text-slate-700">{project?.name}</strong></span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {contract.packageName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Nhà thầu: <strong className="text-slate-800">{contract.contractor}</strong> (MST: {contract.contractorTaxCode || '---'})
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-center">
                  <button
                    onClick={() => onEditContract(contract)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa HĐ</span>
                  </button>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá Trị Hợp Đồng</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">{formatVND(stats.contractVal)}</span>
                  {contract.adjustedValue && contract.adjustedValue !== contract.originalValue && (
                    <span className="text-[10px] text-blue-600 font-medium">Gốc: {formatBillion(contract.originalValue)}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Đã Giải Ngân ({stats.disbursedRate.toFixed(1)}%)</span>
                  <span className="text-sm font-black text-emerald-600 mt-0.5 block">{formatVND(stats.totalDisbursed)}</span>
                  <span className="text-[10px] text-slate-500">{contractPayments.length} đợt thanh toán</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tạm Ứng Còn Lại</span>
                  <span className="text-sm font-black text-amber-600 mt-0.5 block">{formatVND(stats.advanceRemaining)}</span>
                  <span className="text-[10px] text-slate-500">Đã thu hồi: {formatBillion(stats.totalAdvanceRecovered)}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bảo Hành Giữ Lại ({contract.retentionRate || 5}%)</span>
                  <span className="text-sm font-black text-purple-700 mt-0.5 block">{formatVND(stats.totalRetention)}</span>
                  <span className="text-[10px] text-slate-500">Giữ tiền mặt</span>
                </div>
              </div>

              {/* Bank Guarantees bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Bảo lãnh thực hiện HĐ: <strong className="text-slate-800">{formatDate(contract.guaranteeExpiry)}</strong> ({contract.bankName})
                  </span>
                  {contract.advanceGuaranteeExpiry && (
                    <span className="flex items-center gap-1.5 font-medium hidden sm:flex">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Bảo lãnh tạm ứng: <strong className="text-slate-800">{formatDate(contract.advanceGuaranteeExpiry)}</strong>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onNavigateToPayments(contract.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-auto"
                >
                  Xem các đợt thanh toán ({contractPayments.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}