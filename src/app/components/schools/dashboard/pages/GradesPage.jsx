import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import {
  getNilaiList,
  createNilai,
  updateNilai,
  deleteNilai,
} from "../../../../services/nilaiService";
import { dummyGrades } from "../../../../data/dummyData";

const initialForm = {
  siswaId: "",
  guruId: "",
  mapelId: "",
  tugasId: "",
  nilai: "",
  jenis: "tugas",
  tanggal: "",
  bobot: "",
  semester: "",
  tahunAjaran: "",
  catatan: "",
};

export function GradesPage({ searchQuery = "" }) {
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
      const result = await getNilaiList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyGrades);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.nilai} ${item.jenis} ${item.siswaId} ${item.guruId} ${item.mapelId} ${item.semester ?? ""} ${item.tahunAjaran ?? ""}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "siswaId", header: "Siswa ID", accessor: (item) => item.siswaId || "-" },
    { key: "mapelId", header: "Mapel ID", accessor: (item) => item.mapelId || "-" },
    { key: "guruId", header: "Guru ID", accessor: (item) => item.guruId || "-" },
    {
      key: "jenis",
      header: "Jenis",
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {item.jenis?.toUpperCase() || "-"}
        </span>
      ),
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (item) => (
        <span className={`font-bold ${
          Number(item.nilai) >= 80 ? "text-green-600" :
          Number(item.nilai) >= 60 ? "text-yellow-600" : "text-red-600"
        }`}>
          {item.nilai ?? "-"}
        </span>
      ),
    },
    { key: "semester", header: "Semester", accessor: (item) => item.semester || "-" },
    { key: "tahunAjaran", header: "Tahun Ajaran", accessor: (item) => item.tahunAjaran || "-" },
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
      siswaId: String(item.siswaId ?? ""),
      guruId: String(item.guruId ?? ""),
      mapelId: String(item.mapelId ?? ""),
      tugasId: item.tugasId || "",
      nilai: String(item.nilai ?? ""),
      jenis: item.jenis || "tugas",
      tanggal: item.tanggal ? item.tanggal.slice(0, 10) : "",
      bobot: item.bobot !== null && item.bobot !== undefined ? String(item.bobot) : "",
      semester: item.semester || "",
      tahunAjaran: item.tahunAjaran || "",
      catatan: item.catatan || "",
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

    if (!form.siswaId || !form.guruId || !form.mapelId || !form.nilai || !form.jenis) {
      setError("Siswa, guru, mapel, nilai, dan jenis wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        siswaId: Number(form.siswaId),
        guruId: Number(form.guruId),
        mapelId: Number(form.mapelId),
        tugasId: form.tugasId || undefined,
        nilai: Number(form.nilai),
        jenis: form.jenis,
        tanggal: form.tanggal || undefined,
        bobot: form.bobot ? Number(form.bobot) : undefined,
        semester: form.semester || undefined,
        tahunAjaran: form.tahunAjaran || undefined,
        catatan: form.catatan || undefined,
      };

      if (editingId !== null) {
        await updateNilai(editingId, payload);
        setMessage("Data nilai berhasil diperbarui.");
      } else {
        await createNilai(payload);
        setMessage("Data nilai berhasil ditambahkan.");
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
      await deleteNilai(deleteTarget.id);
      setMessage("Data nilai berhasil dihapus.");
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
        title="Nilai"
        subtitle="Kelola data nilai siswa"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Nilai"
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
        emptyMessage="Belum ada data nilai untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId !== null ? "Edit Data Nilai" : "Tambah Nilai Baru"}
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
              <label className="block text-sm font-medium text-[#374151] mb-1">Siswa ID *</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.siswaId} onChange={(e) => handleChange("siswaId", e.target.value)} placeholder="ID Siswa" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Guru ID *</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.guruId} onChange={(e) => handleChange("guruId", e.target.value)} placeholder="ID Guru" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Mapel ID *</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.mapelId} onChange={(e) => handleChange("mapelId", e.target.value)} placeholder="ID Mapel" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Nilai *</label>
              <input type="number" min={0} max={100} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.nilai} onChange={(e) => handleChange("nilai", e.target.value)} placeholder="0-100" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Jenis *</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jenis} onChange={(e) => handleChange("jenis", e.target.value)} required>
                <option value="tugas">Tugas</option>
                <option value="uts">UTS</option>
                <option value="uas">UAS</option>
                <option value="praktik">Praktik</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Tanggal</label>
              <input type="date" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.tanggal} onChange={(e) => handleChange("tanggal", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Tugas ID</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.tugasId} onChange={(e) => handleChange("tugasId", e.target.value)} placeholder="ID Tugas (opsional)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Bobot (%)</label>
              <input type="number" min={0} max={100} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.bobot} onChange={(e) => handleChange("bobot", e.target.value)} placeholder="Bobot penilaian" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Semester</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.semester} onChange={(e) => handleChange("semester", e.target.value)} placeholder="Contoh: Ganjil/Genap" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Tahun Ajaran</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.tahunAjaran} onChange={(e) => handleChange("tahunAjaran", e.target.value)} placeholder="Contoh: 2024/2025" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#374151] mb-1">Catatan</label>
              <textarea className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 min-h-20" value={form.catatan} onChange={(e) => handleChange("catatan", e.target.value)} placeholder="Catatan penilaian..." />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#F3F4F6]">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : editingId !== null ? "Simpan Perubahan" : "Tambah Nilai"}
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); setForm(initialForm); setEditingId(null); setError(""); }} className="flex items-center gap-2 px-5 py-2.5 border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Nilai"
        message={`Apakah Anda yakin ingin menghapus nilai ${deleteTarget?.jenis} (Nilai: ${deleteTarget?.nilai})?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}

