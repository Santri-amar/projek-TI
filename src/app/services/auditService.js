// Audit Trail Service - Logging semua aktivitas user
// Menggunakan localStorage sebagai database audit log

const AUDIT_LOG_KEY = 'audit_logs';

/**
 * Log aktivitas user
 * @param {Object} params
 * @param {string} params.action - Jenis aksi (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW)
 * @param {string} params.entity - Entity yang diubah (STUDENT, TEACHER, CLASS, dll)
 * @param {string} params.userId - ID user yang melakukan aksi
 * @param {string} params.userName - Nama user
 * @param {string} params.userRole - Role user
 * @param {string} params.description - Deskripsi detail aksi
 * @param {Object} params.data - Data yang berubah (optional)
 */
export function logAudit({
  action,
  entity,
  userId,
  userName,
  userRole,
  description,
  data = null,
}) {
  const logs = getAuditLogs();
  
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    entity,
    userId,
    userName,
    userRole,
    description,
    data: data ? JSON.stringify(data) : null,
    ipAddress: '127.0.0.1', // Simulation
    userAgent: navigator.userAgent,
  };
  
  logs.unshift(newLog); // Add to beginning
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.length = 1000;
  }
  
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
}

/**
 * Get semua audit logs
 * @param {Object} filters - Optional filters
 * @returns {Array}
 */
export function getAuditLogs(filters = {}) {
  const raw = localStorage.getItem(AUDIT_LOG_KEY);
  let logs = raw ? JSON.parse(raw) : [];
  
  // Apply filters
  if (filters.action) {
    logs = logs.filter(log => log.action === filters.action);
  }
  if (filters.entity) {
    logs = logs.filter(log => log.entity === filters.entity);
  }
  if (filters.userId) {
    logs = logs.filter(log => log.userId === filters.userId);
  }
  if (filters.userRole) {
    logs = logs.filter(log => log.userRole === filters.userRole);
  }
  if (filters.dateFrom) {
    logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.dateFrom));
  }
  if (filters.dateTo) {
    logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.dateTo));
  }
  
  return logs;
}

/**
 * Get audit logs by entity ID
 * @param {string} entityId 
 * @returns {Array}
 */
export function getAuditLogsByEntity(entityId) {
  const logs = getAuditLogs();
  return logs.filter(log => {
    if (!log.data) return false;
    try {
      const data = JSON.parse(log.data);
      return data.entityId === entityId;
    } catch {
      return false;
    }
  });
}

/**
 * Clear audit logs (admin only)
 */
export function clearAuditLogs() {
  localStorage.removeItem(AUDIT_LOG_KEY);
}

/**
 * Export audit logs to JSON
 * @returns {string} JSON string
 */
export function exportAuditLogs() {
  const logs = getAuditLogs();
  return JSON.stringify(logs, null, 2);
}

/**
 * Get audit statistics
 * @returns {Object}
 */
export function getAuditStats() {
  const logs = getAuditLogs();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    totalLogs: logs.length,
    todayLogs: logs.filter(log => new Date(log.timestamp) >= today).length,
    weekLogs: logs.filter(log => new Date(log.timestamp) >= thisWeek).length,
    monthLogs: logs.filter(log => new Date(log.timestamp) >= thisMonth).length,
    byAction: {
      CREATE: logs.filter(log => log.action === 'CREATE').length,
      UPDATE: logs.filter(log => log.action === 'UPDATE').length,
      DELETE: logs.filter(log => log.action === 'DELETE').length,
      LOGIN: logs.filter(log => log.action === 'LOGIN').length,
      LOGOUT: logs.filter(log => log.action === 'LOGOUT').length,
      VIEW: logs.filter(log => log.action === 'VIEW').length,
    },
    byEntity: {
      STUDENT: logs.filter(log => log.entity === 'STUDENT').length,
      TEACHER: logs.filter(log => log.entity === 'TEACHER').length,
      CLASS: logs.filter(log => log.entity === 'CLASS').length,
      SUBJECT: logs.filter(log => log.entity === 'SUBJECT').length,
      GRADE: logs.filter(log => log.entity === 'GRADE').length,
      ATTENDANCE: logs.filter(log => log.entity === 'ATTENDANCE').length,
    },
    byRole: {
      admin: logs.filter(log => log.userRole === 'admin').length,
      guru: logs.filter(log => log.userRole === 'guru').length,
      siswa: logs.filter(log => log.userRole === 'siswa').length,
    },
  };
}
