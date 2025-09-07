# Tài liệu Thiết kế Cơ bản (Basic Design) - Phần 6
## Hệ thống Quản lý Idle Resource (IRMS)

## Phần 8: API Endpoint Definition

Dựa vào System Requirement và Event Description, định nghĩa các API endpoint cần thiết cho hệ thống.

### Bảng quản lý API Endpoint List

| ID | Tên API | Phương thức | Đường dẫn | Event ID liên quan | Mô tả ngắn gọn |
|----|---------|-------------|-----------|-------------------|-----------------|
| API-01 | Authentication Login | POST | /api/auth/login | E-01-01 | Đăng nhập hệ thống |
| API-02 | Authentication Logout | POST | /api/auth/logout | E-02-05 | Đăng xuất hệ thống |
| API-03 | Get Dashboard Data | GET | /api/dashboard | E-02-01, E-02-10 | Lấy dữ liệu dashboard |
| API-04 | Get Idle Resources | GET | /api/idle-resources | E-03-01, E-03-02 | Lấy danh sách idle resource |
| API-05 | Create Idle Resource | POST | /api/idle-resources | E-04-02 | Tạo idle resource mới |
| API-06 | Update Idle Resource | PUT | /api/idle-resources/{id} | E-04-02 | Cập nhật idle resource |
| API-07 | Delete Idle Resource | DELETE | /api/idle-resources/{id} | E-04-03 | Xóa idle resource |
| API-08 | Batch Delete Resources | DELETE | /api/idle-resources/batch | E-03-08 | Xóa nhiều resource |
| API-09 | Upload CV File | POST | /api/cv-files | E-04-06 | Upload file CV |
| API-10 | Download CV File | GET | /api/cv-files/{id}/download | E-04-07, E-03-15 | Download file CV |
| API-11 | Import Excel Data | POST | /api/idle-resources/import | E-03-05 | Import dữ liệu từ Excel |
| API-12 | Export Resources | GET | /api/idle-resources/export | E-03-06 | Export dữ liệu resource |
| API-13 | Get Users | GET | /api/users | E-05-01, E-05-02 | Lấy danh sách user |
| API-14 | Create User | POST | /api/users | E-05-04, E-05-08 | Tạo user mới |
| API-15 | Update User | PUT | /api/users/{id} | E-05-05, E-05-08 | Cập nhật user |
| API-16 | Reset Password | POST | /api/users/{id}/reset-password | E-05-07 | Reset mật khẩu user |
| API-17 | Get History Logs | GET | /api/history-logs | E-06-01, E-06-02 | Lấy lịch sử cập nhật |
| API-18 | Export History Logs | GET | /api/history-logs/export | E-06-04 | Export lịch sử |
| API-19 | Get Departments | GET | /api/departments | E-04-01, E-05-01 | Lấy danh sách phòng ban |
| API-20 | Session Validation | GET | /api/auth/validate | All events | Kiểm tra session hợp lệ |

### API Endpoint Definition (Swagger 3.0)

#### API-01: Authentication Login
```yaml
/api/auth/login:
  post:
    summary: Đăng nhập hệ thống
    tags: [Authentication]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [username, password]
            properties:
              username:
                type: string
                maxLength: 50
                description: Tên đăng nhập
              password:
                type: string
                maxLength: 100
                description: Mật khẩu
              rememberMe:
                type: boolean
                default: false
                description: Ghi nhớ đăng nhập
    responses:
      200:
        description: Đăng nhập thành công
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                token:
                  type: string
                  description: JWT token
                user:
                  $ref: '#/components/schemas/UserInfo'
      401:
        description: Thông tin đăng nhập không hợp lệ
      429:
        description: Quá nhiều lần thử đăng nhập
```

#### API-02: Authentication Logout
```yaml
/api/auth/logout:
  post:
    summary: Đăng xuất hệ thống
    tags: [Authentication]
    security:
      - bearerAuth: []
    responses:
      200:
        description: Đăng xuất thành công
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                message:
                  type: string
```

#### API-03: Get Dashboard Data
```yaml
/api/dashboard:
  get:
    summary: Lấy dữ liệu dashboard
    tags: [Dashboard]
    security:
      - bearerAuth: []
    responses:
      200:
        description: Dữ liệu dashboard
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DashboardData'
      403:
        description: Không có quyền truy cập
```

#### API-04: Get Idle Resources
```yaml
/api/idle-resources:
  get:
    summary: Lấy danh sách idle resource với phân trang và filter
    tags: [Idle Resources]
    security:
      - bearerAuth: []
    parameters:
      - name: page
        in: query
        schema:
          type: integer
          minimum: 1
          default: 1
      - name: pageSize
        in: query
        schema:
          type: integer
          minimum: 1
          maximum: 100
          default: 20
      - name: search
        in: query
        schema:
          type: string
          maxLength: 100
      - name: departmentId
        in: query
        schema:
          type: integer
      - name: status
        in: query
        schema:
          type: string
          enum: [Idle, Available, Not Yet Open, In Process]
      - name: urgentOnly
        in: query
        schema:
          type: boolean
      - name: sortBy
        in: query
        schema:
          type: string
      - name: sortDirection
        in: query
        schema:
          type: string
          enum: [asc, desc]
    responses:
      200:
        description: Danh sách idle resource
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/IdleResourceList'
```

#### API-05: Create Idle Resource
```yaml
/api/idle-resources:
  post:
    summary: Tạo idle resource mới
    tags: [Idle Resources]
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/IdleResourceInput'
    responses:
      201:
        description: Tạo thành công
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/IdleResourceData'
      400:
        description: Dữ liệu không hợp lệ
      403:
        description: Không có quyền tạo
      409:
        description: Employee code đã tồn tại
```

#### API-06: Update Idle Resource
```yaml
/api/idle-resources/{id}:
  put:
    summary: Cập nhật idle resource
    tags: [Idle Resources]
    security:
      - bearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/IdleResourceInput'
    responses:
      200:
        description: Cập nhật thành công
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/IdleResourceData'
      400:
        description: Dữ liệu không hợp lệ
      403:
        description: Không có quyền cập nhật
      404:
        description: Resource không tồn tại
```

#### API-07: Delete Idle Resource
```yaml
/api/idle-resources/{id}:
  delete:
    summary: Xóa idle resource
    tags: [Idle Resources]
    security:
      - bearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
    responses:
      200:
        description: Xóa thành công
      403:
        description: Không có quyền xóa
      404:
        description: Resource không tồn tại
      409:
        description: Không thể xóa do có liên kết
```

#### API-08: Batch Delete Resources
```yaml
/api/idle-resources/batch:
  delete:
    summary: Xóa nhiều idle resource
    tags: [Idle Resources]
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [ids]
            properties:
              ids:
                type: array
                items:
                  type: integer
                minItems: 1
                maxItems: 100
    responses:
      200:
        description: Kết quả xóa
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: integer
                  description: Số record xóa thành công
                failed:
                  type: integer
                  description: Số record xóa thất bại
                errors:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                      error:
                        type: string
```

#### API-09: Upload CV File
```yaml
/api/cv-files:
  post:
    summary: Upload file CV
    tags: [CV Management]
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        multipart/form-data:
          schema:
            type: object
            required: [file, resourceId]
            properties:
              file:
                type: string
                format: binary
                description: CV file (PDF, DOC, DOCX, max 10MB)
              resourceId:
                type: integer
                description: ID của idle resource
    responses:
      201:
        description: Upload thành công
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CVFileInfo'
      400:
        description: File không hợp lệ
      403:
        description: Không có quyền upload
      413:
        description: File quá lớn
```

#### API-10: Download CV File
```yaml
/api/cv-files/{id}/download:
  get:
    summary: Download file CV
    tags: [CV Management]
    security:
      - bearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
    responses:
      200:
        description: File CV
        content:
          application/octet-stream:
            schema:
              type: string
              format: binary
      403:
        description: Không có quyền download
      404:
        description: File không tồn tại
```

#### API-11: Import Excel Data
```yaml
/api/idle-resources/import:
  post:
    summary: Import dữ liệu từ Excel
    tags: [Import/Export]
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        multipart/form-data:
          schema:
            type: object
            required: [file]
            properties:
              file:
                type: string
                format: binary
                description: Excel file (.xlsx, .xls, max 10MB)
              preview:
                type: boolean
                default: false
                description: Preview mode (không lưu data)
    responses:
      200:
        description: Kết quả import
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ImportResult'
      400:
        description: File không hợp lệ
      403:
        description: Không có quyền import
```

#### API-12: Export Resources
```yaml
/api/idle-resources/export:
  get:
    summary: Export dữ liệu resource
    tags: [Import/Export]
    security:
      - bearerAuth: []
    parameters:
      - name: format
        in: query
        schema:
          type: string
          enum: [csv, excel]
          default: csv
      - name: search
        in: query
        schema:
          type: string
      - name: departmentId
        in: query
        schema:
          type: integer
      - name: status
        in: query
        schema:
          type: string
    responses:
      200:
        description: File export
        content:
          application/octet-stream:
            schema:
              type: string
              format: binary
      403:
        description: Không có quyền export
```

#### API-13: Get Users
```yaml
/api/users:
  get:
    summary: Lấy danh sách user (Admin only)
    tags: [User Management]
    security:
      - bearerAuth: []
    parameters:
      - name: page
        in: query
        schema:
          type: integer
          minimum: 1
          default: 1
      - name: pageSize
        in: query
        schema:
          type: integer
          minimum: 1
          maximum: 100
          default: 20
      - name: search
        in: query
        schema:
          type: string
      - name: role
        in: query
        schema:
          type: string
          enum: [Admin, RA, MNG, Viewer]
      - name: status
        in: query
        schema:
          type: string
          enum: [Active, Inactive]
    responses:
      200:
        description: Danh sách user
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: array
                  items:
                    $ref: '#/components/schemas/UserInfo'
                pagination:
                  $ref: '#/components/schemas/PaginationInfo'
      403:
        description: Không có quyền truy cập (Admin only)
```

#### API-17: Get History Logs
```yaml
/api/history-logs:
  get:
    summary: Lấy lịch sử cập nhật
    tags: [History]
    security:
      - bearerAuth: []
    parameters:
      - name: page
        in: query
        schema:
          type: integer
          minimum: 1
          default: 1
      - name: pageSize
        in: query
        schema:
          type: integer
          minimum: 1
          maximum: 100
          default: 20
      - name: resourceId
        in: query
        schema:
          type: integer
      - name: actionType
        in: query
        schema:
          type: string
          enum: [Create, Update, Delete, Import, Export, CV Upload, CV Download]
      - name: userId
        in: query
        schema:
          type: integer
      - name: dateFrom
        in: query
        schema:
          type: string
          format: date
      - name: dateTo
        in: query
        schema:
          type: string
          format: date
    responses:
      200:
        description: Danh sách history log
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: array
                  items:
                    $ref: '#/components/schemas/HistoryLogData'
                pagination:
                  $ref: '#/components/schemas/PaginationInfo'
```

### Components Schema

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    UserInfo:
      type: object
      properties:
        userId:
          type: integer
        username:
          type: string
        email:
          type: string
        fullName:
          type: string
        role:
          type: string
          enum: [Admin, RA, MNG, Viewer]
        departmentId:
          type: integer
        departmentName:
          type: string
        isActive:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    IdleResourceData:
      type: object
      properties:
        resourceId:
          type: integer
        employeeCode:
          type: string
        fullName:
          type: string
        departmentId:
          type: integer
        departmentName:
          type: string
        position:
          type: string
        email:
          type: string
        skillSet:
          type: string
        idleFrom:
          type: string
          format: date
        idleTo:
          type: string
          format: date
        status:
          type: string
          enum: [Idle, Available, Not Yet Open, In Process]
        processNote:
          type: string
        rate:
          type: number
        cvFileId:
          type: integer
        cvFileName:
          type: string
        isUrgent:
          type: boolean
        createdBy:
          type: integer
        updatedBy:
          type: integer
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    IdleResourceInput:
      type: object
      required: [employeeCode, fullName, departmentId, position, idleFrom, status]
      properties:
        employeeCode:
          type: string
          maxLength: 20
        fullName:
          type: string
          maxLength: 100
        departmentId:
          type: integer
        position:
          type: string
          maxLength: 50
        email:
          type: string
          maxLength: 100
          format: email
        skillSet:
          type: string
          maxLength: 1000
        idleFrom:
          type: string
          format: date
        idleTo:
          type: string
          format: date
        status:
          type: string
          enum: [Idle, Available, Not Yet Open, In Process]
        processNote:
          type: string
          maxLength: 500
        rate:
          type: number
          minimum: 0

    PaginationInfo:
      type: object
      properties:
        currentPage:
          type: integer
        pageSize:
          type: integer
        totalPages:
          type: integer
        totalRecords:
          type: integer
        hasNext:
          type: boolean
        hasPrevious:
          type: boolean

    IdleResourceList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/IdleResourceData'
        pagination:
          $ref: '#/components/schemas/PaginationInfo'

    DashboardData:
      type: object
      properties:
        totalResources:
          type: integer
        urgentResources:
          type: integer
        recentUpdates:
          type: array
          items:
            type: object
            properties:
              resourceId:
                type: integer
              resourceName:
                type: string
              action:
                type: string
              timestamp:
                type: string
                format: date-time
              updatedBy:
                type: string
        departmentStats:
          type: array
          items:
            type: object
            properties:
              departmentId:
                type: integer
              departmentName:
                type: string
              totalCount:
                type: integer
              urgentCount:
                type: integer

    CVFileInfo:
      type: object
      properties:
        cvId:
          type: integer
        resourceId:
          type: integer
        fileName:
          type: string
        fileType:
          type: string
        fileSize:
          type: integer
        uploadedAt:
          type: string
          format: date-time
        uploadedBy:
          type: integer

    ImportResult:
      type: object
      properties:
        success:
          type: boolean
        totalRows:
          type: integer
        successRows:
          type: integer
        errorRows:
          type: integer
        errors:
          type: array
          items:
            type: object
            properties:
              rowNumber:
                type: integer
              field:
                type: string
              value:
                type: string
              errorMessage:
                type: string

    HistoryLogData:
      type: object
      properties:
        logId:
          type: integer
        resourceId:
          type: integer
        resourceName:
          type: string
        actionType:
          type: string
          enum: [Create, Update, Delete, Import, Export, CV Upload, CV Download]
        oldValues:
          type: object
        newValues:
          type: object
        changedBy:
          type: integer
        changedByName:
          type: string
        changedAt:
          type: string
          format: date-time
        description:
          type: string
```

## API Security & Standards:

### 1. Authentication:
- **JWT Token**: Bearer token authentication
- **Session Management**: Token expiration và refresh
- **Rate Limiting**: Prevent brute force attacks
- **CORS**: Configured for specific domains

### 2. Authorization:
- **Role-based Access**: API endpoint permissions
- **Data Filtering**: Role-based data access
- **Department Scope**: Manager role restrictions
- **Audit Logging**: Track all API calls

### 3. Validation:
- **Input Validation**: Schema validation for all inputs
- **File Validation**: Type, size, and content validation
- **Business Rules**: Domain-specific validation
- **Error Responses**: Consistent error format

### 4. Performance:
- **Pagination**: Limit large data responses
- **Caching**: Cache static data (departments, statuses)
- **Compression**: GZIP response compression
- **Database Optimization**: Efficient queries

### 5. Error Handling:
- **HTTP Status Codes**: Standard status codes
- **Error Messages**: User-friendly error descriptions
- **Logging**: Comprehensive error logging
- **Monitoring**: API performance monitoring
