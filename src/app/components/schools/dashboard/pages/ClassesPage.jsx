import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { StatusBadge } from "../../../ui/StatusBadge";
import {
  getKelasList,
  createKelas,
  updateKelas,
  deleteKelas,
} from "../../../../services/kelasService";
import { dummyClasses } from "../../../../data/dummyData";

const initialForm = {
  name: "",
  tingkat: "",
  jurusan: "",
  kapasitas: "",
  jumlahSiswa: "",
  status: "aktif",
  waliKelasId: "",
};

export function ClassesPage({ searchQuery = "" }) {
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
      const result = await getKelasList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyClasses);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.tingkat} ${item.jurusan}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "name", header: "Nama Kelas", accessor: (item) => item.name || "-" },
    { key: "tingkat", header: "Tingkat", accessor: (item) => item.tingkat || "-" },
    { key: "jurusan", header: "Jurusan", accessor: (item) => item.jurusan || "-" },
    { key: "kapasitas", header: "Kapasitas", accessor: (item) => item.kapasitas || "-" },
    { key: "jumlahSiswa", header: "Jumlah Siswa", accessor: (item) => item.jumlahSiswa ?? 0 },
    { key: "waliKelasId", header: "Wali Kelas ID", accessor: (item) => item.waliKelasId || "-" },
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
      name: item.name || "",
      tingkat: item.tingkat || "",
      jurusan: item.jurusan || "",
      kapasitas: String(item.kapasitas ?? ""),
      jumlahSiswa: String(item.jumlahSiswa ?? ""),
      status: item.status || "aktif",
      waliKelasId: item.waliKelasId ? String(item.waliKelasId) : "",
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

    if (!form.name || !form.tingkat || !form.jurusan || !form.kapasitas) {
      setError("Nama kelas, tingkat, jurusan, dan kapasitas wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name,
        tingkat: form.tingkat,
        jurusan: form.jurusan,
        kapasitas: Number(form.kapasitas),
        jumlahSiswa: form.jumlahSiswa ? Number(form.jumlahSiswa) : undefined,
        status: form.status || undefined,
        waliKelasId: form.waliKelasId ? Number(form.waliKelasId) : undefined,
      };

      if (editingId) {
        await updateKelas(editingId, payload);
        setMessage("Data kelas berhasil diperbarui.");
      } else {
        await createKelas(payload);
        setMessage("Data kelas berhasil ditambahkan.");
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
      await deleteKelas(deleteTarget.id);
      setMessage("Data kelas berhasil dihapus.");
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
        title="Data Kelas"
        subtitle="Kelola data kelas dan jurusan"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Kelas"
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
        emptyMessage="Belum ada data kelas untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? "Edit Data Kelas" : "Tambah Kelas Baru"}
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
              <label className="block text-sm font-medium text-[#374151] mb-1">Nama Kelas *</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Contoh: X IPA 1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Tingkat *</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.tingkat} onChange={(e) => handleChange("tingkat", e.target.value)} required>
                <option value="">Pilih Tingkat</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Jurusan *</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jurusan} onChange={(e) => handleChange("jurusan", e.target.value)} placeholder="Contoh: IPA, IPS" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Kapasitas *</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.kapasitas} onChange={(e) => handleChange("kapasitas", e.target.value)} placeholder="Jumlah maksimal siswa" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Jumlah Siswa</label>
              <input type="number" min={0} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jumlahSiswa} onChange={(e) => handleChange("jumlahSiswa", e.target.value)} placeholder="Jumlah siswa saat ini" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Wali Kelas ID</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.waliKelasId} onChange={(e) => handleChange("waliKelasId", e.target.value)} placeholder="ID Guru wali kelas" />
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
              {isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Kelas"}
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); setForm(initialForm); setEditingId(null); setError(""); }} className="flex items-center gap-2 px-5 py-2.5 border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Kelas"
        message={`Apakah Anda yakin ingin menghapus kelas "${deleteTarget?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}
