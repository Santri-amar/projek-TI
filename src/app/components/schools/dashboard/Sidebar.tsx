import { motion } from "motion/react";
import { useState } from "react";
import {
  Home, Users, GraduationCap, BookOpen, Calendar,
  ClipboardCheck, BarChart3, Megaphone, FileText,
  Settings, User, LogOut, Menu, X
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "guru" | "siswa";
  activeMenu: string;
  onMenuClick: (menu: string) => void;
}

const menuItems = {
  admin: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "students", label: "Data Siswa", icon: Users },
    { id: "teachers", label: "Data Guru", icon: GraduationCap },
    { id: "classes", label: "Kelas", icon: BookOpen },
    { id: "subjects", label: "Mata Pelajaran", icon: FileText },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "attendance", label: "Absensi", icon: ClipboardCheck },
    { id: "grades", label: "Nilai", icon: BarChart3 },
    { id: "announcements", label: "Pengumuman", icon: Megaphone },
    { id: "reports", label: "Laporan", icon: FileText },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ],
  guru: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "my-classes", label: "Kelas Saya", icon: BookOpen },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "attendance", label: "Absensi", icon: ClipboardCheck },
    { id: "grades", label: "Nilai", icon: BarChart3 },
    { id: "announcements", label: "Pengumuman", icon: Megaphone },
    { id: "profile", label: "Profil", icon: User },
  ],
  siswa: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "schedule", label: "Jadwal Saya", icon: Calendar },
    { id: "grades", label: "Nilai Saya", icon: BarChart3 },
    { id: "attendance", label: "Absensi Saya", icon: ClipboardCheck },
    { id: "announcements", label: "Pengumuman", icon: Megaphone },
    { id: "profile", label: "Profil", icon: User },
  ],
};

export function Sidebar({ role, activeMenu, onMenuClick }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menus = menuItems[role];

  const SidebarContent = () => (
    <>
      {/* Logo & School Info */}
      <div className="p-6 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-3 mb-2">
          {/* Logo */}
          <img src="/logo-owl.png" alt="Schools Logo" className="w-10 h-10 object-contain" />

          <div>
            <h1 className="font-black text-lg text-black">SCHOOLS</h1>
            <p className="text-xs text-gray-600">SMA Negeri 1</p>
          </div>
        </div>
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-black text-white rounded">
          {role === "admin" ? "Admin Panel" : role === "guru" ? "Teacher Panel" : "Student Panel"}
        </span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;

          return (
            <motion.button
              key={menu.id}
              onClick={() => {
                onMenuClick(menu.id);
                setMobileOpen(false);
              }}
              whileHover={{ scale: isActive ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-[#F5F5F5]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{menu.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#E5E5E5]">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[260px] h-screen bg-white border-r border-[#E5E5E5] fixed left-0 top-0 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="lg:hidden w-[280px] h-screen bg-white fixed left-0 top-0 z-50 flex flex-col shadow-2xl"
          >
            <SidebarContent />
          </motion.div>
        </>
      )}
    </>
  );
}
