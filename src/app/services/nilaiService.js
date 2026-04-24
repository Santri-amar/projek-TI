import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";

export async function getNilaiList() {
  const response = await apiClient.get("/api/nilai");
  return extractList(response.data);
}

export async function createNilai(payload) {
  const response = await apiClient.post("/api/nilai", payload);
  return response.data;
}

export async function updateNilai(id, payload) {
  const response = await apiClient.put(`/api/nilai/${id}`, payload);
  return response.data;
}

export async function deleteNilai(id) {
  const response = await apiClient.delete(`/api/nilai/${id}`);
  return response.data;
}
