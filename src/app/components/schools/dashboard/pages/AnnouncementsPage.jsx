import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Megaphone, 
  FileText, 
  Bell, 
  Calendar, 
  Loader2,
  ChevronRight
} from "lucide-react";
import { dummyAnnouncements } from "../../../../data/dummyData";
import "./StudentsPage.css"; 

export function AnnouncementsPage({ searchQuery = "" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    setTimeout(() => {
      setData(dummyAnnouncements);
      setIsLoading(false);
    }, 500);
  }, []);

  const tabs = ["Semua", "Baru", "Pengumuman", "Lainnya"];

  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Semua") return matchesSearch;
    // In real app, filter by category
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#030213]" />
        <p className="text-sm font-bold text-slate-500 tracking-wide">MEMUAT PENGUMUMAN...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Pengumuman</h1>

      <div className="form-section-card shadow-xl shadow-black/[0.02]">
        <div className="view-content !p-0">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-6 border-b border-slate-50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                  ? "bg-[#030213] text-white shadow-lg shadow-black/10" 
                  : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List Content */}
          <div className="divide-y divide-slate-50">
            {filteredData.map((item, idx) => {
               const Icon = idx % 3 === 0 ? FileText : idx % 3 === 1 ? Bell : Megaphone;
               return (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#030213]">{item.title}</h4>
                      <p className="text-xs font-medium text-slate-400">
                        {idx === 0 ? "Hari ini - 12.30" : idx === 1 ? "Kemarin - 17.30" : "05/03/2026"}
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-[#15803d] text-white rounded-md font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-green-900/10 self-end sm:self-center">
                    Detail
                  </button>
                </div>
               );
            })}
          </div>

          {filteredData.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium">
              Tidak ada pengumuman untuk ditampilkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
