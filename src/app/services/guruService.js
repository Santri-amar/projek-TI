import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { dummyTeachers } from "../data/dummyData";

export async function getGuruList() {
  try {
    const response = await apiClient.get("/api/guru");
    return extractList(response.data);
  } catch (error) {
    console.warn("API Error, using dummy data for teachers");
    return dummyTeachers;
  }
}

export async function getGuruById(id) {
  try {
    const response = await apiClient.get(`/api/guru/${id}`);
    return response.data;
  } catch (error) {
    return dummyTeachers.find(t => t.id === Number(id));
  }
}

export async function createGuru(payload) {
  try {
    const response = await apiClient.post("/api/guru", payload);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...payload };
  }
}

export async function updateGuru(id, payload) {
  try {
    const response = await apiClient.put(`/api/guru/${id}`, payload);
    return response.data;
  } catch (error) {
    return { id, ...payload };
  }
}

export async function deleteGuru(id) {
  try {
    const response = await apiClient.delete(`/api/guru/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
}
