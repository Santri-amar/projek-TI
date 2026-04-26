import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { StatusBadge } from "../../../ui/StatusBadge";
import {
  getSiswaList,
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "../../../../services/siswaService";
import { dummyStudents } from "../../../../data/dummyData";

const initialForm = {
  nis: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  tanggalLahir: "",
  kelasId: "",
  status: "aktif",
};

export function StudentsPage({ searchQuery = "" }) {
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
      const result = await getSiswaList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyStudents);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.nis} ${item.email}`
        .toLowerCase()
        .includes(combinedSearch),
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "nis", header: "NIS", accessor: (item) => item.nis || "-" },
    { key: "name", header: "Nama Siswa", accessor: (item) => item.name || "-" },
    { key: "email", header: "Email", accessor: (item) => item.email || "-" },
    {
      key: "gender",
      header: "Gender",
      accessor: (item) =>
        item.gender === "L"
          ? "Laki-laki"
          : item.gender === "P"
            ? "Perempuan"
            : "-",
    },
    {
      key: "kelasId",
      header: "Kelas ID",
      accessor: (item) => item.kelasId || "-",
    },
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
      nis: item.nis || "",
      name: item.name || "",
      email: item.email || "",
      password: "",
      phone: item.phone || "",
      gender: item.gender || "",
      tanggalLahir: item.tanggalLahir ? item.tanggalLahir.slice(0, 10) : "",
      kelasId: item.kelasId ? String(item.kelasId) : "",
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

    if (!form.nis || !form.name || !form.email) {
      setError("NIS, nama, dan email wajib diisi.");
      return;
    }
    if (!editingId && !form.password) {
      setError("Password wajib diisi saat tambah siswa baru.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        nis: form.nis,
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        phone: form.phone || undefined,
        gender: form.gender || undefined,
        tanggalLahir: form.tanggalLahir || undefined,
        kelasId: form.kelasId ? Number(form.kelasId) : undefined,
        status: form.status || undefined,
      };

      if (editingId) {
        await updateSiswa(editingId, payload);
        setMessage("Data siswa berhasil diperbarui.");
      } else {
        await createSiswa(payload);
        setMessage("Data siswa berhasil ditambahkan.");
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
      await deleteSiswa(deleteTarget.id);
      setMessage("Data siswa berhasil dihapus.");
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
        title="Data Siswa"
        subtitle="Kelola data siswa sekolah"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Siswa"
      />

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm"
        >
          {message}
        </motion.div>
      )}

      {error && !isModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
        >
          {error}
        </motion.div>
      )}

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        emptyMessage="Belum ada data siswa untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        title={editingId ? "Edit Data Siswa" : "Tambah Siswa Baru"}
        onClose={() => {
          setIsModalOpen(false);
          setForm(initialForm);
          setEditingId(null);
          setError("");
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                NIS *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.nis}
                onChange={(e) => handleChange("nis", e.target.value)}
                placeholder="Nomor Induk Siswa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Nama Lengkap *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nama siswa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Email *
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@school.id"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Password {editingId ? "(kosongkan jika tidak diubah)" : "*"}
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={
                  editingId ? "Password baru (opsional)" : "Password"
                }
                required={!editingId}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                No. HP
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="081234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Kelas ID
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.kelasId}
                onChange={(e) => handleChange("kelasId", e.target.value)}
                placeholder="ID Kelas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Pilih Gender</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.tanggalLahir}
                onChange={(e) => handleChange("tanggalLahir", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#F3F4F6]">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving
                ? "Menyimpan..."
                : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Siswa"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setForm(initialForm);
                setEditingId(null);
                setError("");
              }}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#E3EAF5] text-[#374151] rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
            >
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data Siswa"
        message={`Apakah Anda yakin ingin menghapus data siswa "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}
