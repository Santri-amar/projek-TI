import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { UserData } from "../services/authService";

// 1. Bentuk data yang ada di "papan pengumuman"
interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (token: string, user: UserData) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

// 2. Buat papan pengumumannya (masih kosong)
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Buat "penjaga papan" yang tugasnya update isi papan
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  function login(token: string, user: UserData) {
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
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
