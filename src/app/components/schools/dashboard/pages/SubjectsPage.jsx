import { useEffect, useMemo, useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Loader2, 
  Edit2, 
  Trash2, 
  GraduationCap,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { getMapelList, createMapel, updateMapel, deleteMapel } from "../../../../services/mapelService";

export function SubjectsPage({ searchQuery = "", userRole = "siswa" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", teacher_name: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canCRUD = userRole === "admin";

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getMapelList();
      setData(result);
    } catch (err) {
      console.error("Failed to load subjects");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(s => 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const columns = [
    {
      key: "code",
      header: "Kode Mapel",
      render: (item) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-black tracking-wider uppercase">
          {item.code || item.kode || "N/A"}
        </span>
      )
    },
    { key: "name", header: "Nama Mata Pelajaran", accessor: (item) => item.name || "-" },
    { key: "teacher", header: "Koordinator / Guru", accessor: (item) => item.teacher_name || item.guru?.name || "-" },
    {
      key: "status",
      header: "Status",
      render: () => (
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Aktif
        </div>
      )
    }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateMapel(editingId, form);
      } else {
        await createMapel(form);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mata Pelajaran" 
        subtitle="Kelola kurikulum dan mata pelajaran sekolah"
        onAddClick={userRole !== 'siswa' ? () => { setEditingId(null); setForm({ name: "", code: "", teacher_name: "" }); setIsModalOpen(true); } : undefined}
        addButtonLabel="Tambah Baru"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Mapel", value: data.length, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Kategori Umum", value: "32", icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Kategori Kejuruan", value: "16", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white border border-[#E3EAF5] rounded-[2rem] p-6 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-7 h-7 ${s.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h4 className="text-2xl font-black text-[#111827]">{s.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        isLoading={isLoading}
        onEdit={canCRUD ? (item) => { setEditingId(item.id); setForm(item); setIsModalOpen(true); } : undefined}
        onDelete={canCRUD ? (item) => setDeleteTarget(item) : undefined}
      />

      {isModalOpen && (
        <FormModal isOpen={isModalOpen} title={editingId ? "Edit Mapel" : "Tambah Mapel Baru"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Mapel</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                     value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="Contoh: Matematika" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kode Mapel</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                     value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} required placeholder="Contoh: MTK-01" />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Simpan Mapel
              </button>
            </div>
          </form>
        </FormModal>
      )}

      <ConfirmDialog 
        isOpen={!!deleteTarget} 
        onConfirm={async () => { await deleteMapel(deleteTarget.id); await loadData(); setDeleteTarget(null); }} 
        onCancel={() => setDeleteTarget(null)} 
      />
    </div>
  );
}
