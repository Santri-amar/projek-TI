import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { DUMMY_ABSENSI } from "./dummyData";

export async function getAbsensiList() {
  try {
    const response = await apiClient.get("/api/absensi");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for attendance");
    return DUMMY_ABSENSI;
  }
}

export async function createAbsensi(payload) {
  try {
    const response = await apiClient.post("/api/absensi", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload, time: new Date().toLocaleTimeString() };
  }
}

export async function updateAbsensi(id, payload) {
  try {
    const response = await apiClient.put(`/api/absensi/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteAbsensi(id) {
  try {
    const response = await apiClient.delete(`/api/absensi/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
