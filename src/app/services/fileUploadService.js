// File Upload Service - Simulation using localStorage
// Untuk demo/sertifikasi BNSP

const UPLOAD_STORAGE_KEY = 'uploaded_files';

/**
 * Simulate file upload
 * @param {File} file - File object dari input
 * @param {string} category - Category: 'avatar', 'document', 'certificate', 'other'
 * @returns {Object} Uploaded file info
 */
export function uploadFile(file, category = 'other') {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Tidak ada file yang dipilih'));
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error('Ukuran file terlalu besar. Maksimal 5MB'));
      return;
    }
    
    // Validate file type based on category
    const allowedTypes = {
      avatar: ['image/jpeg', 'image/png', 'image/gif'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      certificate: ['application/pdf', 'image/jpeg', 'image/png'],
      other: ['*/*'],
    };
    
    const types = allowedTypes[category] || allowedTypes.other;
    if (types[0] !== '*/*' && !types.includes(file.type)) {
      reject(new Error(`Tipe file tidak diizinkan untuk kategori ${category}`));
      return;
    }
    
    // Simulate upload delay
    setTimeout(() => {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const uploadedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          category,
          url: e.target.result, // Base64 data URL
          uploadedAt: new Date().toISOString(),
        };
        
        // Save to localStorage
        const files = getUploadedFiles();
        files.push(uploadedFile);
        
        // Keep only last 50 files to avoid localStorage limit
        if (files.length > 50) {
          files.splice(0, files.length - 50);
        }
        
        localStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(files));
        resolve(uploadedFile);
      };
      
      reader.onerror = function() {
        reject(new Error('Gagal membaca file'));
      };
      
      reader.readAsDataURL(file);
    }, 500); // Simulate network delay
  });
}

/**
 * Get all uploaded files
 * @param {string} category - Filter by category
 * @returns {Array}
 */
export function getUploadedFiles(category = null) {
  const raw = localStorage.getItem(UPLOAD_STORAGE_KEY);
  let files = raw ? JSON.parse(raw) : [];
  
  if (category) {
    files = files.filter(f => f.category === category);
  }
  
  return files;
}

/**
 * Get file by ID
 * @param {string} fileId 
 * @returns {Object|null}
 */
export function getFileById(fileId) {
  const files = getUploadedFiles();
  return files.find(f => f.id === fileId) || null;
}

/**
 * Delete file
 * @param {string} fileId 
 * @returns {boolean}
 */
export function deleteFile(fileId) {
  const files = getUploadedFiles();
  const filtered = files.filter(f => f.id !== fileId);
  
  if (filtered.length === files.length) {
    return false; // File not found
  }
  
  localStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Clear all uploaded files
 */
export function clearUploadedFiles() {
  localStorage.removeItem(UPLOAD_STORAGE_KEY);
}

/**
 * Format file size
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file icon based on type
 * @param {string} mimeType 
 * @returns {string} Icon name
 */
export function getFileIcon(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word')) return 'document';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
  if (mimeType.includes('presentation')) return 'presentation';
  return 'file';
}

/**
 * Upload avatar helper
 * @param {File} file 
 * @returns {Promise<Object>}
 */
export function uploadAvatar(file) {
  return uploadFile(file, 'avatar');
}

/**
 * Upload document helper
 * @param {File} file 
 * @returns {Promise<Object>}
 */
export function uploadDocument(file) {
  return uploadFile(file, 'document');
}

/**
 * Upload certificate helper
 * @param {File} file 
 * @returns {Promise<Object>}
 */
export function uploadCertificate(file) {
  return uploadFile(file, 'certificate');
}
