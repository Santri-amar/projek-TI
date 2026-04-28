import { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Building2, 
  HelpCircle,
  Settings,
  LogOut,
  User as UserIcon,
  Clock
} from "lucide-react";

export function TopNavbar({
  pageTitle,
  userName,
  userRole,
  searchQuery,
  onSearchQueryChange,
  onLogout,
  onMenuClick,
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userInitial = userName?.charAt(0).toUpperCase() || "U";

  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 bg-white border-b border-slate-100 z-40 transition-all">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold text-slate-900">{pageTitle}</h2>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span className="text-[12px] font-bold text-blue-700">SMA Negeri 1</span>
          <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
        </div>
      </div>

      {/* CENTER SECTION */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[13px] font-medium text-slate-600 focus:bg-white focus:border-indigo-200 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5">
        
        {/* Subtle Real-time Clock */}
        <div className="hidden xl:flex flex-col items-end text-slate-400 border-r border-slate-100 pr-5">
           <span className="text-[13px] font-bold text-slate-700 tabular-nums leading-none">
             {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
           </span>
           <span className="text-[10px] font-medium uppercase tracking-tighter mt-1">
             {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
           </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onMenuClick("announcements")} className="p-2 hover:bg-slate-50 rounded-full relative transition-all group">
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>

        {/* User Identity */}
        <div className="relative group">
          <button className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-full transition-all">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[13px] font-bold shadow-md shadow-indigo-100">
               {userInitial}
            </div>
            <div className="text-left hidden lg:block">
               <p className="text-[13px] font-bold text-slate-800 leading-none">{userName}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                 {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
               </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
             <button onClick={() => onMenuClick("profile")} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <UserIcon className="w-4 h-4 text-slate-400" /> Profil
             </button>
             <button onClick={() => onMenuClick("settings")} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Settings className="w-4 h-4 text-slate-400" /> Settings
             </button>
             <div className="h-px bg-slate-50 my-1.5 mx-2" />
             <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
             </button>
          </div>
        </div>

      </div>
    </header>
  );
}
