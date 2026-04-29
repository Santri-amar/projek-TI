import { useEffect, useState } from "react";
import { 
  ClipboardCheck, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  MapPinIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";

export function StudentAttendancePage({ searchQuery = "" }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckInLoading, setIsCheckInLoading] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null); // null, 'present', 'late'
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadHistory();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function loadHistory() {
    setIsLoading(true);
    // Simulating API history
    setTimeout(() => {
      setHistory([
        { id: 1, date: "2025-01-10", time: "07:15", status: "Hadir", method: "Mandiri" },
        { id: 2, date: "2025-01-09", time: "07:35", status: "Terlambat", method: "Mandiri" },
        { id: 3, date: "2025-01-08", time: "07:10", status: "Hadir", method: "Guru" },
      ]);
      setIsLoading(false);
    }, 800);
  }

  const filteredHistory = history.filter(item => 
    !searchQuery || 
    item.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckIn = () => {
    setIsCheckInLoading(true);
    setTimeout(() => {
      const now = new Date();
      const status = now.getHours() < 7 || (now.getHours() === 7 && now.getMinutes() <= 30) ? "present" : "late";
      setTodayStatus(status);
      setHistory(prev => [{
        id: Date.now(),
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: status === "present" ? "Hadir" : "Terlambat",
        method: "Mandiri"
      }, ...prev]);
      setIsCheckInLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Kehadiran Saya" 
        subtitle="Pantau tingkat kehadiran dan kedisiplinan Anda"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Check-in Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 text-center relative overflow-hidden h-full">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Waktu Sekarang</p>
                <h3 className="text-4xl font-black text-[#111827] mb-8">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</h3>
                
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Clock className="w-10 h-10 text-indigo-600" />
                </div>

                <AnimatePresence mode="wait">
                  {!todayStatus ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                       <p className="text-sm text-slate-500 font-medium mb-8">Anda belum melakukan absensi hari ini.</p>
                       <button 
                         onClick={handleCheckIn}
                         disabled={isCheckInLoading}
                         className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                       >
                         {isCheckInLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Absen Sekarang"}
                       </button>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-green-50 border border-green-100 rounded-3xl">
                       <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                       <h4 className="font-black text-green-700">Sudah Absen</h4>
                       <p className="text-xs text-green-600 font-bold uppercase mt-1">Status: {todayStatus === 'present' ? 'Tepat Waktu' : 'Terlambat'}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                   <MapPinIcon className="w-4 h-4" />
                   <span className="text-xs font-bold">Lokasi: Area Sekolah</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right: History List */}
        <div className="lg:col-span-2">
           <div className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 md:p-10 h-full">
              <h3 className="text-xl font-black text-[#111827] mb-8">Riwayat Kehadiran</h3>
              
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>
              ) : (
                <div className="space-y-4">
                   {filteredHistory.map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                             item.status === 'Hadir' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                           }`}>
                             <Calendar className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">{item.date}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.method === 'Mandiri' ? 'Absen Mandiri' : 'Oleh Guru'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-slate-800">{item.time}</p>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${
                             item.status === 'Hadir' ? 'text-green-600' : 'text-red-600'
                           }`}>{item.status}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
