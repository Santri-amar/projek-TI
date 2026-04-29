import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { DUMMY_NILAI } from "./dummyData";

export async function getNilaiList() {
  try {
    const response = await apiClient.get("/api/nilai");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for grades");
    return DUMMY_NILAI;
  }
}

export async function createNilai(payload) {
  try {
    const response = await apiClient.post("/api/nilai", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload };
  }
}

export async function updateNilai(id, payload) {
  try {
    const response = await apiClient.put(`/api/nilai/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteNilai(id) {
  try {
    const response = await apiClient.delete(`/api/nilai/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
