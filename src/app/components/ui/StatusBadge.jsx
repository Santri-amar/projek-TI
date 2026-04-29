import { motion } from "motion/react";

const statusConfig = {
  aktif: { bg: "bg-green-100", text: "text-green-700", label: "Aktif" },
  nonaktif: { bg: "bg-gray-100", text: "text-gray-600", label: "Nonaktif" },
  hadir: { bg: "bg-green-100", text: "text-green-700", label: "Hadir" },
  izin: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Izin" },
  sakit: { bg: "bg-orange-100", text: "text-orange-700", label: "Sakit" },
  alfa: { bg: "bg-red-100", text: "text-red-700", label: "Alfa" },
  published: { bg: "bg-blue-100", text: "text-blue-700", label: "Published" },
  draft: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  low: { bg: "bg-gray-100", text: "text-gray-600", label: "Low" },
  normal: { bg: "bg-blue-100", text: "text-blue-700", label: "Normal" },
  high: { bg: "bg-orange-100", text: "text-orange-700", label: "High" },
  urgent: { bg: "bg-red-100", text: "text-red-700", label: "Urgent" },
  teori: { bg: "bg-blue-100", text: "text-blue-700", label: "Teori" },
  praktikum: { bg: "bg-purple-100", text: "text-purple-700", label: "Praktikum" },
  tugas: { bg: "bg-blue-100", text: "text-blue-700", label: "Tugas" },
  uts: { bg: "bg-yellow-100", text: "text-yellow-700", label: "UTS" },
  uas: { bg: "bg-orange-100", text: "text-orange-700", label: "UAS" },
  praktik: { bg: "bg-purple-100", text: "text-purple-700", label: "Praktik" },
  true: { bg: "bg-green-100", text: "text-green-700", label: "Ya" },
  false: { bg: "bg-gray-100", text: "text-gray-600", label: "Tidak" },
};

export function StatusBadge({ status, customLabel, activeLabel, inactiveLabel }) {
  const key = String(status).toLowerCase();
  const config = statusConfig[key] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: customLabel || status,
  };

  let label = customLabel || config.label;
  if (activeLabel && (key === "aktif" || key === "true" || status === true)) {
    label = activeLabel;
  }
  if (inactiveLabel && (key === "nonaktif" || key === "false" || status === false)) {
    label = inactiveLabel;
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {label}
    </motion.span>
  );
}

