# Tài liệu Thiết kế Cơ bản (Basic Design) - Phần 2
## Hệ thống Quản lý Idle Resource (IRMS)

## Phần 3: Screen Layout Design

### S-01-01: Màn hình Đăng nhập

```
┌─────────────────────────────────────────────────────────────┐
│                    IRMS - Idle Resource Management          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              [LOGO] IRMS                           │   │
│  │         Idle Resource Management System            │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  Username: [____________________]          │   │   │
│  │  │                                            │   │   │
│  │  │  Password: [____________________]          │   │   │
│  │  │                                            │   │   │
│  │  │     [Remember Me] ☐                       │   │   │
│  │  │                                            │   │   │
│  │  │            [   Login   ]                   │   │   │
│  │  │                                            │   │   │
│  │  │  Forgot Password? | Need Help?             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                    © 2024 FJP Company                      │
└─────────────────────────────────────────────────────────────┘
```

### S-02-01: Màn hình chính (Top Screen Dashboard)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ IRMS - Idle Resource Management    [Profile ▼] [Settings] [Logout]               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────────────────────────────┐ │
│ │  📊 Dashboard   │ │                    Dashboard Overview                      │ │
│ │  👥 Idle Resource│ │                                                           │ │
│ │  📋 User Mgmt   │ │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │ │
│ │  📜 History Log │ │  │ Total Resources│ │ Idle > 2 Months│ │ By Department │   │ │
│ │                 │ │  │     [150]     │ │     [25] ⚠️    │ │   [Chart]     │   │ │
│ │                 │ │  └───────────────┘ └───────────────┘ └───────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │                 │ │  │           Recent Updates (Last 7 days)             │   │ │
│ │                 │ │  │ • Nguyen Van A - Updated Status to "Available"     │   │ │
│ │                 │ │  │ • Tran Thi B - Added to Idle Pool                  │   │ │
│ │                 │ │  │ • Le Van C - CV Updated                             │   │ │
│ │                 │ │  │ • More...                           [View All]     │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │                 │ │  │              Quick Actions                          │   │ │
│ │                 │ │  │ [📥 Import Excel] [📤 Export Data] [➕ Add Resource]│   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ └─────────────────┘ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### S-03-01: Màn hình Quản lý danh sách Idle Resource

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ IRMS > Idle Resource Management                [Profile ▼] [Settings] [Logout]     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────────────────────────────┐ │
│ │  📊 Dashboard   │ │                 Idle Resource Management                    │ │
│ │  👥 Idle Resource│ │                                                           │ │
│ │  📋 User Mgmt   │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │  📜 History Log │ │  │ Search: [_____________] Dept: [All ▼] Status: [All ▼]│   │ │
│ │                 │ │  │ [🔍 Search] [🔄 Reset] [📥 Import] [📤 Export]     │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │                 │ │  │ [➕ Add New] [🗑️ Delete] [⚙️ Column Settings]       │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │ ┌───────────────────────────────────────────────────────┐ │ │
│ │                 │ │ │☐│ID │Name      │Dept │Position│Idle From│Status│CV│⚠️│ │ │
│ │                 │ │ ├─┼──┼──────────┼─────┼────────┼─────────┼──────┼──┼─┤ │ │
│ │                 │ │ │☐│01│John Smith│IT   │Dev     │2024-01-15│Idle │📄│ │ │ │
│ │                 │ │ │☐│02│Jane Doe  │HR   │Analyst │2024-02-20│Idle │📄│⚠️│ │ │
│ │                 │ │ │☐│03│Bob Wilson│IT   │QA      │2024-03-10│Idle │📄│ │ │ │
│ │                 │ │ │☐│04│Alice Brown│MKT │Designer│2023-11-05│Idle │📄│⚠️│ │ │
│ │                 │ │ │☐│05│Charlie Lee│IT   │BA      │2024-01-25│Idle │ │ │ │ │
│ │                 │ │ └───────────────────────────────────────────────────────┘ │ │
│ │                 │ │                                                           │ │
│ │                 │ │  [◀ Previous] Page 1 of 10 [Next ▶]      Total: 150     │ │
│ └─────────────────┘ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### S-04-01: Màn hình Chi tiết/Chỉnh sửa Idle Resource

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ IRMS > Idle Resource > Detail                  [Profile ▼] [Settings] [Logout]     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────────────────────────────┐ │
│ │  📊 Dashboard   │ │               Resource Detail / Edit Form                   │ │
│ │  👥 Idle Resource│ │                                                           │ │
│ │  📋 User Mgmt   │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │  📜 History Log │ │  │                Basic Information                    │   │ │
│ │                 │ │  │ Employee Code: [__________] * Required              │   │ │
│ │                 │ │  │ Full Name:     [____________________] * Required    │   │ │
│ │                 │ │  │ Department:    [IT Department    ▼] * Required      │   │ │
│ │                 │ │  │ Position:      [____________________] * Required    │   │ │
│ │                 │ │  │ Email:         [____________________]               │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │                 │ │  │                Idle Information                     │   │ │
│ │                 │ │  │ Idle From:     [2024-01-15      ] * Required        │   │ │
│ │                 │ │  │ Idle To:       [               ]                    │   │ │
│ │                 │ │  │ Status:        [Idle           ▼] * Required        │   │ │
│ │                 │ │  │ Process Note:  [________________________]           │   │ │
│ │                 │ │  │                [________________________]           │   │ │
│ │                 │ │  │ Rate:          [_______] JPY/hour                   │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │                 │ │  │                Skills & CV                          │   │ │
│ │                 │ │  │ Skill Set:     [________________________]           │   │ │
│ │                 │ │  │                [________________________]           │   │ │
│ │                 │ │  │ CV File:       [📄 john_smith_cv.pdf] [Download]   │   │ │
│ │                 │ │  │                [Choose File] [Upload New]           │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  [◀ Back to List] [💾 Save] [🗑️ Delete] [📜 History]    │ │
│ └─────────────────┘ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### S-05-01: Màn hình Quản lý người dùng và phân quyền (Admin only)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ IRMS > User Management                         [Profile ▼] [Settings] [Logout]     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────────────────────────────┐ │
│ │  📊 Dashboard   │ │                   User Management                           │ │
│ │  👥 Idle Resource│ │                                                           │ │
│ │  📋 User Mgmt   │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │  📜 History Log │ │  │ Search: [_____________] Role: [All ▼] Status: [All ▼]│   │ │
│ │                 │ │  │ [🔍 Search] [🔄 Reset]                             │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │                 │ │  │ [➕ Add User] [✏️ Edit] [🚫 Disable] [🔓 Reset Pwd] │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │ ┌───────────────────────────────────────────────────────┐ │ │
│ │                 │ │ │☐│ID│Username  │Full Name  │Email        │Role │Status│ │ │
│ │                 │ │ ├─┼─┼──────────┼───────────┼─────────────┼─────┼──────┤ │ │
│ │                 │ │ │☐│1│admin     │Admin User │admin@fjp.com│Admin│Active│ │ │
│ │                 │ │ │☐│2│ra_user   │RA User    │ra@fjp.com   │RA   │Active│ │ │
│ │                 │ │ │☐│3│manager1  │Manager One│mgr1@fjp.com │MNG  │Active│ │ │
│ │                 │ │ │☐│4│viewer1   │Viewer One │view1@fjp.com│View │Active│ │ │
│ │                 │ │ │☐│5│ra_dept   │RA Dept    │rad@fjp.com  │RA   │Inactive││ │
│ │                 │ │ └───────────────────────────────────────────────────────┘ │ │
│ │                 │ │                                                           │ │
│ │                 │ │  [◀ Previous] Page 1 of 3 [Next ▶]        Total: 25     │ │
│ └─────────────────┘ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### S-06-01: Màn hình Lịch sử cập nhật Idle Resource

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ IRMS > History Log                             [Profile ▼] [Settings] [Logout]     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────────────────────────────┐ │
│ │  📊 Dashboard   │ │                    History Log                              │ │
│ │  👥 Idle Resource│ │                                                           │ │
│ │  📋 User Mgmt   │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │  📜 History Log │ │  │Resource: [All ▼] Action: [All ▼] Date: [Last 30 days▼]│  │
│ │                 │ │  │User: [All ▼] [🔍 Search] [🔄 Reset]                │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │  ┌─────────────────────────────────────────────────────┐   │ │
│ │                 │ │  │ [📤 Export Log] [🔍 View Details]                  │   │ │
│ │                 │ │  └─────────────────────────────────────────────────────┘   │ │
│ │                 │ │                                                           │ │
│ │                 │ │ ┌───────────────────────────────────────────────────────┐ │ │
│ │                 │ │ │Date/Time      │Resource │Action │User    │Changes     │ │ │
│ │                 │ │ ├───────────────┼─────────┼───────┼────────┼────────────┤ │ │
│ │                 │ │ │2024-03-15 14:30│John Smith│Update│ra_user │Status→Idle│ │ │
│ │                 │ │ │2024-03-15 10:15│Jane Doe  │Create│ra_user │New Record │ │ │
│ │                 │ │ │2024-03-14 16:45│Bob Wilson│Update│manager1│CV Upload  │ │ │
│ │                 │ │ │2024-03-14 09:20│Alice Brown│Update│ra_user │Dept Change│ │ │
│ │                 │ │ │2024-03-13 13:30│Charlie Lee│Delete│admin   │Removed    │ │ │
│ │                 │ │ └───────────────────────────────────────────────────────┘ │ │
│ │                 │ │                                                           │ │
│ │                 │ │  [◀ Previous] Page 1 of 20 [Next ▶]      Total: 500     │ │
│ └─────────────────┘ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Design Guidelines:

### 1. Layout Structure:
- **Width**: 1200px optimized for desktop
- **Header**: 60px height với navigation và user menu
- **Left Menu**: 200px width, collapsible
- **Main Content**: Remaining space với padding 20px
- **Footer**: Minimal với copyright info

### 2. Navigation:
- **Left Menu**: Persistent navigation với icons
- **Breadcrumb**: Hiển thị current path
- **Role-based menu**: Ẩn/hiện items theo permission

### 3. Grid/Table Design:
- **Header**: Sticky header với sort capability
- **Pagination**: Bottom pagination với page info
- **Selection**: Checkbox cho bulk operations
- **Actions**: Row-level actions với icons

### 4. Form Design:
- **Required fields**: Marked với * (asterisk)
- **Validation**: Real-time validation với error messages
- **File upload**: Drag & drop support
- **Save/Cancel**: Prominent action buttons

### 5. Visual Indicators:
- **Urgent (≥2 months idle)**: ⚠️ icon với yellow highlight
- **Status colors**: Green (Available), Yellow (Idle), Red (Urgent)
- **CV files**: 📄 icon với download action
