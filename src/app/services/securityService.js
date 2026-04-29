// Security Service - Password hashing & input sanitization
// Menggunakan localStorage untuk simulation

import CryptoJS from 'crypto-js';

const SECRET_KEY = 'sim-sekolah-secret-key-2025';

/**
 * Hash password menggunakan SHA-256
 * @param {string} password - Password plain text
 * @returns {string} Hashed password
 */
export function hashPassword(password) {
  if (!password) return '';
  return CryptoJS.SHA256(password + SECRET_KEY).toString();
}

/**
 * Verify password
 * @param {string} password - Password input
 * @param {string} hashedPassword - Password hash dari database
 * @returns {boolean}
 */
export function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

/**
 * Sanitize input untuk mencegah XSS
 * @param {string} input - Input yang akan disanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number
 * @param {string} phone 
 * @returns {boolean}
 */
export function validatePhone(phone) {
  const re = /^[0-9+\-\s]{8,20}$/;
  return re.test(phone);
}

/**
 * Generate secure random token
 * @param {number} length 
 * @returns {string}
 */
export function generateToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Encrypt sensitive data
 * @param {string} data 
 * @returns {string} Encrypted data
 */
export function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

/**
 * Decrypt sensitive data
 * @param {string} encryptedData 
 * @returns {object} Decrypted data
 */
export function decryptData(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
}

/**
 * Rate limiter simulation
 * @param {string} key - Identifier
 * @param {number} maxAttempts - Max attempts
 * @param {number} windowMs - Time window in ms
 * @returns {boolean}
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  
  // Filter attempts within window
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limited
  }
  
  // Add current attempt
  recentAttempts.push(now);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
  
  return true;
}

/**
 * Clear rate limit
 * @param {string} key 
 */
export function clearRateLimit(key) {
  localStorage.removeItem(`rate_limit_${key}`);
}
