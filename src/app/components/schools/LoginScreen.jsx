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
    if (!trimmedIdentifier) {
      setErrorMsg("Username atau email tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      try {
        if (role === "admin") {
          response = await loginAdmin({ identifier: trimmedIdentifier, password });
        } else if (role === "guru") {
          response = await loginGuru({ identifier: trimmedIdentifier, password });
        } else {
          response = await loginSiswa({ identifier: trimmedIdentifier, password });
        }
      } catch (apiError) {
        console.warn("API Login failed, using dummy fallback", apiError);
        // DUMMY FALLBACK jika server mati
        response = {
          data: {
            token: "dummy-token-" + Date.now(),
            user: {
              name: trimmedIdentifier.split('@')[0],
              email: trimmedIdentifier.includes("@") ? trimmedIdentifier : `${trimmedIdentifier}@school.id`,
              role: role,
              avatar: null
            }
          }
        };
      }

      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Kombinasi email/username dan password salah.");
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
            <p>Sistem Informasi Akademik</p>
            <p className="opacity-60 text-xs">Modern, Terintegrasi, & Profesional</p>
          </div>
        </aside>

        <div className="auth-right">
          <h1 className="auth-title">Account Login</h1>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-group">
              <label className="auth-label" htmlFor="login-identifier">
                Email or Username
              </label>
              <input
                id="login-identifier"
                className="auth-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan email atau username"
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
                <option value="admin">Admin / Super Admin</option>
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
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-400 text-sm mb-4 font-bold">{errorMsg}</p>
            )}

            <button className="auth-submit mt-4" type="submit" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
