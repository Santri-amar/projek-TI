import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  BarChart3,
  ClipboardCheck,
  Megaphone,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Loader2,
  ArrowRight
} from "lucide-react";
import {
  SplitText,
  AnimatedCounter,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "../../ui/AnimatedComponents";
import { getSiswaDashboardOverview } from "../../../services/dashboardService";

export function StudentDashboard({ userName = "Siswa", onNavigate }) {
  const [dashData, setDashData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getSiswaDashboardOverview();
        setDashData(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const stats = dashData?.stats || {
    todayAttendancePercent: 0,
    rataRataNilai: 0,
    tugasAktif: 0,
    ranking: "0/0"
  };

  const upcomingSchedule = dashData?.upcomingSchedule || [];
  const recentGrades = dashData?.recentGrades || [];

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Selamat Pagi" : currentHour < 17 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Welcome Header */}
      <FadeInUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-[#EEF4FF] via-[#F0EBFF] to-[#F8F5FF] border border-[#DCE7F8] rounded-3xl p-6 md:p-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-indigo-500 mb-1 tracking-wide uppercase">{greeting} 👋</p>
              <h1 className="text-2xl md:text-4xl font-black text-[#111827] mb-2 tracking-tight">
                <SplitText text={`Halo, ${userName}!`} />
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-md">
                Tetap semangat belajarnya ya! Berikut ringkasan progres akademik Anda hari ini.
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progres Belajar</p>
                <p className="text-lg font-black text-indigo-600">+12.5% <span className="text-slate-400 text-xs font-bold">bulan ini</span></p>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Interactive Stats Grid */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.08}>
        {[
          { id: "schedule", icon: Calendar, label: "Jadwal Hari Ini", value: upcomingSchedule.length, suffix: " Mapel", color: "text-blue-600", bg: "bg-blue-50" },
          { id: "grades", icon: BarChart3, label: "Rata-rata Nilai", value: stats.rataRataNilai || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
          { id: "attendance", icon: ClipboardCheck, label: "Kehadiran", value: stats.todayAttendancePercent || 0, suffix: "%", color: "text-amber-600", bg: "bg-amber-50" },
          { id: "profile", icon: Award, label: "Ranking", value: stats.ranking?.split('/')[0] || 0, suffix: `/${stats.ranking?.split('/')[1] || 0}`, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.label}>
              <motion.button
                onClick={() => onNavigate(stat.id)}
                whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                className="w-full text-left bg-white border border-[#E3EAF5] rounded-3xl p-5 transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:scale-150 transition-transform`} />
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-[#111827] flex items-baseline gap-1">
                    <AnimatedCounter value={Number(stat.value)} duration={1.5} />
                    <span className="text-xs font-bold text-slate-400">{stat.suffix || ""}</span>
                  </h3>
                </div>
              </motion.button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clickable Schedule Card */}
        <FadeInUp delay={0.2} className="bg-white border border-[#E3EAF5] rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#111827]">Jadwal Terdekat</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Senin, 27 April 2026</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate("schedule")}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors group"
            >
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingSchedule.length > 0 ? (
              upcomingSchedule.map((item, idx) => (
                <div key={idx} className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group cursor-pointer">
                   <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <span className="text-[10px] font-black text-blue-600 uppercase">Jam</span>
                      <span className="text-sm font-black text-slate-800">{item.jam?.split(":")[0] || "--"}</span>
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-[#111827] text-lg">{item.mapel || item.subject_name}</h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1">
                        <User className="w-3 h-3" /> {item.guru || item.teacher_name}
                      </p>
                   </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">Tidak ada jadwal hari ini.</p>
              </div>
            )}
          </div>
        </FadeInUp>

        {/* Clickable Grades Card */}
        <FadeInUp delay={0.3} className="bg-white border border-[#E3EAF5] rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#111827]">Nilai Terbaru</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hasil Ujian Terakhir</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate("grades")}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors group"
            >
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>

          <div className="space-y-4">
            {recentGrades.length > 0 ? (
              recentGrades.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-emerald-50/30 rounded-2xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-emerald-600 shadow-sm">
                      {item.mapel?.substring(0, 2).toUpperCase() || "N"}
                    </div>
                    <div>
                      <p className="font-bold text-[#111827]">{item.mapel || item.subject_name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.jenis || "Tugas"}</p>
                    </div>
                  </div>
                  <div className={`text-xl font-black ${Number(item.nilai) >= 75 ? "text-emerald-600" : "text-red-500"}`}>
                    {item.nilai}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">Belum ada data nilai terbaru.</p>
              </div>
            )}
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
