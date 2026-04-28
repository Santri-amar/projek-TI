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

export function TeachersPage({ searchQuery = "", userRole = "siswa" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", nip: "", email: "" });
  
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [localSearch, setLocalSearch] = useState("");

  // Role Checks: ONLY ADMIN can CRUD Teachers
  const canCRUD = userRole === "admin";

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getGuruList();
      setData(result);
    } catch (err) {
      setError("Gagal memuat data guru.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();
  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.name} ${item.nip}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    {
      key: "avatar",
      header: "",
      render: (item) => (
        <div className="avatar-wrapper mx-auto">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`} alt="" className="w-full h-full object-cover rounded-full" />
        </div>
      ),
    },
    { key: "name", header: "Nama Guru", accessor: (item) => item.name || "-" },
    { key: "nip", header: "NIP", accessor: (item) => item.nip || "-" },
    { key: "mapel", header: "Mata Pelajaran", accessor: (item) => item.mapel || item.subject_name || "-" },
    { key: "status", header: "Status", render: (item) => (
      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase">Aktif</span>
    )},
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Daftar Guru"
        subtitle="Tenaga pengajar profesional sekolah"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={canCRUD ? () => setIsModalOpen(true) : undefined}
        addButtonLabel="Tambah Guru"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        onEdit={canCRUD ? (item) => { setEditingId(item.id); setForm(item); setIsModalOpen(true); } : undefined}
        onDelete={canCRUD ? (item) => setDeleteTarget(item) : undefined}
      />

      {canCRUD && isModalOpen && (
        <FormModal isOpen={isModalOpen} title={editingId ? "Edit Guru" : "Tambah Guru"} onClose={() => setIsModalOpen(false)}>
           <div className="p-4">
             <p className="text-sm text-slate-500 mb-4">Hanya Admin yang dapat mengelola akun guru.</p>
             {/* Form Fields... */}
           </div>
        </FormModal>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} onConfirm={async () => { /* Delete */ setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
