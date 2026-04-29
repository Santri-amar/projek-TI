import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Save, User, BookOpen, BarChart3, FileText, Loader2 } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { createNilai } from "../../../../services/nilaiService";

export function AddExamGradePage({ onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    siswa_id: "1",
    mapel_id: "1",
    nilai_uas: "",
    nilai_uts: "",
    keterangan: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createNilai(formData);
    setTimeout(() => {
      setIsSubmitting(false);
      onBack();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <PageHeader title="Input Nilai Ujian" subtitle="Masukkan skor UTS dan UAS siswa" />
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white border border-[#E3EAF5] rounded-3xl p-8 shadow-sm max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Target Akademik</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Pilih Siswa</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none"
                    value={formData.siswa_id}
                    onChange={(e) => setFormData({...formData, siswa_id: e.target.value})}
                  >
                    <option value="1">Ahmad Fauzi</option>
                    <option value="2">Siti Aminah</option>
                    <option value="3">Budi Cahyo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Mata Pelajaran</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none"
                    value={formData.mapel_id}
                    onChange={(e) => setFormData({...formData, mapel_id: e.target.value})}
                  >
                    <option value="1">Matematika</option>
                    <option value="2">Fisika</option>
                    <option value="3">Bahasa Indonesia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-2">Skor Ujian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Nilai UTS</label>
                <div className="relative">
                  <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" max="100" min="0" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="0-100"
                    value={formData.nilai_uts}
                    onChange={(e) => setFormData({...formData, nilai_uts: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Nilai UAS</label>
                <div className="relative">
                  <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" max="100" min="0" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="0-100"
                    value={formData.nilai_uas}
                    onChange={(e) => setFormData({...formData, nilai_uas: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Keterangan</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                  <textarea 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all min-h-[100px]"
                    placeholder="Catatan tambahan..."
                    value={formData.keterangan}
                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  ></textarea>
                </div>
              </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onBack} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Batal</button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? "Menyimpan..." : "Simpan Nilai"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
