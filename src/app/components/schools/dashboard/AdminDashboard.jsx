import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Megaphone,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Settings as SettingsIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { getAdminDashboardOverview } from "../../../services/dashboardService";
import { formatNumber, formatPercent } from "../../../services/serviceUtils";

const quickManagementItems = [
  {
    icon: Users,
    title: "Data Siswa",
    description: "Manage student data and information",
    menuId: "students",
    link: "/students",
    color: "#3B82F6",
    countKey: "students",
  },
  {
    icon: GraduationCap,
    title: "Manajemen User",
    description: "Manage users (Admin, Guru, Siswa)",
    menuId: "teachers",
    link: "/users",
    color: "#10B981",
    countKey: "users",
  },
  {
    icon: BookOpen,
    title: "Manajemen Akademik",
    description: "Manage academic settings and curriculum",
    menuId: "classes",
    link: "/academic",
    color: "#F59E0B",
    countKey: "classes",
  },
  {
    icon: Calendar,
    title: "Data Akademik",
    description: "Academic data and reports",
    menuId: "subjects",
    link: "/academic-data",
    color: "#8B5CF6",
    countKey: "mapel",
  },
  {
    icon: ClipboardCheck,
    title: "Absensi",
    description: "Student and teacher attendance",
    menuId: "attendance",
    link: "/attendance",
    color: "#EC4899",
    countKey: "attendance",
  },
  {
    icon: BarChart3,
    title: "Nilai",
    description: "Grades and assessments",
    menuId: "grades",
    link: "/grades",
    color: "#14B8A6",
    countKey: "grades",
  },
  {
    icon: Megaphone,
    title: "Pengumuman",
    description: "School announcements and news",
    menuId: "announcements",
    link: "/announcements",
    color: "#F43F5E",
    countKey: "announcements",
  },
  {
    icon: SettingsIcon,
    title: "Settings",
    description: "System configuration",
    menuId: "settings",
    link: "/settings",
    color: "#6B7280",
    countKey: "settings",
  },
];

function activityIconByType(type) {
  if (type === "announcement") return Megaphone;
  if (type === "attendance") return ClipboardCheck;
  return BarChart3;
}

export function AdminDashboard({
  userName = "Ahmad",
  schoolName = "SMA Negeri 1",
  searchQuery = "",
  onQuickAction,
}) {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAdminDashboardOverview();
        if (!mounted) return;
        setOverview(response);
      } catch (error) {
        if (!mounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "Gagal memuat data dashboard.";
        setErrorMessage(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const statData = overview?.stats;

    return [
      {
        icon: Users,
        title: "Total Students",
        value: isLoading ? "..." : formatNumber(statData?.totalStudents ?? 0),
        growth: "+12%",
        growthPositive: true,
        iconColor: "#6366f1",
      },
      {
        icon: GraduationCap,
        title: "Total Teachers",
        value: isLoading ? "..." : formatNumber(statData?.totalTeachers ?? 0),
        growth: "+5%",
        growthPositive: true,
        iconColor: "#10b981",
      },
      {
        icon: BookOpen,
        title: "Total Classes",
        value: isLoading ? "..." : formatNumber(statData?.totalClasses ?? 0),
        growth: "+8%",
        growthPositive: true,
        iconColor: "#f59e0b",
      },
      {
        icon: TrendingUp,
        title: "Today Attendance",
        value: isLoading
          ? "..."
          : formatPercent(statData?.todayAttendancePercent ?? 0),
        growth: "-2%",
        growthPositive: false,
        iconColor: "#a855f7",
      },
    ];
  }, [isLoading, overview]);

  const quickCountMap = useMemo(() => {
    const statData = overview?.stats;

    return {
      students: isLoading ? "..." : formatNumber(statData?.totalStudents ?? 0),
      users: isLoading
        ? "..."
        : formatNumber(
            (statData?.totalStudents ?? 0) + (statData?.totalTeachers ?? 0),
          ),
      classes: isLoading ? "..." : formatNumber(statData?.totalClasses ?? 0),
      mapel: isLoading ? "..." : formatNumber(statData?.totalMapel ?? 0),
      attendance: isLoading
        ? "..."
        : formatPercent(statData?.todayAttendancePercent ?? 0),
      grades: isLoading ? "..." : formatNumber(statData?.totalGrades ?? 0),
      announcements: isLoading
        ? "..."
        : formatNumber(statData?.totalAnnouncements ?? 0),
      settings: "—",
    };
  }, [isLoading, overview]);

  const recentActivities = overview?.recentActivities || [];
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredQuickManagementItems = useMemo(() => {
    if (!normalizedSearch) return quickManagementItems;
    return quickManagementItems.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const filteredRecentActivities = useMemo(() => {
    if (!normalizedSearch) return recentActivities;
    return recentActivities.filter(
      (activity) =>
        activity.title.toLowerCase().includes(normalizedSearch) ||
        activity.description.toLowerCase().includes(normalizedSearch),
    );
  }, [recentActivities, normalizedSearch]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Welcome Header */}
      <div className="relative bg-gradient-to-r from-[#EEF4FF] to-[#F8F5FF] border border-[#DCE7F8] rounded-[24px] p-6 md:p-10 overflow-hidden shadow-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#111827] mb-2">
              Welcome Back, {userName} 👋
            </h1>
            <p className="text-sm md:text-base text-[#6B7280] mb-4">
              Overview of your school performance today.
            </p>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#111827]">School:</span>
                <span className="px-3 py-1 bg-white rounded-full text-[#4B5563] font-mono border border-[#E3EAF5]">
                  {schoolName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#111827]">
                  Academic Year:
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-[#4B5563] border border-[#E3EAF5]">
                  2024/2025
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickAction?.("students")}
            className="bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:opacity-95 transition text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-[24px] p-6 shadow-sm hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.iconColor}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    stat.growthPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <ArrowUpRight
                    className={`w-3 h-3 ${!stat.growthPositive ? "rotate-90" : ""}`}
                  />

                  {stat.growth}
                </span>
              </div>

              <h3 className="text-3xl font-black text-[#111827] mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-semibold text-[#4B5563]">
                {stat.title}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Management */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6">
          Quick Management
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {filteredQuickManagementItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onQuickAction?.(item.menuId)}
                className="bg-white border border-[#E3EAF5] rounded-[20px] p-5 text-left hover:border-[#4DA3FF] transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#111827]">
                      {quickCountMap[item.countKey]}
                    </div>
                  </div>
                </div>
                <h4 className="text-base font-bold text-[#111827] mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#6B7280] mb-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-end">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#4DA3FF] group-hover:translate-x-1 transition" />
                </div>
              </motion.button>
            );
          })}
        </div>
        {!isLoading && filteredQuickManagementItems.length === 0 && (
          <div className="mt-4 bg-white border border-[#E3EAF5] rounded-xl p-4 text-sm text-[#6B7280]">
            Tidak ada fitur Quick Management yang cocok dengan kata kunci.
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-[20px] p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#111827]">
              Recent Activity
            </h3>
            <p className="text-xs md:text-sm text-[#6B7280]">
              Latest updates from your school
            </p>
          </div>
          <button className="px-3 md:px-4 py-2 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-lg text-xs md:text-sm font-semibold hover:opacity-95 transition">
            View All
          </button>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 mb-4">
            Gagal memuat data: {errorMessage}
          </p>
        )}

        <div className="space-y-3">
          {isLoading && (
            <div className="bg-white border border-[#E3EAF5] rounded-xl p-4 text-sm text-[#6B7280]">
              Memuat aktivitas terbaru...
            </div>
          )}

          {!isLoading && filteredRecentActivities.length === 0 && (
            <div className="bg-white border border-[#E3EAF5] rounded-xl p-4 text-sm text-[#6B7280]">
              Tidak ada aktivitas yang cocok dengan kata kunci.
            </div>
          )}

          {!isLoading &&
            filteredRecentActivities.map((activity) => {
              const Icon = activityIconByType(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white border border-[#E3EAF5] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#EEF4FF] rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#111827]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#111827] text-sm mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#6B7280] font-medium">
                      {activity.timestamp}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
