import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Megaphone,
  FileText,
  Settings,
  User,
  Calendar,
} from "lucide-react";
import { StudentsPage } from "./pages/StudentsPage";
import { TeachersPage } from "./pages/TeachersPage";
import { ClassesPage } from "./pages/ClassesPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { SchedulePage } from "./pages/SchedulePage";
import { AttendancePage } from "./pages/AttendancePage";
import { GradesPage } from "./pages/GradesPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyClassesPage } from "./pages/MyClassesPage";
import { StudentSchedulePage } from "./pages/StudentSchedulePage";
import { StudentGradesPage } from "./pages/StudentGradesPage";
import { StudentAttendancePage } from "./pages/StudentAttendancePage";
import { AddStudentPage } from "./pages/AddStudentPage";
import { AddTeacherPage } from "./pages/AddTeacherPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { AddExamGradePage } from "./pages/AddExamGradePage";

const roleCards = {
  admin: [
    {
      title: "Manajemen User",
      value: "89 Akun",
      desc: "Admin, Guru, Siswa",
      icon: Users,
      color: "#3B82F6",
    },
    {
      title: "Data Akademik",
      value: "42 Kelas",
      desc: "Mapel & kurikulum",
      icon: BookOpen,
      color: "#10B981",
    },
    {
      title: "Pengumuman",
      value: "24 Aktif",
      desc: "Informasi sekolah",
      icon: Megaphone,
      color: "#F59E0B",
    },
    {
      title: "Laporan",
      value: "12 Baru",
      desc: "Monitoring sistem",
      icon: FileText,
      color: "#8B5CF6",
    },
  ],
  guru: [
    {
      title: "Kelas Saya",
      value: "6 Kelas",
      desc: "Kelas yang diampu",
      icon: BookOpen,
      color: "#3B82F6",
    },
    {
      title: "Absensi Hari Ini",
      value: "92%",
      desc: "Status kehadiran",
      icon: ClipboardCheck,
      color: "#10B981",
    },
    {
      title: "Nilai Tugas",
      value: "38 Entri",
      desc: "Input penilaian",
      icon: BarChart3,
      color: "#F59E0B",
    },
    {
      title: "Pengumuman",
      value: "5 Baru",
      desc: "Info terbaru sekolah",
      icon: Megaphone,
      color: "#8B5CF6",
    },
  ],
  siswa: [
    {
      title: "Jadwal Hari Ini",
      value: "5 Mapel",
      desc: "Aktivitas belajar",
      icon: Calendar,
      color: "#3B82F6",
    },
    {
      title: "Nilai Saya",
      value: "88.5",
      desc: "Rata-rata sementara",
      icon: BarChart3,
      color: "#10B981",
    },
    {
      title: "Absensi Saya",
      value: "95%",
      desc: "Kehadiran semester",
      icon: ClipboardCheck,
      color: "#F59E0B",
    },
    {
      title: "Pengumuman",
      value: "3 Baru",
      desc: "Info dari sekolah",
      icon: Megaphone,
      color: "#8B5CF6",
    },
  ],
};

function DashboardCards({ role }) {
  const cards = roleCards[role] || roleCards.admin;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-[#E3EAF5] rounded-2xl p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mb-1">{card.title}</p>
            <h3 className="text-2xl font-extrabold text-[#111827]">
              {card.value}
            </h3>
            <p className="text-xs text-[#4B5563] mt-2">{card.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function WelcomeHeader({ userName, role }) {
  return (
    <div className="bg-gradient-to-r from-[#EEF4FF] to-[#F8F5FF] border border-[#DCE7F8] rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-[#111827] mb-2">
        Selamat Datang, {userName}!
      </h1>
      <p className="text-sm text-[#6B7280]">
        Anda login sebagai{" "}
        <span className="font-semibold capitalize">{role}</span>. Berikut
        ringkasan aktivitas Anda hari ini.
      </p>
    </div>
  );
}

export function DashboardContent({
  role,
  userName,
  activeMenu,
  searchQuery = "",
  userEmail = "",
  onProfileUpdate,
}) {
  const isDashboard = activeMenu === "dashboard";
  const isProfile = activeMenu === "profile";
  const isSettings = activeMenu === "settings";

  const pageComponents = useMemo(() => {
    // Role-specific page mappings
    const adminPages = {
      "academic-management": <ClassesPage searchQuery={searchQuery} />,
      "user-management": <UserManagementPage searchQuery={searchQuery} />,
      "academic-data": <AttendancePage searchQuery={searchQuery} />,
      announcements: <AnnouncementsPage searchQuery={searchQuery} />,
      schedule: <SchedulePage searchQuery={searchQuery} />,
      "add-student": <AddStudentPage onBack={() => onMenuClick("user-management")} />,
      "add-teacher": <AddTeacherPage onBack={() => onMenuClick("teachers")} />,
      "add-exam-grade": <AddExamGradePage onBack={() => onMenuClick("academic-data")} />,
      students: <StudentsPage searchQuery={searchQuery} onAddClick={() => onMenuClick("add-student")} />,
      teachers: <TeachersPage searchQuery={searchQuery} onAddClick={() => onMenuClick("add-teacher")} />,
      profile: <ProfilePage />,
    };

    const guruPages = {
      "students-data": <StudentsPage searchQuery={searchQuery} onAddClick={() => onMenuClick("add-student")} />,
      attendance: <AttendancePage searchQuery={searchQuery} />,
      schedule: <SchedulePage searchQuery={searchQuery} />,
      grades: <GradesPage searchQuery={searchQuery} onAddClick={() => onMenuClick("add-exam-grade")} />,
      announcements: <AnnouncementsPage searchQuery={searchQuery} />,
      "add-student": <AddStudentPage onBack={() => onMenuClick("students-data")} />,
      "add-exam-grade": <AddExamGradePage onBack={() => onMenuClick("grades")} />,
      profile: <ProfilePage />,
    };

    const siswaPages = {
      dashboard: <DashboardCards role="siswa" />,
      profile: <ProfilePage />,
      schedule: <SchedulePage searchQuery={searchQuery} />,
      grades: <GradesPage searchQuery={searchQuery} onAddClick={() => onMenuClick("add-exam-grade")} />,
      attendance: <AttendancePage searchQuery={searchQuery} />,
      announcements: <AnnouncementsPage searchQuery={searchQuery} />,
      "add-exam-grade": <AddExamGradePage onBack={() => onMenuClick("grades")} />,
    };

    const commonPages = {
      profile: (
        <ProfilePage
          userName={userName}
          userEmail={userEmail}
          userRole={role}
          onProfileUpdate={onProfileUpdate}
        />
      ),
      settings: (
        <ProfilePage
          userName={userName}
          userEmail={userEmail}
          userRole={role}
          onProfileUpdate={onProfileUpdate}
        />
      ),
    };

    if (role === "admin") {
      return { ...adminPages, ...commonPages };
    }
    if (role === "guru") {
      return { ...guruPages, ...commonPages };
    }
    return { ...siswaPages, ...commonPages };
  }, [searchQuery, userName, userEmail, role, onProfileUpdate]);

  const currentPage = pageComponents[activeMenu];

  return (
    <div className="space-y-6">
      {isDashboard && (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          <WelcomeHeader userName={userName} role={role} />
          <DashboardCards role={role} />

          {/* Quick Info Section */}
          <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#111827] mb-4">
              Informasi Cepat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#EEF4FF] rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Tahun Ajaran
                  </p>
                  <p className="text-xs text-[#6B7280]">2024/2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#EEF4FF] rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Semester
                  </p>
                  <p className="text-xs text-[#6B7280]">Ganjil</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#EEF4FF] rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Status Sistem
                  </p>
                  <p className="text-xs text-[#6B7280]">Aktif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isDashboard && currentPage}

      {!isDashboard && !currentPage && (
        <div className="bg-white border border-[#E3EAF5] rounded-2xl p-8 text-center">
          <h3 className="text-lg font-bold text-[#111827] mb-2">
            Halaman Tidak Tersedia
          </h3>
          <p className="text-sm text-[#6B7280]">
            Menu ini belum memiliki konten yang dapat ditampilkan.
          </p>
        </div>
      )}
    </div>
  );
}
