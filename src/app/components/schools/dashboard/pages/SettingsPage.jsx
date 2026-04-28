import { useState } from "react";
import { 
  Bell, 
  Moon, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";

export function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: false,
    darkMode: false,
    language: "Bahasa Indonesia",
    twoFactor: true
  });

  const [message, setMessage] = useState("");

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setMessage("✅ Preferensi disimpan!");
    setTimeout(() => setMessage(""), 2000);
  };

  const sections = [
    {
      title: "Notifikasi",
      items: [
        { id: "emailNotif", label: "Email Notifikasi", desc: "Terima update akademik via email", icon: Bell },
        { id: "pushNotif", label: "Push Notifikasi", desc: "Terima notifikasi langsung di browser", icon: Smartphone },
      ]
    },
    {
      title: "Keamanan & Privasi",
      items: [
        { id: "twoFactor", label: "Autentikasi 2-Lapis", desc: "Keamanan tambahan saat login", icon: ShieldCheck },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" subtitle="Konfigurasi preferensi aplikasi Anda" />

      <div className="max-w-4xl mx-auto space-y-6">
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-black border border-green-100 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </motion.div>
        )}

        {sections.map((section, idx) => (
          <div key={idx} className="bg-white border border-[#E3EAF5] rounded-[2.5rem] p-8 md:p-10">
             <h3 className="text-xl font-black text-[#111827] mb-8">{section.title}</h3>
             <div className="space-y-6">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Icon className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-800">{item.label}</p>
                             <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => toggle(item.id)}
                         className={`w-14 h-8 rounded-full transition-all relative ${settings[item.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                       >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings[item.id] ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>
                  );
                })}
             </div>
          </div>
        ))}

        <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 flex items-center gap-6">
           <Info className="w-10 h-10 text-indigo-600" />
           <div>
              <h4 className="font-bold text-indigo-900">Versi Aplikasi</h4>
              <p className="text-sm text-indigo-600/70 font-medium tracking-tight">SIM-SEKOLAH Pro v2.4.0 (Stable Release)</p>
           </div>
        </div>
      </div>
    </div>
  );
}
