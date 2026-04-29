import { useEffect, useMemo, useState } from "react";
import { 
  School, 
  Users, 
  User, 
  ArrowRight, 
  Loader2,
  Calendar,
  Layers,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { getKelasList } from "../../../../services/kelasService";

export function ClassesPage({ searchQuery = "", userRole = "siswa" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    setIsLoading(true);
    try {
      const result = await getKelasList();
      setData(result);
    } catch (err) {
      console.error("Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  const columns = [
    {
      key: "name",
      header: "Nama Kelas",
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm border border-indigo-100/50">
            {item.name}
          </div>
          <div>
            <p className="font-bold text-[#111827]">{item.name}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun Ajaran 2024/2025</p>
          </div>
        </div>
      )
    },
    {
      key: "wali",
      header: "Wali Kelas",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-sm font-bold text-slate-700">{item.wali_name || item.teacher_name || "Belum Ditentukan"}</span>
        </div>
      )
    },
    {
      key: "total",
      header: "Total Siswa",
      render: (item) => (
        <div className="flex items-center gap-2 font-black text-slate-800">
          <Users className="w-4 h-4 text-slate-400" /> {item.total_students || 32} <span className="text-[10px] text-slate-400">Siswa</span>
        </div>
      )
    },
    {
      key: "action",
      header: "",
      render: (item) => (
        <button 
          onClick={() => setSelectedClass(item)}
          className="p-2 hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 rounded-xl transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daftar Kelas" 
        subtitle="Kelola data kelas dan wali kelas"
        onAddClick={userRole !== 'siswa' ? () => setIsModalOpen(true) : null}
        addButtonLabel="Tambah Baru"
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Kelas", value: data.length, icon: Layers, color: "text-blue-600" },
          { label: "Kelas Penuh", value: 24, icon: Users, color: "text-emerald-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#E3EAF5] rounded-3xl p-6 flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                <s.icon className={`w-6 h-6 ${s.color}`} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h4 className="text-xl font-black text-[#111827]">{s.value}</h4>
             </div>
          </div>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        isLoading={isLoading} 
      />

      {/* Side Panel for Class Detail (Interaction) */}
      {selectedClass && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-[150] border-l border-slate-100 p-8 transform transition-transform animate-in slide-in-from-right duration-500">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#111827]">Detail Kelas</h3>
            <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X className="w-6 h-6" /></button>
          </div>
          
          <div className="space-y-8">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-100 mb-6">
              {selectedClass.name}
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Wali Kelas</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <User className="w-6 h-6 text-indigo-600" />
                   </div>
                   <p className="font-bold text-slate-800 text-lg">{selectedClass.wali_name || "Dr. Hadi Wijaya"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Siswa</p>
                    <p className="text-2xl font-black text-indigo-600">32 <span className="text-xs">Orang</span></p>
                 </div>
                 <div className="p-5 bg-purple-50/50 rounded-3xl border border-purple-100/50">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Mata Pelajaran</p>
                    <p className="text-2xl font-black text-purple-600">12 <span className="text-xs">Mapel</span></p>
                 </div>
              </div>
            </div>

            <button className="w-full py-4 bg-[#111827] text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
               Lihat Daftar Siswa <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple X component needed for the panel
function X({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
