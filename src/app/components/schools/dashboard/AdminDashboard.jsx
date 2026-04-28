import { useEffect, useState } from "react";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  School, 
  ArrowUpRight, 
  Bell, 
  Calendar,
  Activity,
  PlusCircle,
  Loader2
} from "lucide-react";
import { motion } from "motion/react";
import { 
  FadeInUp, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCounter,
  SplitText 
} from "../../ui/AnimatedComponents";
import { getAdminDashboardStats } from "../../../services/dashboardService";

export function AdminDashboard({ userName = "Admin", onQuickAction }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getAdminDashboardStats();
      setStats(data);
      setIsLoading(false);
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const mainStats = [
    { label: "Total Siswa", value: stats.totalSiswa, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
    { label: "Total Guru", value: stats.totalGuru, icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+2%" },
    { label: "Total Kelas", value: stats.totalKelas, icon: School, color: "text-purple-600", bg: "bg-purple-50", trend: "0%" },
    { label: "Total Mapel", value: stats.totalMapel, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50", trend: "+4%" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111827] flex items-center gap-2">
            Selamat Datang, 
            <SplitText text={userName} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600" />
            <motion.span animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }}>👋</motion.span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Sistem Informasi Sekolah - SMA Negeri 1</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm">
            <Calendar className="w-4 h-4" /> 2025/2026
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            <PlusCircle className="w-4 h-4" /> Tambah Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
        {mainStats.map((item, i) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={i}>
              <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-full translate-x-12 -translate-y-12 opacity-50 group-hover:scale-110 transition-transform`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                  <div className="flex items-end justify-between mt-1">
                    <h4 className="text-3xl font-black text-[#111827]">
                      <AnimatedCounter value={item.value} />
                    </h4>
                    <span className="text-[10px] font-black text-green-500 flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3 h-3" /> {item.trend}
                    </span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <FadeInUp delay={0.4} className="lg:col-span-2 bg-white border border-[#E3EAF5] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#111827] flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Aktivitas Terbaru
            </h3>
            <button className="text-sm font-bold text-indigo-600 hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-6">
            {stats.recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold">
                  {act.id}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{act.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>

        {/* Quick Actions */}
        <FadeInUp delay={0.5} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6">Aksi Cepat</h3>
            <div className="space-y-3">
              {[
                { label: "Tambah Siswa", id: "students", icon: PlusCircle },
                { label: "Buat Pengumuman", id: "announcements", icon: Bell },
                { label: "Atur Jadwal", id: "schedule", icon: Calendar },
              ].map((btn, i) => {
                const Icon = btn.icon;
                return (
                  <button 
                    key={i}
                    onClick={() => onQuickAction(btn.id)}
                    className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group"
                  >
                    <span className="font-bold flex items-center gap-3">
                      <Icon className="w-5 h-5" /> {btn.label}
                    </span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
