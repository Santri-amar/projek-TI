import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getGuruList() {
  const response = await apiClient.get("/api/guru");
  return extractList(response.data);
}

export async function createGuru(payload) {
  const response = await apiClient.post("/api/guru", payload);
  return response.data;
}

export async function updateGuru(id, payload) {
  const response = await apiClient.put(`/api/guru/${id}`, payload);
  return response.data;
}

export async function deleteGuru(id) {
  const response = await apiClient.delete(`/api/guru/${id}`);
  return response.data;
}
