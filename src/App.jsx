import React, { useState, useEffect } from 'react';
import { storageService, calculateContractStats } from './services/storageService';
import { exportService } from './services/exportService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { PaymentsView } from './views/PaymentsView';
import { ContractsView } from './views/ContractsView';
import { ProjectsView } from './views/ProjectsView';
import { GuaranteesView } from './views/GuaranteesView';
import { PaymentModal } from './components/PaymentModal';
import { PaymentDetailDrawer } from './components/PaymentDetailDrawer';
import { Form03aModal } from './components/Form03aModal';
import { Form03cQTModal } from './components/Form03cQTModal';
import { Form04aModal } from './components/Form04aModal';
import { ProjectModal } from './components/ProjectModal';
import { ContractModal } from './components/ContractModal';
import { WorkItemsModal } from './components/WorkItemsModal';
import { QuantitiesView } from './views/QuantitiesView';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [documents, setDocuments] = useState({});
  const checklistTemplates = storageService.getChecklistTemplates();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [selectedPaymentForDetail, setSelectedPaymentForDetail] = useState(null);
  const [selectedPaymentForForm03a, setSelectedPaymentForForm03a] = useState(null);
  const [selectedPaymentForForm03c, setSelectedPaymentForForm03c] = useState(null);
  const [selectedPaymentForForm04a, setSelectedPaymentForForm04a] = useState(null);
  const [activePaymentIdForQuantities, setActivePaymentIdForQuantities] = useState(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [selectedContractForWorkItems, setSelectedContractForWorkItems] = useState(null);

  // Quản lý ẩn/hiện cột quản lý bên trái (Sidebar)
  // Mặc định ẩn khi vào trang nhập khối lượng hoặc có thể bật tắt tự do theo nhu cầu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setProjects(storageService.getProjects());
    setContracts(storageService.getContracts());
    setPayments(storageService.getPayments());
    setDocuments(storageService.getDocuments());
  }, []);

  // Filter datasets based on selected project
  const visibleProjects = selectedProjectId === 'all'
    ? projects
    : projects.filter(p => p.id === selectedProjectId);

  const visibleContracts = selectedProjectId === 'all'
    ? contracts
    : contracts.filter(c => c.projectId === selectedProjectId);

  const visiblePayments = payments.filter(p => {
    const contract = contracts.find(c => c.id === p.contractId);
    if (selectedProjectId !== 'all' && contract?.projectId !== selectedProjectId) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContract = contract?.code.toLowerCase().includes(q) || contract?.contractor.toLowerCase().includes(q);
      return matchTitle || matchContract;
    }
    return true;
  });

  // Calculate sidebar stats
  const totalContractVal = visibleContracts.reduce((s, c) => s + (Number(c.adjustedValue || c.originalValue) || 0), 0);
  const totalDisbursed = visiblePayments.filter(p => p.status === 'disbursed').reduce((s, p) => s + (Number(p.approvedAmount || p.requestedAmount) || 0), 0);
  const totalAdvancePaid = visiblePayments.filter(p => p.paymentType === 'advance' && ['disbursed', 'approved'].includes(p.status)).reduce((s, p) => s + (Number(p.approvedAmount || p.requestedAmount) || 0), 0);
  const totalAdvanceDeducted = visiblePayments.filter(p => ['disbursed', 'approved'].includes(p.status)).reduce((s, p) => s + (Number(p.advanceDeduction) || 0), 0);
  const advanceRemaining = Math.max(0, totalAdvancePaid - totalAdvanceDeducted);

  const sidebarStats = {
    projectCount: visibleProjects.length,
    contractCount: visibleContracts.length,
    pendingCount: visiblePayments.filter(p => ['pending_approval', 'under_review'].includes(p.status)).length,
    alertCount: visibleContracts.filter(c => c.guaranteeExpiry || c.advanceGuaranteeExpiry).length,
    totalDisbursed,
    disbursedRate: totalContractVal > 0 ? (totalDisbursed / totalContractVal) * 100 : 0,
    advanceRemaining
  };

  // Payment CRUD
  const handleSavePayment = (paymentData) => {
    let updated;
    if (payments.some(p => p.id === paymentData.id)) {
      updated = payments.map(p => p.id === paymentData.id ? paymentData : p);
    } else {
      updated = [paymentData, ...payments];
    }
    setPayments(updated);
    storageService.savePayments(updated);
  };

  const handleUpdatePaymentStatus = (paymentId, newStatus) => {
    const updated = payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: newStatus,
          disbursedDate: newStatus === 'disbursed' ? new Date().toISOString().slice(0, 10) : p.disbursedDate
        };
      }
      return p;
    });
    setPayments(updated);
    storageService.savePayments(updated);

    if (selectedPaymentForDetail && selectedPaymentForDetail.id === paymentId) {
      setSelectedPaymentForDetail(updated.find(p => p.id === paymentId));
    }
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ thanh toán này không?')) {
      const updated = payments.filter(p => p.id !== paymentId);
      setPayments(updated);
      storageService.savePayments(updated);
      if (selectedPaymentForDetail?.id === paymentId) {
        setSelectedPaymentForDetail(null);
      }
    }
  };

  // Document checklist toggle
  const handleUpdateDocumentStatus = (paymentId, templateId, newStatus) => {
    const currentList = documents[paymentId] || [];
    let updatedList;
    if (currentList.some(d => d.templateId === templateId)) {
      updatedList = currentList.map(d => d.templateId === templateId ? { ...d, status: newStatus } : d);
    } else {
      updatedList = [...currentList, { id: `doc-${Date.now()}`, templateId, status: newStatus, notes: '' }];
    }

    const newDocs = { ...documents, [paymentId]: updatedList };
    setDocuments(newDocs);
    storageService.saveDocuments(newDocs);
  };

  // Project CRUD
  const handleSaveProject = (projectData) => {
    let updated;
    if (projects.some(p => p.id === projectData.id)) {
      updated = projects.map(p => p.id === projectData.id ? projectData : p);
    } else {
      updated = [projectData, ...projects];
    }
    setProjects(updated);
    storageService.saveProjects(updated);
  };

  // Contract CRUD
  const handleSaveContract = (contractData) => {
    let updated;
    if (contracts.some(c => c.id === contractData.id)) {
      updated = contracts.map(c => c.id === contractData.id ? contractData : c);
    } else {
      updated = [contractData, ...contracts];
    }
    setContracts(updated);
    storageService.saveContracts(updated);
  };

  // Export JSON & Reset Data
  const handleExportBackup = () => {
    exportService.exportBackupJSON(projects, contracts, payments, documents);
  };

  const handleResetData = () => {
    if (window.confirm('Khôi phục toàn bộ hệ thống về dữ liệu mẫu thực tế ban đầu?')) {
      storageService.resetToDefault();
      setProjects(storageService.getProjects());
      setContracts(storageService.getContracts());
      setPayments(storageService.getPayments());
      setDocuments(storageService.getDocuments());
    }
  };

  // Helper finders for modals
  const activeContractForDetail = contracts.find(c => c.id === selectedPaymentForDetail?.contractId);
  const activeProjectForDetail = projects.find(p => p.id === activeContractForDetail?.projectId);

  const activeContractFor03a = contracts.find(c => c.id === selectedPaymentForForm03a?.contractId);
  const activeProjectFor03a = projects.find(p => p.id === activeContractFor03a?.projectId);

  const activeContractFor03c = contracts.find(c => c.id === selectedPaymentForForm03c?.contractId);
  const activeProjectFor03c = projects.find(p => p.id === activeContractFor03c?.projectId);

  const activeContractFor04a = contracts.find(c => c.id === selectedPaymentForForm04a?.contractId);
  const activeProjectFor04a = projects.find(p => p.id === activeContractFor04a?.projectId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Top Navbar & Thanh Tác Vụ Điều Hướng Phân Hệ */}
      <Navbar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNewPayment={() => { setEditingPayment(null); setIsPaymentModalOpen(true); }}
        onExportBackup={handleExportBackup}
        onResetData={handleResetData}
        currentTab={currentTab}
        onTabChange={(tabId) => {
          setCurrentTab(tabId);
          if (tabId === 'quantities') {
            setIsSidebarOpen(false); // Tự động ẩn cột quản lý khi vào trang nhập khối lượng để có không gian tối đa
          }
        }}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        sidebarStats={sidebarStats}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar (Cột quản lý) */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tabId) => {
            setCurrentTab(tabId);
            if (tabId === 'quantities') {
              setIsSidebarOpen(false);
            }
          }}
          stats={sidebarStats}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
        />

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          
          {currentTab === 'dashboard' && (
            <DashboardView
              projects={visibleProjects}
              contracts={visibleContracts}
              payments={visiblePayments}
              onSelectPayment={(p) => setSelectedPaymentForDetail(p)}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'quantities' && (
            <QuantitiesView
              projects={visibleProjects}
              contracts={visibleContracts}
              payments={visiblePayments}
              selectedPaymentId={activePaymentIdForQuantities}
              onSelectPaymentId={setActivePaymentIdForQuantities}
              onSavePaymentData={handleSavePayment}
              onOpenForm03a={(p) => setSelectedPaymentForForm03a(p)}
              onOpenNewPayment={() => { setEditingPayment(null); setIsPaymentModalOpen(true); }}
              onManageWorkItems={(c) => setSelectedContractForWorkItems(c)}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentsView
              payments={visiblePayments}
              contracts={visibleContracts}
              projects={visibleProjects}
              onOpenNewPayment={() => { setEditingPayment(null); setIsPaymentModalOpen(true); }}
              onSelectPayment={(p) => setSelectedPaymentForDetail(p)}
              onOpenForm03a={(p) => setSelectedPaymentForForm03a(p)}
              onOpenForm03c={(p) => setSelectedPaymentForForm03c(p)}
              onOpenForm04a={(p) => setSelectedPaymentForForm04a(p)}
              onNavigateToQuantities={(payId) => {
                setActivePaymentIdForQuantities(payId);
                setCurrentTab('quantities');
              }}
              onEditPayment={(p) => { setEditingPayment(p); setIsPaymentModalOpen(true); }}
              onDeletePayment={handleDeletePayment}
            />
          )}

          {currentTab === 'contracts' && (
            <ContractsView
              contracts={visibleContracts}
              projects={visibleProjects}
              payments={payments}
              onOpenNewContract={() => { setEditingContract(null); setIsContractModalOpen(true); }}
              onEditContract={(c) => { setEditingContract(c); setIsContractModalOpen(true); }}
              onManageWorkItems={(c) => setSelectedContractForWorkItems(c)}
              onNavigateToPayments={(contractId) => {
                setCurrentTab('payments');
              }}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={visibleProjects}
              contracts={contracts}
              payments={payments}
              onOpenNewProject={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
              onEditProject={(pr) => { setEditingProject(pr); setIsProjectModalOpen(true); }}
              onSelectProjectForView={(projId) => {
                setSelectedProjectId(projId);
                setCurrentTab('contracts');
              }}
            />
          )}

          {currentTab === 'guarantees' && (
            <GuaranteesView
              contracts={visibleContracts}
              projects={visibleProjects}
            />
          )}

        </main>
      </div>

      {/* Modals & Drawers */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        contracts={contracts}
        projects={projects}
        editingPayment={editingPayment}
      />

      <PaymentDetailDrawer
        isOpen={Boolean(selectedPaymentForDetail)}
        onClose={() => setSelectedPaymentForDetail(null)}
        payment={selectedPaymentForDetail}
        contract={activeContractForDetail}
        project={activeProjectForDetail}
        documents={documents}
        checklistTemplates={checklistTemplates}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onUpdateDocumentStatus={handleUpdateDocumentStatus}
        onOpenForm03a={() => setSelectedPaymentForForm03a(selectedPaymentForDetail)}
        onOpenForm03c={() => setSelectedPaymentForForm03c(selectedPaymentForDetail)}
        onOpenForm04a={() => setSelectedPaymentForForm04a(selectedPaymentForDetail)}
        onDeletePayment={handleDeletePayment}
      />

      <Form03aModal
        isOpen={Boolean(selectedPaymentForForm03a)}
        onClose={() => setSelectedPaymentForForm03a(null)}
        payment={selectedPaymentForForm03a}
        contract={activeContractFor03a}
        project={activeProjectFor03a}
      />

      <Form03cQTModal
        isOpen={Boolean(selectedPaymentForForm03c)}
        onClose={() => setSelectedPaymentForForm03c(null)}
        payment={selectedPaymentForForm03c}
        contract={activeContractFor03c}
        project={activeProjectFor03c}
      />

      <Form04aModal
        isOpen={Boolean(selectedPaymentForForm04a)}
        onClose={() => setSelectedPaymentForForm04a(null)}
        payment={selectedPaymentForForm04a}
        contract={activeContractFor04a}
        project={activeProjectFor04a}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onSave={handleSaveContract}
        projects={projects}
        editingContract={editingContract}
      />

      <WorkItemsModal
        isOpen={Boolean(selectedContractForWorkItems)}
        onClose={() => setSelectedContractForWorkItems(null)}
        contract={selectedContractForWorkItems}
        onSaved={() => {
          // Triggers re-renders when work items are modified
          setContracts([...storageService.getContracts()]);
        }}
      />

    </div>
  );
}