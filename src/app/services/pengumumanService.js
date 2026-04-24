import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getPengumumanList() {
  const response = await apiClient.get("/api/pengumuman");
  return extractList(response.data);
}

export async function createPengumuman(payload) {
  const response = await apiClient.post("/api/pengumuman", payload);
  return response.data;
}

export async function updatePengumuman(id, payload) {
  const response = await apiClient.put(`/api/pengumuman/${id}`, payload);
  return response.data;
}

export async function deletePengumuman(id) {
  const response = await apiClient.delete(`/api/pengumuman/${id}`);
  return response.data;
}
