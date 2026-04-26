import { motion } from "motion/react";
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const myAttendance = [
  {
    tanggal: "20 Jan 2025",
    hari: "Senin",
    mapel: "Matematika",
    status: "hadir",
    jamMasuk: "07:05",
    jamKeluar: "09:00",
    keterangan: "",
  },
  {
    tanggal: "20 Jan 2025",
    hari: "Senin",
    mapel: "Fisika",
    status: "hadir",
    jamMasuk: "09:35",
    jamKeluar: "11:30",
    keterangan: "",
  },
  {
    tanggal: "21 Jan 2025",
    hari: "Selasa",
    mapel: "Biologi",
    status: "izin",
    jamMasuk: "-",
    jamKeluar: "-",
    keterangan: "Sakit demam",
  },
  {
    tanggal: "21 Jan 2025",
    hari: "Selasa",
    mapel: "Bahasa Indonesia",
    status: "izin",
    jamMasuk: "-",
    jamKeluar: "-",
    keterangan: "Sakit demam",
  },
  {
    tanggal: "22 Jan 2025",
    hari: "Rabu",
    mapel: "Kimia",
    status: "hadir",
    jamMasuk: "07:02",
    jamKeluar: "09:00",
    keterangan: "",
  },
  {
    tanggal: "22 Jan 2025",
    hari: "Rabu",
    mapel: "Bahasa Inggris",
    status: "hadir",
    jamMasuk: "09:32",
    jamKeluar: "11:00",
    keterangan: "",
  },
  {
    tanggal: "23 Jan 2025",
    hari: "Kamis",
    mapel: "Sejarah",
    status: "hadir",
    jamMasuk: "07:00",
    jamKeluar: "09:30",
    keterangan: "",
  },
  {
    tanggal: "23 Jan 2025",
    hari: "Kamis",
    mapel: "Geografi",
    status: "sakit",
    jamMasuk: "-",
    jamKeluar: "-",
    keterangan: "Izin keluarga",
  },
];

const statusConfig = {
  hadir: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Hadir",
  },
  izin: {
    icon: AlertCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    label: "Izin",
  },
  sakit: {
    icon: XCircle,
    color: "text-orange-600",
    bg: "bg-orange-100",
    label: "Sakit",
  },
  alfa: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    label: "Alfa",
  },
};

export function StudentAttendancePage() {
  const total = myAttendance.length;
  const hadir = myAttendance.filter((a) => a.status === "hadir").length;
  const izin = myAttendance.filter((a) => a.status === "izin").length;
  const sakit = myAttendance.filter((a) => a.status === "sakit").length;
  const alfa = myAttendance.filter((a) => a.status === "alfa").length;
  const persentase = Math.round((hadir / total) * 100);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827] mb-1">Absensi Saya</h2>
        <p className="text-sm text-[#6B7280]">
          Riwayat kehadiran semester ganjil 2024/2025
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-black">{persentase}%</p>
          <p className="text-xs opacity-90 mt-1">Kehadiran</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-500 text-white rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-black">{hadir}</p>
          <p className="text-xs opacity-90 mt-1">Hadir</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-500 text-white rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-black">{izin}</p>
          <p className="text-xs opacity-90 mt-1">Izin</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-500 text-white rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-black">{sakit}</p>
          <p className="text-xs opacity-90 mt-1">Sakit</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-red-500 text-white rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-black">{alfa}</p>
          <p className="text-xs opacity-90 mt-1">Alfa</p>
        </motion.div>
      </div>

      {/* Attendance List */}
      <div className="bg-white border border-[#E3EAF5] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EEF4FF] border-b border-[#DCE7F8]">
                <th className="px-5 py-3.5 text-left font-semibold text-[#374151]">
                  Tanggal
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-[#374151]">
                  Mata Pelajaran
                </th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">
                  Status
                </th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">
                  Jam Masuk
                </th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">
                  Jam Keluar
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-[#374151]">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody>
              {myAttendance.map((item, index) => {
                const status = statusConfig[item.status];
                const StatusIcon = status.icon;
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#111827]">
                        {item.tanggal}
                      </p>
                      <p className="text-xs text-[#6B7280]">{item.hari}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-[#111827]">
                        {item.mapel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-[#374151]">{item.jamMasuk}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-[#374151]">{item.jamKeluar}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[#6B7280]">
                        {item.keterangan || "-"}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
