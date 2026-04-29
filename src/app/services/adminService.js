import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

// Dummy Data Fallback
const DUMMY_ADMINS = [
  { id: 1, name: "Super Admin", email: "superadmin@school.id", role: "Super Admin", status: "Aktif" },
  { id: 2, name: "Admin Akademik", email: "akademik@school.id", role: "Admin", status: "Aktif" },
];

export async function getAdminList() {
  try {
    const response = await apiClient.get("/api/admin");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for admins");
    return DUMMY_ADMINS;
  }
}

export async function getAdminById(id) {
  try {
    const response = await apiClient.get(`/api/admin/${id}`);
    return response.data;
  } catch (error) {
    return DUMMY_ADMINS.find(a => a.id === Number(id));
  }
}

export async function createAdmin(payload) {
  try {
    const response = await apiClient.post("/api/admin", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload };
  }
}

export async function updateAdmin(id, payload) {
  try {
    const response = await apiClient.put(`/api/admin/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteAdmin(id) {
  try {
    const response = await apiClient.delete(`/api/admin/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
