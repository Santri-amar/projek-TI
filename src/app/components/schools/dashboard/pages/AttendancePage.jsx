import { useEffect, useState } from "react";
import { 
  ClipboardCheck, 
  Users, 
  Search, 
  Loader2, 
  Save, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Calendar
} from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";
import { getSiswaList } from "../../../../services/siswaService";
import { createAbsensi } from "../../../../services/absensiService";

export function AttendancePage({ searchQuery = "", userRole = "siswa" }) {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [attendance, setAttendance] = useState({}); // { studentId: status }
  const [selectedClass, setSelectedClass] = useState("X-A");
  const [message, setMessage] = useState("");

  const canCRUD = userRole === "admin" || userRole === "guru";

  useEffect(() => {
    loadStudents();
  }, [selectedClass]);

  async function loadStudents() {
    setIsLoading(true);
    try {
      const result = await getSiswaList();
      // Filter by class if needed
      setStudents(result);
      // Initialize all as 'Hadir'
      const initial = {};
      result.forEach(s => initial[s.id] = "Hadir");
      setAttendance(initial);
    } catch (err) {
      console.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusChange = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call to save bulk attendance
      await createAbsensi({ class: selectedClass, date: new Date().toISOString(), data: attendance });
      setMessage("✅ Absensi berhasil disimpan!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Gagal menyimpan absensi");
    } finally {
      setIsSaving(false);
    }
  };

  if (userRole === "siswa") {
    return (
      <div className="p-8 text-center bg-white border border-[#E3EAF5] rounded-3xl">
         <Clock className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
         <h3 className="text-xl font-black text-[#111827]">Riwayat Absensi</h3>
         <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">
            Silakan buka tab <strong>Dashboard</strong> atau <strong>Absensi Saya</strong> untuk melihat statistik kehadiran Anda.
         </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Input Absensi" 
        subtitle={`Manajemen kehadiran siswa kelas ${selectedClass}`}
      />

      <div className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-50">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                 <Users className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                 <h4 className="text-xl font-black text-[#111827]">Daftar Hadir</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Hari ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <select 
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
                className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none min-w-[150px]"
              >
                <option value="X-A">Kelas X-A</option>
                <option value="X-B">Kelas X-B</option>
                <option value="XI-A">Kelas XI-A</option>
              </select>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan
              </button>
           </div>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold text-center border border-green-100">
             {message}
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Siswa</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Hadir</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Izin</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Sakit</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Alpa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-xs">
                          {student.name?.charAt(0)}
                       </div>
                       <span className="text-sm font-bold text-slate-700">{student.name}</span>
                    </div>
                  </td>
                  {["Hadir", "Izin", "Sakit", "Alpa"].map((status) => (
                    <td key={status} className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleStatusChange(student.id, status)}
                        className={`w-6 h-6 rounded-full border-2 transition-all mx-auto flex items-center justify-center ${
                          attendance[student.id] === status 
                          ? status === 'Hadir' ? 'bg-green-500 border-green-500 text-white' 
                            : status === 'Alpa' ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-amber-500 border-amber-500 text-white'
                          : 'border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        {attendance[student.id] === status && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
