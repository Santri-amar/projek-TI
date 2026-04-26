import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { StatusBadge } from "../../../ui/StatusBadge";
import {
  getMapelList,
  createMapel,
  updateMapel,
  deleteMapel,
} from "../../../../services/mapelService";
import { dummySubjects } from "../../../../data/dummyData";

const initialForm = {
  kodeMapel: "",
  name: "",
  guruId: "",
  kelasId: "",
  hari: "",
  waktuMulai: "",
  waktuSelesai: "",
  durasiMenit: "",
  status: "aktif",
};

export function SubjectsPage({ searchQuery = "" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError("");
    try {
      const result = await getMapelList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummySubjects);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.kodeMapel} ${item.hari ?? ""}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "kodeMapel", header: "Kode Mapel", accessor: (item) => item.kodeMapel || "-" },
    { key: "name", header: "Nama Mapel", accessor: (item) => item.name || "-" },
    { key: "hari", header: "Hari", accessor: (item) => item.hari || "-" },
    { key: "waktuMulai", header: "Mulai", accessor: (item) => item.waktuMulai || "-" },
    { key: "waktuSelesai", header: "Selesai", accessor: (item) => item.waktuSelesai || "-" },
    { key: "durasiMenit", header: "Durasi (menit)", accessor: (item) => item.durasiMenit || "-" },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  function openAdd() {
    setEditingId(null);
    setForm(initialForm);
    setMessage("");
    setError("");
    setIsModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      kodeMapel: item.kodeMapel || "",
      name: item.name || "",
      guruId: item.guruId ? String(item.guruId) : "",
      kelasId: item.kelasId ? String(item.kelasId) : "",
      hari: item.hari || "",
      waktuMulai: item.waktuMulai || "",
      waktuSelesai: item.waktuSelesai || "",
      durasiMenit: item.durasiMenit ? String(item.durasiMenit) : "",
      status: item.status || "aktif",
    });
    setMessage("");
    setError("");
    setIsModalOpen(true);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.kodeMapel || !form.name) {
      setError("Kode mapel dan nama mapel wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        kodeMapel: form.kodeMapel,
        name: form.name,
        guruId: form.guruId ? Number(form.guruId) : undefined,
        kelasId: form.kelasId ? Number(form.kelasId) : undefined,
        hari: form.hari || undefined,
        waktuMulai: form.waktuMulai || undefined,
        waktuSelesai: form.waktuSelesai || undefined,
        durasiMenit: form.durasiMenit ? Number(form.durasiMenit) : undefined,
        status: form.status || undefined,
      };

      if (editingId) {
        await updateMapel(editingId, payload);
        setMessage("Data mapel berhasil diperbarui.");
      } else {
        await createMapel(payload);
        setMessage("Data mapel berhasil ditambahkan.");
      }

      await loadData();
      setIsModalOpen(false);
      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteMapel(deleteTarget.id);
      setMessage("Data mapel berhasil dihapus.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Mata Pelajaran"
        subtitle="Kelola data mata pelajaran"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Mapel"
      />

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          {message}
        </motion.div>
      )}

      {error && !isModalOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </motion.div>
      )}

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        emptyMessage="Belum ada data mapel untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? "Edit Data Mapel" : "Tambah Mapel Baru"}
        onClose={() => { setIsModalOpen(false); setForm(initialForm); setEditingId(null); setError(""); }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Kode Mapel *</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.kodeMapel} onChange={(e) => handleChange("kodeMapel", e.target.value)} placeholder="Contoh: MTK10" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Nama Mapel *</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Contoh: Matematika" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Guru ID</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.guruId} onChange={(e) => handleChange("guruId", e.target.value)} placeholder="ID Guru pengajar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Kelas ID</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.kelasId} onChange={(e) => handleChange("kelasId", e.target.value)} placeholder="ID Kelas" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Hari</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.hari} onChange={(e) => handleChange("hari", e.target.value)}>
                <option value="">Pilih Hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Durasi (menit)</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.durasiMenit} onChange={(e) => handleChange("durasiMenit", e.target.value)} placeholder="Contoh: 45" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Waktu Mulai</label>
              <input type="time" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.waktuMulai} onChange={(e) => handleChange("waktuMulai", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Waktu Selesai</label>
              <input type="time" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.waktuSelesai} onChange={(e) => handleChange("waktuSelesai", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Status</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#F3F4F6]">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Mapel"}
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); setForm(initialForm); setEditingId(null); setError(""); }} className="flex items-center gap-2 px-5 py-2.5 border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Mapel"
        message={`Apakah Anda yakin ingin menghapus mapel "${deleteTarget?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}

