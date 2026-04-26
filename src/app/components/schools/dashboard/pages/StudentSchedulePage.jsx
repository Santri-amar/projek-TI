import { motion } from "motion/react";
import { Calendar, Clock, MapPin, User } from "lucide-react";

const studentSchedule = [
  {
    hari: "Senin",
    mapel: "Matematika",
    jam: "07:00 - 09:00",
    ruang: "R-101",
    guru: "Dr. Siti Aminah, M.Pd.",
  },
  {
    hari: "Senin",
    mapel: "Fisika",
    jam: "09:30 - 11:30",
    ruang: "Lab Fisika",
    guru: "Hadi Wijaya, S.Pd.",
  },
  {
    hari: "Selasa",
    mapel: "Biologi",
    jam: "08:00 - 10:00",
    ruang: "Lab Biologi",
    guru: "Rina Susanti, M.Si.",
  },
  {
    hari: "Selasa",
    mapel: "Bahasa Indonesia",
    jam: "10:30 - 12:00",
    ruang: "R-102",
    guru: "Dewi Kusuma, S.Pd.",
  },
  {
    hari: "Rabu",
    mapel: "Kimia",
    jam: "07:00 - 09:00",
    ruang: "Lab Kimia",
    guru: "Dr. Siti Aminah, M.Pd.",
  },
  {
    hari: "Rabu",
    mapel: "Bahasa Inggris",
    jam: "09:30 - 11:00",
    ruang: "R-103",
    guru: "John Smith, M.Ed.",
  },
  {
    hari: "Kamis",
    mapel: "Sejarah",
    jam: "08:00 - 09:30",
    ruang: "R-201",
    guru: "Ahmad Hidayat, S.Pd.",
  },
  {
    hari: "Kamis",
    mapel: "Geografi",
    jam: "10:00 - 11:30",
    ruang: "R-202",
    guru: "Budi Santoso, M.Pd.",
  },
  {
    hari: "Jumat",
    mapel: "Pendidikan Agama",
    jam: "07:00 - 08:30",
    ruang: "R-301",
    guru: "Hj. Fatimah, S.Ag.",
  },
  {
    hari: "Jumat",
    mapel: "Olahraga",
    jam: "09:00 - 11:00",
    ruang: "Lapangan",
    guru: "Agus Salim, S.Pd.",
  },
];

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export function StudentSchedulePage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827] mb-1">Jadwal Saya</h2>
        <p className="text-sm text-[#6B7280]">
          Jadwal pelajaran semester ganjil 2024/2025
        </p>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const daySchedule = studentSchedule.filter((s) => s.hari === day);
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E3EAF5] rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">{day}</h3>
              </div>

              <div className="space-y-3">
                {daySchedule.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-[#EEF4FF] rounded-xl"
                  >
                    <div className="w-14 h-14 bg-white rounded-lg flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-[#6B7280]">Jam</span>
                      <span className="text-sm font-bold text-[#4DA3FF]">
                        {item.jam.split(" - ")[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#111827]">
                        {item.mapel}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {item.guru}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.ruang}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-[#4DA3FF] bg-white px-2 py-1 rounded-lg">
                        {item.jam}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
