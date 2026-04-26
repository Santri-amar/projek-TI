import { apiClient } from "./apiClient";

const loginEndpointByRole = {
  superadmin: "login/superadmin",
  admin: "login/admin",
  guru: "guru", // diubah agar sesuai backend
  siswa: "login/siswa",
};

function normalizeLoginResponse(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Format respons login tidak valid.");
  }

  const raw = payload;
  const msg = raw.msg || raw.message || "Login berhasil";

  const data = raw.data;
  const token = data?.token;
  const user = data?.user;

  if (!token || !user) {
    throw new Error("Token atau data user tidak ditemukan di respons login.");
  }

  return {
    msg,
    data: {
      token,
      user,
    },
  };
}

export async function loginByRole(role, payload) {
  const endpoint = loginEndpointByRole[role];
  const rawIdentifier = payload.identifier.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawIdentifier);
  const base = { password: payload.password };

  const candidatePayloads = isEmail
    ? [
        { ...base, email: rawIdentifier },
        { ...base, username: rawIdentifier },
        { ...base, name: rawIdentifier },
      ]
    : [
        { ...base, username: rawIdentifier },
        { ...base, name: rawIdentifier },
        { ...base, email: rawIdentifier },
      ];

  let lastError = null;

  for (const requestPayload of candidatePayloads) {
    try {
      const response = await apiClient.post(endpoint, requestPayload);
      return normalizeLoginResponse(response.data);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Login gagal.");
    }
  }

  throw lastError ?? new Error("Login gagal.");
}

export async function loginAdmin(payload) {
  const endpoint = loginEndpointByRole["admin"];
  const rawIdentifier = payload.identifier.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawIdentifier);

  if (!isEmail) {
    throw new Error("Admin hanya dapat login menggunakan email.");
  }

  const requestPayload = {
    email: rawIdentifier,
    password: payload.password,
  };

  const response = await apiClient.post(endpoint, requestPayload);
  return normalizeLoginResponse(response.data);
}

export async function loginGuru(payload) {
  return loginByRole("guru", payload);
}

export async function loginSiswa(payload) {
  return loginByRole("siswa", payload);
}

export async function loginSuperadmin(payload) {
  return loginByRole("superadmin", payload);
}
