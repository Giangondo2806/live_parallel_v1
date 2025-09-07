# Tài liệu Thiết kế Cơ bản (Basic Design) - IRMS v7.0
## Hệ thống Quản lý Idle Resource (Idle Resource Management System)

## Tổng quan

Đây là tài liệu Thiết kế Cơ bản (Basic Design) cho Hệ thống Quản lý Idle Resource (IRMS) phiên bản 7.0, được phát triển dựa trên tài liệu System Requirement Definition và tuân thủ chuẩn IPA External Design (外部設計) của Nhật Bản.

## Cấu trúc tài liệu

Tài liệu được chia thành 7 phần chính, mỗi phần được tách thành file riêng để dễ quản lý và đọc hiểu:

### 📋 [01-screen-list-and-transition.md](./01-screen-list-and-transition.md)
**Phần 1 & 2: Screen List và Screen Transition**
- Danh sách tổng hợp 6 màn hình chính của hệ thống
- Sơ đồ luồng di chuyển màn hình với role-based navigation
- Quy tắc điều hướng và luồng chính theo từng role

### 🎨 [02-screen-layout-design.md](./02-screen-layout-design.md)
**Phần 3: Screen Layout Design**
- Layout design chi tiết cho tất cả 6 màn hình
- ASCII art layouts tối ưu cho desktop (1200px)
- Design guidelines và visual indicators
- Tham khảo UI/UX tương tự Argon Dashboard

### 🧩 [03-ui-component-description.md](./03-ui-component-description.md)
**Phần 4: UI Component Description**
- Specification chi tiết cho 155+ UI components
- Mỗi component có đầy đủ: Item ID, Type, I/O, Validation Rules
- Component standards và validation patterns
- Đảm bảo consistency across tất cả màn hình

### ⚡ [04-event-description.md](./04-event-description.md)
**Phần 5: Event Description**
- Định nghĩa 47 events cho tất cả màn hình
- Chi tiết input/validation/process/output cho từng event
- Event processing rules và error handling
- Authentication, file upload, import/export events

### 🗃️ [05-data-structure-and-csv-layout.md](./05-data-structure-and-csv-layout.md)
**Phần 6 & 7: Data Structure và CSV Layout**
- 10 cấu trúc dữ liệu chính mapping với database entities
- TypeScript interfaces với validation rules
- 4 CSV/Excel layout definitions cho import/export
- Role-based data filtering specifications

### 🔗 [06-api-endpoint-definition.md](./06-api-endpoint-definition.md)
**Phần 8: API Endpoint Definition**
- 20 API endpoints với Swagger 3.0 specification
- JWT authentication và role-based authorization
- Request/Response schemas và error handling
- File upload/download APIs với validation

### ✅ [07-verification-and-requirement-mapping.md](./07-verification-and-requirement-mapping.md)
**Phần 9: Verification & Requirement Mapping**
- IPA Basic Design compliance checklist
- Requirement mapping matrix (100% coverage)
- Data flow verification và business logic validation
- Non-functional requirements verification
- Gap analysis và final verification summary

## Thống kê thiết kế

| Metric | Count | Description |
|--------|-------|-------------|
| **Screens** | 6 | Tất cả màn hình từ Login đến History Log |
| **UI Components** | 155+ | TextField, Button, DataGrid, v.v. |
| **Events** | 47 | User interactions và system events |
| **APIs** | 20 | RESTful endpoints với authentication |
| **Data Structures** | 10 | TypeScript interfaces |
| **CSV Layouts** | 4 | Import/Export file formats |
| **Functional Requirements** | 20 | 100% mapped từ System Requirement |

## Role-based Design

Thiết kế hỗ trợ 4 role chính với quyền hạn được định nghĩa rõ ràng:

- **👑 Admin**: Full access to all screens và functions
- **📝 RA (Resource Administrator)**: Resource management và import/export
- **👥 MNG (Manager)**: Department-scoped resource management  
- **👀 Viewer**: Read-only access với data restrictions

## Key Features Thiết kế

### 🎯 Core Functionalities
- **Authentication & Authorization**: JWT-based với session management
- **Resource Management**: CRUD operations với role-based access
- **File Management**: CV upload/download với validation
- **Import/Export**: Excel/CSV với template validation
- **Search & Filter**: Advanced filtering với pagination
- **Audit Trail**: Complete history logging
- **Dashboard**: Real-time statistics và charts

### 🚨 Business Rules
- **Urgent Indicator**: Auto-highlight resources idle ≥ 2 months
- **Role-based Data Access**: Department scope for Managers
- **Data Privacy**: Hidden sensitive fields for Viewers
- **File Validation**: Type, size, và content validation
- **Unique Constraints**: Employee code uniqueness

### 🔐 Security Features
- **JWT Authentication**: Token-based security
- **Role-based Authorization**: Screen và data level
- **Input Validation**: Client và server-side
- **File Security**: Type và size validation
- **Audit Logging**: All operations tracked

## Technical Standards

### Frontend
- **Responsive Design**: Desktop-optimized với tablet support
- **Component Library**: Standardized UI components
- **State Management**: Consistent data flow patterns
- **Error Handling**: User-friendly error messages
- **Performance**: Pagination và lazy loading

### Backend  
- **RESTful APIs**: Consistent API design patterns
- **Data Validation**: Schema-based validation
- **Error Responses**: Standardized error format
- **File Processing**: Secure file handling
- **Database**: Optimized queries với indexing

### Integration
- **API Standards**: Swagger 3.0 documentation
- **Data Formats**: JSON for APIs, CSV/Excel for files
- **Authentication**: Bearer token authentication
- **CORS**: Configured for security
- **Rate Limiting**: Prevent abuse

## Quality Assurance

### ✅ Verification Completed
- **IPA Compliance**: All 12 criteria met
- **Requirement Coverage**: 100% functional requirements mapped
- **Cross-reference Validation**: All mappings verified
- **Business Logic**: All rules implemented
- **Non-functional Requirements**: Performance, security, usability addressed

### 🧪 Testing Recommendations
- **Unit Testing**: Component và API testing
- **Integration Testing**: End-to-end workflows
- **Security Testing**: Authentication và authorization
- **Performance Testing**: Load và stress testing
- **Usability Testing**: User acceptance testing

## Implementation Readiness

**Status**: ✅ **READY FOR IMPLEMENTATION**

Tài liệu Basic Design đã:
- ✅ Tuân thủ đầy đủ chuẩn IPA External Design
- ✅ Map 100% requirements từ System Requirement Definition  
- ✅ Provide chi tiết implementation specifications
- ✅ Include comprehensive verification và validation
- ✅ Ready cho Detail Design và Development phases

## Liên hệ và Support

Tài liệu này được tạo bởi AI Agent chuyên về Basic Design theo chuẩn IPA. Để có thêm thông tin chi tiết hoặc clarification, vui lòng tham khảo từng file cụ thể hoặc liên hệ team development.

---
*© 2024 - IRMS Basic Design Document v7.0*
