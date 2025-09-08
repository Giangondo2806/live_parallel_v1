# Feature Implementation Task List: Idle Resource Management Screen (S-03-01)

## Screen: S-03-01 - Idle Resource Management

### Method Conflict Analysis Summary:
Trước khi tạo task, tôi đã phân tích tất cả các method cần sửa đổi cho từng event và nhóm các event có chung method để tránh conflict:

**Backend Methods Analysis:**
- `findAll()`, `search()` → Used by E-03-01, E-03-02, E-03-03, E-03-16, E-03-17
- `exportToExcel()` → Used by E-03-06 
- `create()` → Used by E-03-07
- `remove()`, `bulkDelete()` → Used by E-03-08
- `importFromExcel()` → Used by E-03-04, E-03-05
- `findOne()` → Used by E-03-13, E-03-14, E-03-15

**Frontend Methods Analysis:**
- `loadResourceList()`, `handleSearch()`, `handleReset()`, `handleSort()`, `handlePageChange()` → Used by E-03-01, E-03-02, E-03-03, E-03-16, E-03-17
- `handleExport()` → Used by E-03-06
- `handleAddNew()` → Used by E-03-07  
- `handleDelete()`, `handleBulkDelete()` → Used by E-03-08
- `handleImport()`, `handleFileUpload()` → Used by E-03-04, E-03-05
- `handleEdit()`, `handleView()`, `handleCVDownload()` → Used by E-03-13, E-03-14, E-03-15
- `handleSelectAll()`, `handleRowSelect()` → Used by E-03-11, E-03-12
- `handleColumnSettings()`, `saveColumnSettings()` → Used by E-03-09, E-03-10

### Task Breakdown Strategy:
Các task được nhóm theo business feature để tránh conflict và đảm bảo tính liên kết logic:

| Task ID | Screen ID & Name | Feature Name | Event IDs | Methods to Modify | Dependencies | Status |
|---------|------------------|--------------|-----------|-------------------|--------------|--------|
| T-S03-001 | S-03-01 - Idle Resource List | Foundation & Page Load | E-03-01 | Backend: `findAll()`, `search()`<br/>Frontend: `loadResourceList()`, `useEffect()`, role-based filtering | T-S00-000 (Auth System) | pending |
| T-S03-002 | S-03-01 - Idle Resource List | Search & Filter Functionality | E-03-02, E-03-03, E-03-17 | Backend: `findAll()`, `search()` (enhance)<br/>Frontend: `handleSearch()`, `handleReset()`, `handleSort()`, `buildSearchQuery()` | T-S03-001 | pending |
| T-S03-003 | S-03-01 - Idle Resource List | Import Excel Functionality | E-03-04, E-03-05 | Backend: `importFromExcel()`<br/>Frontend: `handleImport()`, `handleFileUpload()`, `validateExcelFile()`, `showImportDialog()` | T-S03-001 | pending |
| T-S03-004 | S-03-01 - Idle Resource List | Export Data Functionality | E-03-06 | Backend: `exportToExcel()`<br/>Frontend: `handleExport()`, `generateExportFilter()`, `downloadFile()` | T-S03-001 | pending |
| T-S03-005 | S-03-01 - Idle Resource List | Add New Resource Navigation | E-03-07 | Frontend: `handleAddNew()`, `navigateToForm()`, permission check | T-S03-001 | pending |
| T-S03-006 | S-03-01 - Idle Resource List | Delete & Bulk Delete Operations | E-03-08 | Backend: `remove()`, `bulkDelete()`<br/>Frontend: `handleDelete()`, `handleBulkDelete()`, `showDeleteConfirmation()` | T-S03-001 | pending |
| T-S03-007 | S-03-01 - Idle Resource List | Column Management | E-03-09, E-03-10 | Frontend: `handleColumnSettings()`, `saveColumnSettings()`, `restoreColumnLayout()`, `updateGridColumns()` | T-S03-001 | pending |
| T-S03-008 | S-03-01 - Idle Resource List | Row Selection Management | E-03-11, E-03-12 | Frontend: `handleSelectAll()`, `handleRowSelect()`, `updateSelectionState()`, `updateActionButtons()` | T-S03-001 | pending |
| T-S03-009 | S-03-01 - Idle Resource List | Row Actions (Edit/View/CV) | E-03-13, E-03-14, E-03-15 | Backend: `findOne()` (enhance for permissions)<br/>Frontend: `handleEdit()`, `handleView()`, `handleCVDownload()`, `checkPermissions()` | T-S03-001 | pending |
| T-S03-010 | S-03-01 - Idle Resource List | Pagination Management | E-03-16 | Backend: `findAll()` (enhance pagination)<br/>Frontend: `handlePageChange()`, `updatePaginationState()`, `calculatePageInfo()` | T-S03-001 | pending |

## Detailed Task Specifications:

### T-S03-001: Foundation & Page Load
**Feature**: Initial page load with role-based data filtering and basic resource list display

**Event Coverage**: E-03-01 (Page Load)

**Backend Implementation**:
```typescript
// idle-resources.service.ts
async findAll(searchCriteria: SearchCriteriaDto, userRole: UserRole, userDeptId?: number): Promise<PaginatedIdleResourceResponseDto> {
  // TODO: Implement role-based filtering logic
  // TODO: Add basic pagination
  // TODO: Include department and user relations
  // TODO: Calculate isUrgent flag (idle >= 2 months)
  // TODO: Add performance optimization with proper indexing
}

async search(searchCriteria: SearchCriteriaDto): Promise<PaginatedIdleResourceResponseDto> {
  // TODO: Basic search structure (will be enhanced in T-S03-002)
}
```

**Frontend Implementation**:
```typescript
// page.tsx
const loadResourceList = async (page: number = 1, filters: ResourceSearchFilters = {}) => {
  // TODO: Call API with current user role
  // TODO: Handle role-based UI elements visibility
  // TODO: Set loading states
  // TODO: Handle API errors gracefully
  // TODO: Update resource list state
}

useEffect(() => {
  // TODO: Load initial data on component mount
  // TODO: Check user permissions
  // TODO: Setup default filters based on role
}, []);
```

**Acceptance Criteria**:
- [ ] Page loads resource list based on user role (Admin/RA sees all, Manager sees department only)
- [ ] Urgent resources (≥2 months idle) are highlighted with warning icon
- [ ] Basic pagination is functional (10 items per page)
- [ ] Loading states are properly displayed
- [ ] Error handling for API failures
- [ ] Role-based UI elements visibility (Import button only for RA, etc.)

**Dependencies**: T-S00-000 (Authentication system must be complete)

---

### T-S03-002: Search & Filter Functionality
**Feature**: Advanced search across multiple fields with filters and sorting

**Event Coverage**: E-03-02 (Search Button Click), E-03-03 (Reset Button Click), E-03-17 (Sort Column Click)

**Backend Implementation**:
```typescript
// idle-resources.service.ts - Enhance existing methods
async findAll(searchCriteria: SearchCriteriaDto): Promise<PaginatedIdleResourceResponseDto> {
  // TODO: Add text search across name, employee code, skills
  // TODO: Add department filter
  // TODO: Add status filter  
  // TODO: Add date range filtering
  // TODO: Implement column sorting with multiple fields
  // TODO: Add search result highlighting
}

async search(searchCriteria: SearchCriteriaDto): Promise<PaginatedIdleResourceResponseDto> {
  // TODO: Implement full-text search functionality
  // TODO: Add search result ranking and relevance scoring
  // TODO: Track search queries for analytics
}
```

**Frontend Implementation**:
```typescript
// page.tsx
const handleSearch = async () => {
  // TODO: Validate search criteria
  // TODO: Build search query object
  // TODO: Call search API
  // TODO: Reset pagination to page 1
  // TODO: Update URL with search params
  // TODO: Handle search result highlighting
}

const handleReset = async () => {
  // TODO: Clear all search filters
  // TODO: Reset form states
  // TODO: Reload full data list
  // TODO: Clear URL search params
}

const handleSort = async (column: string, direction: 'asc' | 'desc') => {
  // TODO: Update sort state
  // TODO: Call API with sort parameters
  // TODO: Update grid sort indicators
}

const buildSearchQuery = (filters: ResourceSearchFilters) => {
  // TODO: Convert filter object to API query parameters
  // TODO: Handle special filter types (date ranges, etc.)
}
```

**Acceptance Criteria**:
- [ ] Text search works across name, employee code, and skills fields
- [ ] Department dropdown filter functional
- [ ] Status dropdown filter functional  
- [ ] Sort functionality works for all sortable columns
- [ ] Reset button clears all filters and reloads full data
- [ ] Search pagination resets to page 1
- [ ] URL reflects current search state (shareable links)
- [ ] Search performance optimized (debounced input)

**Dependencies**: T-S03-001

---

### T-S03-003: Import Excel Functionality  
**Feature**: Excel file import with validation and batch processing

**Event Coverage**: E-03-04 (Import Button Click), E-03-05 (Import File Upload)

**Backend Implementation**:
```typescript
// idle-resources.service.ts
async importFromExcel(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
  // TODO: Validate Excel file format (.xlsx, .xls)
  // TODO: Parse Excel data and validate schema
  // TODO: Check for duplicate employee codes
  // TODO: Validate department references
  // TODO: Implement batch processing for large files
  // TODO: Create detailed import log with success/failure details
  // TODO: Handle partial imports gracefully
  // TODO: Create history log entries for imported resources
  // TODO: Send import summary notification
}
```

**Frontend Implementation**:
```typescript
// page.tsx
const handleImport = () => {
  // TODO: Check user permission (RA only)
  // TODO: Open import dialog
  // TODO: Show template download option
  // TODO: Handle file selection UI
}

const handleFileUpload = async (file: File) => {
  // TODO: Validate file type and size client-side
  // TODO: Show upload progress
  // TODO: Call import API
  // TODO: Show import results dialog
  // TODO: Handle import errors gracefully
  // TODO: Refresh resource list after successful import
}

const validateExcelFile = (file: File): boolean => {
  // TODO: Check file extension
  // TODO: Check file size (max 10MB)
  // TODO: Show validation error messages
}

const showImportDialog = () => {
  // TODO: Display import dialog with instructions
  // TODO: Provide template download link
  // TODO: Show file upload area
}
```

**Acceptance Criteria**:
- [ ] Import button only visible for RA role users
- [ ] File validation (Excel format, max 10MB)
- [ ] Template download available
- [ ] Upload progress indicator
- [ ] Detailed import results shown (success/failure counts)
- [ ] Duplicate employee code handling
- [ ] Resource list refreshes after successful import
- [ ] Import history logged for audit

**Dependencies**: T-S03-001

---

### T-S03-004: Export Data Functionality
**Feature**: Excel export with current filters applied

**Event Coverage**: E-03-06 (Export Button Click)

**Backend Implementation**:
```typescript
// idle-resources.service.ts  
async exportToExcel(exportFilter: ExportFilterDto, res: Response): Promise<void> {
  // TODO: Apply user role-based filtering to export data
  // TODO: Apply current search filters
  // TODO: Generate Excel file with proper formatting
  // TODO: Include summary statistics
  // TODO: Add export metadata (date, user, filters)
  // TODO: Stream large exports efficiently
  // TODO: Create audit log entry for data export
}
```

**Frontend Implementation**:
```typescript
// page.tsx
const handleExport = async () => {
  // TODO: Check user permission (RA, MNG, Admin)
  // TODO: Generate export filter based on current search
  // TODO: Show export progress indicator
  // TODO: Call export API
  // TODO: Handle file download
  // TODO: Show export completion message
}

const generateExportFilter = (): ExportFilterDto => {
  // TODO: Convert current search filters to export format
  // TODO: Include current sort settings
  // TODO: Add user role context
}

const downloadFile = (response: Response) => {
  // TODO: Handle file download from API response
  // TODO: Set appropriate filename with timestamp
}
```

**Acceptance Criteria**:
- [ ] Export button visible for authorized roles (RA, MNG, Admin)
- [ ] Current filters applied to export data
- [ ] Excel file properly formatted with headers
- [ ] Export includes metadata (export date, filters applied)
- [ ] Large export handled efficiently (streaming)
- [ ] Export completion feedback to user
- [ ] Export action logged for audit

**Dependencies**: T-S03-001

---

### T-S03-005: Add New Resource Navigation
**Feature**: Navigation to resource creation form with permission check

**Event Coverage**: E-03-07 (Add New Button Click)

**Frontend Implementation**:
```typescript
// page.tsx
const handleAddNew = () => {
  // TODO: Check user permission (RA, MNG, Admin)
  // TODO: Navigate to resource form (S-04-01) in create mode
  // TODO: Pass necessary context (department restrictions for managers)
}

const navigateToForm = (mode: 'create' | 'edit', resourceId?: number) => {
  // TODO: Setup navigation with proper route parameters
  // TODO: Pass user role context to form
}
```

**Acceptance Criteria**:
- [ ] Add New button visible for authorized roles
- [ ] Navigation to S-04-01 in create mode
- [ ] Permission validation before navigation
- [ ] User role context passed to form

**Dependencies**: T-S03-001

---

### T-S03-006: Delete & Bulk Delete Operations
**Feature**: Single and bulk resource deletion with confirmations

**Event Coverage**: E-03-08 (Delete Button Click)

**Backend Implementation**:
```typescript
// idle-resources.service.ts
async remove(id: number, userId: number): Promise<void> {
  // TODO: Check if resource exists and user has permission
  // TODO: Implement soft delete for audit trail
  // TODO: Check for dependencies (CV files, history logs)
  // TODO: Archive related data
  // TODO: Create deletion history log entry
  // TODO: Send notification to stakeholders
}

async bulkDelete(ids: number[], userId: number): Promise<{ deletedCount: number; errors: string[] }> {
  // TODO: Validate user permissions for each resource
  // TODO: Check dependencies for each resource
  // TODO: Implement transaction for atomic operation
  // TODO: Create bulk history log entries
  // TODO: Handle partial failures gracefully
  // TODO: Return detailed results
}
```

**Frontend Implementation**:
```typescript
// page.tsx
const handleDelete = async (resourceId: number) => {
  // TODO: Check user permission (RA only)
  // TODO: Show delete confirmation dialog
  // TODO: Call delete API
  // TODO: Handle delete success/error
  // TODO: Refresh resource list
}

const handleBulkDelete = async () => {
  // TODO: Check user permission and selection
  // TODO: Show bulk delete confirmation
  // TODO: Call bulk delete API
  // TODO: Show detailed results
  // TODO: Clear selection after delete
  // TODO: Refresh resource list
}

const showDeleteConfirmation = (isBulk: boolean, count: number = 1) => {
  // TODO: Display appropriate confirmation dialog
  // TODO: Show impact information
  // TODO: Handle confirmation/cancellation
}
```

**Acceptance Criteria**:
- [ ] Delete button only visible for RA role
- [ ] Single resource deletion with confirmation
- [ ] Bulk deletion for selected resources
- [ ] Soft delete implementation (data preserved)
- [ ] Dependency checking before deletion
- [ ] Detailed delete results shown
- [ ] Resource list refreshed after deletion

**Dependencies**: T-S03-001

---

### T-S03-007: Column Management
**Feature**: User customizable data grid columns

**Event Coverage**: E-03-09 (Column Settings Click), E-03-10 (Column Settings Save)

**Frontend Implementation**:
```typescript
// page.tsx
const handleColumnSettings = () => {
  // TODO: Open column settings dialog
  // TODO: Show current column visibility and order
  // TODO: Allow column reordering with drag & drop
}

const saveColumnSettings = async (columnConfig: ColumnConfig[]) => {
  // TODO: Validate column settings
  // TODO: Save user preferences to local storage/API
  // TODO: Update data grid layout
  // TODO: Close settings dialog
}

const restoreColumnLayout = () => {
  // TODO: Load saved column preferences
  // TODO: Apply to data grid
  // TODO: Handle missing or invalid preferences
}

const updateGridColumns = (config: ColumnConfig[]) => {
  // TODO: Update data grid column definitions
  // TODO: Preserve sort and filter states
}
```

**Acceptance Criteria**:
- [ ] Column settings dialog with current configuration
- [ ] Drag & drop column reordering
- [ ] Show/hide column toggles
- [ ] Settings persist across sessions
- [ ] Grid layout updates immediately
- [ ] Reset to default option available

**Dependencies**: T-S03-001

---

### T-S03-008: Row Selection Management  
**Feature**: Single and bulk row selection with action button states

**Event Coverage**: E-03-11 (Select All Toggle), E-03-12 (Row Selection Toggle)

**Frontend Implementation**:
```typescript
// page.tsx
const handleSelectAll = (checked: boolean) => {
  // TODO: Toggle all visible row selections
  // TODO: Update select all checkbox state
  // TODO: Update bulk action button states
  // TODO: Handle partial selections across pages
}

const handleRowSelect = (resourceId: number, checked: boolean) => {
  // TODO: Toggle individual row selection
  // TODO: Update select all state accordingly
  // TODO: Update action button states
  // TODO: Maintain selection state during pagination
}

const updateSelectionState = (selectedIds: number[]) => {
  // TODO: Update internal selection state
  // TODO: Update UI indicators
  // TODO: Validate selection limits if any
}

const updateActionButtons = (selectionCount: number) => {
  // TODO: Enable/disable bulk action buttons
  // TODO: Update button text with selection count
  // TODO: Show/hide contextual actions
}
```

**Acceptance Criteria**:
- [ ] Select all checkbox with three states (none, some, all)
- [ ] Individual row selection toggles
- [ ] Bulk action buttons enabled based on selection
- [ ] Selection count displayed accurately
- [ ] Selection state maintained during pagination
- [ ] Selection limits enforced if applicable

**Dependencies**: T-S03-001

---

### T-S03-009: Row Actions (Edit/View/CV)
**Feature**: Individual resource actions with permission checks

**Event Coverage**: E-03-13 (Edit Action Click), E-03-14 (View Action Click), E-03-15 (CV Download Click)

**Backend Implementation**:
```typescript
// idle-resources.service.ts - Enhance existing method
async findOne(id: number, userRole: UserRole, userDeptId?: number): Promise<IdleResourceResponseDto> {
  // TODO: Add permission checks for viewing specific resource
  // TODO: Log resource view activity
  // TODO: Include CV file information
  // TODO: Calculate computed fields (isUrgent, etc.)
}
```

**Frontend Implementation**:
```typescript
// page.tsx
const handleEdit = (resourceId: number) => {
  // TODO: Check user edit permission for this resource
  // TODO: Navigate to S-04-01 in edit mode
  // TODO: Pass resource ID and context
}

const handleView = (resourceId: number) => {
  // TODO: Navigate to S-04-01 in view mode
  // TODO: Pass resource ID for readonly display
}

const handleCVDownload = async (resourceId: number, fileName: string) => {
  // TODO: Validate file exists
  // TODO: Check download permission
  // TODO: Call download API
  // TODO: Handle download success/error
  // TODO: Log download activity
}

const checkPermissions = (action: string, resource: MockIdleResource): boolean => {
  // TODO: Check user role and resource access
  // TODO: Handle department-specific permissions for managers
  // TODO: Return permission result
}
```

**Acceptance Criteria**:
- [ ] Edit action only available for authorized users
- [ ] View action available for all users
- [ ] CV download functional with permission check
- [ ] Navigation to S-04-01 with proper mode and context
- [ ] Permission-based action button visibility
- [ ] Download activity logged for audit

**Dependencies**: T-S03-001

---

### T-S03-010: Pagination Management
**Feature**: Efficient pagination with page state management

**Event Coverage**: E-03-16 (Page Navigation Click)

**Backend Implementation**:
```typescript
// idle-resources.service.ts - Enhance existing method
async findAll(searchCriteria: SearchCriteriaDto): Promise<PaginatedIdleResourceResponseDto> {
  // TODO: Optimize pagination query performance
  // TODO: Add total count calculation
  // TODO: Handle large dataset pagination efficiently
  // TODO: Support different page sizes
}
```

**Frontend Implementation**:
```typescript
// page.tsx  
const handlePageChange = async (newPage: number) => {
  // TODO: Validate page number
  // TODO: Update URL with page parameter
  // TODO: Load new page data
  // TODO: Maintain current filters and sort
  // TODO: Update pagination UI
}

const updatePaginationState = (currentPage: number, totalPages: number, totalItems: number) => {
  // TODO: Update pagination component state
  // TODO: Update page info display
  // TODO: Handle edge cases (empty results, etc.)
}

const calculatePageInfo = (total: number, pageSize: number, currentPage: number) => {
  // TODO: Calculate pagination metadata
  // TODO: Determine enabled/disabled navigation buttons
  // TODO: Calculate item range display (showing X-Y of Z)
}
```

**Acceptance Criteria**:
- [ ] Page navigation functional (Previous/Next, direct page)
- [ ] Page state reflected in URL (shareable links)
- [ ] Pagination info accurate (showing X-Y of Z items)
- [ ] Current filters maintained during pagination
- [ ] Performance optimized for large datasets
- [ ] Edge cases handled (empty results, invalid pages)

**Dependencies**: T-S03-001

## Implementation Timeline:

**Phase 1 (Critical Path)**:
- T-S03-001: Foundation & Page Load (3-4 days)

**Phase 2 (Core Features)**:
- T-S03-002: Search & Filter Functionality (2-3 days)
- T-S03-008: Row Selection Management (1-2 days)
- T-S03-010: Pagination Management (1-2 days)

**Phase 3 (Advanced Features)**:
- T-S03-009: Row Actions (2-3 days)
- T-S03-005: Add New Resource Navigation (1 day)

**Phase 4 (Data Operations)**:
- T-S03-003: Import Excel Functionality (3-4 days)
- T-S03-004: Export Data Functionality (2-3 days)
- T-S03-006: Delete & Bulk Delete Operations (2-3 days)

**Phase 5 (UI Enhancements)**:
- T-S03-007: Column Management (2-3 days)

**Total Estimated Time**: 19-28 development days

## Quality Assurance Checklist:

### Pre-Development:
- [ ] All event requirements clearly understood
- [ ] Method conflicts identified and resolved
- [ ] Dependencies verified and available
- [ ] UI mockups and business rules reviewed

### During Development:
- [ ] Each task implements complete end-to-end functionality
- [ ] Role-based permissions implemented correctly
- [ ] Error handling comprehensive
- [ ] Performance considerations addressed

### Post-Development:
- [ ] All acceptance criteria met
- [ ] Unit tests written for modified methods
- [ ] Integration tests for complete workflows
- [ ] User acceptance testing completed
- [ ] Documentation updated

### Cross-Task Validation:
- [ ] No method modified by multiple tasks
- [ ] Consistent data flow between tasks
- [ ] UI state management coherent
- [ ] Permission checks consistent across features

Cấu trúc task list này đảm bảo:
1. **Không có method conflict** - mỗi method chỉ được assigned cho một task duy nhất
2. **Complete business features** - mỗi task implement một tính năng hoàn chỉnh từ UI đến backend
3. **Clear dependencies** - task dependencies được xác định rõ ràng
4. **Actionable scope** - mỗi task có phạm vi cụ thể và có thể thực hiện được
5. **Quality assurance** - có checklist để đảm bảo chất lượng implementation
