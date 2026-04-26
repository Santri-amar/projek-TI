import { motion } from "motion/react";
import {
  Calendar,
  BarChart3,
  ClipboardCheck,
  Megaphone,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";

const upcomingSchedule = [
  { hari: "Senin", mapel: "Matematika", jam: "07:00 - 09:00", ruang: "R-101", guru: "Dr. Siti Aminah" },
  { hari: "Senin", mapel: "Fisika", jam: "09:30 - 11:30", ruang: "Lab Fisika", guru: "Hadi Wijaya" },
  { hari: "Selasa", mapel: "Biologi", jam: "08:00 - 10:00", ruang: "Lab Biologi", guru: "Rina Susanti" },
];

const recentGrades = [
  { mapel: "Matematika", jenis: "Tugas", nilai: 85, tanggal: "15 Jan 2025" },
  { mapel: "Fisika", jenis: "UTS", nilai: 88, tanggal: "10 Jan 2025" },
  { mapel: "Biologi", jenis: "Tugas", nilai: 78, tanggal: "14 Jan 2025" },
];

const announcements = [
  { title: "Ujian Tengah Semester", date: "20 Jan 2025", priority: "high" },
  { title: "Libur Nasional", date: "17 Agt 2025", priority: "normal" },
];

export function StudentDashboard({ userName = "Siswa" }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#EEF4FF] to-[#F8F5FF] border border-[#DCE7F8] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">
          Selamat Datang, {userName}! 👋
        </h1>
        <p className="text-sm text-[#6B7280]">
          Berikut ringkasan aktivitas belajar Anda hari ini.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Jadwal Hari Ini", value: "5 Mapel", color: "#3B82F6" },
          { icon: BarChart3, label: "Rata-rata Nilai", value: "85.3", color: "#10B981" },
          { icon: ClipboardCheck, label: "Kehadiran", value: "95%", color: "#F59E0B" },
          { icon: Award, label: "Ranking", value: "5/30", color: "#8B5CF6" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-[#E3EAF5] rounded-2xl p-4 hover:shadow-md transition"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-xs text-[#6B7280] mb-1">{stat.label}</p>
              <h3 className="text-xl font-extrabold text-[#111827]">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Jadwal Hari Ini</h3>
                <p className="text-xs text-[#6B7280]">Senin, 20 Januari 2025</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingSchedule.slice(0, 2).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 p-4 bg-[#EEF4FF] rounded-xl"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-[#4DA3FF]">
                  {item.jam.split(" - ")[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#111827]">{item.mapel}</p>
                  <p className="text-xs text-[#6B7280]">{item.guru} • {item.ruang}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#4DA3FF]">{item.jam}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Nilai Terbaru</h3>
                <p className="text-xs text-[#6B7280]">Semester Ganjil 2024/2025</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {recentGrades.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-[#EEF4FF] rounded-xl"
              >
                <div>
                  <p className="font-semibold text-[#111827]">{item.mapel}</p>
                  <p className="text-xs text-[#6B7280]">{item.jenis} • {item.tanggal}</p>
                </div>
                <div className={`text-2xl font-bold ${
                  item.nilai >= 80 ? "text-green-600" :
                  item.nilai >= 60 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {item.nilai}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-[#111827]">Pengumuman</h3>
        </div>

        <div className="space-y-3">
          {announcements.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-[#EEF4FF] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.priority === "high" ? "bg-red-500" : "bg-blue-500"
                }`} />
                <p className="font-medium text-[#111827]">{item.title}</p>
              </div>
              <p className="text-xs text-[#6B7280]">{item.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

