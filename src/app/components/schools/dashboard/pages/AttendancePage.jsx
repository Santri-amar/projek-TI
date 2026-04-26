import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { StatusBadge } from "../../../ui/StatusBadge";
import {
  getAbsensiList,
  createAbsensi,
  updateAbsensi,
  deleteAbsensi,
} from "../../../../services/absensiService";
import { dummyAttendance } from "../../../../data/dummyData";

const initialForm = {
  siswaId: "",
  jadwalId: "",
  guruId: "",
  mapelId: "",
  status: "hadir",
  tanggal: "",
  jamMasuk: "",
  jamKeluar: "",
  keterangan: "",
  metode: "",
  divalidasi: false,
};

export function AttendancePage({ searchQuery = "" }) {
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
      const result = await getAbsensiList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyAttendance);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.status} ${item.tanggal} ${item.siswaId} ${item.guruId} ${item.mapelId} ${item.keterangan ?? ""}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "tanggal", header: "Tanggal", accessor: (item) => item.tanggal || "-" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === "hadir" ? "bg-green-100 text-green-700" :
          item.status === "izin" ? "bg-yellow-100 text-yellow-700" :
          item.status === "sakit" ? "bg-blue-100 text-blue-700" :
          "bg-red-100 text-red-700"
        }`}>
          {item.status?.toUpperCase() || "-"}
        </span>
      ),
    },
    { key: "siswaId", header: "Siswa ID", accessor: (item) => item.siswaId || "-" },
    { key: "guruId", header: "Guru ID", accessor: (item) => item.guruId || "-" },
    { key: "mapelId", header: "Mapel ID", accessor: (item) => item.mapelId || "-" },
    { key: "jamMasuk", header: "Jam Masuk", accessor: (item) => item.jamMasuk || "-" },
    { key: "jamKeluar", header: "Jam Keluar", accessor: (item) => item.jamKeluar || "-" },
    {
      key: "divalidasi",
      header: "Validasi",
      render: (item) => <StatusBadge status={item.divalidasi ? "aktif" : "nonaktif"} activeLabel="Tervalidasi" inactiveLabel="Belum" />,
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
      siswaId: String(item.siswaId ?? ""),
      jadwalId: item.jadwalId || "",
      guruId: String(item.guruId ?? ""),
      mapelId: String(item.mapelId ?? ""),
      status: item.status || "hadir",
      tanggal: item.tanggal ? item.tanggal.slice(0, 10) : "",
      jamMasuk: item.jamMasuk || "",
      jamKeluar: item.jamKeluar || "",
      keterangan: item.keterangan || "",
      metode: item.metode || "",
      divalidasi: item.divalidasi ?? false,
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

    if (!form.siswaId || !form.jadwalId || !form.guruId || !form.mapelId || !form.status || !form.tanggal) {
      setError("Siswa, jadwal, guru, mapel, status, dan tanggal wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        siswaId: Number(form.siswaId),
        jadwalId: form.jadwalId,
        guruId: Number(form.guruId),
        mapelId: Number(form.mapelId),
        status: form.status,
        tanggal: form.tanggal,
        jamMasuk: form.jamMasuk || undefined,
        jamKeluar: form.jamKeluar || undefined,
        keterangan: form.keterangan || undefined,
        metode: form.metode || undefined,
        divalidasi: form.divalidasi,
      };

      if (editingId !== null) {
        await updateAbsensi(editingId, payload);
        setMessage("Data absensi berhasil diperbarui.");
      } else {
        await createAbsensi(payload);
        setMessage("Data absensi berhasil ditambahkan.");
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
      await deleteAbsensi(deleteTarget.id);
      setMessage("Data absensi berhasil dihapus.");
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
        title="Absensi"
        subtitle="Kelola data absensi siswa dan guru"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Absensi"
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
        emptyMessage="Belum ada data absensi untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId !== null ? "Edit Data Absensi" : "Tambah Absensi Baru"}
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
              <label className="block text-sm font-medium text-[#374151] mb-1">Jadwal ID *</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jadwalId} onChange={(e) => handleChange("jadwalId", e.target.value)} placeholder="ID Jadwal" required />
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
              <label className="block text-sm font-medium text-[#374151] mb-1">Status *</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.status} onChange={(e) => handleChange("status", e.target.value)} required>
                <option value="hadir">Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="alfa">Alfa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Tanggal *</label>
              <input type="date" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.tanggal} onChange={(e) => handleChange("tanggal", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Jam Masuk</label>
              <input type="time" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jamMasuk} onChange={(e) => handleChange("jamMasuk", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Jam Keluar</label>
              <input type="time" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.jamKeluar} onChange={(e) => handleChange("jamKeluar", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Metode</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.metode} onChange={(e) => handleChange("metode", e.target.value)}>
                <option value="">Pilih Metode</option>
                <option value="manual">Manual</option>
                <option value="qr">QR Code</option>
                <option value="fingerprint">Fingerprint</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Validasi</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.divalidasi ? "true" : "false"} onChange={(e) => handleChange("divalidasi", e.target.value === "true")}>
                <option value="false">Belum Validasi</option>
                <option value="true">Sudah Validasi</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#374151] mb-1">Keterangan</label>
              <textarea className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 min-h-20" value={form.keterangan} onChange={(e) => handleChange("keterangan", e.target.value)} placeholder="Keterangan tambahan..." />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#F3F4F6]">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : editingId !== null ? "Simpan Perubahan" : "Tambah Absensi"}
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); setForm(initialForm); setEditingId(null); setError(""); }} className="flex items-center gap-2 px-5 py-2.5 border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Absensi"
        message={`Apakah Anda yakin ingin menghapus data absensi tanggal ${deleteTarget?.tanggal}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}

