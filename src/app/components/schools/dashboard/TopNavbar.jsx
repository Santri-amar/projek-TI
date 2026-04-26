import { motion } from "motion/react";
import { Search, Bell, ChevronDown, School } from "lucide-react";
import "./Dashboard.css";

export function TopNavbar({
  pageTitle,
  userName,
  userRole,
  searchQuery,
  onSearchQueryChange,
  onLogout,
  onMenuClick,
}) {
  return (
    <header className="top-navbar px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
      {/* Left: Page Title & School Badge */}
      <div className="flex items-center gap-6">
        <h2 className="page-title">{pageTitle}</h2>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl cursor-pointer hover:bg-white transition-all group">
          <School className="w-4 h-4 text-[#4338ca]" />
          <span className="text-xs font-extrabold text-[#4338ca]">SMA Negeri 1</span>
          <ChevronDown className="w-3 h-3 text-[#4338ca] group-hover:rotate-180 transition-transform" />
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden lg:flex search-container">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 hover:bg-slate-50 rounded-xl relative transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#030213]">{userName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{userRole}</p>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${userName}&background=random&color=fff`}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            
            {/* Simple Dropdown on Hover/Click */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
               <button 
                onClick={() => onMenuClick("profile")}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
               >
                 Profil Saya
               </button>
               <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
               >
                 Logout
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
