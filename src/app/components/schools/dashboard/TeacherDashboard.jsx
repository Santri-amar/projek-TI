import { motion } from "motion/react";
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Megaphone,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const myClasses = [
  { name: "X IPA 1", mapel: "Matematika", siswa: 30, hari: "Senin", jam: "07:00 - 09:00", ruang: "R-101" },
  { name: "X IPA 2", mapel: "Matematika", siswa: 28, hari: "Selasa", jam: "09:30 - 11:30", ruang: "R-102" },
  { name: "XI IPA 1", mapel: "Matematika", siswa: 31, hari: "Rabu", jam: "07:00 - 09:00", ruang: "R-201" },
];

const todayAttendance = [
  { kelas: "X IPA 1", hadir: 28, izin: 1, sakit: 1, alfa: 0, total: 30 },
  { kelas: "X IPA 2", hadir: 26, izin: 1, sakit: 0, alfa: 1, total: 28 },
];

const pendingGrades = [
  { kelas: "X IPA 1", mapel: "Matematika", jenis: "Tugas 3", deadline: "22 Jan 2025", submitted: 25, total: 30 },
  { kelas: "X IPA 2", mapel: "Matematika", jenis: "UTS", deadline: "25 Jan 2025", submitted: 20, total: 28 },
];

const announcements = [
  { title: "Rapat Guru", date: "Jumat, 15:00", priority: "normal" },
  { title: "Batas Input Nilai UTS", date: "25 Jan 2025", priority: "high" },
];

export function TeacherDashboard({ userName = "Guru" }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#EEF4FF] to-[#F8F5FF] border border-[#DCE7F8] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">
          Selamat Datang, {userName}! 👋
        </h1>
        <p className="text-sm text-[#6B7280]">
          Berikut ringkasan aktivitas mengajar Anda hari ini.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Kelas Diampu", value: "6 Kelas", color: "#3B82F6" },
          { icon: Users, label: "Total Siswa", value: "178", color: "#10B981" },
          { icon: ClipboardCheck, label: "Kehadiran Hari Ini", value: "92%", color: "#F59E0B" },
          { icon: BarChart3, label: "Nilai Belum Input", value: "12", color: "#8B5CF6" },
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
        {/* My Classes */}
        <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Kelas Saya</h3>
                <p className="text-xs text-[#6B7280]">Kelas yang diampu semester ini</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {myClasses.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-[#EEF4FF] rounded-xl"
              >
                <div>
                  <p className="font-semibold text-[#111827]">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">{item.mapel} • {item.siswa} siswa</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#4DA3FF]">{item.hari}</p>
                  <p className="text-xs text-[#6B7280]">{item.jam}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Today's Attendance Summary */}
        <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Absensi Hari Ini</h3>
                <p className="text-xs text-[#6B7280]">Ringkasan kehadiran per kelas</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {todayAttendance.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-[#EEF4FF] rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[#111827]">{item.kelas}</p>
                  <span className="text-xs text-[#6B7280]">{item.hadir}/{item.total} hadir</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(item.hadir / item.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-green-600">Hadir: {item.hadir}</span>
                  <span className="text-yellow-600">Izin: {item.izin}</span>
                  <span className="text-orange-600">Sakit: {item.sakit}</span>
                  <span className="text-red-600">Alfa: {item.alfa}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Grades */}
        <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Nilai Belum Input</h3>
                <p className="text-xs text-[#6B7280]">Daftar nilai yang perlu diinput</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {pendingGrades.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-[#EEF4FF] rounded-xl"
              >
                <div>
                  <p className="font-semibold text-[#111827]">{item.kelas} • {item.jenis}</p>
                  <p className="text-xs text-[#6B7280]">Deadline: {item.deadline}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-600">{item.submitted}/{item.total}</p>
                  <p className="text-xs text-[#6B7280]">sudah mengumpulkan</p>
                </div>
              </motion.div>
            ))}
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
    </div>
  );
}

