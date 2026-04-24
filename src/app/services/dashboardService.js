import { getAbsensiList } from "./absensiService";
import { getGuruList } from "./guruService";
import { getJadwalList } from "./jadwalService";
import { getKelasList } from "./kelasService";
import { getMapelList } from "./mapelService";
import { getNilaiList } from "./nilaiService";
import { getPengumumanList } from "./pengumumanService";
import { getSiswaList } from "./siswaService";
import { formatRelativeTime, sortByDateDesc } from "./serviceUtils";

function calculateTodayAttendancePercent(absensi) {
  if (!absensi.length) {
    return 0;
  }

  const sortedByDate = sortByDateDesc(
    absensi,
    (item) => item.tanggal || item.createdAt,
  );
  const referenceDate = sortedByDate[0]?.tanggal;

  if (!referenceDate) {
    return 0;
  }

  const sameDateItems = absensi.filter(
    (item) => item.tanggal === referenceDate,
  );
  if (!sameDateItems.length) {
    return 0;
  }

  const hadirCount = sameDateItems.filter(
    (item) => item.status?.toLowerCase() === "hadir",
  ).length;

  return (hadirCount / sameDateItems.length) * 100;
}

function mapPengumumanActivity(items) {
  return sortByDateDesc(items, (item) => item.publishAt || item.createdAt)
    .slice(0, 3)
    .map((item) => ({
      id: `ann-${item.id}`,
      type: "announcement",
      title: item.title || "Pengumuman Baru",
      description: (item.content || "").slice(0, 80) || "Ada pengumuman baru.",
      timestamp: formatRelativeTime(item.publishAt || item.createdAt),
      createdAt: item.publishAt || item.createdAt,
    }));
}

function mapAbsensiActivity(items) {
  return sortByDateDesc(items, (item) => item.createdAt || item.tanggal)
    .slice(0, 2)
    .map((item) => ({
      id: `abs-${item.id}`,
      type: "attendance",
      title: "Update Absensi",
      description: `Absensi siswa #${item.siswaId} status: ${item.status}`,
      timestamp: formatRelativeTime(item.createdAt || item.tanggal),
      createdAt: item.createdAt || item.tanggal || undefined,
    }));
}

function mapNilaiActivity(items) {
  return sortByDateDesc(items, (item) => item.createdAt || item.tanggal)
    .slice(0, 2)
    .map((item) => ({
      id: `nilai-${item.id}`,
      type: "grade",
      title: "Input Nilai",
      description: `Nilai ${item.jenis?.toUpperCase() || "ujian"} siswa #${item.siswaId}: ${item.nilai}`,
      timestamp: formatRelativeTime(item.createdAt || item.tanggal),
      createdAt: item.createdAt || item.tanggal || undefined,
    }));
}

export async function getAdminDashboardOverview() {
  const [siswa, guru, kelas, mapel, jadwal, absensi, nilai, pengumuman] =
    await Promise.all([
      getSiswaList(),
      getGuruList(),
      getKelasList(),
      getMapelList(),
      getJadwalList(),
      getAbsensiList(),
      getNilaiList(),
      getPengumumanList(),
    ]);

  const stats = {
    totalStudents: siswa.length,
    totalTeachers: guru.length,
    totalClasses: kelas.length,
    totalMapel: mapel.length,
    totalSchedules: jadwal.length,
    totalAnnouncements: pengumuman.length,
    totalGrades: nilai.length,
    todayAttendancePercent: calculateTodayAttendancePercent(absensi),
  };

  const recentActivities = [
    ...mapPengumumanActivity(pengumuman),
    ...mapAbsensiActivity(absensi),
    ...mapNilaiActivity(nilai),
  ];

  return {
    stats,
    recentActivities: sortByDateDesc(
      recentActivities,
      (item) => item.createdAt,
    ).slice(0, 5),
  };
}
