import { useState } from "react";
import { motion } from "motion/react";
import { 
  Camera, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Plus,
  ChevronDown,
  Edit,
  Loader2
} from "lucide-react";
import "./StudentsPage.css"; 

export function AttendancePage() {
  const [activeTab, setActiveTab] = useState("input"); // 'input' or 'history'

  const historyData = Array(9).fill({
    name: "Inayatul Maula",
    nim: "2021400243",
    subject: "Data Mining",
    date: "Rabu, 14 Maret 2023 10:32 WIB",
    status: "HADIR"
  }).map((item, idx) => idx % 2 === 1 ? {...item, status: 'IZIN', subject: 'Sistem Mikroprosesor', date: 'Rabu, 15 Maret 2023 09:20 WIB'} : item);

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">
          {activeTab === 'input' ? 'ABSENSI' : 'RIWAYAT ABSENSI'}
        </h1>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('input')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'input' ? 'bg-[#030213] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
          >
            Absensi Baru
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-[#030213] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
          >
            Riwayat
          </button>
        </div>
      </div>

      <div className="form-section-card shadow-xl shadow-black/[0.02]">
        {activeTab === 'input' ? (
          <div className="view-content !p-0">
             <div className="max-w-3xl mx-auto p-10 space-y-8">
                {/* Selfie Box */}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-700">Ambil Foto Selfie</label>
                   <div className="file-upload-zone h-[180px] flex items-center justify-center border-dashed">
                      <Camera className="w-8 h-8 text-slate-300" />
                   </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Nama Anda</label>
                      <input type="text" className="form-input w-full" placeholder="Masukkan nama" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">NIM</label>
                      <input type="text" className="form-input w-full" placeholder="Masukkan NIM" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Tanggal & Waktu</label>
                      <input type="text" className="form-input w-full" placeholder="Otomatis terisi" disabled />
                   </div>

                   {/* Radio Status */}
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Keterangan</label>
                      <div className="flex items-center gap-12 pt-2">
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-[#030213] flex items-center justify-center">
                               <div className="w-2.5 h-2.5 bg-[#030213] rounded-full opacity-0 group-has-[:checked]:opacity-100 transition-all"></div>
                            </div>
                            <input type="radio" name="status" className="hidden" defaultChecked />
                            <span className="text-sm font-bold text-slate-600">Hadir</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-[#030213] flex items-center justify-center">
                               <div className="w-2.5 h-2.5 bg-[#030213] rounded-full opacity-0 group-has-[:checked]:opacity-100 transition-all"></div>
                            </div>
                            <input type="radio" name="status" className="hidden" />
                            <span className="text-sm font-bold text-slate-600">Izin</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-[#030213] flex items-center justify-center">
                               <div className="w-2.5 h-2.5 bg-[#030213] rounded-full opacity-0 group-has-[:checked]:opacity-100 transition-all"></div>
                            </div>
                            <input type="radio" name="status" className="hidden" />
                            <span className="text-sm font-bold text-slate-600">Telat</span>
                         </label>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Keterangan</label>
                      <textarea className="form-input form-textarea w-full" placeholder="Tambahkan catatan jika perlu"></textarea>
                   </div>

                   <button className="w-full py-4 bg-[#030213] text-white rounded-lg font-bold text-lg shadow-xl shadow-black/10 active:scale-95 transition-all">
                      Simpan
                   </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="view-content !p-10 space-y-10 bg-[#F9FAFB]">
             {/* Toolbar */}
             <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                <button className="flex items-center justify-between gap-4 px-6 py-2 bg-white border border-slate-100 rounded-xl w-48 font-bold text-sm shadow-sm">
                  <span>Terbaru</span>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-100 rounded-xl font-bold text-sm shadow-sm">
                  <Plus className="w-4 h-4 text-[#030213]" />
                  <span>Tambah Guru</span>
                </button>
             </div>

             {/* Grid History */}
             <div className="attendance-grid">
                {historyData.map((item, idx) => (
                  <div key={idx} className="attendance-card bg-white">
                    <span className={`attendance-status-badge ${item.status === 'HADIR' ? 'status-hadir' : 'status-izin'}`}>
                      {item.status}
                    </span>
                    
                    <div className="attendance-avatar mt-4">
                      <img 
                        src={`https://i.pravatar.cc/150?u=student${idx}`} 
                        alt="" 
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>

                    <div className="flex flex-col justify-center gap-1">
                      <p className="text-[10px] font-bold text-slate-400">{item.date}</p>
                      <h4 className="text-sm font-bold text-[#030213] leading-tight">
                        Nama : {item.name}<br/>
                        NIM : {item.nim}<br/>
                        Makul : {item.subject}
                      </h4>
                    </div>

                    <button className="attendance-edit-btn">
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
