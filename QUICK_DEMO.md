#  QUICK DEMO GUIDE - BNSP SIM-SEKOLAH

##  Langkah Demonstrasi untuk Asesor (5 menit)

### STEP 1: LOGIN SYSTEM (1 menit)
```
1. Buka browser: http://localhost:5174
2. Klik "Belum punya akun? Register"
3. Isi form register:
   - Username: demo_admin
   - Email: demo@admin.com
   - Phone: 081234567890
   - Birth Date: 1990-01-01
   - Role: Admin
   - Password: Admin123
   - Confirm: Admin123
4. Klik Register
5. Login dengan email & password yang baru dibuat
```

**Point to Highlight:** 
- Password otomatis di-hash (tidak plain text)
- Input validation aktif
- Audit trail mencatat registrasi

---

### STEP 2: DASHBOARD & ANALYTICS (1 menit)
```
1. Setelah login, lihat Dashboard Admin
2. Klik menu "Laporan & Analytics" di sidebar
3. Tunjukkan:
   - Overview statistics (Total Siswa, Guru, Nilai, Kehadiran)
   - Charts: Gender Distribution, Grade Distribution, Attendance
   - Export buttons (Excel, CSV)
```

**Point to Highlight:**
- Real-time data dari localStorage
- Charts dan visualizations
- Export functionality

---

### STEP 3: CRUD OPERATIONS (1.5 menit)
```
1. Klik menu "Data Siswa"
2. Klik "Tambah Siswa"
3. Isi form dengan data dummy
4. Klik Simpan
5. Tunjukkan data masuk ke table
6. Klik Edit pada salah satu siswa
7. Ubah data dan Simpan
8. Klik Hapus pada salah satu siswa
```

**Point to Highlight:**
- Form validation aktif
- Data tersimpan di localStorage
- Audit trail mencatat semua operasi

---

### STEP 4: EXPORT DATA (30 detik)
```
1. Kembali ke "Laporan & Analytics"
2. Klik "Export Data Siswa (Excel)"
3. Tunjukkan file Excel yang terdownload
4. Buka file untuk menunjukkan format
```

**Point to Highlight:**
- Export otomatis ke Excel format
- Data lengkap dan terformat rapi

---

### STEP 5: AUDIT TRAIL (30 detik)
```
1. Buka Developer Tools (F12)
2. Application > Local Storage
3. Klik key "audit_logs"
4. Tunjukkan semua activity yang tercatat:
   - LOGIN
   - CREATE (siswa)
   - UPDATE (siswa)
   - DELETE (siswa)
   - dll
```

**Point to Highlight:**
- Semua activity tercatat
- Timestamp, user info, action type lengkap
- Security & compliance ready

---

### STEP 6: SECURITY FEATURES (30 detik)
```
1. Di Local Storage, buka "school_users"
2. Tunjukkan bahwa password sudah di-hash
3. Bandingkan dengan input password awal
4. Tunjukkan format hash SHA-256
```

**Point to Highlight:**
- Password tidak tersimpan plain text
- SHA-256 encryption
- Security best practice

---

##  Checklist Demonstrasi

- [ ] Login/Register works
- [ ] Password hashing visible
- [ ] Dashboard analytics shown
- [ ] CRUD operations demonstrated
- [ ] Export functionality shown
- [ ] Audit trail visible
- [ ] Security features explained
- [ ] Responsive design mentioned

---

## ️ TROUBLESHOOTING

**Jika ada error:**
```bash
# Clear localStorage
localStorage.clear()

# Refresh browser
Ctrl+Shift+R

# Restart server
Ctrl+C di terminal
npm run dev
```

**Jika data tidak muncul:**
```bash
# Cek localStorage
Application > Local Storage > localhost:5174

# Cek console untuk error
Console tab di Developer Tools
```

---

##  TIPS UNTUK PRESENTASI

1. **Fokus pada Security:** Password hashing, validation, audit trail
2. **Show Real Data:** Gunakan localStorage untuk menunjukkan data persistence
3. **Highlight Features:** Export, Analytics, CRUD lengkap
4. **Mention Technology:** React, Tailwind, crypto-js, localStorage
5. **BNSP Compliance:** Jelaskan bahwa semua fitur sesuai standar BNSP

---

**Good luck! ️**
**Status: READY FOR DEMONSTRATION**
