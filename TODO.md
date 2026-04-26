# TODO - UI Refactor SIM-SEKOLAH

## Phase 1: Create Reusable UI Components ✅

- [x] `src/app/components/ui/DataTable.jsx` - Table with headers, rows, status badges, actions
- [x] `src/app/components/ui/FormModal.jsx` - Modal wrapper for add/edit forms
- [x] `src/app/components/ui/StatusBadge.jsx` - Colored status badges
- [x] `src/app/components/ui/PageHeader.jsx` - Title + Add button + search
- [x] `src/app/components/ui/ConfirmDialog.jsx` - Delete confirmation dialog

## Phase 2: Create Dummy Data ✅

- [x] `src/app/data/dummyData.js` - Dummy arrays for all entities

## Phase 3: Create Page Components ✅

### Admin Pages (Full CRUD)
- [x] `src/app/components/schools/dashboard/pages/StudentsPage.jsx`
- [x] `src/app/components/schools/dashboard/pages/TeachersPage.jsx`
- [x] `src/app/components/schools/dashboard/pages/ClassesPage.jsx`
- [x] `src/app/components/schools/dashboard/pages/SubjectsPage.jsx`
- [x] `src/app/components/schools/dashboard/pages/SchedulePage.jsx`
- [x] `src/app/components/schools/dashboard/pages/AttendancePage.jsx`
- [x] `src/app/components/schools/dashboard/pages/GradesPage.jsx`
- [x] `src/app/components/schools/dashboard/pages/AnnouncementsPage.jsx`

### Guru Pages
- [x] `src/app/components/schools/dashboard/pages/MyClassesPage.jsx` - Kelas yang diampu

### Siswa Pages (Read-only, Personal View)
- [x] `src/app/components/schools/dashboard/pages/StudentSchedulePage.jsx` - Jadwal pribadi
- [x] `src/app/components/schools/dashboard/pages/StudentGradesPage.jsx` - Nilai pribadi
- [x] `src/app/components/schools/dashboard/pages/StudentAttendancePage.jsx` - Absensi pribadi

### Common Pages
- [x] `src/app/components/schools/dashboard/pages/ProfilePage.jsx`

## Phase 4: Create Role-Based Dashboards ✅

- [x] `src/app/components/schools/dashboard/AdminDashboard.jsx` - Full admin overview
- [x] `src/app/components/schools/dashboard/TeacherDashboard.jsx` - Guru overview (kelas, absensi, nilai)
- [x] `src/app/components/schools/dashboard/StudentDashboard.jsx` - Siswa overview (jadwal, nilai, absensi)

## Phase 5: Role-Based Routing ✅

- [x] Updated `Dashboard.jsx` - Render dashboard sesuai role
- [x] Updated `DashboardContent.jsx` - Route ke halaman sesuai role
- [x] Updated `Sidebar.jsx` - Menu sidebar sudah sesuai role

## Phase 6: Build Verification ✅

- [x] Build compiles successfully
- [x] All JSX tags are balanced
- [x] No syntax errors

## Summary

The SIM-SEKOLAH dashboard has been completely refactored with **role-based access control**:

### Role Access Matrix:

| Menu | Admin | Guru | Siswa |
|------|-------|------|-------|
| Dashboard | ✅ AdminDashboard | ✅ TeacherDashboard | ✅ StudentDashboard |
| Data Siswa | ✅ Full CRUD | ❌ - | ❌ - |
| Data Guru | ✅ Full CRUD | ❌ - | ❌ - |
| Kelas | ✅ Full CRUD | ❌ - | ❌ - |
| Mata Pelajaran | ✅ Full CRUD | ❌ - | ❌ - |
| Kelas Saya | ❌ - | ✅ MyClassesPage | ❌ - |
| Jadwal | ✅ Full CRUD | ✅ SchedulePage | ✅ StudentSchedulePage |
| Absensi | ✅ Full CRUD | ✅ AttendancePage | ✅ StudentAttendancePage |
| Nilai | ✅ Full CRUD | ✅ GradesPage | ✅ StudentGradesPage |
| Pengumuman | ✅ Full CRUD | ✅ View Only | ✅ View Only |
| Profil | ✅ Edit | ✅ Edit | ✅ Edit |
| Pengaturan | ✅ Edit | ✅ Edit | ✅ Edit |

### Key Features:
- ✅ **Role-Based UI**: Setiap role melihat dashboard dan halaman yang sesuai
- ✅ **API Integration**: Setiap halaman mencoba fetch API dulu, fallback ke dummy data
- ✅ **CRUD Operations**: Add, Edit, Delete dengan confirmation dialogs (Admin & Guru)
- ✅ **Read-Only Views**: Siswa hanya bisa melihat data pribadi (tidak bisa edit)
- ✅ **Search**: Real-time filtering pada semua halaman
- ✅ **Responsive**: Desktop table view + mobile card view
- ✅ **Theme Consistent**: Menggunakan gradient theme #4DA3FF ke #8B5CF6
- ✅ **Build Success**: `npm run build` compile tanpa error

### File Structure:
```
src/app/components/schools/dashboard/
├── Dashboard.jsx              # Main layout with role-based routing
├── AdminDashboard.jsx         # Admin overview
├── TeacherDashboard.jsx       # Guru overview
├── StudentDashboard.jsx       # Siswa overview
├── DashboardContent.jsx       # Content router by role
├── Sidebar.jsx                # Role-based sidebar menu
├── TopNavbar.jsx              # Top navigation
└── pages/
    ├── StudentsPage.jsx       # Admin: Full CRUD
    ├── TeachersPage.jsx       # Admin: Full CRUD
    ├── ClassesPage.jsx        # Admin: Full CRUD
    ├── SubjectsPage.jsx       # Admin: Full CRUD
    ├── SchedulePage.jsx       # Admin/Guru: Full CRUD
    ├── AttendancePage.jsx     # Admin/Guru: Full CRUD
    ├── GradesPage.jsx         # Admin/Guru: Full CRUD
    ├── AnnouncementsPage.jsx  # All roles: View
    ├── MyClassesPage.jsx      # Guru: Kelas diampu
    ├── StudentSchedulePage.jsx # Siswa: Jadwal pribadi
    ├── StudentGradesPage.jsx   # Siswa: Nilai pribadi
    ├── StudentAttendancePage.jsx # Siswa: Absensi pribadi
    └── ProfilePage.jsx        # All roles: Edit profil
```

