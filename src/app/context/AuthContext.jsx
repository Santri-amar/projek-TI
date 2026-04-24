import { createContext, useContext, useState } from "react";

// 2. Buat papan pengumumannya (masih kosong)
const AuthContext = createContext(null);

// 3. Buat "penjaga papan" yang tugasnya update isi papan
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  function login(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  function updateUser(payload) {
    setUser((prev) => {
      if (!prev) return prev;
      const nextUser = { ...prev, ...payload };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, updateUser, logout, isLoggedIn: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 4. Cara mudah untuk "baca papan pengumuman"
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return context;
}
