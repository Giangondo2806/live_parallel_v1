# Tài liệu Thiết kế Cơ bản (Basic Design) - Phần 3
## Hệ thống Quản lý Idle Resource (IRMS)

## Phần 4: UI Component Description

### S-01-01: Màn hình Đăng nhập

| Item ID | Item Name | Item Type | I/O | Data Type | Initial Value | Required | Max Length | Validation Rules | Item Description |
|---------|-----------|-----------|-----|-----------|---------------|----------|------------|------------------|------------------|
| S01-ITM-01 | Username Input | TextField | Input | string | "" | Yes | 50 | Not empty, alphanumeric | Nhập tên đăng nhập |
| S01-ITM-02 | Password Input | PasswordField | Input | string | "" | Yes | 100 | Min 8 chars, contains letter+number | Nhập mật khẩu |
| S01-ITM-03 | Remember Me Checkbox | Checkbox | Input | boolean | false | No | - | - | Ghi nhớ đăng nhập |
| S01-ITM-04 | Login Button | Button | Action | - | - | - | - | Form validation required | Thực hiện đăng nhập |
| S01-ITM-05 | Forgot Password Link | Link | Navigation | - | - | - | - | - | Liên kết reset password |
| S01-ITM-06 | Need Help Link | Link | Navigation | - | - | - | - | - | Liên kết support |
| S01-ITM-07 | Error Message | Label | Output | string | "" | No | 200 | - | Hiển thị lỗi đăng nhập |
| S01-ITM-08 | Loading Indicator | Spinner | Visual | - | hidden | - | - | - | Hiển thị khi đang xử lý |

### S-02-01: Màn hình chính (Top Screen Dashboard)

| Item ID | Item Name | Item Type | I/O | Data Type | Initial Value | Required | Max Length | Validation Rules | Item Description |
|---------|-----------|-----------|-----|-----------|---------------|----------|------------|------------------|------------------|
| S02-ITM-01 | Left Navigation Menu | Menu | Navigation | - | - | - | - | Role-based visibility | Menu điều hướng chính |
| S02-ITM-02 | Profile Dropdown | Dropdown | Action | - | - | - | - | - | Menu profile user |
| S02-ITM-03 | Settings Button | Button | Navigation | - | - | - | - | - | Truy cập cài đặt |
| S02-ITM-04 | Logout Button | Button | Action | - | - | - | - | Confirm logout | Đăng xuất khỏi hệ thống |
| S02-ITM-05 | Total Resources Card | Card | Output | number | 0 | - | - | - | Hiển thị tổng số resource |
| S02-ITM-06 | Idle > 2 Months Card | Card | Output | number | 0 | - | - | - | Số resource idle > 2 tháng |
| S02-ITM-07 | Department Chart | Chart | Output | object | {} | - | - | - | Biểu đồ theo phòng ban |
| S02-ITM-08 | Recent Updates List | List | Output | array | [] | - | - | - | Danh sách cập nhật gần đây |
| S02-ITM-09 | View All Updates Link | Link | Navigation | - | - | - | - | - | Xem tất cả updates |
| S02-ITM-10 | Import Excel Button | Button | Action | - | - | - | - | Role permission check | Nút import dữ liệu |
| S02-ITM-11 | Export Data Button | Button | Action | - | - | - | - | Role permission check | Nút export dữ liệu |
| S02-ITM-12 | Add Resource Button | Button | Navigation | - | - | - | - | Role permission check | Thêm resource mới |

### S-03-01: Màn hình Quản lý danh sách Idle Resource

| Item ID | Item Name | Item Type | I/O | Data Type | Initial Value | Required | Max Length | Validation Rules | Item Description |
|---------|-----------|-----------|-----|-----------|---------------|----------|------------|------------------|------------------|
| S03-ITM-01 | Search Input | TextField | Input | string | "" | No | 100 | - | Tìm kiếm resource |
| S03-ITM-02 | Department Filter | Dropdown | Input | string | "All" | No | - | Valid department codes | Lọc theo phòng ban |
| S03-ITM-03 | Status Filter | Dropdown | Input | string | "All" | No | - | Valid status values | Lọc theo trạng thái |
| S03-ITM-04 | Search Button | Button | Action | - | - | - | - | - | Thực hiện tìm kiếm |
| S03-ITM-05 | Reset Button | Button | Action | - | - | - | - | - | Reset bộ lọc |
| S03-ITM-06 | Import Button | Button | Action | - | - | - | - | Role: RA only | Import Excel file |
| S03-ITM-07 | Export Button | Button | Action | - | - | - | - | Role permission check | Export dữ liệu |
| S03-ITM-08 | Add New Button | Button | Navigation | - | - | - | - | Role: RA, MNG, Admin | Thêm resource mới |
| S03-ITM-09 | Delete Button | Button | Action | - | - | - | - | Role: RA only, selection required | Xóa resource đã chọn |
| S03-ITM-10 | Column Settings Button | Button | Action | - | - | - | - | - | Cài đặt hiển thị cột |
| S03-ITM-11 | Select All Checkbox | Checkbox | Input | boolean | false | No | - | - | Chọn tất cả rows |
| S03-ITM-12 | Resource Data Grid | DataGrid | Output | array | [] | - | - | - | Bảng dữ liệu resource |
| S03-ITM-13 | Row Selection Checkbox | Checkbox | Input | boolean | false | No | - | - | Chọn từng row |
| S03-ITM-14 | Resource ID Column | GridColumn | Output | string | - | - | 10 | - | Mã ID resource |
| S03-ITM-15 | Name Column | GridColumn | Output | string | - | - | 50 | - | Tên resource |
| S03-ITM-16 | Department Column | GridColumn | Output | string | - | - | 30 | - | Phòng ban |
| S03-ITM-17 | Position Column | GridColumn | Output | string | - | - | 30 | - | Vị trí công việc |
| S03-ITM-18 | Idle From Column | GridColumn | Output | date | - | - | - | Date format | Ngày bắt đầu idle |
| S03-ITM-19 | Status Column | GridColumn | Output | string | - | - | 20 | - | Trạng thái hiện tại |
| S03-ITM-20 | CV Column | GridColumn | Output | link | - | - | - | - | Link download CV |
| S03-ITM-21 | Urgent Indicator | Icon | Visual | boolean | false | - | - | Idle >= 2 months | Icon cảnh báo urgent |
| S03-ITM-22 | Edit Action Button | Button | Navigation | - | - | - | - | Role permission check | Sửa resource |
| S03-ITM-23 | View Action Button | Button | Navigation | - | - | - | - | - | Xem chi tiết resource |
| S03-ITM-24 | Previous Page Button | Button | Action | - | - | - | - | - | Trang trước |
| S03-ITM-25 | Next Page Button | Button | Action | - | - | - | - | - | Trang sau |
| S03-ITM-26 | Page Info Label | Label | Output | string | - | - | - | - | Thông tin phân trang |
| S03-ITM-27 | Total Count Label | Label | Output | number | 0 | - | - | - | Tổng số bản ghi |

### S-04-01: Màn hình Chi tiết/Chỉnh sửa Idle Resource

| Item ID | Item Name | Item Type | I/O | Data Type | Initial Value | Required | Max Length | Validation Rules | Item Description |
|---------|-----------|-----------|-----|-----------|---------------|----------|------------|------------------|------------------|
| S04-ITM-01 | Employee Code Input | TextField | Input | string | "" | Yes | 20 | Unique, alphanumeric | Mã nhân viên |
| S04-ITM-02 | Full Name Input | TextField | Input | string | "" | Yes | 100 | Not empty | Họ tên đầy đủ |
| S04-ITM-03 | Department Dropdown | Dropdown | Input | string | "" | Yes | - | Valid department ID | Phòng ban |
| S04-ITM-04 | Position Input | TextField | Input | string | "" | Yes | 50 | Not empty | Vị trí công việc |
| S04-ITM-05 | Email Input | TextField | Input | string | "" | No | 100 | Valid email format | Email liên hệ |
| S04-ITM-06 | Idle From DatePicker | DatePicker | Input | date | null | Yes | - | Valid date, not future | Ngày bắt đầu idle |
| S04-ITM-07 | Idle To DatePicker | DatePicker | Input | date | null | No | - | >= Idle From date | Ngày kết thúc idle |
| S04-ITM-08 | Status Dropdown | Dropdown | Input | string | "Idle" | Yes | - | Valid status values | Trạng thái |
| S04-ITM-09 | Process Note TextArea | TextArea | Input | string | "" | No | 500 | - | Ghi chú xử lý |
| S04-ITM-10 | Rate Input | NumberField | Input | decimal | 0 | No | - | >= 0 | Mức lương theo giờ |
| S04-ITM-11 | Skill Set TextArea | TextArea | Input | string | "" | No | 1000 | - | Bộ kỹ năng |
| S04-ITM-12 | CV File Display | Link | Output | string | "" | No | - | - | File CV hiện tại |
| S04-ITM-13 | CV Download Button | Button | Action | - | - | - | - | File exists | Download CV |
| S04-ITM-14 | CV File Upload | FileUpload | Input | file | null | No | 10MB | PDF, DOC, DOCX | Upload CV mới |
| S04-ITM-15 | Upload CV Button | Button | Action | - | - | - | - | File selected | Thực hiện upload |
| S04-ITM-16 | Back to List Button | Button | Navigation | - | - | - | - | - | Quay lại danh sách |
| S04-ITM-17 | Save Button | Button | Action | - | - | - | - | Form validation | Lưu thông tin |
| S04-ITM-18 | Delete Button | Button | Action | - | - | - | - | Role: RA only, confirm | Xóa resource |
| S04-ITM-19 | History Button | Button | Navigation | - | - | - | - | - | Xem lịch sử thay đổi |
| S04-ITM-20 | Validation Message | Label | Output | string | "" | - | 200 | - | Thông báo validation |
| S04-ITM-21 | Success Message | Label | Output | string | "" | - | 200 | - | Thông báo thành công |
| S04-ITM-22 | Error Message | Label | Output | string | "" | - | 200 | - | Thông báo lỗi |

### S-05-01: Màn hình Quản lý người dùng và phân quyền

| Item ID | Item Name | Item Type | I/O | Data Type | Initial Value | Required | Max Length | Validation Rules | Item Description |
|---------|-----------|-----------|-----|-----------|---------------|----------|------------|------------------|------------------|
| S05-ITM-01 | User Search Input | TextField | Input | string | "" | No | 100 | - | Tìm kiếm user |
| S05-ITM-02 | Role Filter | Dropdown | Input | string | "All" | No | - | Valid role values | Lọc theo role |
| S05-ITM-03 | Status Filter | Dropdown | Input | string | "All" | No | - | Active/Inactive | Lọc theo trạng thái |
| S05-ITM-04 | Search Button | Button | Action | - | - | - | - | - | Thực hiện tìm kiếm |
| S05-ITM-05 | Reset Button | Button | Action | - | - | - | - | - | Reset bộ lọc |
| S05-ITM-06 | Add User Button | Button | Action | - | - | - | - | Admin only | Thêm user mới |
| S05-ITM-07 | Edit Button | Button | Action | - | - | - | - | Selection required | Sửa user |
| S05-ITM-08 | Disable Button | Button | Action | - | - | - | - | Selection required, confirm | Vô hiệu hóa user |
| S05-ITM-09 | Reset Password Button | Button | Action | - | - | - | - | Selection required, confirm | Reset mật khẩu |
| S05-ITM-10 | User Data Grid | DataGrid | Output | array | [] | - | - | - | Bảng dữ liệu user |
| S05-ITM-11 | Select All Checkbox | Checkbox | Input | boolean | false | No | - | - | Chọn tất cả users |
| S05-ITM-12 | Row Selection Checkbox | Checkbox | Input | boolean | false | No | - | - | Chọn từng user |
| S05-ITM-13 | User ID Column | GridColumn | Output | number | - | - | - | - | ID user |
| S05-ITM-14 | Username Column | GridColumn | Output | string | - | - | 50 | - | Tên đăng nhập |
| S05-ITM-15 | Full Name Column | GridColumn | Output | string | - | - | 100 | - | Họ tên |
| S05-ITM-16 | Email Column | GridColumn | Output | string | - | - | 100 | - | Email |
| S05-ITM-17 | Role Column | GridColumn | Output | string | - | - | 20 | - | Vai trò |
| S05-ITM-18 | Status Column | GridColumn | Output | string | - | - | 20 | - | Trạng thái |
| S05-ITM-19 | Edit Action Button | Button | Navigation | - | - | - | - | - | Sửa user |
| S05-ITM-20 | View Action Button | Button | Navigation | - | - | - | - | - | Xem chi tiết user |

### S-06-01: Màn hình Lịch sử cập nhật Idle Resource

| Item ID | Item Name | Item Type | I/O | Data Type | Initial Value | Required | Max Length | Validation Rules | Item Description |
|---------|-----------|-----------|-----|-----------|---------------|----------|------------|------------------|------------------|
| S06-ITM-01 | Resource Filter | Dropdown | Input | string | "All" | No | - | Valid resource IDs | Lọc theo resource |
| S06-ITM-02 | Action Filter | Dropdown | Input | string | "All" | No | - | Valid action types | Lọc theo hành động |
| S06-ITM-03 | Date Range Filter | Dropdown | Input | string | "Last 30 days" | No | - | Valid date ranges | Lọc theo thời gian |
| S06-ITM-04 | User Filter | Dropdown | Input | string | "All" | No | - | Valid user IDs | Lọc theo user |
| S06-ITM-05 | Search Button | Button | Action | - | - | - | - | - | Thực hiện tìm kiếm |
| S06-ITM-06 | Reset Button | Button | Action | - | - | - | - | - | Reset bộ lọc |
| S06-ITM-07 | Export Log Button | Button | Action | - | - | - | - | Data exists | Export log file |
| S06-ITM-08 | View Details Button | Button | Action | - | - | - | - | Selection required | Xem chi tiết log |
| S06-ITM-09 | History Data Grid | DataGrid | Output | array | [] | - | - | - | Bảng dữ liệu lịch sử |
| S06-ITM-10 | Date Time Column | GridColumn | Output | datetime | - | - | - | DateTime format | Thời gian thay đổi |
| S06-ITM-11 | Resource Column | GridColumn | Output | string | - | - | 50 | - | Tên resource |
| S06-ITM-12 | Action Column | GridColumn | Output | string | - | - | 20 | - | Hành động |
| S06-ITM-13 | User Column | GridColumn | Output | string | - | - | 50 | - | User thực hiện |
| S06-ITM-14 | Changes Column | GridColumn | Output | string | - | - | 100 | - | Nội dung thay đổi |
| S06-ITM-15 | View Detail Action | Button | Action | - | - | - | - | - | Xem chi tiết thay đổi |

## Component Standards:

### 1. Input Components:
- **TextField**: Standard text input với validation
- **PasswordField**: Masked input cho password
- **NumberField**: Numeric input với format validation
- **DatePicker**: Date selection với calendar popup
- **Dropdown**: Single selection với search capability
- **TextArea**: Multi-line text input
- **Checkbox**: Boolean selection
- **FileUpload**: File selection với drag & drop

### 2. Action Components:
- **Button**: Primary/Secondary/Danger styles
- **Link**: Navigation links
- **Icon Button**: Icon-only actions

### 3. Display Components:
- **Label**: Text display
- **Card**: Information containers
- **Chart**: Data visualization
- **DataGrid**: Tabular data với sorting/pagination
- **List**: Ordered/unordered lists

### 4. Visual Indicators:
- **Spinner**: Loading states
- **Icon**: Status/action indicators
- **Progress Bar**: Task progress
- **Badge**: Count/status badges

### 5. Validation Rules:
- **Required**: Not empty validation
- **Max Length**: Character limit
- **Email Format**: Valid email pattern
- **Date Range**: Valid date constraints
- **File Type**: Allowed file extensions
- **File Size**: Maximum upload size
- **Unique**: No duplicate values
