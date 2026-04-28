import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { DUMMY_JADWAL } from "./dummyData";

export async function getJadwalList() {
  try {
    const response = await apiClient.get("/api/jadwal");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for schedule");
    return DUMMY_JADWAL;
  }
}

export async function createJadwal(payload) {
  try {
    const response = await apiClient.post("/api/jadwal", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload };
  }
}

export async function updateJadwal(id, payload) {
  try {
    const response = await apiClient.put(`/api/jadwal/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteJadwal(id) {
  try {
    const response = await apiClient.delete(`/api/jadwal/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
