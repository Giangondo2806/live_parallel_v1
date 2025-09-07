# Tài liệu Thiết kế Cơ bản (Basic Design) - Phần 4
## Hệ thống Quản lý Idle Resource (IRMS)

## Phần 5: Event Description

### S-01-01: Màn hình Đăng nhập

| Screen ID | Screen Name | Event ID | Event Name | Input Information | Validation Rule | Event Process Description | Output Data | Next Screen ID |
|-----------|-------------|----------|------------|-------------------|-----------------|---------------------------|-------------|----------------|
| S-01-01 | Đăng nhập | E-01-01 | Login Button Click | Username, Password, Remember Me flag | Username not empty, Password min 8 chars | 1. Validate input fields<br/>2. Call authentication API<br/>3. Check user credentials<br/>4. Generate session token<br/>5. Set remember me cookie if checked | Success: Session token, User info<br/>Error: Error message | S-02-01 |
| S-01-01 | Đăng nhập | E-01-02 | Forgot Password Click | - | - | 1. Navigate to password reset page<br/>2. Display password reset form | Password reset form | Password Reset Page |
| S-01-01 | Đăng nhập | E-01-03 | Need Help Click | - | - | 1. Open help documentation<br/>2. Display contact information | Help content | Help Page |
| S-01-01 | Đăng nhập | E-01-04 | Username Field Change | Username text | - | 1. Clear previous validation errors<br/>2. Update username state | Updated input field | - |
| S-01-01 | Đăng nhập | E-01-05 | Password Field Change | Password text | - | 1. Clear previous validation errors<br/>2. Update password state | Updated input field | - |
| S-01-01 | Đăng nhập | E-01-06 | Remember Me Toggle | Checkbox state | - | 1. Update remember me flag | Updated checkbox state | - |

### S-02-01: Màn hình chính (Top Screen Dashboard)

| Screen ID | Screen Name | Event ID | Event Name | Input Information | Validation Rule | Event Process Description | Output Data | Next Screen ID |
|-----------|-------------|----------|------------|-------------------|-----------------|---------------------------|-------------|----------------|
| S-02-01 | Top Screen | E-02-01 | Page Load | Session token | Valid session token | 1. Validate user session<br/>2. Load user profile<br/>3. Load dashboard data<br/>4. Load menu items based on role<br/>5. Load recent activities | Dashboard data, Menu items, User profile | - |
| S-02-01 | Top Screen | E-02-02 | Menu Item Click | Menu item ID | User has permission for menu item | 1. Check user permission<br/>2. Navigate to target screen<br/>3. Update navigation breadcrumb | Navigation success | Target Screen |
| S-02-01 | Top Screen | E-02-03 | Profile Dropdown Click | - | - | 1. Display profile menu<br/>2. Show user information | Profile menu | - |
| S-02-01 | Top Screen | E-02-04 | Settings Button Click | - | User has settings permission | 1. Navigate to settings page | Settings page | Settings Page |
| S-02-01 | Top Screen | E-02-05 | Logout Button Click | - | - | 1. Show logout confirmation<br/>2. Clear session data<br/>3. Clear cookies<br/>4. Redirect to login | Logout success | S-01-01 |
| S-02-01 | Top Screen | E-02-06 | Import Excel Button Click | - | User role: RA, Admin | 1. Check user permission<br/>2. Open import dialog | Import dialog | - |
| S-02-01 | Top Screen | E-02-07 | Export Data Button Click | - | User role: RA, MNG, Admin | 1. Check user permission<br/>2. Open export dialog | Export dialog | - |
| S-02-01 | Top Screen | E-02-08 | Add Resource Button Click | - | User role: RA, MNG, Admin | 1. Check user permission<br/>2. Navigate to resource form | New resource form | S-04-01 |
| S-02-01 | Top Screen | E-02-09 | View All Updates Click | - | - | 1. Navigate to history log with recent filter | History log page | S-06-01 |
| S-02-01 | Top Screen | E-02-10 | Dashboard Refresh | - | - | 1. Reload dashboard statistics<br/>2. Update charts and counters<br/>3. Refresh recent activities | Updated dashboard data | - |

### S-03-01: Màn hình Quản lý danh sách Idle Resource

| Screen ID | Screen Name | Event ID | Event Name | Input Information | Validation Rule | Event Process Description | Output Data | Next Screen ID |
|-----------|-------------|----------|------------|-------------------|-----------------|---------------------------|-------------|----------------|
| S-03-01 | Idle Resource List | E-03-01 | Page Load | Page number, Filters | Valid page number | 1. Load resource list based on user role<br/>2. Apply role-based data filtering<br/>3. Calculate pagination<br/>4. Highlight urgent resources (≥2 months) | Resource list, Pagination info | - |
| S-03-01 | Idle Resource List | E-03-02 | Search Button Click | Search text, Department, Status | - | 1. Validate search criteria<br/>2. Build search query<br/>3. Execute search API<br/>4. Update data grid<br/>5. Reset pagination to page 1 | Filtered resource list | - |
| S-03-01 | Idle Resource List | E-03-03 | Reset Button Click | - | - | 1. Clear all search filters<br/>2. Reset to default view<br/>3. Reload full data | Full resource list | - |
| S-03-01 | Idle Resource List | E-03-04 | Import Button Click | - | User role: RA only | 1. Check user permission<br/>2. Open file selection dialog<br/>3. Show import template download | Import dialog | - |
| S-03-01 | Idle Resource List | E-03-05 | Import File Upload | Excel file | Valid Excel format, max 10MB | 1. Validate file format (.xlsx, .xls)<br/>2. Validate file size<br/>3. Parse Excel data<br/>4. Validate data against schema<br/>5. Show preview data<br/>6. Execute import process | Import result, Error list | - |
| S-03-01 | Idle Resource List | E-03-06 | Export Button Click | Export filters | User role: RA, MNG, Admin | 1. Check user permission<br/>2. Apply current filters<br/>3. Generate export file<br/>4. Download file | Export file | - |
| S-03-01 | Idle Resource List | E-03-07 | Add New Button Click | - | User role: RA, MNG, Admin | 1. Check user permission<br/>2. Navigate to new resource form | New resource form | S-04-01 |
| S-03-01 | Idle Resource List | E-03-08 | Delete Button Click | Selected resource IDs | User role: RA only, items selected | 1. Validate user permission<br/>2. Check selected items<br/>3. Show deletion confirmation<br/>4. Execute delete operation<br/>5. Refresh data grid | Delete confirmation, Updated list | - |
| S-03-01 | Idle Resource List | E-03-09 | Column Settings Click | - | - | 1. Open column settings dialog<br/>2. Show current column visibility<br/>3. Allow column reordering | Column settings dialog | - |
| S-03-01 | Idle Resource List | E-03-10 | Column Settings Save | Column configurations | Valid column settings | 1. Validate column settings<br/>2. Save user preferences<br/>3. Update data grid layout | Updated grid layout | - |
| S-03-01 | Idle Resource List | E-03-11 | Select All Toggle | Checkbox state | - | 1. Toggle all row selections<br/>2. Update bulk action buttons state | Updated selection state | - |
| S-03-01 | Idle Resource List | E-03-12 | Row Selection Toggle | Row ID, Checkbox state | - | 1. Toggle individual row selection<br/>2. Update select all state<br/>3. Update action buttons state | Updated selection state | - |
| S-03-01 | Idle Resource List | E-03-13 | Edit Action Click | Resource ID | User has edit permission | 1. Check user permission<br/>2. Load resource data<br/>3. Navigate to edit form | Resource edit form | S-04-01 |
| S-03-01 | Idle Resource List | E-03-14 | View Action Click | Resource ID | - | 1. Load resource data<br/>2. Navigate to view form | Resource view form | S-04-01 |
| S-03-01 | Idle Resource List | E-03-15 | CV Download Click | CV file ID | File exists | 1. Validate file exists<br/>2. Check download permission<br/>3. Generate download link<br/>4. Initiate file download | File download | - |
| S-03-01 | Idle Resource List | E-03-16 | Page Navigation Click | Page number | Valid page number | 1. Validate page number<br/>2. Load page data<br/>3. Update pagination controls | New page data | - |
| S-03-01 | Idle Resource List | E-03-17 | Sort Column Click | Column name, Sort direction | - | 1. Apply column sorting<br/>2. Update sort indicators<br/>3. Reload data with sort | Sorted data | - |

### S-04-01: Màn hình Chi tiết/Chỉnh sửa Idle Resource

| Screen ID | Screen Name | Event ID | Event Name | Input Information | Validation Rule | Event Process Description | Output Data | Next Screen ID |
|-----------|-------------|----------|------------|-------------------|-----------------|---------------------------|-------------|----------------|
| S-04-01 | Resource Detail/Edit | E-04-01 | Page Load | Resource ID (optional) | Valid resource ID for edit mode | 1. Check if new or edit mode<br/>2. Load resource data if edit<br/>3. Load dropdown data (departments, statuses)<br/>4. Set form permissions based on user role | Form data, Dropdown options | - |
| S-04-01 | Resource Detail/Edit | E-04-02 | Save Button Click | All form data | All required fields filled, valid data formats | 1. Validate all form fields<br/>2. Check employee code uniqueness<br/>3. Validate date ranges<br/>4. Save/update resource data<br/>5. Log history change<br/>6. Show success message | Success message, Updated resource | S-03-01 |
| S-04-01 | Resource Detail/Edit | E-04-03 | Delete Button Click | Resource ID | User role: RA only, resource exists | 1. Check user permission<br/>2. Show delete confirmation<br/>3. Check for dependencies<br/>4. Execute delete operation<br/>5. Log history change | Delete confirmation, Success message | S-03-01 |
| S-04-01 | Resource Detail/Edit | E-04-04 | Back to List Click | - | - | 1. Check for unsaved changes<br/>2. Show save confirmation if needed<br/>3. Navigate back to list | Navigation confirmation | S-03-01 |
| S-04-01 | Resource Detail/Edit | E-04-05 | History Button Click | Resource ID | Resource exists | 1. Navigate to history log<br/>2. Filter by current resource | History log filtered | S-06-01 |
| S-04-01 | Resource Detail/Edit | E-04-06 | CV Upload Button Click | File selection | File format: PDF, DOC, DOCX, max 10MB | 1. Validate file format<br/>2. Validate file size<br/>3. Upload file to server<br/>4. Update resource CV reference<br/>5. Show upload success | Upload success, File reference | - |
| S-04-01 | Resource Detail/Edit | E-04-07 | CV Download Click | CV file reference | File exists | 1. Validate file exists<br/>2. Generate download URL<br/>3. Initiate file download | File download | - |
| S-04-01 | Resource Detail/Edit | E-04-08 | Employee Code Change | Employee code | Unique, alphanumeric, max 20 chars | 1. Validate format<br/>2. Check uniqueness<br/>3. Show validation message | Validation result | - |
| S-04-01 | Resource Detail/Edit | E-04-09 | Department Change | Department ID | Valid department ID | 1. Validate department exists<br/>2. Update department field | Updated department | - |
| S-04-01 | Resource Detail/Edit | E-04-10 | Date Field Change | Date value | Valid date format, logical date range | 1. Validate date format<br/>2. Check date logic (idle_to >= idle_from)<br/>3. Update urgent indicator if needed | Validation result, Updated field | - |
| S-04-01 | Resource Detail/Edit | E-04-11 | Field Validation | Field name, Field value | Field-specific validation rules | 1. Apply field validation rules<br/>2. Show validation message<br/>3. Update field state | Validation message | - |

### S-05-01: Màn hình Quản lý người dùng và phân quyền

| Screen ID | Screen Name | Event ID | Event Name | Input Information | Validation Rule | Event Process Description | Output Data | Next Screen ID |
|-----------|-------------|----------|------------|-------------------|-----------------|---------------------------|-------------|----------------|
| S-05-01 | User Management | E-05-01 | Page Load | Page number | User role: Admin only | 1. Check admin permission<br/>2. Load user list<br/>3. Load role and status options<br/>4. Calculate pagination | User list, Dropdown options | - |
| S-05-01 | User Management | E-05-02 | Search Button Click | Search text, Role, Status | - | 1. Build search query<br/>2. Execute search API<br/>3. Update data grid<br/>4. Reset pagination | Filtered user list | - |
| S-05-01 | User Management | E-05-03 | Reset Button Click | - | - | 1. Clear all filters<br/>2. Reload full user list | Full user list | - |
| S-05-01 | User Management | E-05-04 | Add User Button Click | - | User role: Admin only | 1. Check admin permission<br/>2. Open new user form dialog | New user form | User Form Dialog |
| S-05-01 | User Management | E-05-05 | Edit Button Click | Selected user ID | User selected, Admin permission | 1. Check admin permission<br/>2. Check user selection<br/>3. Load user data<br/>4. Open edit user form | Edit user form | User Form Dialog |
| S-05-01 | User Management | E-05-06 | Disable Button Click | Selected user IDs | Users selected, Admin permission | 1. Check admin permission<br/>2. Show disable confirmation<br/>3. Execute disable operation<br/>4. Refresh user list | Confirmation, Updated list | - |
| S-05-01 | User Management | E-05-07 | Reset Password Click | Selected user ID | User selected, Admin permission | 1. Check admin permission<br/>2. Show reset confirmation<br/>3. Generate new password<br/>4. Send password email<br/>5. Show success message | Success message | - |
| S-05-01 | User Management | E-05-08 | User Form Save | User form data | All required fields, valid email, unique username | 1. Validate form data<br/>2. Check username uniqueness<br/>3. Check email format<br/>4. Save/update user<br/>5. Close form dialog | Success message, Updated list | S-05-01 |

### S-06-01: Màn hình Lịch sử cập nhật Idle Resource

| Screen ID | Screen Name | Event ID | Event Name | Input Information | Validation Rule | Event Process Description | Output Data | Next Screen ID |
|-----------|-------------|----------|------------|-------------------|-----------------|---------------------------|-------------|----------------|
| S-06-01 | History Log | E-06-01 | Page Load | Page number, Filters | - | 1. Load history log based on user role<br/>2. Apply role-based filtering<br/>3. Load filter options<br/>4. Calculate pagination | History log list, Filter options | - |
| S-06-01 | History Log | E-06-02 | Search Button Click | Resource, Action, Date range, User | - | 1. Build search query<br/>2. Execute search API<br/>3. Update data grid<br/>4. Reset pagination | Filtered history list | - |
| S-06-01 | History Log | E-06-03 | Reset Button Click | - | - | 1. Clear all filters<br/>2. Reset to default date range<br/>3. Reload full history | Full history list | - |
| S-06-01 | History Log | E-06-04 | Export Log Click | Current filters | Data exists | 1. Apply current filters<br/>2. Generate export file<br/>3. Download CSV file | Export file | - |
| S-06-01 | History Log | E-06-05 | View Details Click | Log entry ID | Log entry exists | 1. Load detailed log data<br/>2. Show detailed changes<br/>3. Display change comparison | Detail dialog | - |
| S-06-01 | History Log | E-06-06 | Date Filter Change | Date range option | Valid date range | 1. Validate date range<br/>2. Update filter state<br/>3. Auto-apply filter | Updated filter | - |

## Event Processing Rules:

### 1. Authentication Events:
- All events (except login) require valid session
- Session timeout triggers automatic logout
- Role-based permission checks for protected actions

### 2. Data Validation Events:
- Client-side validation for immediate feedback
- Server-side validation for data integrity
- Unique constraint checks for critical fields

### 3. File Upload Events:
- File type validation (PDF, DOC, DOCX for CV)
- File size limit (10MB maximum)
- Virus scanning for uploaded files
- Secure file storage with access control

### 4. Import/Export Events:
- Template validation for import files
- Data transformation and mapping
- Error reporting with line numbers
- Batch processing for large datasets

### 5. History Logging:
- Automatic logging for all CUD operations
- Change tracking with old/new values
- User attribution for all changes
- Retention policy for log data

### 6. Search and Filter Events:
- Debounced search to reduce API calls
- Persistent filter state during session
- Role-based data filtering
- Performance optimization for large datasets

### 7. Pagination Events:
- Configurable page sizes
- Deep linking for page states
- Efficient data loading strategies
- Total count optimization
