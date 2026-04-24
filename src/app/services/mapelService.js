import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getMapelList() {
  const response = await apiClient.get("/api/mapel");
  return extractList(response.data);
}

export async function createMapel(payload) {
  const response = await apiClient.post("/api/mapel", payload);
  return response.data;
}

export async function updateMapel(id, payload) {
  const response = await apiClient.put(`/api/mapel/${id}`, payload);
  return response.data;
}

export async function deleteMapel(id) {
  const response = await apiClient.delete(`/api/mapel/${id}`);
  return response.data;
}
