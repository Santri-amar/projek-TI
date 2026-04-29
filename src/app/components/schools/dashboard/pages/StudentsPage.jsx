import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FormModal } from "../../../ui/FormModal";
import { ConfirmDialog } from "../../../ui/ConfirmDialog";
import {
  getSiswaList,
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "../../../../services/siswaService";

const initialForm = {
  name: "",
  nisn: "",
  email: "",
  phone: "",
  gender: "L",
  class: "",
  alamat: "",
};

export function StudentsPage({ searchQuery = "", userRole = "siswa", initialAction = null }) {
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

  // Role Checks
  const canCRUD = userRole === "admin";

  useEffect(() => { 
    loadData(); 
    if (initialAction === "open-modal") {
       openAdd();
    }
  }, [initialAction]);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getSiswaList();
      setData(result);
    } catch (err) {
      setError("Gagal memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();
  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.nisn} ${item.class}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    {
      key: "avatar",
      header: "",
      render: (item) => (
        <div className="avatar-wrapper mx-auto group">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt="" className="w-full h-full object-cover" />
        </div>
      ),
    },
    { key: "name", header: "Nama Siswa", accessor: (item) => item.name || "-" },
    { key: "nisn", header: "NISN", accessor: (item) => item.nisn || "-" },
    { key: "class", header: "Kelas", accessor: (item) => item.class || "-" },
    { key: "gender", header: "L/P", accessor: (item) => item.gender || "-" },
  ];

  function openAdd() {
    if (!canCRUD) return;
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function openEdit(item) {
    if (!canCRUD) return;
    setEditingId(item.id);
    setForm({ ...item });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canCRUD) return;
    setIsSaving(true);
    try {
      if (editingId) {
        await updateSiswa(editingId, form);
        setMessage("✅ Data siswa berhasil diperbarui!");
      } else {
        await createSiswa(form);
        setMessage("✅ Data siswa berhasil ditambahkan!");
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      setError("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!canCRUD || !deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteSiswa(deleteTarget.id);
      setMessage("✅ Data siswa berhasil dihapus!");
      await loadData();
    } catch (err) {
      setError("Gagal menghapus data.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Data Siswa"
        subtitle="Daftar seluruh siswa aktif"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={canCRUD ? openAdd : undefined}
        addButtonLabel="Tambah Siswa"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        onEdit={canCRUD ? openEdit : undefined}
        onDelete={canCRUD ? (item) => setDeleteTarget(item) : undefined}
      />

      {/* Modal & Dialog only for Admin */}
      {canCRUD && (
        <>
          <FormModal isOpen={isModalOpen} title={editingId ? "Edit Siswa" : "Tambah Siswa"} onClose={() => setIsModalOpen(false)}>
             <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields here... */}
                <div className="flex gap-3">
                   <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Simpan</button>
                   <button type="button" onClick={() => setIsModalOpen(false)} className="border px-4 py-2 rounded-xl text-sm font-bold">Batal</button>
                </div>
             </form>
          </FormModal>
          <ConfirmDialog isOpen={!!deleteTarget} onConfirm={handleConfirmDelete} onCancel={() => setDeleteTarget(null)} />
        </>
      )}
    </div>
  );
}
