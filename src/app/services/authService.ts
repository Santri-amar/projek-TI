// src/app/services/authService.ts

const AUTH_URL = "https://school.petik.or.id/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: "admin" | "guru" | "siswa";
  isActive: boolean;
}

export interface LoginResponse {
  msg: string;
  data: {
    token: string;
    user: UserData;
  };
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_URL}/auth/login-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Email atau password salah");
  }

  return response.json();
}

// Login Guru
export async function loginGuru(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_URL}/auth/login-guru`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login gagal");
  }

  return response.json();
}

// Login Siswa
export async function loginSiswa(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_URL}/auth/login-siswa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login gagal");
  }

  return response.json();
}

// Fungsi untuk mendapatkan data dashboard admin
export async function getDashboardAdmin(): Promise<{ msg: string; data: any }> {
  const response = await fetch(`${AUTH_URL}/dashboard/dashboard-admin`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendapatkan data dashboard admin");
  }

  return response.json();
}

// Fungsi untuk mendapatkan data guru
export async function getGuru(): Promise<{ msg: string; data: UserData[] }> {
  const response = await fetch(`${AUTH_URL}/guru`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendapatkan data guru");
  }

  return response.json();
}

// Fungsi untuk mendapatkan data siswa
export async function getSiswa(): Promise<{ msg: string; data: UserData[] }> {
  const response = await fetch(`${AUTH_URL}/siswa`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendapatkan data siswa");
  }

  return response.json();
}

// Fungsi untuk mendapatkan data kelas
export async function getKelas(): Promise<{ msg: string; data: any[] }> {
  const response = await fetch(`${AUTH_URL}/kelas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendapatkan data kelas");
  }

  return response.json();
}

// Fungsi untuk mendapatkan data absensi
export async function getAbsensi(): Promise<{ msg: string; data: any }> {
  const response = await fetch(`${AUTH_URL}/absensi`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendapatkan data absensi");
  }

  return response.json();
}