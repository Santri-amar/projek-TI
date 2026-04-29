// Validation Service - Comprehensive data validation
// Untuk memastikan data integrity sesuai standar BNSP

import { validateEmail, validatePhone } from './securityService';

/**
 * Validate student data
 * @param {Object} student 
 * @returns {Object} { isValid, errors }
 */
export function validateStudent(student) {
  const errors = [];
  
  if (!student.name || student.name.trim().length < 3) {
    errors.push('Nama siswa minimal 3 karakter');
  }
  
  if (!student.nis || student.nis.trim().length < 5) {
    errors.push('NIS minimal 5 karakter');
  }
  
  if (!student.email || !validateEmail(student.email)) {
    errors.push('Email tidak valid');
  }
  
  if (!student.phone || !validatePhone(student.phone)) {
    errors.push('Nomor telepon tidak valid');
  }
  
  if (!student.birthDate) {
    errors.push('Tanggal lahir wajib diisi');
  } else {
    const birthDate = new Date(student.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 5 || age > 25) {
      errors.push('Umur siswa harus antara 5-25 tahun');
    }
  }
  
  if (!student.gender || !['laki-laki', 'perempuan'].includes(student.gender)) {
    errors.push('Jenis kelamin tidak valid');
  }
  
  if (!student.classId) {
    errors.push('Kelas wajib dipilih');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate teacher data
 * @param {Object} teacher 
 * @returns {Object}
 */
export function validateTeacher(teacher) {
  const errors = [];
  
  if (!teacher.name || teacher.name.trim().length < 3) {
    errors.push('Nama guru minimal 3 karakter');
  }
  
  if (!teacher.nip || teacher.nip.trim().length < 10) {
    errors.push('NIP minimal 10 karakter');
  }
  
  if (!teacher.email || !validateEmail(teacher.email)) {
    errors.push('Email tidak valid');
  }
  
  if (!teacher.phone || !validatePhone(teacher.phone)) {
    errors.push('Nomor telepon tidak valid');
  }
  
  if (!teacher.subjectId) {
    errors.push('Mata pelajaran wajib dipilih');
  }
  
  if (!teacher.qualification || teacher.qualification.trim().length < 3) {
    errors.push('Kualifikasi wajib diisi');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate class data
 * @param {Object} classData 
 * @returns {Object}
 */
export function validateClass(classData) {
  const errors = [];
  
  if (!classData.name || classData.name.trim().length < 2) {
    errors.push('Nama kelas minimal 2 karakter');
  }
  
  if (!classData.level || !['10', '11', '12'].includes(classData.level)) {
    errors.push('Tingkat kelas tidak valid (10, 11, 12)');
  }
  
  if (!classData.major || classData.major.trim().length < 2) {
    errors.push('Jurusan wajib diisi');
  }
  
  if (!classData.capacity || classData.capacity < 1 || classData.capacity > 50) {
    errors.push('Kapasitas kelas harus antara 1-50 siswa');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate subject data
 * @param {Object} subject 
 * @returns {Object}
 */
export function validateSubject(subject) {
  const errors = [];
  
  if (!subject.code || subject.code.trim().length < 2) {
    errors.push('Kode mata pelajaran minimal 2 karakter');
  }
  
  if (!subject.name || subject.name.trim().length < 3) {
    errors.push('Nama mata pelajaran minimal 3 karakter');
  }
  
  if (!subject.category || !['wajib', 'pilihan'].includes(subject.category)) {
    errors.push('Kategori tidak valid (wajib/pilihan)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate grade data
 * @param {Object} grade 
 * @returns {Object}
 */
export function validateGrade(grade) {
  const errors = [];
  
  if (!grade.studentId) {
    errors.push('Siswa wajib dipilih');
  }
  
  if (!grade.subjectId) {
    errors.push('Mata pelajaran wajib dipilih');
  }
  
  if (!grade.type || !['tugas', 'uts', 'uas', 'ujian'].includes(grade.type)) {
    errors.push('Jenis nilai tidak valid');
  }
  
  if (grade.score === undefined || grade.score === null) {
    errors.push('Nilai wajib diisi');
  } else {
    const score = parseFloat(grade.score);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.push('Nilai harus antara 0-100');
    }
  }
  
  if (!grade.semester || !['ganjil', 'genap'].includes(grade.semester)) {
    errors.push('Semester tidak valid');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate attendance data
 * @param {Object} attendance 
 * @returns {Object}
 */
export function validateAttendance(attendance) {
  const errors = [];
  
  if (!attendance.studentId) {
    errors.push('Siswa wajib dipilih');
  }
  
  if (!attendance.date) {
    errors.push('Tanggal wajib diisi');
  }
  
  if (!attendance.status || !['hadir', 'sakit', 'izin', 'alpha'].includes(attendance.status)) {
    errors.push('Status kehadiran tidak valid');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate announcement data
 * @param {Object} announcement 
 * @returns {Object}
 */
export function validateAnnouncement(announcement) {
  const errors = [];
  
  if (!announcement.title || announcement.title.trim().length < 5) {
    errors.push('Judul pengumuman minimal 5 karakter');
  }
  
  if (!announcement.content || announcement.content.trim().length < 10) {
    errors.push('Konten pengumuman minimal 10 karakter');
  }
  
  if (!announcement.target || !['all', 'siswa', 'guru', 'admin'].includes(announcement.target)) {
    errors.push('Target tidak valid');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate user registration
 * @param {Object} user 
 * @returns {Object}
 */
export function validateRegistration(user) {
  const errors = [];
  
  if (!user.username || user.username.trim().length < 3) {
    errors.push('Username minimal 3 karakter');
  }
  
  if (!user.email || !validateEmail(user.email)) {
    errors.push('Email tidak valid');
  }
  
  if (!user.password || user.password.length < 6) {
    errors.push('Password minimal 6 karakter');
  }
  
  if (user.password !== user.confirmPassword) {
    errors.push('Password dan konfirmasi tidak sama');
  }
  
  if (!user.role || !['admin', 'guru', 'siswa'].includes(user.role)) {
    errors.push('Role tidak valid');
  }
  
  // Password strength check
  const hasUpperCase = /[A-Z]/.test(user.password);
  const hasLowerCase = /[a-z]/.test(user.password);
  const hasNumbers = /\d/.test(user.password);
  
  if (user.password.length >= 6 && !(hasUpperCase && hasLowerCase && hasNumbers)) {
    errors.push('Password harus mengandung huruf besar, huruf kecil, dan angka');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize object data (remove HTML tags, trim strings)
 * @param {Object} data 
 * @returns {Object}
 */
export function sanitizeObject(data) {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove HTML tags
      sanitized[key] = value.replace(/<[^>]*>/g, '').trim();
    } else if (typeof value === 'number') {
      sanitized[key] = value;
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
