import { useEffect, useState } from "react";
import { 
  ClipboardCheck, 
  Users, 
  BarChart3, 
  Megaphone, 
  Clock, 
  Calendar, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { 
  FadeInUp, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCounter,
  SplitText 
} from "../../ui/AnimatedComponents";
import { getGuruDashboardStats } from "../../../services/dashboardService";

export function TeacherDashboard({ userName = "Guru", onNavigate }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getGuruDashboardStats();
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

  const cards = [
    { id: "schedule", label: "Jadwal Hari Ini", value: stats.jadwalHariIni, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "students", label: "Siswa Diajar", value: stats.totalSiswaAjar, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "grades", label: "Tugas Perlu Dinilai", value: stats.tugasBelumDinilai, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "announcements", label: "Pengumuman Baru", value: stats.pengumumanBaru, icon: Megaphone, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight">
            Halo, <SplitText text={userName} className="text-indigo-600 inline" />
          </h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Status: Aktif Mengajar • SMT Ganjil 2024/2025
          </p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
           <button 
             onClick={() => onNavigate("profile")}
             className="px-5 py-2 bg-white text-indigo-600 rounded-xl text-sm font-black shadow-sm border border-slate-100 hover:bg-indigo-50 transition-all"
           >
             Edit Profil
           </button>
           <div className="h-8 w-[1px] bg-slate-200 mx-1" />
           <div className="px-4 py-2 flex items-center gap-2 text-slate-500 font-bold text-sm">
             <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
           </div>
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
        {cards.map((item, i) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={i}>
              <motion.button
                onClick={() => onNavigate(item.id)}
                whileHover={{ y: -5 }}
                className="w-full text-left bg-white border border-[#E3EAF5] rounded-[2rem] p-6 hover:shadow-xl hover:border-indigo-100 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h4 className="text-3xl font-black text-[#111827]">
                  <AnimatedCounter value={item.value} />
                </h4>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.label}</p>
              </motion.button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes Timeline */}
        <FadeInUp delay={0.4} className="lg:col-span-2 bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 md:p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#111827] flex items-center gap-3">
              <Clock className="w-7 h-7 text-indigo-500" />
              Agenda Mengajar Hari Ini
            </h3>
            <button 
              onClick={() => onNavigate("schedule")}
              className="text-sm font-black text-indigo-600 flex items-center gap-1 hover:underline"
            >
              Lihat Semua Jadwal <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-6 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
            {stats.upcomingClasses.map((cls, idx) => (
              <div key={cls.id} className="relative pl-14 group">
                <div className="absolute left-0 top-1 w-14 h-14 bg-white rounded-2xl border-2 border-slate-50 flex items-center justify-center font-black text-slate-300 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-all z-10 shadow-sm">
                  0{idx + 1}
                </div>
                <div className="bg-slate-50/50 hover:bg-white border border-transparent hover:border-indigo-100 p-6 rounded-3xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                     onClick={() => onNavigate("attendance")}>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-xl font-black text-indigo-600 shadow-sm">
                      {cls.class}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827] text-xl">{cls.subject}</h4>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-indigo-400" /> Jam: {cls.time} WIB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
                      Input Absensi
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onNavigate("grades"); }}
                      className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 rounded-xl transition-all shadow-sm"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>

        {/* Right Side Widgets */}
        <div className="space-y-8">
          <FadeInUp delay={0.5} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
             <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                   <ClipboardCheck className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-black mb-2">Presensi Anda</h4>
                <p className="text-indigo-100 text-sm leading-relaxed mb-8">Jangan lupa untuk menandai kehadiran Anda sebagai staf hari ini.</p>
                <button 
                  onClick={() => alert("Kehadiran staf berhasil dikonfirmasi!")}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Konfirmasi Sekarang
                </button>
             </div>
          </FadeInUp>

          <FadeInUp delay={0.6} className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8">
             <h4 className="text-lg font-black text-[#111827] mb-6 flex items-center gap-3">
               <Megaphone className="w-5 h-5 text-purple-500" />
               Info Akademik
             </h4>
             <div className="space-y-6">
                {[
                  "Pengisian nilai raport semester ganjil dibuka mulai besok.",
                  "Rapat guru rutin diadakan hari Jumat pukul 14:00 di aula."
                ].map((info, i) => (
                  <div key={i} className="flex gap-4 group cursor-help">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{info}</p>
                  </div>
                ))}
             </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
