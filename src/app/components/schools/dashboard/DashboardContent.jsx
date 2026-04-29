import { useMemo } from "react";
import { StudentsPage } from "./pages/StudentsPage";
import { TeachersPage } from "./pages/TeachersPage";
import { ClassesPage } from "./pages/ClassesPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { SchedulePage } from "./pages/SchedulePage";
import { AttendancePage } from "./pages/AttendancePage";
import { GradesPage } from "./pages/GradesPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StudentSchedulePage } from "./pages/StudentSchedulePage";
import { StudentGradesPage } from "./pages/StudentGradesPage";
import { StudentAttendancePage } from "./pages/StudentAttendancePage";
import { AddStudentPage } from "./pages/AddStudentPage";
import { AddTeacherPage } from "./pages/AddTeacherPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { AddExamGradePage } from "./pages/AddExamGradePage";
import { ReportsPage } from "./pages/ReportsPage";

// DASHBOARD COMPONENTS
import { AdminDashboard } from "./AdminDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { StudentDashboard } from "./StudentDashboard";

export function DashboardContent({
  role,
  userName,
  activeMenu,
  searchQuery = "",
  userEmail = "",
  onProfileUpdate,
  onMenuClick,
  initialAction = null,
}) {
  const isDashboard = activeMenu === "dashboard";

  const pageComponents = useMemo(() => {
    // COMMON PAGES
    const commonPages = {
      dashboard: role === "admin" ? <AdminDashboard userName={userName} onQuickAction={onMenuClick} /> 
               : role === "guru" ? <TeacherDashboard userName={userName} onNavigate={onMenuClick} />
               : <StudentDashboard userName={userName} onNavigate={onMenuClick} />,
      profile: (
        <ProfilePage
          userName={userName}
          userEmail={userEmail}
          userRole={role}
          onProfileUpdate={onProfileUpdate}
        />
      ),
      settings: <SettingsPage />,
    };

    // ROLE: ADMIN (Full CRUD)
    const adminPages = {
      students: <StudentsPage searchQuery={searchQuery} userRole={role} initialAction={activeMenu === "students" ? initialAction : null} />,
      teachers: <TeachersPage searchQuery={searchQuery} userRole={role} initialAction={activeMenu === "teachers" ? initialAction : null} />,
      classes: <ClassesPage searchQuery={searchQuery} userRole={role} />,
      subjects: <SubjectsPage searchQuery={searchQuery} userRole={role} />,
      schedule: <SchedulePage searchQuery={searchQuery} userRole={role} />,
      attendance: <AttendancePage searchQuery={searchQuery} userRole={role} />,
      grades: <GradesPage searchQuery={searchQuery} userRole={role} />,
      announcements: <AnnouncementsPage searchQuery={searchQuery} userRole={role} />,
      "user-management": <UserManagementPage searchQuery={searchQuery} />,
      reports: <ReportsPage />,
    };

    // ROLE: GURU (CRUD on Nilai & Absensi, View others)
    const guruPages = {
      students: <StudentsPage searchQuery={searchQuery} userRole={role} />,
      attendance: <AttendancePage searchQuery={searchQuery} userRole={role} />,
      schedule: <SchedulePage searchQuery={searchQuery} userRole={role} />,
      grades: <GradesPage searchQuery={searchQuery} userRole={role} />,
      announcements: <AnnouncementsPage searchQuery={searchQuery} userRole={role} />,
    };

    const siswaPages = {
      schedule: <StudentSchedulePage searchQuery={searchQuery} />,
      grades: <StudentGradesPage searchQuery={searchQuery} />,
      attendance: <StudentAttendancePage searchQuery={searchQuery} />,
      announcements: <AnnouncementsPage searchQuery={searchQuery} userRole={role} />,
    };

    console.log("Current Dashboard Role:", role);

    if (role?.toLowerCase() === "admin") return { ...commonPages, ...adminPages };
    if (role?.toLowerCase() === "guru") return { ...commonPages, ...guruPages };
    return { ...commonPages, ...siswaPages };
  }, [searchQuery, userName, userEmail, role, onProfileUpdate, activeMenu, onMenuClick, initialAction]);

  const currentPage = pageComponents[activeMenu];

  if (!currentPage) {
    return (
      <div className="p-8 text-center bg-white border border-[#E3EAF5] rounded-2xl mx-6">
        <h3 className="text-lg font-bold text-[#111827] mb-2">Akses Dibatasi</h3>
        <p className="text-sm text-[#6B7280]">Role Anda ({role}) tidak memiliki izin untuk mengakses menu ini.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {currentPage}
    </div>
  );
}
