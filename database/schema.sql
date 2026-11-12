-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ HỒ SƠ THANH TOÁN DỰ ÁN (QLTT)
-- CƠ SỞ DỮ LIỆU CHUẨN: HỢP ĐỒNG, BOQ, ĐỀ NGHỊ THANH TOÁN & QUY TRÌNH PHÊ DUYỆT 7 BƯỚC
-- ==============================================================================

-- 1. Bảng Dự án & Thầu phụ
CREATE TABLE projects (
    project_code VARCHAR(50) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    location TEXT
);

CREATE TABLE subcontractors (
    sub_code VARCHAR(50) PRIMARY KEY,
    sub_name VARCHAR(255) NOT NULL,
    account_holder VARCHAR(255),
    bank_account VARCHAR(50),
    bank_name VARCHAR(150),
    bank_branch VARCHAR(150)
);

-- 2. Bảng Hợp đồng
CREATE TABLE contracts (
    contract_no VARCHAR(100) PRIMARY KEY,
    project_code VARCHAR(50) REFERENCES projects(project_code),
    sub_code VARCHAR(50) REFERENCES subcontractors(sub_code),
    main_scope TEXT,
    contract_value NUMERIC(18, 2) NOT NULL,
    retention_rate NUMERIC(5, 4) DEFAULT 0.0500, -- 5.00%
    advance_recovery_rate NUMERIC(5, 4) DEFAULT 0.0000,
    vat_rate NUMERIC(5, 4) DEFAULT 0.0800 -- 8.00%
);

-- 3. Bảng Danh mục công việc gốc (BOQ Master)
CREATE TABLE contract_boq (
    item_id SERIAL PRIMARY KEY,
    contract_no VARCHAR(100) REFERENCES contracts(contract_no),
    stt INT NOT NULL,
    item_code VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    unit VARCHAR(50),
    unit_price NUMERIC(18, 2) NOT NULL,
    contract_qty NUMERIC(18, 4) NOT NULL,
    contract_amount NUMERIC(18, 2) NOT NULL
);

-- 4. Bảng Đợt Đề nghị Thanh toán (Trang 1: Bảng tổng hợp các chỉ tiêu tài chính)
CREATE TABLE payment_requests (
    payment_id VARCHAR(50) PRIMARY KEY, -- VD: 20261019054706
    contract_no VARCHAR(100) REFERENCES contracts(contract_no),
    period_no INT NOT NULL, -- Lần ứng thứ: 13
    from_date DATE,
    to_date DATE,
    due_date DATE,
    status VARCHAR(30) DEFAULT 'DRAFT', -- DRAFT, PENDING, VALIDATED, PAID
    
    -- Các chỉ tiêu tài chính Trang 1
    actual_paid_to_date NUMERIC(18, 2) DEFAULT 0,       -- Thực chi đến nay
    cum_accepted_val_1 NUMERIC(18, 2) DEFAULT 0,        -- [1] LK giá trị nghiệm thu đến nay (có VAT)
    prev_requested_val_2 NUMERIC(18, 2) DEFAULT 0,      -- [2] LK đề nghị TT các kỳ trước
    prev_deduct_material_3 NUMERIC(18, 2) DEFAULT 0,    -- [3] LK trừ vật tư đến kỳ trước
    prev_deduct_ppe_4 NUMERIC(18, 2) DEFAULT 0,         -- [4] LK trừ BHLĐ đến kỳ trước
    prev_deduct_other_5 NUMERIC(18, 2) DEFAULT 0,       -- [5] LK trừ khác đến kỳ trước
    prev_hold_6 NUMERIC(18, 2) DEFAULT 0,               -- [6] LK tạm giữ đến kỳ trước
    cum_retention_7 NUMERIC(18, 2) DEFAULT 0,           -- [7] LK 5% bảo lưu đến nay
    cum_adv_recovery_8 NUMERIC(18, 2) DEFAULT 0,        -- [8] LK thu hồi tạm ứng
    cum_mat_adv_recovery_9 NUMERIC(18, 2) DEFAULT 0,    -- [9] LK thu hồi TU vật tư
    total_deducted_prev_10 NUMERIC(18, 2) DEFAULT 0,    -- [10] = SUM([2]..[9])
    curr_gross_payable_11 NUMERIC(18, 2) DEFAULT 0,     -- [11] = [1] - [10]
    
    -- Khấu trừ kỳ này [12]
    curr_deduct_material_12a NUMERIC(18, 2) DEFAULT 0,
    curr_deduct_ppe_12b NUMERIC(18, 2) DEFAULT 0,
    curr_deduct_other_12c NUMERIC(18, 2) DEFAULT 0,
    curr_hold_12d NUMERIC(18, 2) DEFAULT 0,
    curr_total_deduct_12 NUMERIC(18, 2) DEFAULT 0,      -- [12] = SUM(12a..12d)
    
    net_payable NUMERIC(18, 2) DEFAULT 0,               -- Thực nhận = [11] - [12]
    amount_in_words TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Chi tiết Nghiệm thu từng kỳ (Trang 2-5: Bảng chi tiết khối lượng từng đầu việc)
CREATE TABLE payment_details (
    detail_id SERIAL PRIMARY KEY,
    payment_id VARCHAR(50) REFERENCES payment_requests(payment_id) ON DELETE CASCADE,
    item_id INT REFERENCES contract_boq(item_id),
    
    -- Khối lượng
    prev_qty NUMERIC(18, 4) DEFAULT 0,
    curr_qty NUMERIC(18, 4) DEFAULT 0,
    cum_qty NUMERIC(18, 4) DEFAULT 0,
    
    -- Giá trị (chưa VAT)
    prev_val NUMERIC(18, 2) DEFAULT 0,
    curr_val NUMERIC(18, 2) DEFAULT 0,
    cum_val NUMERIC(18, 2) DEFAULT 0,
    
    -- Hợp đồng còn lại
    rem_qty NUMERIC(18, 4) DEFAULT 0,
    rem_val NUMERIC(18, 2) DEFAULT 0
);

-- 6. Bảng Lịch sử Phê duyệt (7 chữ ký)
CREATE TABLE payment_approvals (
    approval_id SERIAL PRIMARY KEY,
    payment_id VARCHAR(50) REFERENCES payment_requests(payment_id) ON DELETE CASCADE,
    step_order INT NOT NULL, -- 1 đến 7
    role_name VARCHAR(100) NOT NULL, -- Thầu phụ, Giám sát, CHT, GĐDA, P.QLCP, BGĐ, TP.Kế toán
    approver_name VARCHAR(150),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    signed_at TIMESTAMP,
    note TEXT
);
