import { useState } from "react";
import { motion } from "motion/react";
import { Save, User, Mail, Shield } from "lucide-react";

export function ProfilePage({
  userName,
  userEmail,
  userRole,
  onProfileUpdate,
}) {
  const [profileName, setProfileName] = useState(userName);
  const [profileEmail, setProfileEmail] = useState(userEmail);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!profileName.trim() || !profileEmail.trim()) {
      setError("Nama dan email wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      onProfileUpdate?.(profileName.trim(), profileEmail.trim());
      setMessage("Profil berhasil diperbarui.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827] mb-1">
          Profil Pengguna
        </h2>
        <p className="text-sm text-[#6B7280]">Kelola informasi profil Anda</p>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm"
        >
          {message}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#111827]">{profileName}</h3>
            <p className="text-sm text-[#6B7280] capitalize">{userRole}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1 flex items-center gap-2">
              <User className="w-4 h-4" /> Nama Lengkap
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              placeholder="email@school.id"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Role
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-[#DCE7F8] bg-gray-50 text-sm text-gray-500"
              value={userRole}
              disabled
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:opacity-95 transition"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
