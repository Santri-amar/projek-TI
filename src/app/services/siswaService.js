import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { dummyStudents } from "../data/dummyData";

export async function getSiswaList() {
  try {
    const response = await apiClient.get("/api/siswa");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for students");
    return dummyStudents;
  }
}

export async function getSiswaById(id) {
  try {
    const response = await apiClient.get(`/api/siswa/${id}`);
    return response.data;
  } catch (error) {
    return dummyStudents.find(s => s.id === Number(id));
  }
}

export async function createSiswa(payload) {
  try {
    const response = await apiClient.post("/api/siswa", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload };
  }
}

export async function updateSiswa(id, payload) {
  try {
    const response = await apiClient.put(`/api/siswa/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteSiswa(id) {
  try {
    const response = await apiClient.delete(`/api/siswa/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
