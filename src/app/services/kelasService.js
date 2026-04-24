import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getKelasList() {
  const response = await apiClient.get("/api/kelas");
  return extractList(response.data);
}

export async function createKelas(payload) {
  const response = await apiClient.post("/api/kelas", payload);
  return response.data;
}

export async function updateKelas(id, payload) {
  const response = await apiClient.put(`/api/kelas/${id}`, payload);
  return response.data;
}

export async function deleteKelas(id) {
  const response = await apiClient.delete(`/api/kelas/${id}`);
  return response.data;
}
