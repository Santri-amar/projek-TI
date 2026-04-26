import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import {
  getGuruList,
  createGuru,
  updateGuru,
  deleteGuru,
} from "../../../../services/guruService";
import { dummyTeachers } from "../../../../data/dummyData";

const initialForm = {
  nip: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  gender: "",
  birthDate: "",
  kelasId: "",
  mapelId: "",
};

export function TeachersPage({ searchQuery = "" }) {
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
      const result = await getGuruList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyTeachers);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.nip} ${item.email}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "nip", header: "NIP", accessor: (item) => item.nip || "-" },
    { key: "name", header: "Nama Guru", accessor: (item) => item.name || "-" },
    { key: "email", header: "Email", accessor: (item) => item.email || "-" },
    { key: "phone", header: "No. HP", accessor: (item) => item.phone || "-" },
    { key: "gender", header: "Gender", accessor: (item) => item.gender === "L" ? "Laki-laki" : item.gender === "P" ? "Perempuan" : "-" },
    { key: "mapelId", header: "Mapel ID", accessor: (item) => item.mapelId || "-" },
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
      nip: item.nip || "",
      name: item.name || "",
      email: item.email || "",
      password: "",
      phone: item.phone || "",
      address: item.address || "",
      gender: item.gender || "",
      birthDate: item.birthDate ? item.birthDate.slice(0, 10) : "",
      kelasId: item.kelasId ? String(item.kelasId) : "",
      mapelId: item.mapelId ? String(item.mapelId) : "",
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

    if (!form.nip || !form.name || !form.email) {
      setError("NIP, nama, dan email wajib diisi.");
      return;
    }
    if (!editingId && !form.password) {
      setError("Password wajib diisi saat tambah guru baru.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        nip: form.nip,
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        gender: form.gender || undefined,
        birthDate: form.birthDate || undefined,
        kelasId: form.kelasId ? Number(form.kelasId) : undefined,
        mapelId: form.mapelId ? Number(form.mapelId) : undefined,
      };

      if (editingId) {
        await updateGuru(editingId, payload);
        setMessage("Data guru berhasil diperbarui.");
      } else {
        await createGuru(payload);
        setMessage("Data guru berhasil ditambahkan.");
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
      await deleteGuru(deleteTarget.id);
      setMessage("Data guru berhasil dihapus.");
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
        title="Data Guru"
        subtitle="Kelola data guru dan tenaga pengajar"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Guru"
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
        emptyMessage="Belum ada data guru untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? "Edit Data Guru" : "Tambah Guru Baru"}
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
              <label className="block text-sm font-medium text-[#374151] mb-1">NIP *</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.nip} onChange={(e) => handleChange("nip", e.target.value)} placeholder="Nomor Induk Pegawai" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Nama Lengkap *</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Nama guru" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Email *</label>
              <input type="email" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="email@school.id" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Password {editingId ? "(opsional)" : "*"}</label>
              <input type="password" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.password} onChange={(e) => handleChange("password", e.target.value)} placeholder={editingId ? "Password baru" : "Password"} required={!editingId} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">No. HP</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="081234567890" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Alamat</label>
              <input className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Alamat lengkap" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Gender</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                <option value="">Pilih Gender</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Tanggal Lahir</label>
              <input type="date" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Kelas ID (Wali Kelas)</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.kelasId} onChange={(e) => handleChange("kelasId", e.target.value)} placeholder="ID Kelas" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Mapel ID</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30" value={form.mapelId} onChange={(e) => handleChange("mapelId", e.target.value)} placeholder="ID Mapel" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#F3F4F6]">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Guru"}
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); setForm(initialForm); setEditingId(null); setError(""); }} className="flex items-center gap-2 px-5 py-2.5 border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Guru"
        message={`Apakah Anda yakin ingin menghapus data guru "${deleteTarget?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}
