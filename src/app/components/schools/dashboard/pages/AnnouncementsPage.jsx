import { useEffect, useMemo, useState } from "react";
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Clock, 
  Loader2, 
  Trash2, 
  User,
  Bell,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { getPengumumanList, createPengumuman, deletePengumuman } from "../../../../services/pengumumanService";

export function AnnouncementsPage({ searchQuery = "", userRole = "siswa" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "Info" });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canCRUD = userRole === "admin";

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getPengumumanList();
      setData(result);
    } catch (err) {
      console.error("Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(a => a.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createPengumuman(form);
      await loadData();
      setIsModalOpen(false);
      setForm({ title: "", content: "", category: "Info" });
    } catch (err) {
      alert("Gagal menyimpan pengumuman");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pengumuman" 
        subtitle="Informasi dan berita terbaru dari sekolah"
        onAddClick={userRole !== 'siswa' ? () => setIsModalOpen(true) : null}
        addButtonLabel="Buat Baru"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden md:col-span-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12" />
            <div className="relative z-10">
               <h3 className="text-2xl font-black mb-2">Pusat Informasi</h3>
               <p className="text-indigo-100 text-sm mb-6">Pastikan Anda selalu memantau info terbaru agar tidak tertinggal jadwal penting sekolah.</p>
               <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-white/20 rounded-xl text-xs font-black uppercase">{data.length} Aktif</span>
                  <span className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase">Wajib Baca</span>
               </div>
            </div>
         </div>
         <div className="bg-white border border-[#E3EAF5] rounded-[2rem] p-8 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Minggu Ini</p>
            <h4 className="text-3xl font-black text-[#111827]">03</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">Pengumuman baru</p>
         </div>
         <div className="bg-white border border-[#E3EAF5] rounded-[2rem] p-8 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <h4 className="text-3xl font-black text-[#111827]">{data.length}</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">Tersimpan</p>
         </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredData.map((item, idx) => (
              <motion.div 
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 hover:shadow-xl hover:border-indigo-100 transition-all group relative"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.category === 'Penting' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {item.category || "Info"}
                  </div>
                  {canCRUD && (
                    <button 
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h4 className="text-xl font-black text-[#111827] mb-3 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 line-clamp-3">
                  {item.content}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Admin Akademik</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" /> 12 Jan 2025
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {isModalOpen && (
        <FormModal isOpen={isModalOpen} title="Buat Pengumuman Baru" onClose={() => setIsModalOpen(false)}>
           <form onSubmit={handleSave} className="space-y-5 p-2">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Judul Pengumuman</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                       className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                       placeholder="Contoh: Jadwal Ujian Semester Ganjil" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none">
                   <option value="Info">Informasi Umum</option>
                   <option value="Penting">Penting / Urgent</option>
                   <option value="Kegiatan">Kegiatan Siswa</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Isi Pengumuman</label>
                <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all min-h-[150px]"
                          placeholder="Tuliskan detail pengumuman di sini..." />
              </div>
              <button type="submit" disabled={isSaving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                 Publikasikan Sekarang
              </button>
           </form>
        </FormModal>
      )}

      <ConfirmDialog 
        isOpen={!!deleteTarget} 
        onConfirm={async () => { await deletePengumuman(deleteTarget.id); await loadData(); setDeleteTarget(null); }} 
        onCancel={() => setDeleteTarget(null)} 
      />
    </div>
  );
}
