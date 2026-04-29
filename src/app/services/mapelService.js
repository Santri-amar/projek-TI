import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { DUMMY_MAPEL } from "./dummyData";

export async function getMapelList() {
  try {
    const response = await apiClient.get("/api/mapel");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for subjects");
    return DUMMY_MAPEL;
  }
}

export async function createMapel(payload) {
  try {
    const response = await apiClient.post("/api/mapel", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload };
  }
}

export async function updateMapel(id, payload) {
  try {
    const response = await apiClient.put(`/api/mapel/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteMapel(id) {
  try {
    const response = await apiClient.delete(`/api/mapel/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
