import { useState } from "react";
import { useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { AdminDashboard } from "./AdminDashboard";
import { DashboardContent } from "./DashboardContent";

export function Dashboard() {
  // TODO: Get user data from API/auth context
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [pageTitle, setPageTitle] = useState("Dashboard");

  // Temporary - should come from auth context/API
  const userRole: "admin" | "guru" | "siswa" = "admin";
  const userName = "Ahmad";

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);

    // Update page title based on menu
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      students: "Data Siswa",
      teachers: "Data Guru",
      classes: "Kelas",
      subjects: "Mata Pelajaran",
      schedule: "Jadwal",
      attendance: "Absensi",
      grades: "Nilai",
      announcements: "Pengumuman",
      reports: "Laporan",
      settings: "Pengaturan",
      "my-classes": "Kelas Saya",
      profile: "Profil",
    };
    setPageTitle(titles[menuId] || "Dashboard");
  };

  const handleLogout = () => {
    // TODO: Call API logout
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        role={userRole}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-[260px] transition-all">
        {/* Top Navbar */}
        <TopNavbar
          pageTitle={pageTitle}
          userName={userName}
          userRole={userRole}
          showSchoolSwitcher={userRole === "admin"}
        />

        {/* Dashboard Content */}
        <div className="pt-[70px] min-h-screen bg-white relative">
          {/* Background pattern dengan opacity */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/dashboard-bg.png')",
              backgroundSize: "600px auto",
              backgroundRepeat: "repeat",
              opacity: 0.05,
            }}
          />
          {/* Konten di atas background */}
          <div className="relative z-10">
            {userRole === "admin" && activeMenu === "dashboard" ? (
              <AdminDashboard userName={userName} />
            ) : (
              <DashboardContent
                role={userRole}
                userName={userName}
                activeMenu={activeMenu}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
