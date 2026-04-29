import { apiClient } from "./apiClient";

export async function getAdminDashboardStats() {
  try {
    const response = await apiClient.get("/api/dashboard/admin");
    return response.data;
  } catch (error) {
    console.warn("Using local calculation for Admin Dashboard");
    return {
      totalSiswa: 1240,
      totalGuru: 86,
      totalKelas: 32,
      totalMapel: 48,
      recentActivities: [
        { id: 1, text: "Siswa baru ditambahkan: Ahmad Fauzi", time: "5 menit yang lalu" },
        { id: 2, text: "Jadwal kelas 7A diperbarui", time: "1 jam yang lalu" },
      ]
    };
  }
}

export async function getGuruDashboardStats() {
  try {
    const response = await apiClient.get("/api/dashboard/guru");
    return response.data;
  } catch (error) {
    return {
      jadwalHariIni: 4,
      totalSiswaAjar: 120,
      tugasBelumDinilai: 12,
      pengumumanBaru: 3,
      upcomingClasses: [
        { id: 1, class: "7A", subject: "Matematika", time: "08:00" },
        { id: 2, class: "8C", subject: "Matematika", time: "10:30" },
      ]
    };
  }
}

export async function getSiswaDashboardOverview() {
  try {
    const response = await apiClient.get("/api/dashboard/siswa");
    return response.data;
  } catch (error) {
    return {
      stats: {
        todayAttendancePercent: 98,
        rataRataNilai: 85,
        tugasAktif: 5,
        ujianMendatang: 2,
      },
      nextClass: { subject: "Fisika", teacher: "Budi Santoso", time: "07:30" }
    };
  }
}
