import { motion } from "motion/react";
import { Plus, Search } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onAddClick,
  addButtonLabel = "Tambah Baru",
  showAdd = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E3EAF5] rounded-2xl p-5 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#6B7280] mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EEF4FF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 border border-[#DCE7F8]"
            />
          </div>

          {/* Add Button */}
          {showAdd && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold shadow-md hover:opacity-95 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{addButtonLabel}</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
