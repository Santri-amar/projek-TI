import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  ChevronDown, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Loader2 
} from "lucide-react";
import { 
  getGuruList, 
  createGuru, 
  updateGuru, 
  deleteGuru 
} from "../../../../services/guruService";
import { dummyTeachers } from "../../../../data/dummyData";
import "./StudentsPage.css"; // Reuse animations

export function TeachersPage({ searchQuery = "", onAddClick }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getGuruList();
      if (result && result.length > 0) {
        setData(result);
      } else {
        setData(dummyTeachers);
      }
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyTeachers);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = searchQuery.trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.email}`
        .toLowerCase()
        .includes(combinedSearch),
    );
  }, [data, combinedSearch]);

  const stats = useMemo(() => {
    const total = data.length;
    const laki = data.filter(s => s.gender === 'L').length;
    const perempuan = data.filter(s => s.gender === 'P').length;
    return { total, laki, perempuan };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#030213]" />
        <p className="text-sm font-bold text-slate-500 tracking-wide">MEMUAT DATA GURU...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Guru Kelas</h1>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-50 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
            <span>Kelas 11 B</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-50 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
            <span>Terbaru</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-[#030213] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Guru</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="teacher-grid">
        {filteredData.map((teacher) => (
          <div key={teacher.id} className="teacher-card group">
            <button className="teacher-card-menu">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            <div className="teacher-avatar-large">
              <img 
                src={`https://i.pravatar.cc/150?u=teacher${teacher.id}`} 
                alt="" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            
            <h3 className="teacher-name">{teacher.name}</h3>
            <p className="teacher-subject">{teacher.subject || "Mathematics"}</p>
          </div>
        ))}
      </div>

      {/* Footer Stats & Pagination */}
      <div className="premium-card mt-12">
        <div className="stats-footer">
          <div className="flex items-center gap-12">
            <div className="stat-item">
              <span>Total:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span>Guru laki:</span>
              <span className="stat-value">{stats.laki}</span>
            </div>
            <div className="stat-item">
              <span>Guru Wanita:</span>
              <span className="stat-value">{stats.perempuan}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1 text-slate-300 hover:text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
            <div className="pagination-dot active">1</div>
            <div className="pagination-dot">2</div>
            <div className="pagination-dot">3</div>
            <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
