import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getAbsensiList() {
  const response = await apiClient.get("/api/absensi");
  return extractList(response.data);
}

export async function createAbsensi(payload) {
  const response = await apiClient.post("/api/absensi", payload);
  return response.data;
}

export async function updateAbsensi(id, payload) {
  const response = await apiClient.put(`/api/absensi/${id}`, payload);
  return response.data;
}

export async function deleteAbsensi(id) {
  const response = await apiClient.delete(`/api/absensi/${id}`);
  return response.data;
}
