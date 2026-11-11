# QLTT - Hệ Thống Quản Lý Hồ Sơ Thanh Toán Dự Án Đầu Tư Xây Dựng

Hệ thống chuyên biệt phục vụ công tác quản lý tài chính, hợp đồng và hồ sơ thanh toán dự án đầu tư xây dựng tại Việt Nam, tuân thủ chặt chẽ:
- **Nghị định số 254/2025/NĐ-CP** ngày 26/09/2025 của Chính phủ quy định về quản lý, thanh toán, quyết toán dự án sử dụng vốn đầu tư công (thay thế Nghị định 99/2021/NĐ-CP).
- **Mẫu số 03.a/TT** - Bảng xác định giá trị khối lượng công việc hoàn thành mới nhất.
- Các quy định và thông tư hướng dẫn của Bộ Tài chính về kiểm soát giải ngân vốn đầu tư công qua Kho bạc Nhà nước.

---

## 🚀 Tính Năng Chính

1. **Dashboard & Báo Cáo Giải Ngân**:
   - Thống kê Tổng mức đầu tư (TMĐT), Giá trị hợp đồng đã ký, Giải ngân lũy kế và Dư nợ tạm ứng còn lại.
   - Biểu đồ cột so sánh tiến độ giải ngân vs khối lượng hoàn thành vs giá trị hợp đồng từng gói thầu.
   - Biểu đồ phân bổ cơ cấu dòng tiền và công nợ (Đã chi, Tạm ứng, Tiền bảo hành giữ lại 5%, Còn lại của HĐ).

2. **Lập & Tính Toán Đợt Thanh Toán Tự Động**:
   - Hỗ trợ các loại hình: Tạm ứng hợp đồng, Khối lượng hoàn thành (Mẫu 03.a/TT - NĐ 254/2025), Quyết toán hợp đồng (A-B).
   - Tự động tính khấu trừ thu hồi tạm ứng, khấu trừ giữ lại bảo hành 5%, khấu trừ vi phạm và số tiền thực thanh toán cho Nhà thầu.
   - Quy trình phê duyệt 5 bước: *Dự thảo → TVGS kiểm tra → Trình CĐT duyệt → Đã duyệt → Kho bạc giải ngân*.

3. **Bảng Xác Định Giá Trị Khối Lượng Hoàn Thành (Mẫu số 03.a/TT)**:
   - Bảng 12 cột chuẩn Phụ lục Nghị định số 254/2025/NĐ-CP.
   - Tách bạch các chỉ tiêu lũy kế trước, phát sinh kỳ này, lũy kế nay và các khoản thu hồi/khấu trừ.
   - Hỗ trợ **In trực tiếp khổ giấy A4** (định dạng văn bản hành chính) hoặc **Xuất file Excel (`.xlsx`)** đầy đủ công thức.

4. **Danh Mục Kiểm Soát 8 Chứng Từ Bắt Buộc**:
   - Giấy đề nghị thanh toán vốn đầu tư.
   - Bảng tính Mẫu số 03.a/TT (Nghị định 254/2025/NĐ-CP).
   - Biên bản nghiệm thu công việc/giai đoạn (A-B-TVGS).
   - Hóa đơn VAT điện tử.
   - Bảng tính chi tiết khối lượng thực tế.
   - Chứng chỉ kiểm định, CO-CQ vật tư thiết bị chính.
   - Chứng thư bảo lãnh tạm ứng / bảo lãnh thực hiện HĐ.
   - Nhật ký thi công và kết quả thí nghiệm nén mẫu.

5. **Cảnh Báo Rủi Ro Bảo Lãnh Ngân Hàng**:
   - Tự động theo dõi hạn bảo lãnh tạm ứng và bảo lãnh thực hiện hợp đồng.
   - Phân loại mức độ khẩn cấp (≤ 30 ngày) để gửi công văn yêu cầu nhà thầu gia hạn kịp thời.

6. **Sao Lưu & Khôi Phục Dữ Liệu**:
   - Tải file sao lưu toàn bộ hệ thống (`.json`) chỉ với một nút bấm.
   - Khôi phục dữ liệu mẫu thực tế bất cứ lúc nào.

---

## 🛠️ Cài Đặt & Khởi Chạy

Yêu cầu môi trường: **Node.js** (>= 18)

```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Đóng gói cho môi trường production
npm run build
```

Mở trình duyệt tại: `http://localhost:3000`

---

## 📦 Công Nghệ Sử Dụng

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icon**: Lucide React
- **Biểu đồ**: Recharts
- **Xuất bảng tính**: SheetJS (xlsx)