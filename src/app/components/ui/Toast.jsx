import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

export function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: "bg-white border-green-100 shadow-green-100/50",
    error: "bg-white border-red-100 shadow-red-100/50",
    info: "bg-white border-blue-100 shadow-blue-100/50"
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] min-w-[320px]"
        >
          <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl ${bgColors[type]}`}>
            <div className="flex-shrink-0">
              {icons[type]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
