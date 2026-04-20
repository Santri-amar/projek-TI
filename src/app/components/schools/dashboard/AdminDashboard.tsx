import { 
  Users, GraduationCap, BookOpen, TrendingUp, Calendar, 
  ClipboardCheck, BarChart3, Megaphone, ChevronRight,
  ArrowUpRight, Plus, Settings as SettingsIcon,
} from "lucide-react";
import { motion } from "motion/react";

interface AdminDashboardProps {
  userName?: string;
  schoolName?: string;
}

// Quick Management Items - Sesuai flowchart
const quickManagementItems = [
  {
    icon: Users,
    title: "Data Siswa",
    description: "Manage student data and information",
    link: "/students",
    color: "#3B82F6",
    count: "1,234"
  },
  {
    icon: GraduationCap,
    title: "Manajemen User",
    description: "Manage users (Admin, Guru, Siswa)",
    link: "/users",
    color: "#10B981",
    count: "89"
  },
  {
    icon: BookOpen,
    title: "Manajemen Akademik",
    description: "Manage academic settings and curriculum",
    link: "/academic",
    color: "#F59E0B",
    count: "42"
  },
  {
    icon: Calendar,
    title: "Data Akademik",
    description: "Academic data and reports",
    link: "/academic-data",
    color: "#8B5CF6",
    count: "15"
  },
  {
    icon: ClipboardCheck,
    title: "Absensi",
    description: "Student and teacher attendance",
    link: "/attendance",
    color: "#EC4899",
    count: "92%"
  },
  {
    icon: BarChart3,
    title: "Nilai",
    description: "Grades and assessments",
    link: "/grades",
    color: "#14B8A6",
    count: "850"
  },
  {
    icon: Megaphone,
    title: "Pengumuman",
    description: "School announcements and news",
    link: "/announcements",
    color: "#F43F5E",
    count: "24"
  },
  {
    icon: SettingsIcon,
    title: "Settings",
    description: "System configuration",
    link: "/settings",
    color: "#6B7280",
    count: "—"
  },
];

const recentActivities = [
  {
    id: 1,
    type: "student",
    title: "New Student Added",
    description: "Ahmad Rizki registered to Class 10A",
    timestamp: "2 minutes ago",
    icon: Users,
  },
  {
    id: 2,
    type: "teacher",
    title: "Teacher Profile Updated",
    description: "Mrs. Sarah updated her contact information",
    timestamp: "15 minutes ago",
    icon: GraduationCap,
  },
  {
    id: 3,
    type: "attendance",
    title: "Attendance Submitted",
    description: "Class 11B attendance recorded by Mr. John",
    timestamp: "1 hour ago",
    icon: ClipboardCheck,
  },
  {
    id: 4,
    type: "grade",
    title: "Grades Updated",
    description: "Mathematics final exam results published for Class 12",
    timestamp: "2 hours ago",
    icon: BarChart3,
  },
  {
    id: 5,
    type: "announcement",
    title: "New Announcement Posted",
    description: "School event notification sent to all students",
    timestamp: "3 hours ago",
    icon: Megaphone,
  },
];

// Summary insights dihapus sesuai permintaan

export function AdminDashboard({ userName = "Ahmad", schoolName = "SMA Negeri 1" }: AdminDashboardProps) {
  const stats = [
    { 
      icon: Users, 
      title: "Total Students", 
      value: "1,234", 
      growth: "+12%",
      growthPositive: true,
      iconColor: "#3B82F6" 
    },
    { 
      icon: GraduationCap, 
      title: "Total Teachers", 
      value: "89", 
      growth: "+5%",
      growthPositive: true,
      iconColor: "#10B981" 
    },
    { 
      icon: BookOpen, 
      title: "Total Classes", 
      value: "42", 
      growth: "+8%",
      growthPositive: true,
      iconColor: "#F59E0B" 
    },
    { 
      icon: TrendingUp, 
      title: "Today Attendance", 
      value: "92%", 
      growth: "-2%",
      growthPositive: false,
      iconColor: "#8B5CF6" 
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Welcome Header */}
      <div className="relative bg-gradient-to-r from-[#F5F5F5] to-white rounded-[20px] p-6 md:p-8 overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 border-[8px] border-dashed border-black/10 rounded-full"></div>
        <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black mb-2">
              Welcome Back, {userName} 👋
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Overview of your school performance today.
            </p>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">School ID:</span>
                <span className="px-3 py-1 bg-white rounded-full text-gray-700 font-mono">
                  SCH-001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">Academic Year:</span>
                <span className="px-3 py-1 bg-white rounded-full text-gray-700">
                  2024/2025
                </span>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition text-sm md:text-base"
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
              className="bg-[#F5F5F5] rounded-[20px] p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.iconColor}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  stat.growthPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${!stat.growthPositive ? "rotate-90" : ""}`} />
                  {stat.growth}
                </span>
              </div>
              
              <h3 className="text-3xl font-black text-black mb-1">{stat.value}</h3>
              <p className="text-sm font-semibold text-gray-700">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Management - Grid dengan 4 kolom */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">Quick Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {quickManagementItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border-2 border-[#E5E5E5] rounded-[20px] p-5 text-left hover:border-black transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-black">{item.count}</div>
                  </div>
                </div>
                <h4 className="text-base font-bold text-black mb-1">{item.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-end">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#F5F5F5] rounded-[20px] p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-black">Recent Activity</h3>
            <p className="text-xs md:text-sm text-gray-600">Latest updates from your school</p>
          </div>
          <button className="px-3 md:px-4 py-2 bg-black text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-900 transition">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black text-sm mb-1">{activity.title}</h4>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium">{activity.timestamp}</span>
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
