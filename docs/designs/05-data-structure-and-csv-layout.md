# Tài liệu Thiết kế Cơ bản (Basic Design) - Phần 5
## Hệ thống Quản lý Idle Resource (IRMS)

## Phần 6: Data Structure Definition

Dựa vào ER Diagram và Danh sách Entity từ System Requirement, định nghĩa cấu trúc dữ liệu phục vụ giao diện và validation.

### Bảng quản lý Data Structure List

| ID | Tên cấu trúc dữ liệu | Mục đích sử dụng | Màn hình liên quan | Mô tả |
|----|---------------------|------------------|-------------------|--------|
| 1  | LoginRequest        | Xác thực người dùng | S-01-01 | Cấu trúc dữ liệu đăng nhập |
| 2  | UserInfo           | Hiển thị thông tin user | S-02-01, S-05-01 | Thông tin người dùng hệ thống |
| 3  | DashboardData      | Hiển thị dashboard | S-02-01 | Dữ liệu tổng quan dashboard |
| 4  | IdleResourceData   | Quản lý idle resource | S-03-01, S-04-01 | Thông tin resource nhàn rỗi |
| 5  | IdleResourceList   | Danh sách resource | S-03-01 | Danh sách với pagination |
| 6  | SearchCriteria     | Tìm kiếm và lọc | S-03-01, S-05-01, S-06-01 | Điều kiện tìm kiếm |
| 7  | CVFileInfo         | Thông tin file CV | S-03-01, S-04-01 | Metadata file CV |
| 8  | HistoryLogData     | Lịch sử thay đổi | S-06-01 | Thông tin log history |
| 9  | ImportResult       | Kết quả import | S-03-01 | Kết quả import Excel |
| 10 | DepartmentInfo     | Thông tin phòng ban | S-04-01, S-05-01 | Danh sách phòng ban |

### Data Structure Definition

#### 1. LoginRequest Structure
```typescript
interface LoginRequest {
  username: string;          // required, max: 50, alphanumeric
  password: string;          // required, max: 100, min: 8
  rememberMe: boolean;       // optional, default: false
}
```

#### 2. UserInfo Structure
```typescript
interface UserInfo {
  userId: number;            // required, primary key
  username: string;          // required, max: 50, unique
  email: string;             // required, max: 100, email format
  fullName: string;          // required, max: 100
  role: UserRole;            // required, enum: Admin|RA|MNG|Viewer
  departmentId?: number;     // optional, foreign key
  departmentName?: string;   // optional, max: 100
  isActive: boolean;         // required, default: true
  createdAt: Date;           // required, auto-generated
  updatedAt: Date;           // required, auto-updated
}

enum UserRole {
  Admin = "Admin",
  RA = "RA",
  Manager = "MNG", 
  Viewer = "Viewer"
}
```

#### 3. DashboardData Structure
```typescript
interface DashboardData {
  totalResources: number;              // Total idle resources count
  urgentResources: number;             // Resources idle >= 2 months
  recentUpdates: RecentUpdate[];       // Last 10 updates
  departmentStats: DepartmentStat[];   // Statistics by department
  chartData: ChartData;                // Chart visualization data
}

interface RecentUpdate {
  resourceId: number;
  resourceName: string;
  action: string;                      // Created, Updated, Deleted
  timestamp: Date;
  updatedBy: string;
}

interface DepartmentStat {
  departmentId: number;
  departmentName: string;
  totalCount: number;
  urgentCount: number;
}

interface ChartData {
  labels: string[];                    // Department names
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}
```

#### 4. IdleResourceData Structure
```typescript
interface IdleResourceData {
  resourceId?: number;       // optional for new, required for existing
  employeeCode: string;      // required, max: 20, unique
  fullName: string;          // required, max: 100
  departmentId: number;      // required, foreign key
  departmentName?: string;   // optional, display only
  position: string;          // required, max: 50
  email?: string;            // optional, max: 100, email format
  skillSet?: string;         // optional, max: 1000
  idleFrom: Date;           // required, not future date
  idleTo?: Date;            // optional, >= idleFrom
  status: ResourceStatus;    // required, enum
  processNote?: string;      // optional, max: 500
  rate?: number;            // optional, decimal >= 0
  cvFileId?: number;        // optional, foreign key
  cvFileName?: string;       // optional, display only
  isUrgent: boolean;        // computed, idle >= 2 months
  createdBy: number;        // required, foreign key
  updatedBy: number;        // required, foreign key
  createdAt: Date;          // required, auto-generated
  updatedAt: Date;          // required, auto-updated
}

enum ResourceStatus {
  Idle = "Idle",
  Available = "Available", 
  NotYetOpen = "Not Yet Open",
  InProcess = "In Process"
}
```

#### 5. IdleResourceList Structure
```typescript
interface IdleResourceList {
  data: IdleResourceData[];
  pagination: PaginationInfo;
  filters: SearchCriteria;
}

interface PaginationInfo {
  currentPage: number;       // 1-based page number
  pageSize: number;          // records per page
  totalPages: number;        // total page count
  totalRecords: number;      // total record count
  hasNext: boolean;          // has next page
  hasPrevious: boolean;      // has previous page
}
```

#### 6. SearchCriteria Structure
```typescript
interface SearchCriteria {
  searchText?: string;       // optional, max: 100
  departmentId?: number;     // optional, filter by department
  status?: ResourceStatus;   // optional, filter by status
  userRole?: UserRole;       // optional, filter by user role
  dateFrom?: Date;          // optional, date range start
  dateTo?: Date;            // optional, date range end
  showUrgentOnly?: boolean;  // optional, show only urgent resources
  sortBy?: string;          // optional, sort column
  sortDirection?: 'asc' | 'desc'; // optional, sort direction
}
```

#### 7. CVFileInfo Structure
```typescript
interface CVFileInfo {
  cvId: number;              // required, primary key
  resourceId: number;        // required, foreign key
  fileName: string;          // required, max: 255
  filePath: string;          // required, max: 500
  fileType: string;          // required, PDF|DOC|DOCX
  fileSize: number;          // required, bytes, max: 10MB
  uploadedAt: Date;          // required, auto-generated
  uploadedBy: number;        // required, foreign key
}
```

#### 8. HistoryLogData Structure
```typescript
interface HistoryLogData {
  logId: number;             // required, primary key
  resourceId?: number;       // optional, foreign key
  resourceName?: string;     // optional, display name
  actionType: ActionType;    // required, enum
  oldValues?: object;        // optional, JSON of old values
  newValues?: object;        // optional, JSON of new values
  changedBy: number;         // required, foreign key
  changedByName: string;     // required, display name
  changedAt: Date;           // required, auto-generated
  description: string;       // required, max: 500
}

enum ActionType {
  Create = "Create",
  Update = "Update", 
  Delete = "Delete",
  Import = "Import",
  Export = "Export",
  CVUpload = "CV Upload",
  CVDownload = "CV Download"
}
```

#### 9. ImportResult Structure
```typescript
interface ImportResult {
  success: boolean;
  totalRows: number;         // total rows in file
  successRows: number;       // successfully imported
  errorRows: number;         // rows with errors
  errors: ImportError[];     // detailed error list
  previewData?: IdleResourceData[]; // preview of data to import
}

interface ImportError {
  rowNumber: number;         // row number in Excel file
  field: string;            // field name with error
  value: string;            // invalid value
  errorMessage: string;     // error description
}
```

#### 10. DepartmentInfo Structure
```typescript
interface DepartmentInfo {
  departmentId: number;      // required, primary key
  departmentName: string;    // required, max: 100
  departmentCode: string;    // required, max: 20, unique
  isActive: boolean;         // required, default: true
  createdAt: Date;          // required, auto-generated
  updatedAt: Date;          // required, auto-updated
}
```

## Phần 7: CSV Layout Definition

Dựa vào System Requirement và Event Description, định nghĩa layout cho các file CSV cần import/export.

### Bảng quản lý CSV Layout List

| ID | File Name | Direction | Purpose | Related Events | Related Screens |
|----|-----------|-----------|---------|----------------|-----------------|
| CSV-01 | idle_resource_import_template.xlsx | Import | Import idle resource data | E-03-05 | S-03-01 |
| CSV-02 | idle_resource_export.csv | Export | Export filtered resource data | E-03-06 | S-03-01 |
| CSV-03 | history_log_export.csv | Export | Export history log data | E-06-04 | S-06-01 |
| CSV-04 | dashboard_report.csv | Export | Export dashboard statistics | E-02-07 | S-02-01 |

### CSV Layout Definition

#### CSV-01: Idle Resource Import Template (Excel)

**File Name**: `idle_resource_import_template.xlsx`  
**Format**: Excel (.xlsx)  
**Purpose**: Template for importing idle resource data  
**Max Records**: 10,000 rows  

| Column | Field Name | Data Type | Required | Max Length | Validation Rules | Example Value |
|--------|------------|-----------|----------|------------|------------------|---------------|
| A | employee_code | string | Yes | 20 | Unique, alphanumeric | EMP001 |
| B | full_name | string | Yes | 100 | Not empty | Nguyen Van A |
| C | department_code | string | Yes | 20 | Must exist in department master | IT |
| D | position | string | Yes | 50 | Not empty | Software Developer |
| E | email | string | No | 100 | Valid email format | nguyenvana@company.com |
| F | skill_set | string | No | 1000 | - | Java, Spring, MySQL |
| G | idle_from | date | Yes | - | Valid date, format: YYYY-MM-DD | 2024-01-15 |
| H | idle_to | date | No | - | >= idle_from, format: YYYY-MM-DD | 2024-03-15 |
| I | status | string | Yes | 20 | Idle/Available/Not Yet Open/In Process | Idle |
| J | process_note | string | No | 500 | - | Waiting for new project assignment |
| K | rate | number | No | - | >= 0, decimal(10,2) | 5000.00 |

**Header Row**: Row 1 contains field names  
**Data Rows**: Start from Row 2  
**Validation Rules**:
- Employee code must be unique across the file
- Department code must exist in system
- Date format: YYYY-MM-DD
- Status values are case-sensitive
- Email validation follows RFC 5322 standard

#### CSV-02: Idle Resource Export (CSV)

**File Name**: `idle_resource_export_YYYYMMDD_HHMMSS.csv`  
**Format**: CSV with UTF-8 encoding  
**Purpose**: Export filtered idle resource data  

| Column | Field Name | Data Type | Description | Role-based Access |
|--------|------------|-----------|-------------|-------------------|
| 1 | resource_id | number | Resource ID | All |
| 2 | employee_code | string | Employee Code | All |
| 3 | full_name | string | Full Name | All |
| 4 | department_name | string | Department Name | All |
| 5 | position | string | Position | All |
| 6 | email | string | Email Address | Admin, RA, MNG |
| 7 | skill_set | string | Skill Set | All |
| 8 | idle_from | date | Idle From Date | All |
| 9 | idle_to | date | Idle To Date | All |
| 10 | status | string | Current Status | Admin, RA, MNG (Hidden for Viewer if "Not Yet Open") |
| 11 | process_note | string | Process Note | Admin, RA, MNG (Hidden for Viewer) |
| 12 | rate | number | Rate (JPY/hour) | Admin, RA (Hidden for MNG, Viewer) |
| 13 | cv_file_name | string | CV File Name | All |
| 14 | is_urgent | boolean | Urgent Flag | All |
| 15 | created_at | datetime | Created Date | All |
| 16 | updated_at | datetime | Last Updated | All |

**Role-based Filtering**:
- **Viewer**: Hidden columns: email, process_note, rate
- **Viewer**: Hidden rows: status = "Not Yet Open"  
- **Manager**: Hidden columns: rate
- **Manager**: Only department resources

#### CSV-03: History Log Export (CSV)

**File Name**: `history_log_export_YYYYMMDD_HHMMSS.csv`  
**Format**: CSV with UTF-8 encoding  
**Purpose**: Export history log data  

| Column | Field Name | Data Type | Description |
|--------|------------|-----------|-------------|
| 1 | log_id | number | Log ID |
| 2 | changed_at | datetime | Change Timestamp |
| 3 | resource_id | number | Resource ID |
| 4 | resource_name | string | Resource Name |
| 5 | action_type | string | Action Type |
| 6 | changed_by_name | string | Changed By User |
| 7 | old_values | string | Old Values (JSON) |
| 8 | new_values | string | New Values (JSON) |
| 9 | description | string | Change Description |

**Date Format**: YYYY-MM-DD HH:MM:SS  
**JSON Format**: {"field_name": "old_value", ...}

#### CSV-04: Dashboard Report Export (CSV)

**File Name**: `dashboard_report_YYYYMMDD_HHMMSS.csv`  
**Format**: CSV with UTF-8 encoding  
**Purpose**: Export dashboard statistics  

| Column | Field Name | Data Type | Description |
|--------|------------|-----------|-------------|
| 1 | report_date | date | Report Date |
| 2 | department_name | string | Department Name |
| 3 | total_resources | number | Total Resources |
| 4 | idle_resources | number | Idle Resources |
| 5 | urgent_resources | number | Urgent Resources (>=2 months) |
| 6 | available_resources | number | Available Resources |
| 7 | avg_idle_days | number | Average Idle Days |
| 8 | longest_idle_days | number | Longest Idle Days |

## Validation Standards:

### 1. Import Validation:
- **File Format**: Excel (.xlsx, .xls) only
- **File Size**: Maximum 10MB
- **Row Limit**: Maximum 10,000 data rows
- **Header Validation**: Exact column names required
- **Data Type Validation**: Per column specifications
- **Business Rule Validation**: Referential integrity checks

### 2. Export Formatting:
- **CSV Encoding**: UTF-8 with BOM
- **Date Format**: YYYY-MM-DD for dates, YYYY-MM-DD HH:MM:SS for datetime
- **Number Format**: No thousand separators, decimal point as period
- **Text Escaping**: Double quotes for text containing commas/newlines
- **Empty Values**: Empty string for NULL values

### 3. Role-based Access:
- **Column Filtering**: Hide sensitive columns based on user role
- **Row Filtering**: Hide restricted data based on user role
- **Department Filtering**: Limit data scope for Manager role
- **Audit Trail**: Log all import/export activities

### 4. Error Handling:
- **Import Errors**: Detailed error report with row numbers
- **Validation Errors**: Field-level error descriptions
- **File Errors**: File format and corruption detection
- **System Errors**: Database and system-level error handling
