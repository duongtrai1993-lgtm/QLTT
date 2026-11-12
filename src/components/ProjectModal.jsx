import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';

export function ProjectModal({ isOpen, onClose, onSave, editingProject = null }) {
  if (!isOpen) return null;

  const [code, setCode] = useState(editingProject?.code || `DA-${new Date().getFullYear()}-0${Math.floor(Math.random() * 90) + 10}`);
  const [name, setName] = useState(editingProject?.name || '');
  const [owner, setOwner] = useState(editingProject?.owner || 'Ban Quản lý Dự án Đầu tư Xây dựng');
  const [location, setLocation] = useState(editingProject?.location || 'Hà Nội');
  const [category, setCategory] = useState(editingProject?.category || 'Công trình Giao thông cấp I');
  const [budget, setBudget] = useState(editingProject?.budget || 100000000000);
  const [capitalSource, setCapitalSource] = useState(editingProject?.capitalSource || 'Ngân sách Nhà nước');
  const [startDate, setStartDate] = useState(editingProject?.startDate || new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(editingProject?.endDate || '2026-12-31');
  const [status, setStatus] = useState(editingProject?.status || 'in_progress');
  const [description, setDescription] = useState(editingProject?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !code) return;

    onSave({
      id: editingProject?.id || `proj-${Date.now()}`,
      code,
      name,
      owner,
      location,
      category,
      budget: Number(budget),
      capitalSource,
      startDate,
      endDate,
      status,
      description
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {editingProject ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã Dự Án *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Tên Dự Án *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Cải tạo & Nâng cấp đường..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chủ Đầu Tư / Ban QLDA *</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Địa Điểm Xây Dựng</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tổng Mức Đầu Tư (VNĐ) *</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-blue-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nguồn Vốn</label>
              <input
                type="text"
                value={capitalSource}
                onChange={(e) => setCapitalSource(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày Bắt Đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày Hoàn Thành</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trạng Thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                <option value="in_progress">Đang thi công</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="final_settlement">Đang quyết toán</option>
                <option value="paused">Tạm dừng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mô Tả Quy Mô Dự Án</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
            >
              {editingProject ? 'Lưu Thay Đổi' : 'Tạo Dự Án'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}