import { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  LogOut
} from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";

export function ProfilePage({ userName, userEmail, userRole, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState("biodata");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: userName || "",
    email: userEmail || "",
    phone: "0812-3456-7890",
    address: "Jl. Pendidikan No. 123, Jakarta Selatan",
    bio: "Semangat belajar untuk masa depan yang lebih cerah!"
  });

  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulating API
    setTimeout(() => {
      onProfileUpdate(form.name, form.email);
      setIsSaving(false);
      setMessage("✅ Profil berhasil diperbarui!");
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setMessage("✅ Password berhasil diganti!");
      setPassForm({ current: "", new: "", confirm: "" });
      setTimeout(() => setMessage(""), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profil Saya" subtitle="Kelola data pribadi dan keamanan akun Anda" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600 to-purple-700" />
             <div className="relative z-10 pt-4">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-xl">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-1 right-1 p-2 bg-white text-indigo-600 rounded-full shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-2xl font-black text-[#111827] mt-6">{userName}</h3>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1 bg-indigo-50 px-3 py-1 rounded-full inline-block">
                  {userRole}
                </p>
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
                   <div className="text-center">
                      <p className="text-lg font-black text-[#111827]">98%</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kehadiran</p>
                   </div>
                   <div className="w-[1px] h-8 bg-slate-100" />
                   <div className="text-center">
                      <p className="text-lg font-black text-[#111827]">85.4</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Nilai</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-[#111827] rounded-[2.5rem] p-8 text-white">
             <h4 className="font-black text-lg mb-4 flex items-center gap-2">
               <Shield className="w-5 h-5 text-green-400" /> Keamanan Akun
             </h4>
             <p className="text-slate-400 text-sm mb-6">Akun Anda sudah terhubung dengan sistem enkripsi terbaru.</p>
             <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab("password")}
                  className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between text-sm font-bold transition-all ${
                    activeTab === 'password' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                   Ganti Password <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 md:p-10">
            <div className="flex gap-4 mb-10 pb-6 border-b border-slate-50">
               <button onClick={() => setActiveTab("biodata")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'biodata' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}>Biodata</button>
               <button onClick={() => setActiveTab("password")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'password' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}>Keamanan</button>
            </div>

            {message && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-black border border-green-100 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {message}</motion.div>}

            {activeTab === "biodata" ? (
              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input type="email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Telepon</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Domisili</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                    </div>
                 </div>
                 <div className="md:col-span-2 pt-6">
                    <button type="submit" disabled={isSaving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                       {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Perubahan Profil"}
                    </button>
                 </div>
              </form>
            ) : (
              <form onSubmit={handlePassword} className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Sekarang</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input type="password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} placeholder="********" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Baru</label>
                       <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} placeholder="Min. 8 karakter" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Konfirmasi Password Baru</label>
                       <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} placeholder="Ulangi password baru" />
                       </div>
                    </div>
                 </div>
                 <div className="pt-6">
                    <button type="submit" disabled={isSaving} className="w-full py-4 bg-[#111827] text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                       {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ganti Password Sekarang"}
                    </button>
                 </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
