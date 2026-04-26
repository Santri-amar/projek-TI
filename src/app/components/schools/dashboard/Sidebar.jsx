import { motion } from "motion/react";
import { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Megaphone,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  School
} from "lucide-react";
import "./Dashboard.css";

const menuItems = {
  admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Data Siswa", icon: Users },
    { id: "teachers", label: "Data Guru", icon: GraduationCap },
    { id: "classes", label: "Kelas", icon: School },
    { id: "subjects", label: "Mata Pelajaran", icon: BookOpen },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "attendance", label: "Absensi", icon: ClipboardCheck },
    { id: "grades", label: "Nilai", icon: BarChart3 },
    { id: "announcements", label: "Pengumuman", icon: Megaphone },
    { id: "profile", label: "Profil", icon: User },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ],
  guru: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Data Siswa", icon: Users },
    { id: "attendance", label: "Absensi", icon: ClipboardCheck },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "grades", label: "Nilai", icon: BarChart3 },
    { id: "announcements", label: "Pengumuman", icon: Megaphone },
    { id: "profile", label: "Profil", icon: User },
  ],
  siswa: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profil", icon: User },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "grades", label: "Nilai", icon: BarChart3 },
    { id: "attendance", label: "Absensi", icon: ClipboardCheck },
    { id: "announcements", label: "Pengumuman", icon: Megaphone },
  ],
};

export function Sidebar({ role, activeMenu, onMenuClick, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menus = menuItems[role] || menuItems.admin;

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white sidebar-container">
      {/* Logo Section */}
      <div className="sidebar-logo-section">
        <div className="flex items-center gap-3">
          <img src="/logo-owl.png" alt="Schools Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-[#4338ca]">SCHOOLS</h1>
            <p className="sidebar-school-badge">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation - Flat List as requested */}
      <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;

          return (
            <button
              key={menu.id}
              onClick={() => {
                onMenuClick(menu.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 sidebar-menu-item ${
                isActive ? "active" : ""
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span className={`font-semibold text-[13px] ${isActive ? "text-white" : "text-slate-600"}`}>
                {menu.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 logout-btn group"
        >
          <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-[14px]">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-5 left-5 z-[60] p-2.5 bg-white rounded-xl shadow-xl border border-slate-100"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] h-screen fixed left-0 top-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden w-[300px] h-screen fixed left-0 top-0 z-[60] shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}
    </>
  );
}
