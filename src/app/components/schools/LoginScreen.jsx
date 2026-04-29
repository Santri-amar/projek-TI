import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "./Logo";
import "./AuthScreens.css";
import { loginAdmin, loginGuru, loginSiswa } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier)
      return setErrorMsg("Username atau email tidak boleh kosong.");
    if (!password) return setErrorMsg("Password wajib diisi.");
    if (role === "admin" && !isEmail(trimmedIdentifier)) {
      return setErrorMsg("Admin wajib login menggunakan email valid.");
    }

    setIsLoading(true);
    try {
      let response;
      if (role === "admin")
        response = await loginAdmin({
          identifier: trimmedIdentifier,
          password,
        });
      else if (role === "guru")
        response = await loginGuru({ identifier: trimmedIdentifier, password });
      else
        response = await loginSiswa({
          identifier: trimmedIdentifier,
          password,
        });

      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.message || "Login gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      className="auth-page auth-login"
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
            <h3 className="left-title">Sistem Informasi Akademik</h3>
            <p className="left-sub">Modern, Terintegrasi, & Profesional</p>
          </div>

          <div className="chip-row">
            <span className="chip">
              <ShieldCheck size={14} /> Aman
            </span>
            <span className="chip">
              <Sparkles size={14} /> Interaktif
            </span>
          </div>

          <button
            type="button"
            className="auth-login-btn-link"
            onClick={() => navigate("/register")}
          >
            Belum punya akun? Register <ArrowRight size={14} />
          </button>
        </aside>

        <div className="auth-right">
          <h1 className="auth-title">Account Login</h1>
          <p className="auth-subtitle">
            Masuk sesuai role untuk mengakses dashboard.
          </p>

          <motion.form
            className="auth-form"
            onSubmit={handleLogin}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <motion.div className="auth-group" variants={item}>
              <label className="auth-label" htmlFor="login-identifier">
                Email or Username
              </label>
              <input
                id="login-identifier"
                className="auth-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  role === "admin"
                    ? "Masukkan email admin"
                    : "Masukkan email atau username"
                }
                required
              />
            </motion.div>

            <motion.div className="auth-group" variants={item}>
              <label className="auth-label" htmlFor="login-role">
                Login Sebagai
              </label>
              <select
                id="login-role"
                className="auth-input auth-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
              </select>
            </motion.div>

            <motion.div className="auth-group" variants={item}>
              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-password-wrap">
                <input
                  id="login-password"
                  className="auth-input auth-input--password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            {errorMsg && (
              <motion.p className="auth-error" variants={item}>
                {errorMsg}
              </motion.p>
            )}

            <motion.button
              className="auth-submit shine"
              type="submit"
              disabled={isLoading}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              variants={item}
            >
              {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </motion.section>
  );
}
