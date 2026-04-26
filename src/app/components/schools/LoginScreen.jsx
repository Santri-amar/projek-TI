import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "./Logo";
import "./AuthScreens.css";
import { loginAdmin, loginGuru, loginSiswa } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedIdentifier = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier);
    if (role === "admin" && !isEmail) {
      setErrorMsg("Admin hanya dapat login menggunakan email.");
      return;
    }

    if (role === "guru" && isEmail) {
      setErrorMsg("Guru hanya dapat login menggunakan username.");
      return;
    }

    if (role === "siswa" && isEmail) {
      setErrorMsg("Siswa hanya dapat login menggunakan username.");
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (role === "admin") {
        result = await loginAdmin({ identifier, password });
      } else if (role === "guru") {
        result = await loginGuru({ identifier, password });
      } else {
        result = await loginSiswa({ identifier, password });
      }

      login(result.data.token, result.data.user);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Terjadi kesalahan, coba lagi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page auth-login">
      <div className="auth-bg-ring auth-bg-ring--outline auth-bg-ring--top-small" />
      <div className="auth-bg-ring auth-bg-ring--filled auth-bg-ring--top-big" />
      <div className="auth-bg-ring auth-bg-ring--outline auth-bg-ring--right-mid" />
      <div className="auth-bg-ring auth-bg-ring--outline auth-bg-ring--left-mid" />
      <div className="auth-bg-ring auth-bg-ring--filled auth-bg-ring--left-bottom" />

      <div className="auth-card">
        <aside className="auth-left">
          <div className="auth-logo-wrap">
            <Logo />
          </div>
          <div className="auth-left-text">
            <p>Don't have an account?</p>
            <button
              type="button"
              className="auth-left-link"
              onClick={() => navigate("/register")}
            >
              Get started!
            </button>
          </div>
        </aside>

        <div className="auth-right">
          <h1 className="auth-title">Account Login</h1>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-group">
              <label className="auth-label" htmlFor="login-identifier">
                {role === "admin" ? "Email" : "Username"}
              </label>
              <input
                id="login-identifier"
                className="auth-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "admin" ? "Masukkan email admin" : "Masukkan username"}
                required
              />
            </div>

            <div className="auth-group">
              <label className="auth-label" htmlFor="login-role">
                Login Sebagai
              </label>
              <select
                id="login-role"
                className="auth-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
              </select>
            </div>

            <div className="auth-group">
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
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="auth-check" htmlFor="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            {errorMsg && (
              <p className="text-red-400 text-sm mb-2">{errorMsg}</p>
            )}

            <button className="auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Memuat..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
