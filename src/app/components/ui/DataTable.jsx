import { motion } from "motion/react";
import { Pencil, Trash2, Loader2, Inbox } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function DataTable({
  columns,
  data,
  isLoading,
  emptyMessage = "Belum ada data untuk ditampilkan.",
  onEdit,
  onDelete,
  keyExtractor = (item, idx) => item.id ?? item.uuid ?? idx,
}) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4DA3FF] animate-spin mb-3" />
        <p className="text-sm text-[#6B7280]">Memuat data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#EEF4FF] rounded-full flex items-center justify-center mb-3">
          <Inbox className="w-8 h-8 text-[#4DA3FF]" />
        </div>
        <p className="text-sm text-[#6B7280] text-center">{emptyMessage}</p>
      </div>
    );
  }

  const hasActions = onEdit || onDelete;

  return (
    <div className="bg-white border border-[#E3EAF5] rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EEF4FF] border-b border-[#DCE7F8]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-left font-semibold text-[#374151] ${col.className || ""}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-5 py-3.5 text-right font-semibold text-[#374151] w-32">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={keyExtractor(item, index)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 ${col.className || ""}`}>
                    {col.render ? (
                      col.render(item)
                    ) : (
                      <span className="text-[#111827]">
                        {col.accessor ? col.accessor(item) : item[col.key]}
                      </span>
                    )}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 bg-[#EEF4FF] hover:bg-[#4DA3FF] text-[#4DA3FF] hover:text-white rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#F3F4F6]">
        {data.map((item, index) => (
          <motion.div
            key={keyExtractor(item, index)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="p-4"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-start py-1.5">
                <span className="text-xs text-[#6B7280] font-medium">{col.header}</span>
                <span className="text-sm text-[#111827] text-right max-w-[60%]">
                  {col.render ? (
                    col.render(item)
                  ) : (
                    col.accessor ? col.accessor(item) : item[col.key]
                  )}
                </span>
              </div>
            ))}
            {hasActions && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#EEF4FF] text-[#4DA3FF] rounded-lg text-xs font-semibold"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export { StatusBadge };

