import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { AdminDashboard } from "./AdminDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { StudentDashboard } from "./StudentDashboard";
import { DashboardContent } from "./DashboardContent";
import { useAuth } from "../../../context/AuthContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, updateUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const rawRole = user?.role?.toLowerCase() || "";
  const userRole = (rawRole === "guru" || rawRole === "siswa") ? rawRole : "admin";
  const userName = user?.name || "User";

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);

    const titles = {
      dashboard: "Dashboard",
      students: "Data Siswa",
      teachers: "Data Guru",
      classes: "Kelas",
      subjects: "Mata Pelajaran",
      schedule: "Jadwal",
      attendance: "Absensi",
      grades: "Nilai",
      announcements: "Pengumuman",
      profile: "Profil",
      settings: "Pengaturan",
      "add-student": "Tambah Siswa",
      "add-teacher": "Tambah Guru",
      "add-exam-grade": "Input Nilai Ujian",
    };
    setPageTitle(titles[menuId] || "Dashboard");
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Yakin ingin logout dari sistem?");
    if (!isConfirmed) return;
    logout();
    navigate("/login", { replace: true });
  };

  if (!isLoggedIn) {
    return null;
  }

  // Render dashboard berdasarkan role
  const renderDashboard = () => {
    if (userRole === "admin") {
      return (
        <AdminDashboard
          userName={userName}
          searchQuery={searchQuery}
          onQuickAction={handleMenuClick}
        />
      );
    }
    if (userRole === "guru") {
      return <TeacherDashboard userName={userName} />;
    }
    return <StudentDashboard userName={userName} />;
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        role={userRole}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
      />

      <div className="dashboard-content-wrapper">
        <TopNavbar
          pageTitle={pageTitle}
          userName={userName}
          userRole={userRole}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onMenuClick={handleMenuClick}
          onLogout={handleLogout}
        />

        <div className="min-h-screen bg-white relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/dashboard-bg.png')",
              backgroundSize: "600px auto",
              backgroundRepeat: "repeat",
              opacity: 0.03,
            }}
          />

          <div className="relative z-10">
            {activeMenu === "dashboard" ? (
              renderDashboard()
            ) : (
              <DashboardContent
                role={userRole}
                userName={userName}
                activeMenu={activeMenu}
                searchQuery={searchQuery}
                userEmail={user?.email || ""}
                onProfileUpdate={(name, email) => {
                  updateUser({ name, email });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
