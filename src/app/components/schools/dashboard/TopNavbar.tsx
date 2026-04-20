import { Bell, Search, ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TopNavbarProps {
  pageTitle: string;
  userName: string;
  userRole: string;
  showSchoolSwitcher?: boolean;
}

export function TopNavbar({ pageTitle, userName, userRole, showSchoolSwitcher = false }: TopNavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("SMA Negeri 1");

  const schools = [
    "SMA Negeri 1",
    "SMA Negeri 2",
    "SMA Negeri 3",
    "SMK Negeri 1",
  ];

  return (
    <div className="h-[70px] bg-white border-b border-[#E5E5E5] fixed top-0 right-0 left-0 lg:left-[260px] z-30 flex items-center justify-between px-4 md:px-8">
      {/* Page Title */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <h1 className="text-lg md:text-2xl font-bold text-black truncate">{pageTitle}</h1>

        {/* School Switcher - For Multi-School Admin */}
        {showSchoolSwitcher && (
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F5] rounded-lg hover:bg-[#E5E5E5] transition"
            >
              <Building2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-800">{selectedSchool}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition ${showSchoolDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* School Dropdown */}
            <AnimatePresence>
              {showSchoolDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E5E5] overflow-hidden"
                >
                  <div className="p-2">
                    {schools.map((school) => (
                      <button
                        key={school}
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowSchoolDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm rounded-lg transition ${
                          selectedSchool === school
                            ? "bg-black text-white font-semibold"
                            : "hover:bg-[#F5F5F5]"
                        }`}
                      >
                        {school}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Search Button - Mobile only */}
        <button className="md:hidden p-2 hover:bg-[#F5F5F5] rounded-lg transition">
          <Search className="w-5 h-5 text-gray-700" />
        </button>

        {/* Notification */}
        <button className="relative p-2 hover:bg-[#F5F5F5] rounded-lg transition">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 hover:bg-[#F5F5F5] rounded-lg transition"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-black">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition hidden md:block ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5E5E5] overflow-hidden"
              >
                <div className="p-2 md:hidden border-b border-[#E5E5E5]">
                  <p className="px-2 py-1 text-sm font-semibold text-black">{userName}</p>
                  <p className="px-2 text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#F5F5F5] transition">
                  Profil
                </button>
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-[#F5F5F5] transition">
                  Pengaturan
                </button>
                <div className="border-t border-[#E5E5E5]"></div>
                <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition">
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
