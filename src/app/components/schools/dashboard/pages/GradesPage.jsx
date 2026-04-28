import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Save, X, Plus } from "lucide-react";
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

export function GradesPage({ searchQuery = "", userRole = "siswa" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ siswa_id: "", mapel_id: "", nilai: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [localSearch, setLocalSearch] = useState("");

  // Role Checks: Only Admin and Guru can modify grades
  const canCRUD = userRole === "admin" || userRole === "guru";

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getNilaiList();
      setData(result);
    } catch (err) {
      setError("Gagal memuat data nilai.");
    } finally {
      setIsLoading(false);
    }
  }

  const combinedSearch = (searchQuery || localSearch).trim().toLowerCase();
  const filteredData = useMemo(() => {
    if (!combinedSearch) return data;
    return data.filter((item) =>
      `${item.siswa_name} ${item.subject_name}`.toLowerCase().includes(combinedSearch)
    );
  }, [data, combinedSearch]);

  const columns = [
    { key: "siswa_name", header: "Nama Siswa", accessor: (item) => item.siswa_name || item.siswa?.name || "-" },
    { key: "subject_name", header: "Mata Pelajaran", accessor: (item) => item.subject_name || item.mapel?.name || "-" },
    { key: "nilai", header: "Nilai Akhir", render: (item) => (
      <span className={`font-bold ${Number(item.nilai) >= 75 ? "text-green-600" : "text-red-600"}`}>
        {item.nilai}
      </span>
    )},
    { key: "keterangan", header: "Status", render: (item) => (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${Number(item.nilai) >= 75 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
        {Number(item.nilai) >= 75 ? "Lulus" : "Remedial"}
      </span>
    )},
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Manajemen Nilai"
        subtitle="Input dan pantau hasil belajar siswa"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onAddClick={canCRUD ? () => setIsModalOpen(true) : undefined}
        addButtonLabel="Input Nilai"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        onEdit={canCRUD ? (item) => { setEditingId(item.id); setForm(item); setIsModalOpen(true); } : undefined}
        onDelete={canCRUD ? (item) => setDeleteTarget(item) : undefined}
      />

      {canCRUD && isModalOpen && (
        <FormModal isOpen={isModalOpen} title={editingId ? "Edit Nilai" : "Input Nilai Baru"} onClose={() => setIsModalOpen(false)}>
           <form className="p-4 space-y-4">
              <p className="text-sm text-slate-500">Gunakan form ini untuk {editingId ? 'memperbarui' : 'memasukkan'} nilai siswa secara kolektif.</p>
              {/* Form implementation */}
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold border rounded-xl">Batal</button>
                <button type="button" className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl">Simpan Nilai</button>
              </div>
           </form>
        </FormModal>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} onConfirm={async () => { /* Delete Logic */ setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
