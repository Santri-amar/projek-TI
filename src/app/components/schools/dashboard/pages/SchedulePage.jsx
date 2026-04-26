import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { StatusBadge } from "../../../ui/StatusBadge";
import {
  getJadwalList,
  createJadwal,
  updateJadwal,
  deleteJadwal,
} from "../../../../services/jadwalService";
import { dummySchedules } from "../../../../data/dummyData";

const initialForm = {
  mapelId: "",
  guruId: "",
  kelasId: "",
  hari: "",
  jamMulai: "",
  jamSelesai: "",
  ruangan: "",
  tipe: "",
  isActive: true,
};

export function SchedulePage({ searchQuery = "" }) {
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
      const result = await getJadwalList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummySchedules);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.hari} ${item.jamMulai} ${item.jamSelesai} ${item.kelasId} ${item.mapelId} ${item.guruId} ${item.ruangan ?? ""}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "hari", header: "Hari", accessor: (item) => item.hari || "-" },
    { key: "jamMulai", header: "Mulai", accessor: (item) => item.jamMulai || "-" },
    { key: "jamSelesai", header: "Selesai", accessor: (item) => item.jamSelesai || "-" },
    { key: "kelasId", header: "Kelas ID", accessor: (item) => item.kelasId || "-" },
    { key: "mapelId", header: "Mapel ID", accessor: (item) => item.mapelId || "-" },
    { key: "guruId", header: "Guru ID", accessor: (item) => item.guruId || "-" },
    { key: "ruangan", header: "Ruangan", accessor: (item) => item.ruangan || "-" },
    {
      key: "isActive",
      header: "Status",
      render: (item) => <StatusBadge status={item.isActive ? "aktif" : "nonaktif"} />,
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
      mapelId: String(item.mapelId ?? ""),
      guruId: String(item.guruId ?? ""),
      kelasId: String(item.kelasId ?? ""),
      hari: item.hari || "",
      jamMulai: item.jamMulai || "",
      jamSelesai: item.jamSelesai || "",
      ruangan: item.ruangan || "",
      tipe: item.tipe || "",
      isActive: item.isActive ?? true,
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

    if (!form.mapelId || !form.guruId || !form.kelasId || !form.hari || !form.jamMulai || !form.jamSelesai) {
      setError("Mapel, guru, kelas, hari, jam mulai, dan jam selesai wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        mapelId: Number(form.mapelId),
        guruId: Number(form.guruId),
        kelasId: Number(form.kelasId),
        hari: form.hari,
        jamMulai: form.jamMulai,
        jamSelesai: form.jamSelesai,
        ruangan: form.ruangan || undefined,
        tipe: form.tipe || undefined,
        isActive: form.isActive,
      };

      if (editingId !== null) {
        await updateJadwal(editingId, payload);
        setMessage("Data jadwal berhasil diperbarui.");
      } else {
        await createJadwal(payload);
        setMessage("Data jadwal berhasil ditambahkan.");
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
      await deleteJadwal(deleteTarget.id);
      setMessage("Data jadwal berhasil dihapus.");
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
        title="Jadwal Pelajaran"
        subtitle="Kelola jadwal pelajaran sekolah"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Jadwal"
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
        emptyMessage="Belum ada data jadwal untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId !== null ? "Edit Data Jadwal" : "Tambah Jadwal Baru"}
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
              <label className="block text-sm font-medium text-[#374151] mb-1">Mapel ID *</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.mapelId} onChange={(e) => handleChange("mapelId", e.target.value)} placeholder="ID Mata pelajaran" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Guru ID *</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.guruId} onChange={(e) => handleChange("guruId", e.target.value)} placeholder="ID Guru" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Kelas ID *</label>
              <input type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.kelasId} onChange={(e) => handleChange("kelasId", e.target.value)} placeholder="ID Kelas" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Hari *</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.hari} onChange={(e) => handleChange("hari", e.target.value)} required>
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
              <label className="block text-sm font-medium text-[#374151] mb-1">Jam Mulai *</label>
              <input type="time" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jamMulai} onChange={(e) => handleChange("jamMulai", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Jam Selesai *</label>
              <input type="time" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jamSelesai} onChange={(e) => handleChange("jamSelesai", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Ruangan</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.ruangan} onChange={(e) => handleChange("ruangan", e.target.value)} placeholder="Contoh: R-101" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Tipe</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.tipe} onChange={(e) => handleChange("tipe", e.target.value)}>
                <option value="">Pilih Tipe</option>
                <option value="teori">Teori</option>
                <option value="praktikum">Praktikum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Status</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.isActive ? "true" : "false"} onChange={(e) => handleChange("isActive", e.target.value === "true")}>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#F3F4F6]">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : editingId !== null ? "Simpan Perubahan" : "Tambah Jadwal"}
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); setForm(initialForm); setEditingId(null); setError(""); }} className="flex items-center gap-2 px-5 py-2.5 border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Jadwal"
        message={`Apakah Anda yakin ingin menghapus jadwal hari ${deleteTarget?.hari} (${deleteTarget?.jamMulai} - ${deleteTarget?.jamSelesai})?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}

