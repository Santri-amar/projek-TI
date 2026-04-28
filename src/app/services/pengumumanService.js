import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { DUMMY_PENGUMUMAN } from "./dummyData";

export async function getPengumumanList() {
  try {
    const response = await apiClient.get("/api/pengumuman");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for announcements");
    return DUMMY_PENGUMUMAN;
  }
}

export async function createPengumuman(payload) {
  try {
    const response = await apiClient.post("/api/pengumuman", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload, date: new Date().toISOString() };
  }
}

export async function updatePengumuman(id, payload) {
  try {
    const response = await apiClient.put(`/api/pengumuman/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deletePengumuman(id) {
  try {
    const response = await apiClient.delete(`/api/pengumuman/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
