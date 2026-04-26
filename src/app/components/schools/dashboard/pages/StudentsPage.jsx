import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronUp, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Loader2 
} from "lucide-react";
import { 
  getSiswaList, 
  createSiswa, 
  updateSiswa, 
  deleteSiswa 
} from "../../../../services/siswaService";
import { dummyStudents } from "../../../../data/dummyData";
import "./StudentsPage.css";

export function StudentsPage({ searchQuery = "", onAddClick }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getSiswaList();
      if (result && result.length > 0) {
        setData(result);
      } else {
        setData(dummyStudents);
      }
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyStudents);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.nis} ${item.email}`
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
        <p className="text-sm font-bold text-slate-500 tracking-wide">MEMUAT DATA MURID...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Data Siswa Siswi</h1>
        
        <div className="flex items-center gap-4">
          {/* Class Filter */}
          <button className="filter-btn group">
            <span>Kelas 10 A</span>
            <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          </button>

          {/* Sort Filter */}
          <button className="filter-btn-secondary flex items-center gap-2">
            <span>Newest</span>
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Add Button */}
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-[#030213] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="premium-table-container shadow-xl shadow-black/[0.02]">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="w-16"></th>
              <th>Nama</th>
              <th>NISN</th>
              <th>No Tlp</th>
              <th>Kelamin</th>
              <th>Kelas</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student) => (
              <tr key={student.id} className="group">
                <td>
                  <div className="avatar-wrapper mx-auto">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${student.id}`} 
                      alt="" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                </td>
                <td className="font-bold text-[#030213]">{student.name}</td>
                <td className="text-slate-500 font-medium">{student.nis || student.nisn || "4756937651"}</td>
                <td className="text-slate-500 font-medium">{student.phone || "086758341566"}</td>
                <td className="text-slate-500 font-medium">
                  {student.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                </td>
                <td>
                  <span className="class-badge">10 A</span>
                </td>
                <td>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Stats & Pagination */}
        <div className="stats-footer">
          <div className="flex items-center gap-12">
            <div className="stat-item">
              <span>Total:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span>Siswa:</span>
              <span className="stat-value">{stats.laki}</span>
            </div>
            <div className="stat-item">
              <span>Siswi:</span>
              <span className="stat-value">{stats.perempuan}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Simple Search Footer */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 w-48">
              <Search className="w-3 h-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none text-[11px] w-full"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
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
    </div>
  );
}
