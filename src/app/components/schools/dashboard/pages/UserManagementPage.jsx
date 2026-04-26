import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  ChevronDown, 
  Loader2 
} from "lucide-react";
import { dummyStudents, dummyTeachers } from "../../../../data/dummyData";
import "./StudentsPage.css"; // Reuse animations

export function UserManagementPage({ searchQuery = "" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Combine students and teachers for "User Management"
    const combined = [
      ...dummyStudents.map(s => ({ ...s, type: 'Siswa', class: 'Class VII-A' })),
      ...dummyTeachers.map(t => ({ ...t, type: 'Guru', class: 'Mathematics' }))
    ];
    setData(combined);
    setIsLoading(false);
  }, []);

  const combinedSearch = searchQuery.trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.type}`
        .toLowerCase()
        .includes(combinedSearch),
    );
  }, [data, combinedSearch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#030213]" />
        <p className="text-sm font-bold text-slate-500 tracking-wide">MEMUAT KONTAK USER...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Kontak User</h1>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-50 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
            <span>Terbaru</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-[#030213] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">
            <Plus className="w-5 h-5" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="premium-table-container p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
          {filteredData.map((user, idx) => (
            <div key={idx} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                <img 
                  src={`https://i.pravatar.cc/150?u=user${idx}`} 
                  alt="" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#030213] text-lg">{user.name}</h4>
                <p className="text-xs font-bold text-slate-400">{user.class || user.type}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="px-10 py-3 bg-[#030213] text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all">
            View More
          </button>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="stats-footer mt-12 px-10">
        <div className="flex items-center gap-12">
          <div className="stat-item">
            <span>Total:</span>
            <span className="stat-value">{data.length}</span>
          </div>
          <div className="stat-item">
            <span>Guru:</span>
            <span className="stat-value">{dummyTeachers.length}</span>
          </div>
          <div className="stat-item">
            <span>Siswa:</span>
            <span className="stat-value">{dummyStudents.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
