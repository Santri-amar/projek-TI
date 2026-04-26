import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Users, Clock, MapPin, ChevronRight } from "lucide-react";

const myClassesData = [
  {
    id: 1,
    name: "X IPA 1",
    mapel: "Matematika",
    siswa: 30,
    hari: "Senin",
    jam: "07:00 - 09:00",
    ruang: "R-101",
    semester: "Ganjil",
    tahunAjaran: "2024/2025",
  },
  {
    id: 2,
    name: "X IPA 2",
    mapel: "Matematika",
    siswa: 28,
    hari: "Selasa",
    jam: "09:30 - 11:30",
    ruang: "R-102",
    semester: "Ganjil",
    tahunAjaran: "2024/2025",
  },
  {
    id: 3,
    name: "XI IPA 1",
    mapel: "Matematika",
    siswa: 31,
    hari: "Rabu",
    jam: "07:00 - 09:00",
    ruang: "R-201",
    semester: "Ganjil",
    tahunAjaran: "2024/2025",
  },
  {
    id: 4,
    name: "XI IPS 1",
    mapel: "Matematika",
    siswa: 25,
    hari: "Kamis",
    jam: "10:00 - 12:00",
    ruang: "R-301",
    semester: "Ganjil",
    tahunAjaran: "2024/2025",
  },
];

export function MyClassesPage() {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827] mb-1">Kelas Saya</h2>
        <p className="text-sm text-[#6B7280]">Daftar kelas yang Anda amp semester ini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myClassesData.map((kelas, idx) => (
          <motion.div
            key={kelas.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedClass(selectedClass === kelas.id ? null : kelas.id)}
            className="bg-white border border-[#E3EAF5] rounded-2xl p-5 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">{kelas.name}</h3>
                  <p className="text-sm text-[#6B7280]">{kelas.mapel}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition ${selectedClass === kelas.id ? "rotate-90" : ""}`} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 p-3 bg-[#EEF4FF] rounded-xl">
                <Users className="w-4 h-4 text-[#4DA3FF]" />
                <div>
                  <p className="text-xs text-[#6B7280]">Siswa</p>
                  <p className="text-sm font-bold text-[#111827]">{kelas.siswa}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#EEF4FF] rounded-xl">
                <Clock className="w-4 h-4 text-[#4DA3FF]" />
                <div>
                  <p className="text-xs text-[#6B7280]">Jadwal</p>
                  <p className="text-sm font-bold text-[#111827]">{kelas.hari}</p>
                </div>
              </div>
            </div>

            {selectedClass === kelas.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-[#F3F4F6] pt-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-[#374151]">{kelas.jam}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-[#374151]">{kelas.ruang}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-[#374151]">{kelas.semester} • {kelas.tahunAjaran}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

