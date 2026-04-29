import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Calendar, MapPin, User, Download, Printer, Loader2 } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { FadeInUp, StaggerContainer, StaggerItem } from "../../../ui/AnimatedComponents";
import { getJadwalList } from "../../../../services/jadwalService";

export function StudentSchedulePage({ searchQuery = "" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString("id-ID", { weekday: "long" }));

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getJadwalList();
      setData(result);
    } catch (err) {
      console.warn("API failed to load schedule");
    } finally {
      setIsLoading(false);
    }
  }

  // Normalisasi filter hari dan pencarian
  const filteredSchedule = data.filter(item => {
    const apiHari = String(item.hari).toLowerCase();
    const selectedHari = currentDay.toLowerCase();
    
    // Mapping angka ke nama hari jika API mengembalikan angka
    const dayMapping = {
      "1": "senin", "2": "selasa", "3": "rabu", "4": "kamis", "5": "jumat", "6": "sabtu", "7": "minggu",
      "monday": "senin", "tuesday": "selasa", "wednesday": "rabu", "thursday": "kamis", "friday": "jumat", "saturday": "sabtu"
    };

    const matchesDay = apiHari === selectedHari || dayMapping[apiHari] === selectedHari;
    const matchesSearch = !searchQuery || item.mapel?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDay && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Jadwal Pelajaran" 
        subtitle="Daftar mata pelajaran yang harus diikuti setiap harinya"
      />

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide bg-white/50 p-2 rounded-2xl border border-slate-100">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              currentDay === day 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
              : "text-slate-500 hover:bg-white hover:shadow-sm"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      <div className="relative min-h-[300px]">
        {filteredSchedule.length > 0 && (
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-indigo-100/50" />
        )}

        <StaggerContainer className="space-y-6" staggerDelay={0.05}>
          {filteredSchedule.length > 0 ? (
            filteredSchedule.map((item, idx) => (
              <StaggerItem key={idx}>
                <div className="relative pl-12 md:pl-20">
                  <div className="absolute left-3 md:left-7 top-6 w-3 h-3 rounded-full bg-white border-2 border-indigo-500 z-10" />
                  
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="bg-white border border-[#E3EAF5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6"
                  >
                    <div className="md:w-32 flex-shrink-0">
                      <div className="flex items-center gap-2 text-indigo-600 font-black text-sm bg-indigo-50 px-3 py-1.5 rounded-lg w-fit">
                        <Clock className="w-4 h-4" />
                        {item.jam || `${item.start_time || '--'} - ${item.end_time || '--'}`}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[#111827]">{item.mapel || item.subject_name || "Mata Pelajaran"}</h4>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          {item.guru || item.teacher_name || "Guru Pengajar"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-purple-500" />
                          {item.ruang || item.room || "Ruang Kelas"}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-600 font-black">
                        {idx + 1}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </StaggerItem>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold">Tidak ada jadwal untuk hari {currentDay}.</p>
              <button onClick={loadData} className="mt-4 text-sm font-bold text-indigo-600 hover:underline">Refresh Data</button>
            </div>
          )}
        </StaggerContainer>
      </div>
    </div>
  );
}
