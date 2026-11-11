import React from 'react';
import { Plus, Building2, MapPin, Calendar, DollarSign, Layers, Edit2, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatBillion, formatVND, formatDate } from '../services/storageService';

export function ProjectsView({
  projects,
  contracts,
  payments,
  onOpenNewProject,
  onEditProject,
  onSelectProjectForView
}) {
  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Danh Mục Dự Án Đầu Tư Xây Dựng
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tổng mức đầu tư, nguồn vốn, tiến độ thực hiện và phân kỳ giải ngân
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm Dự Án Mới
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {projects.map(project => {
          const projectContracts = contracts.filter(c => c.projectId === project.id);
          const projectPayments = payments.filter(p => {
            const contract = contracts.find(c => c.id === p.contractId);
            return contract?.projectId === project.id;
          });

          const totalContractVal = projectContracts.reduce((s, c) => s + (Number(c.adjustedValue || c.originalValue) || 0), 0);
          const totalDisbursed = projectPayments
            .filter(p => p.status === 'disbursed')
            .reduce((s, p) => s + (Number(p.approvedAmount || p.requestedAmount) || 0), 0);

          const percentDisbursed = project.budget > 0 ? (totalDisbursed / project.budget) * 100 : 0;

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-100 text-blue-800">
                      {project.code}
                    </span>
                    <StatusBadge status={project.status} type="project" />
                  </div>

                  <button
                    onClick={() => onEditProject(project)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                    title="Chỉnh sửa thông tin dự án"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {project.description || 'Chưa có mô tả chi tiết'}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Chủ đầu tư / Ban QLDA:</span>
                    <span className="font-semibold text-slate-800">{project.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Địa điểm:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {project.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nguồn vốn:</span>
                    <span className="font-semibold text-slate-800">{project.capitalSource}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Thời gian thực hiện:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {formatDate(project.startDate)} → {formatDate(project.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & Financial bar */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Tổng Mức ĐT</p>
                    <p className="text-xs font-black text-slate-900 mt-0.5">{formatBillion(project.budget)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Giá Trị HĐ Đã Ký</p>
                    <p className="text-xs font-black text-blue-700 mt-0.5">{formatBillion(totalContractVal)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Đã Giải Ngân</p>
                    <p className="text-xs font-black text-emerald-600 mt-0.5">{formatBillion(totalDisbursed)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tiến độ giải ngân so với TMĐT:</span>
                    <span className="font-bold text-slate-800">{percentDisbursed.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, percentDisbursed)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <strong>{projectContracts.length}</strong> gói thầu xây lắp / tư vấn
                  </span>

                  <button
                    onClick={() => onSelectProjectForView(project.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Xem hồ sơ chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}