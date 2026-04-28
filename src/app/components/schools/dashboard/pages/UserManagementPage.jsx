import { useEffect, useMemo, useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  Key, 
  UserX, 
  Loader2, 
  Search,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";
import { DataTable } from "../../../ui/DataTable";
import { FadeInUp, StaggerContainer, StaggerItem } from "../../../ui/AnimatedComponents";
import { getSiswaList } from "../../../../services/siswaService";
import { getGuruList } from "../../../../services/guruService";

export function UserManagementPage({ searchQuery = "" }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, admin, guru, siswa
  const [resetTarget, setResetTarget] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const [students, teachers] = await Promise.all([
        getSiswaList(),
        getGuruList()
      ]);

      const combined = [
        ...teachers.map(t => ({ ...t, role: 'guru', displayRole: 'Guru' })),
        ...students.map(s => ({ ...s, role: 'siswa', displayRole: 'Siswa' }))
      ];
      setData(combined);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    let result = data;
    if (filter !== "all") result = result.filter(u => u.role === filter);
    if (searchQuery) {
      result = result.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [data, filter, searchQuery]);

  const handleResetPassword = async (user) => {
    setIsResetting(true);
    // Simulating API call
    setTimeout(() => {
      setIsResetting(false);
      setResetTarget(null);
      showToast(`Password untuk ${user.name} berhasil direset ke default (123456)`);
    }, 1500);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const columns = [
    {
      key: "user",
      header: "User Information",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-indigo-600">
            {item.name?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-[#111827]">{item.name}</p>
            <p className="text-xs text-slate-500">{item.email || "no-email@school.id"}</p>
          </div>
        </div>
      )
    },
    {
      key: "role",
      header: "Role",
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          item.role === 'guru' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {item.displayRole}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Aktif
        </div>
      )
    },
    {
      key: "actions",
      header: "Security Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button 
            onClick={() => setResetTarget(item)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            <Key className="w-3.5 h-3.5" /> Reset
          </button>
          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <UserX className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 p-1">
      <PageHeader title="Manajemen User" subtitle="Kelola akun, keamanan, dan hak akses pengguna" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Akun", value: data.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Admin Aktif", value: 2, icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Security Logs", value: 48, icon: Key, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white border border-[#E3EAF5] rounded-[2rem] p-6 flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h4 className="text-2xl font-black text-[#111827]">{s.value}</h4>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl w-fit border border-slate-100">
        {["all", "admin", "guru", "siswa"].map(t => (
          <button 
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        isLoading={isLoading} 
      />

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] mb-2">Reset Password?</h3>
              <p className="text-slate-500 font-medium mb-8">
                Password untuk <strong>{resetTarget.name}</strong> akan diatur ulang ke standar sistem (123456). Lanjutkan?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setResetTarget(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleResetPassword(resetTarget)}
                  disabled={isResetting}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Reset"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
