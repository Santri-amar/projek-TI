import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Loader2, 
  Save, 
  X, 
  Edit, 
  Trash2, 
  RotateCcw,
  CheckCircle2,
  Circle
} from "lucide-react";
import {
  getMapelList,
  createMapel,
  updateMapel,
  deleteMapel,
} from "../../../../services/mapelService";
import { dummySubjects } from "../../../../data/dummyData";

const initialForm = {
  name: "",
  jurusan: "",
  guruName: "",
};

export function SubjectsPage({ searchQuery = "" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getMapelList();
      if (result && result.length > 0) {
        setData(result);
      } else {
        setData(dummySubjects);
      }
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      setData(dummySubjects);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return data;
    return data.filter((item) =>
      `${item.name} ${item.kodeMapel}`.toLowerCase().includes(search)
    );
  }, [data, searchQuery]);

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      jurusan: item.jurusan || "Jurusan 1",
      guruName: item.guruName || "Guru 1",
    });
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate API call for now to show the "Success" state from Figma
      await new Promise(r => setTimeout(r, 1000));
      setMessage("Pelajaran berhasil diperbarui..");
      setEditingId(null);
      setForm(initialForm);
      // reload data would go here
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#030213]" />
        <p className="text-sm font-bold text-slate-500 tracking-wide">MEMUAT DATA MAPEL...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">
        {editingId ? "Update Mata Pelajaran" : "Mata Pelajaran"}
      </h1>

      {message && (
        <div className="success-alert">
          <span>{message}</span>
          <button onClick={() => setMessage("")}><X className="w-5 h-5" /></button>
        </div>
      )}

      <div className="split-view-container">
        {/* Left Column: Form */}
        <div className="form-column shadow-xl shadow-black/[0.02]">
          <div className="view-header">
            <Circle className="w-3 h-3 fill-current" />
            <span>{editingId ? "Update Mata Pelajaran" : "Tambah Mata Pelajaran"}</span>
          </div>
          <div className="view-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="form-label">Pelajaran</label>
                <input 
                  type="text" 
                  className="form-input w-full" 
                  placeholder="Nama Mata Pelajaran"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="form-label">Jurusan</label>
                <select 
                  className="form-input w-full"
                  value={form.jurusan}
                  onChange={(e) => setForm({...form, jurusan: e.target.value})}
                >
                  <option value="">-- Pilih Jurusan --</option>
                  <option value="Jurusan 1">Jurusan 1</option>
                  <option value="Jurusan 2">Jurusan 2</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="form-label">Guru</label>
                {editingId ? (
                   <input 
                    type="text" 
                    className="form-input w-full" 
                    value={form.guruName}
                    onChange={(e) => setForm({...form, guruName: e.target.value})}
                   />
                ) : (
                  <select 
                    className="form-input w-full"
                    value={form.guruName}
                    onChange={(e) => setForm({...form, guruName: e.target.value})}
                  >
                    <option value="">-- Pilih Guru --</option>
                    <option value="Guru 1">Guru 1</option>
                    <option value="Guru 2">Guru 2</option>
                  </select>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="px-8 py-2.5 bg-[#030213] text-white rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-all"
                >
                  {isSaving ? "Saving..." : editingId ? "Update" : "Simpan"}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setForm(initialForm); }}
                  className="px-8 py-2.5 bg-white border border-slate-300 rounded-full font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  {editingId ? "Cancel" : "Riset"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Table */}
        <div className="table-column shadow-xl shadow-black/[0.02]">
          <div className="view-header">
            <Circle className="w-3 h-3 fill-current" />
            <span>Data Mata Pelajaran</span>
          </div>
          <div className="view-content !p-0">
            <table className="premium-table">
              <thead>
                <tr>
                  <th className="w-16">No</th>
                  <th>Mata Pelajaran</th>
                  <th>Jurusan</th>
                  <th>Guru</th>
                  <th className="text-center">Operasi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-slate-500 font-bold">{idx + 1}</td>
                    <td className="font-bold text-[#030213]">{item.name}</td>
                    <td className="text-slate-500">Jurusan {idx % 2 + 1}</td>
                    <td className="text-slate-500">Guru {idx % 3 + 1}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-1.5 bg-[#FFD700] text-white rounded-md hover:scale-110 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-[#FF4D4D] text-white rounded-md hover:scale-110 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
