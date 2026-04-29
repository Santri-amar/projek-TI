import { apiClient } from "./apiClient";
import { extractList } from "./serviceUtils";
import { dummyStudents } from "../data/dummyData";
import { validateStudent, sanitizeObject } from './validationService';
import { logAudit } from './auditService';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = "students_data";

// Helper to get current user for audit logging
function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

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
  // Validation
  const validation = validateStudent(payload);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // Sanitize input
  const sanitizedData = sanitizeObject(payload);

  try {
    const response = await apiClient.post("/api/siswa", sanitizedData);
    
    // Audit log
    const currentUser = getCurrentUser();
    if (currentUser) {
      logAudit({
        action: 'CREATE',
        entity: 'STUDENT',
        userId: currentUser.id,
        userName: currentUser.username,
        userRole: currentUser.role,
        description: `Menambahkan siswa baru: ${sanitizedData.name}`,
        data: { studentId: response.data?.id, name: sanitizedData.name },
      });
    }
    
    return response.data;
  } catch (error) {
    // Fallback to localStorage
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newStudent = {
      id: Date.now(),
      ...sanitizedData,
      createdAt: new Date().toISOString(),
    };
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    
    // Audit log
    const currentUser = getCurrentUser();
    if (currentUser) {
      logAudit({
        action: 'CREATE',
        entity: 'STUDENT',
        userId: currentUser.id,
        userName: currentUser.username,
        userRole: currentUser.role,
        description: `Menambahkan siswa baru: ${sanitizedData.name}`,
        data: { studentId: newStudent.id, name: sanitizedData.name },
      });
    }
    
    return newStudent;
  }
}

export async function updateSiswa(id, payload) {
  // Validation
  const validation = validateStudent(payload);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // Sanitize input
  const sanitizedData = sanitizeObject(payload);

  try {
    const response = await apiClient.put(`/api/siswa/${id}`, sanitizedData);
    
    // Audit log
    const currentUser = getCurrentUser();
    if (currentUser) {
      logAudit({
        action: 'UPDATE',
        entity: 'STUDENT',
        userId: currentUser.id,
        userName: currentUser.username,
        userRole: currentUser.role,
        description: `Mengupdate data siswa: ${sanitizedData.name}`,
        data: { studentId: id, name: sanitizedData.name },
      });
    }
    
    return response.data;
  } catch (error) {
    // Fallback to localStorage
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = students.findIndex(s => s.id === Number(id) || s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...sanitizedData, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      
      // Audit log
      const currentUser = getCurrentUser();
      if (currentUser) {
        logAudit({
          action: 'UPDATE',
          entity: 'STUDENT',
          userId: currentUser.id,
          userName: currentUser.username,
          userRole: currentUser.role,
          description: `Mengupdate data siswa: ${sanitizedData.name}`,
          data: { studentId: id, name: sanitizedData.name },
        });
      }
      
      return students[index];
    }
    return { id, ...sanitizedData };
  }
}

export async function deleteSiswa(id) {
  try {
    const response = await apiClient.delete(`/api/siswa/${id}`);
    
    // Audit log
    const currentUser = getCurrentUser();
    if (currentUser) {
      logAudit({
        action: 'DELETE',
        entity: 'STUDENT',
        userId: currentUser.id,
        userName: currentUser.username,
        userRole: currentUser.role,
        description: `Menghapus siswa ID: ${id}`,
        data: { studentId: id },
      });
    }
    
    return response.data;
  } catch (error) {
    // Fallback to localStorage
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const student = students.find(s => s.id === Number(id) || s.id === id);
    const filtered = students.filter(s => s.id !== Number(id) && s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Audit log
    const currentUser = getCurrentUser();
    if (currentUser) {
      logAudit({
        action: 'DELETE',
        entity: 'STUDENT',
        userId: currentUser.id,
        userName: currentUser.username,
        userRole: currentUser.role,
        description: `Menghapus siswa: ${student?.name || id}`,
        data: { studentId: id },
      });
    }
    
    return { success: true };
  }
}