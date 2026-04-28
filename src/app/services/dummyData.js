export const DUMMY_SISWA = [
  { id: 1, name: "Sukma Hidayatullah", nis: "123456", kelas: "XII RPL 1", email: "sukma@gmail.com", phone: "08123456789", status: "Aktif" },
  { id: 2, name: "Ahmad Fauzi", nis: "123457", kelas: "XII RPL 1", email: "fauzi@gmail.com", phone: "08123456790", status: "Aktif" },
  { id: 3, name: "Budi Santoso", nis: "123458", kelas: "XII RPL 2", email: "budi@gmail.com", phone: "08123456791", status: "Cuti" },
  { id: 4, name: "Citra Lestari", nis: "123459", kelas: "XI RPL 1", email: "citra@gmail.com", phone: "08123456792", status: "Aktif" },
  { id: 5, name: "Deni Setiawan", nis: "123460", kelas: "X RPL 1", email: "deni@gmail.com", phone: "08123456793", status: "Keluar" },
];

export const DUMMY_GURU = [
  { id: 1, name: "Dr. Irfan Hakim", nip: "19850101", subject: "Matematika", email: "irfan@school.id", status: "PNS" },
  { id: 2, name: "Siti Aminah, S.Pd", nip: "19880202", subject: "Bahasa Inggris", email: "siti@school.id", status: "Honorer" },
  { id: 3, name: "Budi Utomo, M.Kom", nip: "19900303", subject: "Informatika", email: "budi@school.id", status: "PNS" },
];

export const DUMMY_MAPEL = [
  { id: 1, name: "Matematika", code: "MTK", teacher: "Dr. Irfan Hakim", hours: 4 },
  { id: 2, name: "Bahasa Inggris", code: "ING", teacher: "Siti Aminah, S.Pd", hours: 2 },
  { id: 3, name: "Informatika", code: "INF", teacher: "Budi Utomo, M.Kom", hours: 6 },
];

export const DUMMY_KELAS = [
  { id: 1, name: "XII RPL 1", major: "Rekayasa Perangkat Lunak", capacity: 36, students: 35 },
  { id: 2, name: "XII RPL 2", major: "Rekayasa Perangkat Lunak", capacity: 36, students: 32 },
  { id: 3, name: "XI RPL 1", major: "Rekayasa Perangkat Lunak", capacity: 36, students: 34 },
];

export const DUMMY_JADWAL = [
  { id: 1, day: "Senin", time: "08:00 - 10:00", subject: "Matematika", teacher: "Dr. Irfan Hakim", room: "Lab 1" },
  { id: 2, day: "Senin", time: "10:30 - 12:00", subject: "Informatika", teacher: "Budi Utomo, M.Kom", room: "Lab 2" },
  { id: 3, day: "Selasa", time: "08:00 - 09:30", subject: "Bahasa Inggris", teacher: "Siti Aminah, S.Pd", room: "Kelas XII-1" },
];

export const DUMMY_PENGUMUMAN = [
  { id: 1, title: "Ujian Tengah Semester", content: "Diberitahukan kepada seluruh siswa bahwa UTS akan dilaksanakan pada tanggal 5 Mei 2026.", date: "2026-04-20" },
  { id: 2, title: "Libur Idul Fitri", content: "Libur sekolah menyambut Idul Fitri dimulai dari tanggal 25 April hingga 10 Mei.", date: "2026-04-15" },
];

export const DUMMY_ABSENSI = [
  { id: 1, date: "2026-04-26", siswa: "Sukma Hidayatullah", status: "Hadir", time: "07:15" },
  { id: 2, date: "2026-04-26", siswa: "Ahmad Fauzi", status: "Izin", time: "-" },
  { id: 3, date: "2026-04-26", siswa: "Budi Santoso", status: "Hadir", time: "07:20" },
];

export const DUMMY_NILAI = [
  { id: 1, siswa: "Sukma Hidayatullah", mapel: "Matematika", jenis: "Tugas 1", nilai: 85, status: "Lulus" },
  { id: 2, siswa: "Sukma Hidayatullah", mapel: "Informatika", jenis: "UTS", nilai: 92, status: "Lulus" },
  { id: 3, siswa: "Ahmad Fauzi", mapel: "Matematika", jenis: "Tugas 1", nilai: 70, status: "Lulus" },
];
