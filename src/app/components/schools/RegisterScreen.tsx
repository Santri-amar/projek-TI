import { useState } from "react";
import { useNavigate } from "react-router";
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan confirm password harus sama.");
      return;
    }

    // TODO: Integrasi API register
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
                <input
                  id="register-password"
                  className="auth-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-group">
                <label className="auth-label" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                <input
                  id="register-confirm-password"
                  className="auth-input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
