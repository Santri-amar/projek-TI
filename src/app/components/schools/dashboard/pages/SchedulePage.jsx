import { useEffect, useMemo, useState } from "react";
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  BookOpen, 
  User, 
  Trash2, 
  Loader2,
  ChevronRight,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { getJadwalList, createJadwal, deleteJadwal } from "../../../../services/jadwalService";
import { getKelasList } from "../../../../services/kelasService";
import { getMapelList } from "../../../../services/mapelService";

export function SchedulePage({ searchQuery = "", userRole = "siswa" }) {
  const [data, setData] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Semua");
  const [form, setForm] = useState({ hari: "Senin", jam: "", mapel_id: "", kelas_id: "", ruang: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canCRUD = userRole === "admin";
  const days = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => { 
    loadData();
    if (canCRUD) {
      loadDependencies();
    }
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getJadwalList();
      setData(result);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }

  async function loadDependencies() {
    try {
      const [k, m] = await Promise.all([getKelasList(), getMapelList()]);
      setKelas(k);
      setMapel(m);
    } catch (err) { console.error(err); }
  }

  const filteredData = useMemo(() => {
    let result = data;
    if (selectedDay !== "Semua") result = result.filter(d => d.hari === selectedDay);
    if (searchQuery) result = result.filter(d => d.mapel?.toLowerCase().includes(searchQuery.toLowerCase()));
    return result;
  }, [data, selectedDay, searchQuery]);

  const columns = [
    { key: "hari", header: "Hari", render: (item) => <span className="font-bold text-slate-700">{item.hari}</span> },
    { key: "jam", header: "Waktu", render: (item) => <div className="flex items-center gap-2 text-indigo-600 font-bold"><Clock className="w-3.5 h-3.5" /> {item.jam}</div> },
    { key: "mapel", header: "Mata Pelajaran", accessor: (item) => item.mapel || item.subject_name },
    { key: "kelas", header: "Kelas", accessor: (item) => item.kelas || item.class_name },
    { key: "ruang", header: "Ruangan", accessor: (item) => item.ruang || "R. 101" },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createJadwal(form);
      await loadData();
      setIsModalOpen(false);
    } catch (err) { alert("Gagal simpan jadwal"); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Master Jadwal" 
        subtitle="Atur seluruh jadwal pelajaran sekolah"
        onAddClick={canCRUD ? () => setIsModalOpen(true) : undefined}
        addButtonLabel="Tambah Jadwal"
      />

      {/* Day Filter Interaction */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {days.map(day => (
          <button 
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              selectedDay === day ? "bg-[#111827] text-white shadow-xl" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        isLoading={isLoading}
        onDelete={canCRUD ? (item) => setDeleteTarget(item) : undefined}
      />

      {isModalOpen && (
        <FormModal isOpen={isModalOpen} title="Buat Jadwal Baru" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Hari</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                          value={form.hari} onChange={e => setForm({...form, hari: e.target.value})}>
                     {days.filter(d => d !== "Semua").map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Waktu (Jam)</label>
                  <input type="text" placeholder="07:30 - 09:00" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                         value={form.jam} onChange={e => setForm({...form, jam: e.target.value})} />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Pilih Kelas</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                        value={form.kelas_id} onChange={e => setForm({...form, kelas_id: e.target.value})}>
                   <option value="">Pilih Kelas...</option>
                   {kelas.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Mata Pelajaran</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                        value={form.mapel_id} onChange={e => setForm({...form, mapel_id: e.target.value})}>
                   <option value="">Pilih Mapel...</option>
                   {mapel.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
             </div>
             <button type="submit" disabled={isSaving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl mt-4">
                {isSaving ? "Menyimpan..." : "Simpan Jadwal"}
             </button>
          </form>
        </FormModal>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} onConfirm={async () => { await deleteJadwal(deleteTarget.id); loadData(); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
