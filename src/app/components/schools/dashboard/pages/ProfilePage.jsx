import { useState } from "react";
import { motion } from "motion/react";
import { 
  Key, 
  Save, 
  X, 
  Circle
} from "lucide-react";
import "./StudentsPage.css"; 

export function ProfilePage() {
  const [isChanging, setIsChanging] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Password</h1>
      
      <div className="table-column overflow-hidden shadow-xl shadow-black/[0.02]">
        <div className="view-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 fill-current" />
            <span>Ganti Password</span>
          </div>
          <div className="flex gap-2">
            <button 
              className="px-6 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-all"
              onClick={() => setIsChanging(false)}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-1.5 bg-[#030213] text-white rounded-md font-bold text-xs hover:opacity-90 transition-all"
              onClick={() => setIsChanging(true)}
            >
              Simpan
            </button>
          </div>
        </div>
        
        <div className="p-8 space-y-8 bg-white">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <label className="form-label">Password lama</label>
              <input 
                type="password" 
                className="form-input w-full" 
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">Password baru</label>
              <input 
                type="password" 
                className="form-input w-full" 
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">Konfirmasi Password</label>
              <input 
                type="password" 
                className="form-input w-full" 
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic background elements like in Figma */}
      <div className="fixed bottom-0 right-0 p-10 opacity-5 pointer-events-none -z-10">
         <img src="/logo-owl.png" alt="" className="w-96 grayscale" />
      </div>
    </div>
  );
}
