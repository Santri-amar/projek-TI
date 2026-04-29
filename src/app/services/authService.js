// Local Auth Service (tanpa API)
// Aturan:
// - User harus register dulu agar bisa login
// - Login by email/username + password + role harus cocok
// - Password di-hash untuk keamanan
// - Audit trail untuk semua aktivitas login/register

import { hashPassword, verifyPassword, sanitizeInput } from './securityService';
import { logAudit } from './auditService';

const USERS_KEY = "school_users";
const TOKEN_KEY = "token";
const CURRENT_USER_KEY = "user";

function normalizeText(v) {
  return (v || "").trim();
}

function normalizeEmail(v) {
  return normalizeText(v).toLowerCase();
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeText(v));
}

function readUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function makeToken(user) {
  return `local-${user.role}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function validateRegisterInput(formData) {
  const username = sanitizeInput(normalizeText(formData.username));
  const email = normalizeEmail(formData.email);
  const phone = sanitizeInput(normalizeText(formData.phone));
  const birthDate = normalizeText(formData.birthDate);
  const role = normalizeText(formData.role || "siswa");
  const password = formData.password || "";
  const confirmPassword = formData.confirmPassword || "";

  if (!username) throw new Error("Username wajib diisi.");
  if (username.length < 3) throw new Error("Username minimal 3 karakter.");

  if (!email) throw new Error("Email wajib diisi.");
  if (!isEmail(email)) throw new Error("Format email tidak valid. Contoh: nama@gmail.com");

  if (!phone) throw new Error("Nomor handphone wajib diisi.");
  if (!/^[0-9+\-\s]{8,20}$/.test(phone)) throw new Error("Nomor handphone tidak valid.");

  if (!birthDate) throw new Error("Tanggal lahir wajib diisi.");

  if (!["admin", "guru", "siswa"].includes(role)) {
    throw new Error("Role tidak valid.");
  }

  if (!password) throw new Error("Password wajib diisi.");
  if (password.length < 6) throw new Error("Password minimal 6 karakter.");
  if (password !== confirmPassword) throw new Error("Password dan konfirmasi password tidak sama.");

  return { username, email, phone, birthDate, role, password };
}

export async function registerUser(formData) {
  const clean = validateRegisterInput(formData);
  const users = readUsers();

  const dupEmail = users.find((u) => u.email === clean.email);
  if (dupEmail) throw new Error("Email sudah terdaftar.");

  const dupUsername = users.find(
    (u) => u.username.toLowerCase() === clean.username.toLowerCase()
  );
  if (dupUsername) throw new Error("Username sudah terdaftar.");

  const newUser = {
    id: `u-${Date.now()}`,
    username: clean.username,
    email: clean.email,
    phone: clean.phone,
    birthDate: clean.birthDate,
    gender: formData.gender || "laki-laki",
    role: clean.role,
    password: hashPassword(clean.password), // HASH PASSWORD untuk keamanan
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  // Log audit trail
  logAudit({
    action: 'CREATE',
    entity: 'USER',
    userId: newUser.id,
    userName: newUser.username,
    userRole: newUser.role,
    description: `User baru terdaftar: ${newUser.username} (${newUser.role})`,
    data: { userId: newUser.id, username: newUser.username, role: newUser.role },
  });

  return {
    data: {
      message: "Register berhasil.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    },
  };
}

async function performLogin(role, identifier, password) {
  const users = readUsers();
  const input = normalizeText(identifier);
  const pwd = password || "";

  if (!input) throw new Error("Username/email wajib diisi.");
  if (!pwd) throw new Error("Password wajib diisi.");

  const isInputEmail = isEmail(input);
  const normalizedInput = isInputEmail ? input.toLowerCase() : input;

  const found = users.find((u) => {
    const sameRole = u.role === role;
    if (!sameRole) return false;

    if (isInputEmail) {
      return u.email === normalizedInput && verifyPassword(pwd, u.password);
    }
    return u.username === input && verifyPassword(pwd, u.password);
  });

  // Aturan utama kamu:
  // Belum register => pasti gagal login
  if (!found) {
    throw new Error("Akun belum terdaftar atau password salah.");
  }

  const safeUser = {
    id: found.id,
    username: found.username,
    email: found.email,
    role: found.role,
    phone: found.phone,
    birthDate: found.birthDate,
    gender: found.gender,
  };

  const token = makeToken(safeUser);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

  // Log audit trail untuk login berhasil
  logAudit({
    action: 'LOGIN',
    entity: 'USER',
    userId: found.id,
    userName: found.username,
    userRole: found.role,
    description: `Login berhasil: ${found.username} (${found.role})`,
    data: { userId: found.id, role: found.role },
  });

  return {
    data: {
      token,
      user: safeUser,
      message: "Login berhasil.",
    },
  };
}

export const loginAdmin = (creds) => performLogin("admin", creds.identifier, creds.password);
export const loginGuru = (creds) => performLogin("guru", creds.identifier, creds.password);
export const loginSiswa = (creds) => performLogin("siswa", creds.identifier, creds.password);

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}