-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ HỒ SƠ THANH TOÁN DỰ ÁN (QLTT)
-- CƠ SỞ DỮ LIỆU ĐẦY ĐỦ: THẦU CHÍNH (ĐẦU VÀO) - TỔ ĐỘI THI CÔNG (ĐẦU RA) - GOOGLE SHEETS
-- Dự án mẫu: Khu căn hộ cao tầng Newtown • Thầu chính: Tập đoàn Xây dựng Hòa Bình
-- Nhà thầu thi công: Công ty TNHH MTV XD và TM Nam Khôi
-- ==============================================================================

-- ==========================================
-- PHẦN 1: DANH MỤC GỐC & HỢP ĐỒNG VỚI THẦU CHÍNH
-- ==========================================

-- 1. Dự án
CREATE TABLE projects (
    project_code VARCHAR(50) PRIMARY KEY,        -- VD: 2469E11000
    project_name VARCHAR(255) NOT NULL,          -- VD: Khu căn hộ cao tầng Newtown
    main_contractor VARCHAR(255) NOT NULL,       -- VD: Tập đoàn Xây dựng Hòa Bình
    location TEXT                                -- VD: Trường Sa, Ngũ Hành Sơn, Đà Nẵng
);

-- 2. Hợp đồng thầu phụ (Đầu vào - Thu tiền)
CREATE TABLE contracts (
    contract_no VARCHAR(100) PRIMARY KEY,        -- VD: 0103/NEWTOWN/NAMKHOI/2026
    project_code VARCHAR(50) REFERENCES projects(project_code),
    subcontractor_code VARCHAR(50) NOT NULL,     -- VD: TC000056
    subcontractor_name VARCHAR(255) NOT NULL,    -- VD: Công ty TNHH MTV XD và TM Nam Khôi
    main_scope TEXT,                             -- VD: Thi công kết cấu BTCT Tòa M1, M2
    contract_value NUMERIC(18, 2) NOT NULL,      -- VD: 60168402240
    retention_rate NUMERIC(5, 4) DEFAULT 0.05,   -- VD: 0.0500 (5% bảo lưu)
    advance_recovery_rate NUMERIC(5, 4) DEFAULT 0.00,
    vat_rate NUMERIC(5, 4) DEFAULT 0.08,         -- VD: 0.0800 (8% VAT)
    bank_account VARCHAR(50),
    bank_name VARCHAR(150)
);

-- 3. Bảng khối lượng & đơn giá gốc Hợp đồng (115 đầu việc)
CREATE TABLE contract_boq (
    item_id SERIAL PRIMARY KEY,
    contract_no VARCHAR(100) REFERENCES contracts(contract_no),
    stt INT NOT NULL,
    item_code VARCHAR(100) NOT NULL,             -- VD: 2.1.1.1.2.10
    description TEXT NOT NULL,
    unit VARCHAR(50) NOT NULL,                   -- KG, Mét vuông, Mét dài, %...
    unit_price_in NUMERIC(18, 2) NOT NULL,       -- Đơn giá Hòa Bình trả (chưa VAT)
    contract_qty NUMERIC(18, 4) NOT NULL,        -- Khối lượng hợp đồng
    contract_amount NUMERIC(18, 2) NOT NULL      -- Thành tiền hợp đồng
);

-- ==========================================
-- PHẦN 2: QUẢN LÝ THANH TOÁN VỚI THẦU CHÍNH (ĐẦU VÀO)
-- ==========================================

-- 4. Các đợt Đề nghị thanh toán với Hòa Bình (Trang 1)
CREATE TABLE payment_requests (
    payment_id VARCHAR(50) PRIMARY KEY,          -- VD: 20261019054706
    contract_no VARCHAR(100) REFERENCES contracts(contract_no),
    period_no INT NOT NULL,                      -- Lần ứng thứ (VD: 13)
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(30) DEFAULT 'DRAFT',          -- DRAFT, SUBMITTED, VALIDATED, PAID
    
    -- Các chỉ tiêu tài chính trên Trang 1
    cum_accepted_val NUMERIC(18, 2) DEFAULT 0,   -- [1] Lũy kế GT nghiệm thu (đã VAT)
    prev_paid_val NUMERIC(18, 2) DEFAULT 0,      -- [2] LK đề nghị TT kỳ trước
    prev_deduct_mat NUMERIC(18, 2) DEFAULT 0,    -- [3] LK trừ vật tư kỳ trước
    prev_deduct_ppe NUMERIC(18, 2) DEFAULT 0,    -- [4] LK trừ BHLĐ kỳ trước
    prev_deduct_other NUMERIC(18, 2) DEFAULT 0,  -- [5] LK trừ khác kỳ trước
    prev_hold_amount NUMERIC(18, 2) DEFAULT 0,   -- [6] LK tạm giữ kỳ trước
    cum_retention NUMERIC(18, 2) DEFAULT 0,      -- [7] LK 5% bảo lưu đến nay
    cum_rec_advance NUMERIC(18, 2) DEFAULT 0,    -- [8] LK thu hồi tạm ứng HĐ
    cum_rec_mat NUMERIC(18, 2) DEFAULT 0,        -- [9] LK thu hồi tạm ứng vật tư
    
    -- Các khoản trừ kỳ này [12]
    curr_deduct_mat NUMERIC(18, 2) DEFAULT 0,    -- [12a] Trừ vật tư kỳ này
    curr_deduct_ppe NUMERIC(18, 2) DEFAULT 0,    -- [12b] Trừ BHLĐ kỳ này
    curr_deduct_other NUMERIC(18, 2) DEFAULT 0,  -- [12c] Trừ khác kỳ này
    curr_hold_amount NUMERIC(18, 2) DEFAULT 0,   -- [12d] Tạm giữ kỳ này
    
    net_payable NUMERIC(18, 2) DEFAULT 0,        -- Giá trị thực thanh toán kỳ này
    amount_in_words TEXT,                        -- Số tiền bằng chữ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Chi tiết khối lượng nghiệm thu từng kỳ với Hòa Bình (Trang 2-5)
CREATE TABLE payment_details (
    detail_id SERIAL PRIMARY KEY,
    payment_id VARCHAR(50) REFERENCES payment_requests(payment_id),
    item_id INT REFERENCES contract_boq(item_id),
    prev_qty NUMERIC(18, 4) DEFAULT 0,           -- KL lũy kế kỳ trước
    curr_qty NUMERIC(18, 4) DEFAULT 0,           -- KL nghiệm thu kỳ này
    cum_qty NUMERIC(18, 4) DEFAULT 0,            -- KL lũy kế đến nay
    prev_val NUMERIC(18, 2) DEFAULT 0,           -- GT lũy kế kỳ trước
    curr_val NUMERIC(18, 2) DEFAULT 0,           -- GT nghiệm thu kỳ này
    cum_val NUMERIC(18, 2) DEFAULT 0,            -- GT lũy kế đến nay
    rem_qty NUMERIC(18, 4) DEFAULT 0,            -- KL hợp đồng còn lại
    rem_val NUMERIC(18, 2) DEFAULT 0             -- GT hợp đồng còn lại
);

-- ==========================================
-- PHẦN 3: QUẢN LÝ TỔ ĐỘI THI CÔNG (ĐẦU RA - CHI TIỀN)
-- ==========================================

-- 6. Danh sách Tổ đội thi công
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_code VARCHAR(50) UNIQUE NOT NULL,       -- VD: TD-THEP-01
    team_name VARCHAR(150) NOT NULL,             -- VD: Tổ Thép Ông Tuấn
    leader_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    id_card VARCHAR(30),
    bank_account VARCHAR(50),
    bank_name VARCHAR(150),
    specialty VARCHAR(100),                      -- Thép / Coffa / Bê tông / Hoàn thiện
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- 7. Hợp đồng giao khoán cho Tổ đội
CREATE TABLE team_contracts (
    team_contract_id SERIAL PRIMARY KEY,
    team_contract_no VARCHAR(100) UNIQUE NOT NULL,
    contract_no VARCHAR(100) REFERENCES contracts(contract_no),
    team_id INT REFERENCES teams(team_id),
    retention_rate NUMERIC(5, 4) DEFAULT 0.05,   -- % giữ lại bảo hành của tổ đội
    signed_date DATE
);

-- 8. Bảng đơn giá & khối lượng giao khoán cho từng Tổ đội
CREATE TABLE team_boq (
    team_boq_id SERIAL PRIMARY KEY,
    team_contract_id INT REFERENCES team_contracts(team_contract_id),
    item_id INT REFERENCES contract_boq(item_id), -- Link thẳng về mã công việc của Hòa Bình
    unit_price_out NUMERIC(18, 2) NOT NULL,       -- Đơn giá giao cho tổ đội
    assigned_qty NUMERIC(18, 4) NOT NULL          -- Khối lượng giao khoán cho tổ
);

-- 9. Bảng thanh toán & quyết toán lương Tổ đội theo kỳ
CREATE TABLE team_payments (
    team_pay_id SERIAL PRIMARY KEY,
    team_contract_id INT REFERENCES team_contracts(team_contract_id),
    payment_id VARCHAR(50) REFERENCES payment_requests(payment_id), -- Link với kỳ thanh toán Hòa Bình
    period_no INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    gross_amount NUMERIC(18, 2) DEFAULT 0,        -- Tổng giá trị nghiệm thu kỳ này
    cash_advance NUMERIC(18, 2) DEFAULT 0,        -- Tạm ứng tiền mặt/lương tuần trong kỳ
    deduct_material NUMERIC(18, 2) DEFAULT 0,     -- Trừ vật tư phụ/hao hụt
    deduct_ppe NUMERIC(18, 2) DEFAULT 0,          -- Trừ BHLĐ/đồng phục
    deduct_violation NUMERIC(18, 2) DEFAULT 0,    -- Trừ phạt ATLĐ/lỗi kỹ thuật
    retention_amount NUMERIC(18, 2) DEFAULT 0,    -- Giữ lại bảo hành kỳ này
    net_paid NUMERIC(18, 2) DEFAULT 0,            -- Thực chi cho Đội trưởng
    status VARCHAR(30) DEFAULT 'PENDING'          -- PENDING, APPROVED, PAID
);

-- 10. Chi tiết khối lượng nghiệm thu của từng Tổ đội
CREATE TABLE team_payment_details (
    team_detail_id SERIAL PRIMARY KEY,
    team_pay_id INT REFERENCES team_payments(team_pay_id),
    team_boq_id INT REFERENCES team_boq(team_boq_id),
    prev_qty NUMERIC(18, 4) DEFAULT 0,
    curr_qty NUMERIC(18, 4) DEFAULT 0,
    cum_qty NUMERIC(18, 4) DEFAULT 0,
    curr_val NUMERIC(18, 2) DEFAULT 0
);

-- 11. Sổ nhật ký Tạm ứng tiền mặt / Phạt hiện trường hàng ngày (Cập nhật tức thời)
CREATE TABLE team_transactions (
    trans_id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(team_id),
    team_pay_id INT REFERENCES team_payments(team_pay_id), -- NULL nếu chưa chốt vào kỳ thanh toán
    trans_date DATE NOT NULL,
    trans_type VARCHAR(30) NOT NULL,              -- ADVANCE (Ứng lương), PENALTY (Phạt), PPE (BHLĐ), MATERIAL (Vật tư)
    amount NUMERIC(18, 2) NOT NULL,
    note TEXT
);

-- ==========================================
-- PHẦN 4: TÍCH HỢP ĐỒNG BỘ GOOGLE SHEETS
-- ==========================================

-- 12. Cấu hình kết nối Google Sheets theo từng Dự án / Hợp đồng
CREATE TABLE gsheet_configs (
    config_id SERIAL PRIMARY KEY,
    contract_no VARCHAR(100) REFERENCES contracts(contract_no),
    spreadsheet_id VARCHAR(255) NOT NULL,        -- ID của file Google Sheet
    spreadsheet_url TEXT NOT NULL,               -- Link mở nhanh file Google Sheet
    sync_mode VARCHAR(30) DEFAULT 'REALTIME',    -- REALTIME (Tức thì) hoặc ON_APPROVE (Khi duyệt kỳ)
    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP
);

-- 13. Nhật ký đồng bộ (Kiểm soát lỗi nếu rớt mạng hoặc sai quyền)
CREATE TABLE gsheet_sync_logs (
    log_id SERIAL PRIMARY KEY,
    config_id INT REFERENCES gsheet_configs(config_id),
    target_sheet_name VARCHAR(100) NOT NULL,     -- Tên Tab (VD: DeNghiTT_HB, ThanhToan_ToDoi, SoTamUng)
    record_ref_id VARCHAR(100) NOT NULL,         -- ID phiếu vừa lưu (VD: 20261019054706)
    sync_status VARCHAR(20) NOT NULL,            -- SUCCESS / FAILED
    error_message TEXT,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- HÀM 1: TỰ ĐỘNG TẠO ĐỢT THANH TOÁN MỚI CHO THẦU PHỤ (HÒA BÌNH)
-- =================================================================
CREATE OR REPLACE FUNCTION create_next_subcontractor_payment(
    p_new_payment_id VARCHAR(50),
    p_contract_no VARCHAR(100),
    p_from_date DATE,
    p_to_date DATE
) RETURNS void AS $func$
DECLARE
    v_last_payment payment_requests%ROWTYPE;
    v_new_period INT;
BEGIN
    -- 1. Tìm đợt thanh toán gần nhất trước đó của Hợp đồng này
    SELECT * INTO v_last_payment
    FROM payment_requests
    WHERE contract_no = p_contract_no
    ORDER BY period_no DESC
    LIMIT 1;

    -- Xác định số thứ tự đợt mới
    IF FOUND THEN
        v_new_period := v_last_payment.period_no + 1;
    ELSE
        v_new_period := 1; -- Nếu là đợt đầu tiên
    END IF;

    -- 2. Tạo dòng Header Trang 1 cho đợt mới (Tự động cộng dồn lũy kế từ đợt trước)
    INSERT INTO payment_requests (
        payment_id, contract_no, period_no, from_date, to_date, status,
        cum_accepted_val,
        prev_paid_val,       -- [2] = [2] cũ + Thực nhận kỳ trước
        prev_deduct_mat,     -- [3] = [3] cũ + [12a] cũ
        prev_deduct_ppe,     -- [4] = [4] cũ + [12b] cũ
        prev_deduct_other,   -- [5] = [5] cũ + [12c] cũ
        prev_hold_amount,    -- [6] = [6] cũ + [12d] cũ
        cum_retention,       -- [7] Tạm giữ nguyên lũy kế bảo lưu cũ khiKL kỳ này = 0
        cum_rec_advance,     -- [8]
        cum_rec_mat          -- [9]
    ) VALUES (
        p_new_payment_id, p_contract_no, v_new_period, p_from_date, p_to_date, 'DRAFT',
        COALESCE(v_last_payment.cum_accepted_val, 0),
        COALESCE(v_last_payment.prev_paid_val, 0) + COALESCE(v_last_payment.net_payable, 0),
        COALESCE(v_last_payment.prev_deduct_mat, 0) + COALESCE(v_last_payment.curr_deduct_mat, 0),
        COALESCE(v_last_payment.prev_deduct_ppe, 0) + COALESCE(v_last_payment.curr_deduct_ppe, 0),
        COALESCE(v_last_payment.prev_deduct_other, 0) + COALESCE(v_last_payment.curr_deduct_other, 0),
        COALESCE(v_last_payment.prev_hold_amount, 0) + COALESCE(v_last_payment.curr_hold_amount, 0),
        COALESCE(v_last_payment.cum_retention, 0),
        COALESCE(v_last_payment.cum_rec_advance, 0),
        COALESCE(v_last_payment.cum_rec_mat, 0)
    );

    -- 3. Tự động sinh 115 dòng chi tiết công việc (Trang 2-5) và đẩy "LK đến nay" cũ thành "LK kỳ trước" mới
    IF FOUND THEN
        INSERT INTO payment_details (
            payment_id, item_id,
            prev_qty, curr_qty, cum_qty,
            prev_val, curr_val, cum_val,
            rem_qty, rem_val
        )
        SELECT 
            p_new_payment_id, d.item_id,
            d.cum_qty, 0, d.cum_qty,     -- KL LK kỳ trước mới = KL LK đến nay cũ
            d.cum_val, 0, d.cum_val,     -- GT LK kỳ trước mới = GT LK đến nay cũ
            d.rem_qty, d.rem_val
        FROM payment_details d
        WHERE d.payment_id = v_last_payment.payment_id;
    ELSE
        -- Nếu là Đợt 1: Lấy thẳng từ bảng BOQ gốc với LK kỳ trước = 0
        INSERT INTO payment_details (
            payment_id, item_id,
            prev_qty, curr_qty, cum_qty,
            prev_val, curr_val, cum_val,
            rem_qty, rem_val
        )
        SELECT 
            p_new_payment_id, b.item_id,
            0, 0, 0,
            0, 0, 0,
            b.contract_qty, b.contract_amount
        FROM contract_boq b
        WHERE b.contract_no = p_contract_no;
    END IF;
END;
$func$ LANGUAGE plpgsql;