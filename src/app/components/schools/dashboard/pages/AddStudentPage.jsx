import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Save, User, Mail, Phone, BookOpen, Calendar, MapPin, Loader2 } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { createSiswa } from "../../../../services/siswaService";

export function AddStudentPage({ onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nisn: "",
    email: "",
    phone: "",
    class: "X-A",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createSiswa(formData);
    setTimeout(() => {
      setIsSubmitting(false);
      onBack();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <PageHeader title="Tambah Siswa Baru" subtitle="Masukkan data lengkap siswa untuk pendaftaran" />
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white border border-[#E3EAF5] rounded-3xl p-8 shadow-sm max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Data Pribadi</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">NISN</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="Masukkan NISN"
                    value={formData.nisn}
                    onChange={(e) => setFormData({...formData, nisn: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Class */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-2">Kontak & Akademik</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Pilih Kelas</label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  >
                    <option value="X-A">Kelas X-A</option>
                    <option value="X-B">Kelas X-B</option>
                    <option value="XI-A">Kelas XI-A</option>
                    <option value="XII-A">Kelas XII-A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
          >
            Batal
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? "Menyimpan..." : "Simpan Siswa"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
