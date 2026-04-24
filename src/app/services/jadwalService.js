import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getJadwalList() {
  const response = await apiClient.get("/api/jadwal");
  return extractList(response.data);
}

export async function createJadwal(payload) {
  const response = await apiClient.post("/api/jadwal", payload);
  return response.data;
}

export async function updateJadwal(id, payload) {
  const response = await apiClient.put(`/api/jadwal/${id}`, payload);
  return response.data;
}

export async function deleteJadwal(id) {
  const response = await apiClient.delete(`/api/jadwal/${id}`);
  return response.data;
}
