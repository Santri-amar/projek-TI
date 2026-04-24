import { useState } from "react";
import { useNavigate } from "react-router";
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedIdentifier = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier);

    if (role === "admin" && !isEmail) {
      setErrorMsg("Admin hanya dapat login menggunakan email.");
      return;
    }

    if (
      role !== "admin" &&
      isEmail &&
      !trimmedIdentifier.endsWith("@school.id")
    ) {
      setErrorMsg("Email harus menggunakan domain @school.id");
      return;
    }

    setIsLoading(true);

    try {
      let result;

      // Pilih fungsi login berdasarkan role
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
            <p>Dont have an account?</p>
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
                {role === "admin" ? "Email" : "Email / Username"}
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
              <input
                id="login-password"
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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

          <div className="auth-right-corner" />
        </div>
      </div>
    </section>
  );
}
