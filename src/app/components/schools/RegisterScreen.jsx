import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "./Logo";
import "./AuthScreens.css";
import { registerUser } from "../../services/authService";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    birthDate: "",
    phone: "",
    gender: "laki-laki",
    role: "siswa",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.username.trim()) return setErrorMsg("Username wajib diisi.");
    if (!isEmail(formData.email)) return setErrorMsg("Format email tidak valid (contoh: nama@gmail.com).");
    if (!formData.birthDate) return setErrorMsg("Tanggal lahir wajib diisi.");
    if (!formData.phone.trim()) return setErrorMsg("Nomor handphone wajib diisi.");
    if (formData.password.length < 6) return setErrorMsg("Password minimal 6 karakter.");
    if (formData.password !== formData.confirmPassword) return setErrorMsg("Password dan confirm password harus sama.");

    setIsLoading(true);
    try {
      await registerUser(formData);
      setSuccessMsg("Registrasi berhasil. Mengarahkan ke login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setErrorMsg(error.message || "Registrasi gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      className="auth-page auth-register"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mesh mesh-1" />
      <div className="mesh mesh-2" />
      <div className="mesh mesh-3" />

      <motion.div
        className="auth-card glass"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <aside className="auth-left">
          <div className="glow-orb" />
          <div className="auth-logo-wrap">
            <Logo />
          </div>

          <div className="auth-left-text">
            <h3 className="left-title">Create New Account</h3>
            <p className="left-sub">Daftar sekali, akses sistem kapan saja.</p>
          </div>

          <button type="button" className="auth-login-btn-link" onClick={() => navigate("/login")}>
            <ArrowLeft size={14} /> Sudah punya akun? Log In
          </button>
        </aside>

        <div className="auth-right">
          <h1 className="auth-title">Register</h1>
          <p className="auth-subtitle">Lengkapi data untuk membuat akun baru.</p>

          <motion.form
            className="auth-form"
            onSubmit={handleSubmit}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            <motion.div className="auth-group" variants={item}>
              <label className="auth-label" htmlFor="register-username">Username</label>
              <input id="register-username" className="auth-input" type="text" name="username" value={formData.username} onChange={handleChange} required />
            </motion.div>

            <motion.div className="auth-group" variants={item}>
              <label className="auth-label" htmlFor="register-email">Email</label>
              <input id="register-email" className="auth-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </motion.div>

            <motion.div className="auth-row" variants={item}>
              <div className="auth-group">
                <label className="auth-label" htmlFor="register-birth-date">Tanggal lahir</label>
                <input id="register-birth-date" className="auth-input" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
              </div>
              <div className="auth-group">
                <label className="auth-label" htmlFor="register-phone">Nomor Handphone</label>
                <input id="register-phone" className="auth-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </motion.div>

            <motion.div className="auth-group" variants={item}>
              <p className="auth-label">Kelamin</p>
              <div className="auth-radio-row">
                <label className="auth-radio"><input type="radio" name="gender" value="laki-laki" checked={formData.gender === "laki-laki"} onChange={handleChange} />Laki-laki</label>
                <label className="auth-radio"><input type="radio" name="gender" value="perempuan" checked={formData.gender === "perempuan"} onChange={handleChange} />Perempuan</label>
              </div>
            </motion.div>

            <motion.div className="auth-group" variants={item}>
              <p className="auth-label">Role</p>
              <div className="auth-radio-row">
                <label className="auth-radio"><input type="radio" name="role" value="siswa" checked={formData.role === "siswa"} onChange={handleChange} />Siswa</label>
                <label className="auth-radio"><input type="radio" name="role" value="guru" checked={formData.role === "guru"} onChange={handleChange} />Guru</label>
                <label className="auth-radio"><input type="radio" name="role" value="admin" checked={formData.role === "admin"} onChange={handleChange} />Admin</label>
              </div>
            </motion.div>

            <motion.div className="auth-row" variants={item}>
              <div className="auth-group">
                <label className="auth-label" htmlFor="register-password">Password</label>
                <div className="auth-password-wrap">
                  <input id="register-password" className="auth-input auth-input--password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
                  <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((prev) => !prev)} tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="auth-group">
                <label className="auth-label" htmlFor="register-confirm-password">Confirm Password</label>
                <div className="auth-password-wrap">
                  <input id="register-confirm-password" className="auth-input auth-input--password" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                  <button type="button" className="auth-password-toggle" onClick={() => setShowConfirmPassword((prev) => !prev)} tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>

            {errorMsg && <motion.p className="auth-error" variants={item}>{errorMsg}</motion.p>}
            {successMsg && <motion.p className="auth-success" variants={item}><UserPlus size={14} /> {successMsg}</motion.p>}

            <motion.button
              className="auth-submit shine"
              type="submit"
              disabled={isLoading}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              variants={item}
            >
              {isLoading ? "Memproses..." : "Register"}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </motion.section>
  );
}