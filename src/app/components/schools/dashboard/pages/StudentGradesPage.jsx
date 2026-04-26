import { motion } from "motion/react";
import { BarChart3, TrendingUp, Award, BookOpen } from "lucide-react";

const myGrades = [
  { mapel: "Matematika", tugas: 85, uts: 88, uas: 90, praktik: 88, akhir: 88, semester: "Ganjil", tahunAjaran: "2024/2025" },
  { mapel: "Fisika", tugas: 78, uts: 82, uas: 85, praktik: 90, akhir: 84, semester: "Ganjil", tahunAjaran: "2024/2025" },
  { mapel: "Biologi", tugas: 90, uts: 85, uas: 88, praktik: 92, akhir: 89, semester: "Ganjil", tahunAjaran: "2024/2025" },
  { mapel: "Kimia", tugas: 82, uts: 80, uas: 85, praktik: 88, akhir: 84, semester: "Ganjil", tahunAjaran: "2024/2025" },
  { mapel: "Bahasa Indonesia", tugas: 88, uts: 90, uas: 92, praktik: 0, akhir: 90, semester: "Ganjil", tahunAjaran: "2024/2025" },
  { mapel: "Bahasa Inggris", tugas: 85, uts: 87, uas: 89, praktik: 0, akhir: 87, semester: "Ganjil", tahunAjaran: "2024/2025" },
];

export function StudentGradesPage() {
  const rataRata = Math.round(myGrades.reduce((acc, g) => acc + g.akhir, 0) / myGrades.length);
  const nilaiTertinggi = Math.max(...myGrades.map((g) => g.akhir));
  const nilaiTerendah = Math.min(...myGrades.map((g) => g.akhir));

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827] mb-1">Nilai Saya</h2>
        <p className="text-sm text-[#6B7280]">Ringkasan nilai semester ganjil 2024/2025</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Rata-rata</span>
          </div>
          <p className="text-3xl font-black">{rataRata}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-500 text-white rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Tertinggi</span>
          </div>
          <p className="text-3xl font-black">{nilaiTertinggi}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-orange-500 text-white rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Terendah</span>
          </div>
          <p className="text-3xl font-black">{nilaiTerendah}</p>
        </motion.div>
      </div>

      {/* Grades Table */}
      <div className="bg-white border border-[#E3EAF5] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EEF4FF] border-b border-[#DCE7F8]">
                <th className="px-5 py-3.5 text-left font-semibold text-[#374151]">Mata Pelajaran</th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">Tugas</th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">UTS</th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">UAS</th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">Praktik</th>
                <th className="px-5 py-3.5 text-center font-semibold text-[#374151]">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody>
              {myGrades.map((grade, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#4DA3FF]" />
                      <span className="font-medium text-[#111827]">{grade.mapel}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-semibold ${grade.tugas >= 80 ? "text-green-600" : grade.tugas >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                      {grade.tugas || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-semibold ${grade.uts >= 80 ? "text-green-600" : grade.uts >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                      {grade.uts || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-semibold ${grade.uas >= 80 ? "text-green-600" : grade.uas >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                      {grade.uas || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-semibold ${grade.praktik >= 80 ? "text-green-600" : grade.praktik >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                      {grade.praktik || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${
                      grade.akhir >= 80 ? "bg-green-100 text-green-700" :
                      grade.akhir >= 60 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {grade.akhir}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

