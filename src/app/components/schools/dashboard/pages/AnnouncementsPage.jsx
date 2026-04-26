import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import { StatusBadge } from "../../../ui/StatusBadge";
import {
  getPengumumanList,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
} from "../../../../services/pengumumanService";
import { dummyAnnouncements } from "../../../../data/dummyData";

const initialForm = {
  title: "",
  content: "",
  priority: "normal",
  target: "all",
  isPublished: true,
  publishAt: "",
  expiredAt: "",
};

export function AnnouncementsPage({ searchQuery = "" }) {
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
      const result = await getPengumumanList();
      setData(result);
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummyAnnouncements);
      setError("Gagal memuat dari server. Menampilkan data dummy.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.title} ${item.content} ${item.target ?? ""} ${item.priority ?? ""}`
        .toLowerCase()
        .includes(combinedSearch),
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "title", header: "Judul", accessor: (item) => item.title || "-" },
    {
      key: "priority",
      header: "Prioritas",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.priority === "urgent"
              ? "bg-red-100 text-red-700"
              : item.priority === "high"
                ? "bg-orange-100 text-orange-700"
                : item.priority === "low"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.priority?.toUpperCase() || "NORMAL"}
        </span>
      ),
    },
    {
      key: "target",
      header: "Target",
      accessor: (item) => item.target || "all",
    },
    {
      key: "isPublished",
      header: "Status",
      render: (item) => (
        <StatusBadge
          status={item.isPublished ? "aktif" : "nonaktif"}
          activeLabel="Published"
          inactiveLabel="Draft"
        />
      ),
    },
    {
      key: "content",
      header: "Isi",
      accessor: (item) =>
        item.content
          ? item.content.slice(0, 60) + (item.content.length > 60 ? "..." : "")
          : "-",
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
      title: item.title || "",
      content: item.content || "",
      priority: item.priority || "normal",
      target: item.target || "all",
      isPublished: item.isPublished ?? true,
      publishAt: item.publishAt ? toDateTimeLocal(item.publishAt) : "",
      expiredAt: item.expiredAt ? toDateTimeLocal(item.expiredAt) : "",
    });
    setMessage("");
    setError("");
    setIsModalOpen(true);
  }

  function toDateTimeLocal(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.title || !form.content) {
      setError("Judul dan isi pengumuman wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        priority: form.priority || undefined,
        target: form.target || undefined,
        isPublished: form.isPublished,
        publishAt: form.publishAt
          ? new Date(form.publishAt).toISOString()
          : undefined,
        expiredAt: form.expiredAt
          ? new Date(form.expiredAt).toISOString()
          : undefined,
      };

      if (editingId !== null) {
        await updatePengumuman(editingId, payload);
        setMessage("Pengumuman berhasil diperbarui.");
      } else {
        await createPengumuman(payload);
        setMessage("Pengumuman berhasil ditambahkan.");
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
      await deletePengumuman(deleteTarget.id);
      setMessage("Pengumuman berhasil dihapus.");
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
        title="Pengumuman"
        subtitle="Kelola pengumuman dan informasi sekolah"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={openAdd}
        addButtonLabel="Tambah Pengumuman"
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
        emptyMessage="Belum ada data pengumuman untuk ditampilkan."
        onEdit={openEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <FormModal
        isOpen={isModalOpen}
        title={
          editingId !== null ? "Edit Pengumuman" : "Tambah Pengumuman Baru"
        }
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Judul Pengumuman *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Judul pengumuman"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Target
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.target}
                onChange={(e) => handleChange("target", e.target.value)}
              >
                <option value="all">Semua</option>
                <option value="admin">Admin</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Prioritas
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Status Publish
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.isPublished ? "true" : "false"}
                onChange={(e) =>
                  handleChange("isPublished", e.target.value === "true")
                }
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Publish At
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.publishAt}
                onChange={(e) => handleChange("publishAt", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Expired At
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
                value={form.expiredAt}
                onChange={(e) => handleChange("expiredAt", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Isi Pengumuman *
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 min-h-28"
                value={form.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Tulis isi pengumuman di sini..."
                required
              />
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
                : editingId !== null
                  ? "Simpan Perubahan"
                  : "Tambah Pengumuman"}
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Pengumuman"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${deleteTarget?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
}
