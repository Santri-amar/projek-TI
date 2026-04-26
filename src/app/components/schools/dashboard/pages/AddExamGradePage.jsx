import { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Circle,
  ChevronDown
} from "lucide-react";
import "./StudentsPage.css"; 

export function AddExamGradePage({ onBack }) {
  const [grades, setGrades] = useState([
    { id: 1, subject: "Mata Pelajaran 1", major: "Jurusan 1", value: "80" },
    { id: 2, subject: "Mata Pelajaran 2", major: "Jurusan 1", value: "80" },
    { id: 3, subject: "Mata Pelajaran 3", major: "Jurusan 1", value: "50" },
    { id: 4, subject: "Mata Pelajaran 4", major: "Jurusan 1", value: "80" },
  ]);

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl">
             <ArrowLeft className="w-6 h-6 text-[#030213]" />
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Tambah Data Nilai</h1>
        </div>
        
        <div className="requirements-box lg:max-w-md w-full">
          <span className="requirements-title">Syarat kelulusan</span>
          <ul className="list-disc pl-4 space-y-1">
            <li>Nilai minimal tiap mata pelajaran tidak boleh dibawah 50</li>
            <li>Nilai rata-rata dari semua mata pelajaran tidak boleh dibawah 60</li>
          </ul>
        </div>
      </div>

      <div className="split-view-container !grid-cols-1 lg:!grid-cols-[400px_1fr]">
        {/* Left Column: Participant Details & Stats */}
        <div className="space-y-6">
           <div className="form-column shadow-xl shadow-black/[0.02]">
              <div className="view-header">
                <Circle className="w-3 h-3 fill-current" />
                <span>Daftar Peserta Ujian</span>
              </div>
              <div className="view-content space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-200 rounded"></div>
                   <input type="text" className="form-input flex-1" value="UTS - 006" disabled />
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-400 rounded"></div>
                   <input type="text" className="form-input flex-1" value="05 / 05 / 2025" disabled />
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-400 rounded"></div>
                   <button className="form-input flex-1 flex items-center justify-between">
                      <span>NIS001 - Siswa 1</span>
                      <ChevronDown className="w-4 h-4 text-slate-300" />
                   </button>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-400 rounded"></div>
                   <button className="form-input flex-1 flex items-center justify-between">
                      <span>Jurusan 1</span>
                      <ChevronDown className="w-4 h-4 text-slate-300" />
                   </button>
                </div>
              </div>
           </div>

           {/* Stats Summary Box */}
           <div className="form-section-card p-6 space-y-3 bg-[#E5E7EB]">
              <div className="flex items-center gap-4">
                 <span className="w-12 py-1 bg-white text-center rounded text-xs font-bold">Sum</span>
                 <span className="font-bold text-slate-700">290</span>
              </div>
              <div className="flex items-center gap-4">
                 <span className="w-12 py-1 bg-white text-center rounded text-xs font-bold">Min</span>
                 <span className="font-bold text-slate-700">50</span>
              </div>
              <div className="flex items-center gap-4">
                 <span className="w-12 py-1 bg-white text-center rounded text-xs font-bold">Max</span>
                 <span className="font-bold text-slate-700">80</span>
              </div>
              <div className="flex items-center gap-4">
                 <span className="w-12 py-1 bg-white text-center rounded text-xs font-bold">Avg</span>
                 <span className="font-bold text-slate-700">72</span>
              </div>
           </div>
        </div>

        {/* Right Column: Grade Table */}
        <div className="table-column shadow-xl shadow-black/[0.02]">
           <div className="view-header justify-between">
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3 fill-current" />
                <span>Input Nilai Ujian</span>
              </div>
              <div className="flex gap-2">
                <button onClick={onBack} className="px-6 py-1 bg-white border border-slate-300 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button className="px-6 py-1 bg-[#030213] text-white rounded-md font-bold text-xs hover:opacity-90 transition-all">
                  Simpan
                </button>
              </div>
           </div>
           
           <div className="view-content !p-0">
              <table className="premium-table text-left">
                 <thead>
                    <tr>
                       <th className="w-16">No</th>
                       <th>Mata Pelajaran</th>
                       <th>Jurusan</th>
                       <th>Nilai</th>
                    </tr>
                 </thead>
                 <tbody>
                    {grades.map((item, idx) => (
                       <tr key={item.id}>
                          <td className="text-slate-500 font-bold">{idx + 1}</td>
                          <td className="font-bold text-[#030213]">{item.subject}</td>
                          <td className="text-slate-500 font-medium">{item.major}</td>
                          <td className="w-32">
                             <input 
                              type="number" 
                              className="form-input text-center w-full" 
                              value={item.value}
                              onChange={(e) => {
                                 const newGrades = [...grades];
                                 newGrades[idx].value = e.target.value;
                                 setGrades(newGrades);
                              }}
                             />
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
