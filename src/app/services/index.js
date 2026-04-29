// Services Index - Export all services for easy import
// BNSP SIM-SEKOLAH Services

// Auth Services
export { loginAdmin, loginGuru, loginSiswa, registerUser, logout, getCurrentUser } from './authService';

// Student Services
export { getSiswaList, getSiswaById, createSiswa, updateSiswa, deleteSiswa } from './siswaService';

// Teacher Services
export { getGuruList, getGuruById, createGuru, updateGuru, deleteGuru } from './guruService';

// Class Services
export { getKelasList, createKelas, updateKelas, deleteKelas } from './kelasService';

// Subject Services
export { getMapelList, createMapel, updateMapel, deleteMapel } from './mapelService';

// Grade Services
export { getNilaiList, createNilai, updateNilai, deleteNilai } from './nilaiService';

// Attendance Services
export { getAbsensiList, createAbsensi, updateAbsensi, deleteAbsensi } from './absensiService';

// Announcement Services
export { getPengumumanList, createPengumuman, updatePengumuman, deletePengumuman } from './pengumumanService';

// Security Services
export { 
  hashPassword, 
  verifyPassword, 
  sanitizeInput, 
  validateEmail, 
  validatePhone,
  generateToken,
  encryptData,
  decryptData,
  checkRateLimit,
  clearRateLimit,
} from './securityService';

// Validation Services
export {
  validateStudent,
  validateTeacher,
  validateClass,
  validateSubject,
  validateGrade,
  validateAttendance,
  validateAnnouncement,
  validateRegistration,
  sanitizeObject,
} from './validationService';

// Audit Services
export {
  logAudit,
  getAuditLogs,
  getAuditLogsByEntity,
  clearAuditLogs,
  exportAuditLogs,
  getAuditStats,
} from './auditService';

// Export Services
export {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  printReport,
  exportStudents,
  exportTeachers,
  exportGrades,
  exportAttendance,
} from './exportService';

// Analytics Services
export {
  getAdminAnalytics,
  getTeacherAnalytics,
  getStudentAnalytics,
  generateReport,
  getChartData,
} from './analyticsService';

// File Upload Services
export {
  uploadFile,
  uploadAvatar,
  uploadDocument,
  uploadCertificate,
  getUploadedFiles,
  getFileById,
  deleteFile,
  clearUploadedFiles,
  formatFileSize,
  getFileIcon,
} from './fileUploadService';