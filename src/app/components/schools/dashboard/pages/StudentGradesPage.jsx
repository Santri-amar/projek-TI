import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Award, BarChart3, BookOpen, ChevronRight, Loader2, Star, TrendingUp } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { FadeInUp, StaggerContainer, StaggerItem, AnimatedCounter } from "../../../ui/AnimatedComponents";
import { getNilaiList } from "../../../../services/nilaiService";

export function StudentGradesPage({ searchQuery = "" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getNilaiList();
      setData(result);
    } catch (err) {
      console.warn("API failed");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredData = data.filter(item => 
    !searchQuery || item.mapelName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const average = Math.round(filteredData.reduce((acc, curr) => acc + (Number(curr.nilai) || 0), 0) / (filteredData.length || 1));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Nilai & Hasil Belajar" 
        subtitle="Pantau perkembangan akademik Anda semester ini"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FadeInUp className="md:col-span-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-indigo-100 font-bold mb-1 uppercase tracking-widest text-xs">Rata-rata Semester</p>
                <h2 className="text-5xl font-black mb-2">
                  <AnimatedCounter value={average} duration={1} />
                </h2>
                <div className="flex items-center gap-2 text-sm font-medium bg-white/20 w-fit px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span>Meningkat 4% dari bulan lalu</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-indigo-100 text-[10px] font-bold uppercase mb-1">Mata Pelajaran</p>
                  <p className="text-2xl font-black">{data.length}</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-indigo-100 text-[10px] font-bold uppercase mb-1">Peringkat</p>
                  <p className="text-2xl font-black">#5</p>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 h-full flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <Award className="w-8 h-8 text-amber-500" />
            </div>
            <h4 className="font-bold text-[#111827]">Sangat Baik!</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Pertahankan prestasimu. Kamu berada di 10% terbaik di kelas.</p>
          </div>
        </FadeInUp>
      </div>

      {/* Grades List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#111827]">Daftar Nilai</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <BarChart3 className="w-4 h-4" />
            Semester Ganjil 2024/2025
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.05}>
          {filteredData.map((item, idx) => (
            <StaggerItem key={idx}>
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white border border-[#E3EAF5] rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    item.nilai >= 80 ? "bg-green-50 text-green-600" : "bg-indigo-50 text-indigo-600"
                  }`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">{item.mapelName}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Tugas: 85 | UTS: 78 | UAS: 82</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-2xl font-black ${
                    item.nilai >= 80 ? "text-green-600" : 
                    item.nilai >= 75 ? "text-indigo-600" : "text-red-500"
                  }`}>
                    {item.nilai}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Predikat {item.nilai >= 85 ? 'A' : 'B'}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
