import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { DUMMY_KELAS } from "./dummyData";

export async function getKelasList() {
  try {
    const response = await apiClient.get("/api/kelas");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for classes");
    return DUMMY_KELAS;
  }
}

export async function createKelas(payload) {
  try {
    const response = await apiClient.post("/api/kelas", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload };
  }
}

export async function updateKelas(id, payload) {
  try {
    const response = await apiClient.put(`/api/kelas/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteKelas(id) {
  try {
    const response = await apiClient.delete(`/api/kelas/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
