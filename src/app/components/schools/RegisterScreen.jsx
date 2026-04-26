import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "./Logo";
import "./AuthScreens.css";

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

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan confirm password harus sama.");
      return;
    }
    navigate("/login");
  };

  return (
    <section className="auth-page auth-register">
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
            <p>Have an account?</p>
            <button
              type="button"
              className="auth-login-btn-link"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </aside>

        <div className="auth-right">
          <h1 className="auth-title">Register</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-group">
              <label className="auth-label" htmlFor="register-username">
                Username
              </label>
              <input
                id="register-username"
                className="auth-input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-group">
              <label className="auth-label" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                className="auth-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-row">
              <div className="auth-group">
                <label className="auth-label" htmlFor="register-birth-date">
                  Tanggal lahir
                </label>
                <input
                  id="register-birth-date"
                  className="auth-input"
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="auth-group">
                <label className="auth-label" htmlFor="register-phone">
                  Nomor Handphone
                </label>
                <input
                  id="register-phone"
                  className="auth-input"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-group">
              <p className="auth-label">Kelamin</p>
              <div className="auth-radio-row">
                <label className="auth-radio">
                  <input
                    type="radio"
                    name="gender"
                    value="laki-laki"
                    checked={formData.gender === "laki-laki"}
                    onChange={handleChange}
                  />
                  Laki-laki
                </label>
                <label className="auth-radio">
                  <input
                    type="radio"
                    name="gender"
                    value="perempuan"
                    checked={formData.gender === "perempuan"}
                    onChange={handleChange}
                  />
                  Perempuan
                </label>
              </div>
            </div>

            <div className="auth-group">
              <p className="auth-label">Role</p>
              <div className="auth-radio-row">
                <label className="auth-radio">
                  <input
                    type="radio"
                    name="role"
                    value="siswa"
                    checked={formData.role === "siswa"}
                    onChange={handleChange}
                  />
                  Siswa
                </label>
                <label className="auth-radio">
                  <input
                    type="radio"
                    name="role"
                    value="guru"
                    checked={formData.role === "guru"}
                    onChange={handleChange}
                  />
                  Guru
                </label>
                <label className="auth-radio">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleChange}
                  />
                  Admin
                </label>
              </div>
            </div>

            <div className="auth-row">
              <div className="auth-group">
                <label className="auth-label" htmlFor="register-password">
                  Password
                </label>
                <div className="auth-password-wrap">
                  <input
                    id="register-password"
                    className="auth-input auth-input--password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="auth-group">
                <label className="auth-label" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                <div className="auth-password-wrap">
                  <input
                    id="register-confirm-password"
                    className="auth-input auth-input--password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Konfirmasi password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button className="auth-submit" type="submit">
              Register
            </button>
          </form>

          <div className="auth-right-corner" />
          </div>
        </div>
      </section>
  );
}
