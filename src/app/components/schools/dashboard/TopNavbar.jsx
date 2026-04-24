import { Bell, Search, ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function TopNavbar({
  pageTitle,
  userName,
  userRole,
  searchQuery,
  showSchoolSwitcher = false,
  onSearchQueryChange,
  onMenuClick,
  onLogout,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("SMA Negeri 1");

  const schools = [
    "SMA Negeri 1",
    "SMA Negeri 2",
    "SMA Negeri 3",
    "SMK Negeri 1",
  ];

  return (
    <div className="h-[70px] bg-white border-b border-[#E3EAF5] fixed top-0 right-0 left-0 lg:left-[260px] z-30 flex items-center justify-between px-4 md:px-8">
      {/* Page Title */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <h1 className="text-lg md:text-2xl font-bold text-[#111827] truncate">
          {pageTitle}
        </h1>

        {/* School Switcher - For Multi-School Admin */}
        {showSchoolSwitcher && (
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-[#EEF4FF] rounded-lg hover:bg-[#E7F0FF] transition"
            >
              <Building2 className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm font-semibold text-[#1F2937]">
                {selectedSchool}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition ${showSchoolDropdown ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showSchoolDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E3EAF5] overflow-hidden"
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
                            ? "bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white font-semibold"
                            : "hover:bg-[#EEF4FF]"
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
        {showMobileSearch && (
          <div className="md:hidden absolute left-3 right-3 top-[76px] bg-white border border-[#E3EAF5] rounded-xl p-2 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#EEF4FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            </div>
          </div>
        )}

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-[#EEF4FF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
          />
        </div>

        {/* Search Button - Mobile only */}
        <button
          onClick={() => setShowMobileSearch((prev) => !prev)}
          className="md:hidden p-2 hover:bg-[#EEF4FF] rounded-lg transition"
        >
          <Search className="w-5 h-5 text-gray-700" />
        </button>

        {/* Notification */}
        <button className="relative p-2 hover:bg-[#EEF4FF] rounded-lg transition">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 hover:bg-[#EEF4FF] rounded-lg transition"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-[#111827]">{userName}</p>
              <p className="text-xs text-[#6B7280] capitalize">{userRole}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition hidden md:block ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E3EAF5] overflow-hidden"
              >
                <div className="p-2 md:hidden border-b border-[#E3EAF5]">
                  <p className="px-2 py-1 text-sm font-semibold text-[#111827]">
                    {userName}
                  </p>
                  <p className="px-2 text-xs text-[#6B7280] capitalize">
                    {userRole}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onMenuClick("profile");
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[#EEF4FF] transition"
                >
                  Profil
                </button>
                <button
                  onClick={() => {
                    onMenuClick("settings");
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[#EEF4FF] transition"
                >
                  Pengaturan
                </button>
                <div className="border-t border-[#E3EAF5]"></div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
                >
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
