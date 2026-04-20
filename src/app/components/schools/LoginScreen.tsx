import { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "./Logo";
import "./AuthScreens.css";
import { loginAdmin, loginGuru, loginSiswa } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      let result;

      // Pilih fungsi login berdasarkan role
      if (role === "admin") {
        result = await loginAdmin({ email, password });
      } else if (role === "guru") {
        result = await loginGuru({ email, password });
      } else {
        result = await loginSiswa({ email, password });
      }

      login(result.data.token, result.data.user);
      navigate("/dashboard");
    } catch (error: unknown) {
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
              <label className="auth-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) =>
                  setRole(e.target.value as "admin" | "guru" | "siswa")
                }
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
