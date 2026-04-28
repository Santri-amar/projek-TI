import { apiClient } from "./apiClient";

// Fungsi login utama yang fleksibel
async function performLogin(role, identifier, password) {
  const loginEndpoints = {
    admin: "/api/login/admin",
    guru: "/api/login/guru",
    siswa: "/api/login/siswa",
    superadmin: "/api/login/superadmin"
  };

  const endpoint = loginEndpoints[role] || "/api/login/admin";

  try {
    const response = await apiClient.post(endpoint, {
      email: identifier, // Identifier bisa berisi email atau username
      password: password
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response; // Mengembalikan objek utuh (Axios response)
  } catch (error) {
    console.error(`Login ${role} failed:`, error.response?.data || error.message);
    throw error;
  }
}

export const loginAdmin = (creds) => performLogin("admin", creds.identifier, creds.password);
export const loginGuru = (creds) => performLogin("guru", creds.identifier, creds.password);
export const loginSiswa = (creds) => performLogin("siswa", creds.identifier, creds.password);

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
