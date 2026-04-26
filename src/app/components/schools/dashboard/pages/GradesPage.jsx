import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Plus, 
  ChevronDown, 
  Loader2,
  Circle
} from "lucide-react";
import { dummyGrades } from "../../../../data/dummyData";
import "./StudentsPage.css"; 

export function GradesPage({ searchQuery = "", onAddClick }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    // In real app, fetch from API
    setTimeout(() => {
      setData(dummyGrades);
      setIsLoading(false);
    }, 500);
  }, []);

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.id} ${item.semester}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#030213]" />
        <p className="text-sm font-bold text-slate-500 tracking-wide">MEMUAT DATA NILAI...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header with Requirements */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Nilai Ujian</h1>
        
        <div className="requirements-box lg:max-w-md w-full">
          <span className="requirements-title">Syarat kelulusan</span>
          <ul className="list-disc pl-4 space-y-1">
            <li>Nilai minimal tiap mata pelajaran tidak boleh dibawah 50</li>
            <li>Nilai rata-rata dari semua mata pelajaran tidak boleh dibawah 60</li>
          </ul>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-column overflow-hidden shadow-xl shadow-black/[0.02]">
        <div className="view-header justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 fill-current" />
            <span>Data Ujian</span>
          </div>
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#4361EE] text-white rounded-md font-bold text-sm hover:opacity-90 transition-all"
          >
            <span>Tambah Data Ujian</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6 bg-white">
          {/* Search Footer style but at top of table content */}
          <div className="flex justify-end">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>No Ujian</th>
                  <th>NIS</th>
                  <th>Jurusan</th>
                  <th>Nilai Terendah</th>
                  <th>Nilai Tertinggi</th>
                  <th>Nilai Rata-rata</th>
                  <th className="text-center">Hasil Ujian</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((grade, idx) => (
                  <tr key={grade.id}>
                    <td className="text-slate-500 font-medium">UTS-00{idx + 1}</td>
                    <td className="font-bold text-[#030213]">00{grade.siswaId}</td>
                    <td className="text-slate-500">Jurusan {idx % 2 + 1}</td>
                    <td className="text-slate-500 font-bold">{grade.nilai - 10}</td>
                    <td className="text-slate-500 font-bold">{grade.nilai + 10}</td>
                    <td className="text-slate-500 font-bold">{grade.nilai}</td>
                    <td className="text-center">
                      <span className="pass-badge">Lulus</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
