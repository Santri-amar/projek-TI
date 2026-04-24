import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getSiswaList() {
  const response = await apiClient.get("/api/siswa");
  return extractList(response.data);
}

export async function createSiswa(payload) {
  const response = await apiClient.post("/api/siswa", payload);
  return response.data;
}

export async function updateSiswa(id, payload) {
  const response = await apiClient.put(`/api/siswa/${id}`, payload);
  return response.data;
}

export async function deleteSiswa(id) {
  const response = await apiClient.delete(`/api/siswa/${id}`);
  return response.data;
}
