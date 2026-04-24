import { useEffect, useMemo, useState } from "react";
import {
  createAbsensi,
  deleteAbsensi,
  getAbsensiList,
  updateAbsensi,
} from "../../../services/absensiService";
import {
  createGuru,
  deleteGuru,
  getGuruList,
  updateGuru,
} from "../../../services/guruService";
import {
  createJadwal,
  deleteJadwal,
  getJadwalList,
  updateJadwal,
} from "../../../services/jadwalService";
import {
  createKelas,
  deleteKelas,
  getKelasList,
  updateKelas,
} from "../../../services/kelasService";
import {
  createMapel,
  deleteMapel,
  getMapelList,
  updateMapel,
} from "../../../services/mapelService";
import {
  createNilai,
  deleteNilai,
  getNilaiList,
  updateNilai,
} from "../../../services/nilaiService";
import {
  createPengumuman,
  deletePengumuman,
  getPengumumanList,
  updatePengumuman,
} from "../../../services/pengumumanService";
import {
  createSiswa,
  deleteSiswa,
  getSiswaList,
  updateSiswa,
} from "../../../services/siswaService";

const initialStudentForm = {
  nis: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  tanggalLahir: "",
  kelasId: "",
  status: "aktif",
};

const initialTeacherForm = {
  nip: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  gender: "",
  birthDate: "",
  kelasId: "",
  mapelId: "",
};

const initialClassForm = {
  name: "",
  tingkat: "",
  jurusan: "",
  kapasitas: "",
  jumlahSiswa: "",
  status: "aktif",
  waliKelasId: "",
};

const initialMapelForm = {
  kodeMapel: "",
  name: "",
  guruId: "",
  kelasId: "",
  hari: "",
  waktuMulai: "",
  waktuSelesai: "",
  durasiMenit: "",
  status: "aktif",
};

const initialAnnouncementForm = {
  title: "",
  content: "",
  priority: "normal",
  target: "all",
  isPublished: true,
  publishAt: "",
  expiredAt: "",
};

const initialScheduleForm = {
  mapelId: "",
  guruId: "",
  kelasId: "",
  hari: "",
  jamMulai: "",
  jamSelesai: "",
  ruangan: "",
  tipe: "",
  isActive: true,
};

const initialAttendanceForm = {
  siswaId: "",
  jadwalId: "",
  guruId: "",
  mapelId: "",
  status: "hadir",
  tanggal: "",
  jamMasuk: "",
  jamKeluar: "",
  keterangan: "",
  metode: "",
  divalidasi: false,
};

const initialGradeForm = {
  siswaId: "",
  guruId: "",
  mapelId: "",
  tugasId: "",
  nilai: "",
  jenis: "tugas",
  tanggal: "",
  bobot: "",
  semester: "",
  tahunAjaran: "",
  catatan: "",
};

const roleCards = {
  admin: [
    { title: "Manajemen User", value: "89 Akun", desc: "Admin, Guru, Siswa" },
    { title: "Data Akademik", value: "42 Kelas", desc: "Mapel & kurikulum" },
    { title: "Pengumuman", value: "24 Aktif", desc: "Informasi sekolah" },
    { title: "Laporan", value: "12 Baru", desc: "Monitoring sistem" },
  ],
  guru: [
    { title: "Kelas Saya", value: "6 Kelas", desc: "Kelas yang diampu" },
    { title: "Absensi Hari Ini", value: "92%", desc: "Status kehadiran" },
    { title: "Nilai Tugas", value: "38 Entri", desc: "Input penilaian" },
    { title: "Pengumuman", value: "5 Baru", desc: "Info terbaru sekolah" },
  ],
  siswa: [
    { title: "Jadwal Hari Ini", value: "5 Mapel", desc: "Aktivitas belajar" },
    { title: "Nilai Saya", value: "88.5", desc: "Rata-rata sementara" },
    { title: "Absensi Saya", value: "95%", desc: "Kehadiran semester" },
    { title: "Pengumuman", value: "3 Baru", desc: "Info dari sekolah" },
  ],
};

function toDashboardItems(items) {
  return items;
}

function mapStudentToForm(student) {
  return {
    nis: student.nis || "",
    name: student.name || "",
    email: student.email || "",
    password: "",
    phone: student.phone || "",
    gender: student.gender || "",
    tanggalLahir: student.tanggalLahir || "",
    kelasId: student.kelasId ? String(student.kelasId) : "",
    status: student.status || "aktif",
  };
}

function mapTeacherToForm(teacher) {
  return {
    nip: teacher.nip || "",
    name: teacher.name || "",
    email: teacher.email || "",
    password: "",
    phone: teacher.phone || "",
    address: teacher.address || "",
    gender: teacher.gender || "",
    birthDate: teacher.birthDate || "",
    kelasId: teacher.kelasId ? String(teacher.kelasId) : "",
    mapelId: teacher.mapelId ? String(teacher.mapelId) : "",
  };
}

function mapClassToForm(classItem) {
  return {
    name: classItem.name || "",
    tingkat: classItem.tingkat || "",
    jurusan: classItem.jurusan || "",
    kapasitas: String(classItem.kapasitas ?? ""),
    jumlahSiswa: String(classItem.jumlahSiswa ?? ""),
    status: classItem.status || "aktif",
    waliKelasId: classItem.waliKelasId ? String(classItem.waliKelasId) : "",
  };
}

function mapMapelToForm(mapel) {
  return {
    kodeMapel: mapel.kodeMapel || "",
    name: mapel.name || "",
    guruId: mapel.guruId ? String(mapel.guruId) : "",
    kelasId: mapel.kelasId ? String(mapel.kelasId) : "",
    hari: mapel.hari || "",
    waktuMulai: mapel.waktuMulai || "",
    waktuSelesai: mapel.waktuSelesai || "",
    durasiMenit: mapel.durasiMenit ? String(mapel.durasiMenit) : "",
    status: mapel.status || "aktif",
  };
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function mapAnnouncementToForm(announcement) {
  return {
    title: announcement.title || "",
    content: announcement.content || "",
    priority: announcement.priority || "normal",
    target: announcement.target || "all",
    isPublished: announcement.isPublished ?? true,
    publishAt: toDateTimeLocal(announcement.publishAt),
    expiredAt: toDateTimeLocal(announcement.expiredAt),
  };
}

function toDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function mapScheduleToForm(schedule) {
  return {
    mapelId: String(schedule.mapelId ?? ""),
    guruId: String(schedule.guruId ?? ""),
    kelasId: String(schedule.kelasId ?? ""),
    hari: schedule.hari || "",
    jamMulai: schedule.jamMulai || "",
    jamSelesai: schedule.jamSelesai || "",
    ruangan: schedule.ruangan || "",
    tipe: schedule.tipe || "",
    isActive: schedule.isActive ?? true,
  };
}

function mapAttendanceToForm(attendance) {
  return {
    siswaId: String(attendance.siswaId ?? ""),
    jadwalId: attendance.jadwalId || "",
    guruId: String(attendance.guruId ?? ""),
    mapelId: String(attendance.mapelId ?? ""),
    status: attendance.status || "hadir",
    tanggal: toDateInput(attendance.tanggal),
    jamMasuk: attendance.jamMasuk || "",
    jamKeluar: attendance.jamKeluar || "",
    keterangan: attendance.keterangan || "",
    metode: attendance.metode || "",
    divalidasi: attendance.divalidasi ?? false,
  };
}

function mapGradeToForm(grade) {
  return {
    siswaId: String(grade.siswaId ?? ""),
    guruId: String(grade.guruId ?? ""),
    mapelId: String(grade.mapelId ?? ""),
    tugasId: grade.tugasId || "",
    nilai: String(grade.nilai ?? ""),
    jenis: grade.jenis || "tugas",
    tanggal: toDateInput(grade.tanggal),
    bobot:
      grade.bobot !== null && grade.bobot !== undefined
        ? String(grade.bobot)
        : "",
    semester: grade.semester || "",
    tahunAjaran: grade.tahunAjaran || "",
    catatan: grade.catatan || "",
  };
}

const menuDataConfigMap = {
  students: {
    title: "Data Siswa",
    fetcher: async () => toDashboardItems(await getSiswaList()),
    primaryText: (item) => String(item.name ?? "Siswa"),
    secondaryText: (item) =>
      `${String(item.nis ?? "-")} • ${String(item.email ?? "-")}`,
  },
  teachers: {
    title: "Data Guru",
    fetcher: async () => toDashboardItems(await getGuruList()),
    primaryText: (item) => String(item.name ?? "Guru"),
    secondaryText: (item) =>
      `${String(item.nip ?? "-")} • ${String(item.email ?? "-")}`,
  },
  classes: {
    title: "Kelas",
    fetcher: async () => toDashboardItems(await getKelasList()),
    primaryText: (item) => String(item.name ?? "Kelas"),
    secondaryText: (item) =>
      `Tingkat ${String(item.tingkat ?? "-")} • ${String(item.jurusan ?? "-")}`,
  },
  subjects: {
    title: "Mata Pelajaran",
    fetcher: async () => toDashboardItems(await getMapelList()),
    primaryText: (item) => String(item.name ?? "Mapel"),
    secondaryText: (item) =>
      `${String(item.kodeMapel ?? "-")} • ${String(item.hari ?? "-")}`,
  },
  schedule: {
    title: "Jadwal",
    fetcher: async () => toDashboardItems(await getJadwalList()),
    primaryText: (item) =>
      `${String(item.hari ?? "-")} • ${String(item.jamMulai ?? "-")} - ${String(item.jamSelesai ?? "-")}`,
    secondaryText: (item) =>
      `Ruang ${String(item.ruangan ?? "-")} • Kelas ${String(item.kelasId ?? "-")}`,
  },
  attendance: {
    title: "Absensi",
    fetcher: async () => toDashboardItems(await getAbsensiList()),
    primaryText: (item) =>
      `Siswa #${String(item.siswaId ?? "-")} • ${String(item.status ?? "-")}`,
    secondaryText: (item) =>
      `${String(item.tanggal ?? "-")} • Mapel #${String(item.mapelId ?? "-")}`,
  },
  grades: {
    title: "Nilai",
    fetcher: async () => toDashboardItems(await getNilaiList()),
    primaryText: (item) =>
      `Nilai ${String(item.jenis ?? "-")} • ${String(item.nilai ?? "-")}`,
    secondaryText: (item) =>
      `Siswa #${String(item.siswaId ?? "-")} • ${String(item.tahunAjaran ?? "-")}`,
  },
  announcements: {
    title: "Pengumuman",
    fetcher: async () => toDashboardItems(await getPengumumanList()),
    primaryText: (item) => String(item.title ?? "Pengumuman"),
    secondaryText: (item) => String(item.content ?? "").slice(0, 96),
  },
  reports: {
    title: "Laporan",
    fetcher: async () => toDashboardItems(await getNilaiList()),
    primaryText: (item) =>
      `Laporan nilai ${String(item.jenis ?? "-")} • ${String(item.nilai ?? "-")}`,
    secondaryText: (item) =>
      `Siswa #${String(item.siswaId ?? "-")} • ${String(item.tahunAjaran ?? "-")}`,
  },
  settings: {
    title: "Pengaturan",
    fetcher: async () => toDashboardItems(await getGuruList()),
    primaryText: (item) => `User ${String(item.name ?? "-")}`,
    secondaryText: (item) =>
      `${String(item.email ?? "-")} • ${String(item.gender ?? "-")}`,
  },
  "my-classes": {
    title: "Kelas Saya",
    fetcher: async () => toDashboardItems(await getJadwalList()),
    primaryText: (item) =>
      `${String(item.hari ?? "-")} • ${String(item.jamMulai ?? "-")} - ${String(item.jamSelesai ?? "-")}`,
    secondaryText: (item) =>
      `Kelas ${String(item.kelasId ?? "-")} • Mapel #${String(item.mapelId ?? "-")}`,
  },
  profile: {
    title: "Profil",
    fetcher: async () => toDashboardItems(await getGuruList()),
    primaryText: (item) => String(item.name ?? "-"),
    secondaryText: (item) =>
      `${String(item.email ?? "-")} • NIP ${String(item.nip ?? "-")}`,
  },
  dashboard: {
    title: "Dashboard",
    fetcher: async () => toDashboardItems(await getPengumumanList()),
    primaryText: (item) => String(item.title ?? "Aktivitas"),
    secondaryText: (item) => String(item.content ?? "").slice(0, 96),
  },
};

export function DashboardContent({
  role,
  userName,
  activeMenu,
  searchQuery = "",
  userEmail = "",
  onProfileUpdate,
}) {
  const cards = roleCards[role];
  const menuConfig = menuDataConfigMap[activeMenu];
  const isStudentsMenu = activeMenu === "students";
  const isTeachersMenu = activeMenu === "teachers";
  const isClassesMenu = activeMenu === "classes";
  const isSubjectsMenu = activeMenu === "subjects";
  const isScheduleMenu = activeMenu === "schedule";
  const isAttendanceMenu = activeMenu === "attendance";
  const isGradesMenu = activeMenu === "grades";
  const isAnnouncementsMenu = activeMenu === "announcements";
  const isSettingsMenu = activeMenu === "settings";
  const isProfileMenu = activeMenu === "profile";

  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingTeacher, setIsSavingTeacher] = useState(false);
  const [isSavingClass, setIsSavingClass] = useState(false);
  const [isSavingSubject, setIsSavingSubject] = useState(false);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [teacherForm, setTeacherForm] = useState(initialTeacherForm);
  const [classForm, setClassForm] = useState(initialClassForm);
  const [subjectForm, setSubjectForm] = useState(initialMapelForm);
  const [scheduleForm, setScheduleForm] = useState(initialScheduleForm);
  const [attendanceForm, setAttendanceForm] = useState(initialAttendanceForm);
  const [gradeForm, setGradeForm] = useState(initialGradeForm);
  const [announcementForm, setAnnouncementForm] = useState(
    initialAnnouncementForm,
  );
  const [profileName, setProfileName] = useState(userName);
  const [profileEmail, setProfileEmail] = useState(userEmail);

  useEffect(() => {
    let mounted = true;

    async function loadMenuData() {
      if (!menuConfig) {
        setItems([]);
        setStudents([]);
        setTeachers([]);
        setClassesData([]);
        setSubjectsData([]);
        setScheduleData([]);
        setAttendanceData([]);
        setGradesData([]);
        setAnnouncementsData([]);
        setErrorMessage("");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setActionMessage("");

      try {
        if (isStudentsMenu) {
          const siswa = await getSiswaList();
          if (!mounted) return;
          setStudents(siswa);
          setTeachers([]);
          setClassesData([]);
          setSubjectsData([]);
          setScheduleData([]);
          setAttendanceData([]);
          setGradesData([]);
          setAnnouncementsData([]);
          setItems(toDashboardItems(siswa));
        } else if (isTeachersMenu) {
          const guru = await getGuruList();
          if (!mounted) return;
          setTeachers(guru);
          setStudents([]);
          setClassesData([]);
          setSubjectsData([]);
          setScheduleData([]);
          setAttendanceData([]);
          setGradesData([]);
          setAnnouncementsData([]);
          setItems(toDashboardItems(guru));
        } else if (isClassesMenu) {
          const kelas = await getKelasList();
          if (!mounted) return;
          setClassesData(kelas);
          setStudents([]);
          setTeachers([]);
          setSubjectsData([]);
          setScheduleData([]);
          setAttendanceData([]);
          setGradesData([]);
          setAnnouncementsData([]);
          setItems(toDashboardItems(kelas));
        } else if (isSubjectsMenu) {
          const mapel = await getMapelList();
          if (!mounted) return;
          setSubjectsData(mapel);
          setStudents([]);
          setTeachers([]);
          setClassesData([]);
          setScheduleData([]);
          setAttendanceData([]);
          setGradesData([]);
          setAnnouncementsData([]);
          setItems(toDashboardItems(mapel));
        } else if (isScheduleMenu) {
          const schedules = await getJadwalList();
          if (!mounted) return;
          setScheduleData(schedules);
          setStudents([]);
          setTeachers([]);
          setClassesData([]);
          setSubjectsData([]);
          setAttendanceData([]);
          setGradesData([]);
          setAnnouncementsData([]);
          setItems(toDashboardItems(schedules));
        } else if (isAttendanceMenu) {
          const attendance = await getAbsensiList();
          if (!mounted) return;
          setAttendanceData(attendance);
          setStudents([]);
          setTeachers([]);
          setClassesData([]);
          setSubjectsData([]);
          setScheduleData([]);
          setGradesData([]);
          setAnnouncementsData([]);
          setItems(toDashboardItems(attendance));
        } else if (isGradesMenu) {
          const grades = await getNilaiList();
          if (!mounted) return;
          setGradesData(grades);
          setStudents([]);
          setTeachers([]);
          setClassesData([]);
          setSubjectsData([]);
          setScheduleData([]);
          setAttendanceData([]);
          setAnnouncementsData([]);
          setItems(toDashboardItems(grades));
        } else if (isAnnouncementsMenu) {
          const announcements = await getPengumumanList();
          if (!mounted) return;
          setAnnouncementsData(announcements);
          setStudents([]);
          setTeachers([]);
          setClassesData([]);
          setSubjectsData([]);
          setScheduleData([]);
          setAttendanceData([]);
          setGradesData([]);
          setItems(toDashboardItems(announcements));
        } else {
          const response = await menuConfig.fetcher();
          if (!mounted) return;
          setItems(response);
          setStudents([]);
          setTeachers([]);
          setClassesData([]);
          setSubjectsData([]);
          setScheduleData([]);
          setAttendanceData([]);
          setGradesData([]);
          setAnnouncementsData([]);
        }
      } catch (error) {
        if (!mounted) return;
        const message =
          error instanceof Error ? error.message : "Gagal memuat data menu.";
        setErrorMessage(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadMenuData();

    return () => {
      mounted = false;
    };
  }, [
    activeMenu,
    menuConfig,
    isStudentsMenu,
    isTeachersMenu,
    isClassesMenu,
    isSubjectsMenu,
    isScheduleMenu,
    isAttendanceMenu,
    isGradesMenu,
    isAnnouncementsMenu,
  ]);

  useEffect(() => {
    setProfileName(userName);
  }, [userName]);

  useEffect(() => {
    setProfileEmail(userEmail);
  }, [userEmail]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const previewItems = useMemo(
    () =>
      items.slice(
        0,
        isStudentsMenu ||
          isTeachersMenu ||
          isClassesMenu ||
          isSubjectsMenu ||
          isScheduleMenu ||
          isAttendanceMenu ||
          isGradesMenu ||
          isAnnouncementsMenu
          ? 10
          : 8,
      ),
    [
      items,
      isStudentsMenu,
      isTeachersMenu,
      isClassesMenu,
      isSubjectsMenu,
      isScheduleMenu,
      isAttendanceMenu,
      isGradesMenu,
      isAnnouncementsMenu,
    ],
  );

  const filteredPreviewItems = useMemo(() => {
    if (!normalizedSearch) return previewItems;
    return previewItems.filter((item) => {
      const primary = menuConfig
        ? menuConfig.primaryText(item).toLowerCase()
        : "";
      const secondary = menuConfig
        ? menuConfig.secondaryText(item).toLowerCase()
        : "";
      return (
        primary.includes(normalizedSearch) ||
        secondary.includes(normalizedSearch)
      );
    });
  }, [previewItems, normalizedSearch, menuConfig]);

  const studentPreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? students.filter((student) =>
          `${student.name} ${student.nis} ${student.email}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : students;
    return base.slice(0, 10);
  }, [students, normalizedSearch]);

  const teacherPreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? teachers.filter((teacher) =>
          `${teacher.name} ${teacher.nip} ${teacher.email}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : teachers;
    return base.slice(0, 10);
  }, [teachers, normalizedSearch]);

  const classPreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? classesData.filter((classItem) =>
          `${classItem.name} ${classItem.tingkat} ${classItem.jurusan}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : classesData;
    return base.slice(0, 10);
  }, [classesData, normalizedSearch]);

  const subjectPreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? subjectsData.filter((subject) =>
          `${subject.name} ${subject.kodeMapel} ${subject.hari ?? ""}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : subjectsData;
    return base.slice(0, 10);
  }, [subjectsData, normalizedSearch]);

  const schedulePreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? scheduleData.filter((schedule) =>
          `${schedule.hari} ${schedule.jamMulai} ${schedule.jamSelesai} ${schedule.kelasId} ${schedule.mapelId} ${schedule.guruId} ${schedule.ruangan ?? ""}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : scheduleData;
    return base.slice(0, 10);
  }, [scheduleData, normalizedSearch]);

  const attendancePreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? attendanceData.filter((attendance) =>
          `${attendance.status} ${attendance.tanggal} ${attendance.siswaId} ${attendance.guruId} ${attendance.mapelId} ${attendance.keterangan ?? ""}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : attendanceData;
    return base.slice(0, 10);
  }, [attendanceData, normalizedSearch]);

  const gradePreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? gradesData.filter((grade) =>
          `${grade.nilai} ${grade.jenis} ${grade.siswaId} ${grade.guruId} ${grade.mapelId} ${grade.semester ?? ""} ${grade.tahunAjaran ?? ""}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : gradesData;
    return base.slice(0, 10);
  }, [gradesData, normalizedSearch]);

  const announcementPreviewItems = useMemo(() => {
    const base = normalizedSearch
      ? announcementsData.filter((announcement) =>
          `${announcement.title} ${announcement.content} ${announcement.target ?? ""} ${announcement.priority ?? ""}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : announcementsData;
    return base.slice(0, 10);
  }, [announcementsData, normalizedSearch]);

  const resetStudentForm = () => {
    setStudentForm(initialStudentForm);
    setEditingStudentId(null);
  };

  const resetTeacherForm = () => {
    setTeacherForm(initialTeacherForm);
    setEditingTeacherId(null);
  };

  const resetClassForm = () => {
    setClassForm(initialClassForm);
    setEditingClassId(null);
  };

  const resetSubjectForm = () => {
    setSubjectForm(initialMapelForm);
    setEditingSubjectId(null);
  };

  const resetScheduleForm = () => {
    setScheduleForm(initialScheduleForm);
    setEditingScheduleId(null);
  };

  const resetAttendanceForm = () => {
    setAttendanceForm(initialAttendanceForm);
    setEditingAttendanceId(null);
  };

  const resetGradeForm = () => {
    setGradeForm(initialGradeForm);
    setEditingGradeId(null);
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm(initialAnnouncementForm);
    setEditingAnnouncementId(null);
  };

  const handleStudentFieldChange = (field, value) => {
    setStudentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTeacherFieldChange = (field, value) => {
    setTeacherForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClassFieldChange = (field, value) => {
    setClassForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectFieldChange = (field, value) => {
    setSubjectForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleFieldChange = (field, value) => {
    setScheduleForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttendanceFieldChange = (field, value) => {
    setAttendanceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGradeFieldChange = (field, value) => {
    setGradeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnnouncementFieldChange = (field, value) => {
    setAnnouncementForm((prev) => ({ ...prev, [field]: value }));
  };

  const reloadStudents = async () => {
    const siswa = await getSiswaList();
    setStudents(siswa);
    setItems(toDashboardItems(siswa));
  };

  const reloadTeachers = async () => {
    const guru = await getGuruList();
    setTeachers(guru);
    setItems(toDashboardItems(guru));
  };

  const reloadClasses = async () => {
    const kelas = await getKelasList();
    setClassesData(kelas);
    setItems(toDashboardItems(kelas));
  };

  const reloadSubjects = async () => {
    const mapel = await getMapelList();
    setSubjectsData(mapel);
    setItems(toDashboardItems(mapel));
  };

  const reloadSchedules = async () => {
    const schedules = await getJadwalList();
    setScheduleData(schedules);
    setItems(toDashboardItems(schedules));
  };

  const reloadAttendance = async () => {
    const attendance = await getAbsensiList();
    setAttendanceData(attendance);
    setItems(toDashboardItems(attendance));
  };

  const reloadGrades = async () => {
    const grades = await getNilaiList();
    setGradesData(grades);
    setItems(toDashboardItems(grades));
  };

  const reloadAnnouncements = async () => {
    const announcements = await getPengumumanList();
    setAnnouncementsData(announcements);
    setItems(toDashboardItems(announcements));
  };

  const handleSubmitStudent = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (!studentForm.nis || !studentForm.name || !studentForm.email) {
      setErrorMessage("NIS, nama, dan email wajib diisi.");
      return;
    }

    if (!editingStudentId && !studentForm.password) {
      setErrorMessage("Password wajib diisi saat tambah siswa baru.");
      return;
    }

    setIsSavingStudent(true);

    try {
      const payload = {
        nis: studentForm.nis,
        name: studentForm.name,
        email: studentForm.email,
        password: studentForm.password || undefined,
        phone: studentForm.phone || undefined,
        gender: studentForm.gender || undefined,
        tanggalLahir: studentForm.tanggalLahir || undefined,
        kelasId: studentForm.kelasId ? Number(studentForm.kelasId) : undefined,
        status: studentForm.status || undefined,
      };

      if (editingStudentId) {
        await updateSiswa(editingStudentId, payload);
        setActionMessage("Data siswa berhasil diperbarui.");
      } else {
        await createSiswa(payload);
        setActionMessage("Data siswa berhasil ditambahkan.");
      }

      await reloadStudents();
      resetStudentForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data siswa.";
      setErrorMessage(message);
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudentId(student.id);
    setStudentForm(mapStudentToForm(student));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteStudent = async (studentId) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus data siswa ini?");
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deleteSiswa(studentId);
      await reloadStudents();
      if (editingStudentId === studentId) {
        resetStudentForm();
      }
      setActionMessage("Data siswa berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data siswa.";
      setErrorMessage(message);
    }
  };

  const handleSubmitTeacher = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (!teacherForm.nip || !teacherForm.name || !teacherForm.email) {
      setErrorMessage("NIP, nama, dan email wajib diisi.");
      return;
    }

    if (!editingTeacherId && !teacherForm.password) {
      setErrorMessage("Password wajib diisi saat tambah guru baru.");
      return;
    }

    setIsSavingTeacher(true);

    try {
      const payload = {
        nip: teacherForm.nip,
        name: teacherForm.name,
        email: teacherForm.email,
        password: teacherForm.password || undefined,
        phone: teacherForm.phone || undefined,
        address: teacherForm.address || undefined,
        gender: teacherForm.gender || undefined,
        birthDate: teacherForm.birthDate || undefined,
        kelasId: teacherForm.kelasId ? Number(teacherForm.kelasId) : undefined,
        mapelId: teacherForm.mapelId ? Number(teacherForm.mapelId) : undefined,
      };

      if (editingTeacherId) {
        await updateGuru(editingTeacherId, payload);
        setActionMessage("Data guru berhasil diperbarui.");
      } else {
        await createGuru(payload);
        setActionMessage("Data guru berhasil ditambahkan.");
      }

      await reloadTeachers();
      resetTeacherForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data guru.";
      setErrorMessage(message);
    } finally {
      setIsSavingTeacher(false);
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacherId(teacher.id);
    setTeacherForm(mapTeacherToForm(teacher));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteTeacher = async (teacherId) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus data guru ini?");
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deleteGuru(teacherId);
      await reloadTeachers();
      if (editingTeacherId === teacherId) {
        resetTeacherForm();
      }
      setActionMessage("Data guru berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data guru.";
      setErrorMessage(message);
    }
  };

  const handleSubmitClass = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (
      !classForm.name ||
      !classForm.tingkat ||
      !classForm.jurusan ||
      !classForm.kapasitas
    ) {
      setErrorMessage(
        "Nama kelas, tingkat, jurusan, dan kapasitas wajib diisi.",
      );
      return;
    }

    setIsSavingClass(true);

    try {
      const payload = {
        name: classForm.name,
        tingkat: classForm.tingkat,
        jurusan: classForm.jurusan,
        kapasitas: Number(classForm.kapasitas),
        jumlahSiswa: classForm.jumlahSiswa
          ? Number(classForm.jumlahSiswa)
          : undefined,
        status: classForm.status || undefined,
        waliKelasId: classForm.waliKelasId
          ? Number(classForm.waliKelasId)
          : undefined,
      };

      if (editingClassId) {
        await updateKelas(editingClassId, payload);
        setActionMessage("Data kelas berhasil diperbarui.");
      } else {
        await createKelas(payload);
        setActionMessage("Data kelas berhasil ditambahkan.");
      }

      await reloadClasses();
      resetClassForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data kelas.";
      setErrorMessage(message);
    } finally {
      setIsSavingClass(false);
    }
  };

  const handleEditClass = (classItem) => {
    setEditingClassId(classItem.id);
    setClassForm(mapClassToForm(classItem));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteClass = async (classId) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus data kelas ini?");
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deleteKelas(classId);
      await reloadClasses();
      if (editingClassId === classId) {
        resetClassForm();
      }
      setActionMessage("Data kelas berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data kelas.";
      setErrorMessage(message);
    }
  };

  const handleSubmitSubject = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (!subjectForm.kodeMapel || !subjectForm.name) {
      setErrorMessage("Kode mapel dan nama mapel wajib diisi.");
      return;
    }

    setIsSavingSubject(true);

    try {
      const payload = {
        kodeMapel: subjectForm.kodeMapel,
        name: subjectForm.name,
        guruId: subjectForm.guruId ? Number(subjectForm.guruId) : undefined,
        kelasId: subjectForm.kelasId ? Number(subjectForm.kelasId) : undefined,
        hari: subjectForm.hari || undefined,
        waktuMulai: subjectForm.waktuMulai || undefined,
        waktuSelesai: subjectForm.waktuSelesai || undefined,
        durasiMenit: subjectForm.durasiMenit
          ? Number(subjectForm.durasiMenit)
          : undefined,
        status: subjectForm.status || undefined,
      };

      if (editingSubjectId) {
        await updateMapel(editingSubjectId, payload);
        setActionMessage("Data mapel berhasil diperbarui.");
      } else {
        await createMapel(payload);
        setActionMessage("Data mapel berhasil ditambahkan.");
      }

      await reloadSubjects();
      resetSubjectForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data mapel.";
      setErrorMessage(message);
    } finally {
      setIsSavingSubject(false);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubjectId(subject.id);
    setSubjectForm(mapMapelToForm(subject));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteSubject = async (subjectId) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus data mapel ini?");
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deleteMapel(subjectId);
      await reloadSubjects();
      if (editingSubjectId === subjectId) {
        resetSubjectForm();
      }
      setActionMessage("Data mapel berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data mapel.";
      setErrorMessage(message);
    }
  };

  const handleSubmitSchedule = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (
      !scheduleForm.mapelId ||
      !scheduleForm.guruId ||
      !scheduleForm.kelasId ||
      !scheduleForm.hari ||
      !scheduleForm.jamMulai ||
      !scheduleForm.jamSelesai
    ) {
      setErrorMessage(
        "Mapel, guru, kelas, hari, jam mulai, dan jam selesai wajib diisi.",
      );
      return;
    }

    setIsSavingSchedule(true);

    try {
      const payload = {
        mapelId: Number(scheduleForm.mapelId),
        guruId: Number(scheduleForm.guruId),
        kelasId: Number(scheduleForm.kelasId),
        hari: scheduleForm.hari,
        jamMulai: scheduleForm.jamMulai,
        jamSelesai: scheduleForm.jamSelesai,
        ruangan: scheduleForm.ruangan || undefined,
        tipe: scheduleForm.tipe || undefined,
        isActive: scheduleForm.isActive,
      };

      if (editingScheduleId !== null) {
        await updateJadwal(editingScheduleId, payload);
        setActionMessage("Data jadwal berhasil diperbarui.");
      } else {
        await createJadwal(payload);
        setActionMessage("Data jadwal berhasil ditambahkan.");
      }

      await reloadSchedules();
      resetScheduleForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data jadwal.";
      setErrorMessage(message);
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingScheduleId(schedule.id);
    setScheduleForm(mapScheduleToForm(schedule));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteSchedule = async (scheduleId) => {
    const isConfirmed = window.confirm(
      "Yakin ingin menghapus data jadwal ini?",
    );
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deleteJadwal(scheduleId);
      await reloadSchedules();
      if (
        editingScheduleId !== null &&
        String(editingScheduleId) === String(scheduleId)
      ) {
        resetScheduleForm();
      }
      setActionMessage("Data jadwal berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data jadwal.";
      setErrorMessage(message);
    }
  };

  const handleSubmitAttendance = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (
      !attendanceForm.siswaId ||
      !attendanceForm.jadwalId ||
      !attendanceForm.guruId ||
      !attendanceForm.mapelId ||
      !attendanceForm.status ||
      !attendanceForm.tanggal
    ) {
      setErrorMessage(
        "Siswa, jadwal, guru, mapel, status, dan tanggal wajib diisi.",
      );
      return;
    }

    setIsSavingAttendance(true);

    try {
      const payload = {
        siswaId: Number(attendanceForm.siswaId),
        jadwalId: attendanceForm.jadwalId,
        guruId: Number(attendanceForm.guruId),
        mapelId: Number(attendanceForm.mapelId),
        status: attendanceForm.status,
        tanggal: attendanceForm.tanggal,
        jamMasuk: attendanceForm.jamMasuk || undefined,
        jamKeluar: attendanceForm.jamKeluar || undefined,
        keterangan: attendanceForm.keterangan || undefined,
        metode: attendanceForm.metode || undefined,
        divalidasi: attendanceForm.divalidasi,
      };

      if (editingAttendanceId !== null) {
        await updateAbsensi(editingAttendanceId, payload);
        setActionMessage("Data absensi berhasil diperbarui.");
      } else {
        await createAbsensi(payload);
        setActionMessage("Data absensi berhasil ditambahkan.");
      }

      await reloadAttendance();
      resetAttendanceForm();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan data absensi.";
      setErrorMessage(message);
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendanceId(attendance.id);
    setAttendanceForm(mapAttendanceToForm(attendance));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteAttendance = async (attendanceId) => {
    const isConfirmed = window.confirm(
      "Yakin ingin menghapus data absensi ini?",
    );
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deleteAbsensi(attendanceId);
      await reloadAttendance();
      if (
        editingAttendanceId !== null &&
        String(editingAttendanceId) === String(attendanceId)
      ) {
        resetAttendanceForm();
      }
      setActionMessage("Data absensi berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menghapus data absensi.";
      setErrorMessage(message);
    }
  };

  const handleSubmitGrade = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (
      !gradeForm.siswaId ||
      !gradeForm.guruId ||
      !gradeForm.mapelId ||
      !gradeForm.nilai ||
      !gradeForm.jenis
    ) {
      setErrorMessage("Siswa, guru, mapel, nilai, dan jenis wajib diisi.");
      return;
    }

    setIsSavingGrade(true);

    try {
      const payload = {
        siswaId: Number(gradeForm.siswaId),
        guruId: Number(gradeForm.guruId),
        mapelId: Number(gradeForm.mapelId),
        tugasId: gradeForm.tugasId || undefined,
        nilai: Number(gradeForm.nilai),
        jenis: gradeForm.jenis,
        tanggal: gradeForm.tanggal || undefined,
        bobot: gradeForm.bobot ? Number(gradeForm.bobot) : undefined,
        semester: gradeForm.semester || undefined,
        tahunAjaran: gradeForm.tahunAjaran || undefined,
        catatan: gradeForm.catatan || undefined,
      };

      if (editingGradeId !== null) {
        await updateNilai(editingGradeId, payload);
        setActionMessage("Data nilai berhasil diperbarui.");
      } else {
        await createNilai(payload);
        setActionMessage("Data nilai berhasil ditambahkan.");
      }

      await reloadGrades();
      resetGradeForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data nilai.";
      setErrorMessage(message);
    } finally {
      setIsSavingGrade(false);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGradeId(grade.id);
    setGradeForm(mapGradeToForm(grade));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteGrade = async (gradeId) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus data nilai ini?");
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deleteNilai(gradeId);
      await reloadGrades();
      if (
        editingGradeId !== null &&
        String(editingGradeId) === String(gradeId)
      ) {
        resetGradeForm();
      }
      setActionMessage("Data nilai berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data nilai.";
      setErrorMessage(message);
    }
  };

  const handleSubmitAnnouncement = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (!announcementForm.title || !announcementForm.content) {
      setErrorMessage("Judul dan isi pengumuman wajib diisi.");
      return;
    }

    setIsSavingAnnouncement(true);

    try {
      const payload = {
        title: announcementForm.title,
        content: announcementForm.content,
        priority: announcementForm.priority || undefined,
        target: announcementForm.target || undefined,
        isPublished: announcementForm.isPublished,
        publishAt: announcementForm.publishAt
          ? new Date(announcementForm.publishAt).toISOString()
          : undefined,
        expiredAt: announcementForm.expiredAt
          ? new Date(announcementForm.expiredAt).toISOString()
          : undefined,
      };

      if (editingAnnouncementId !== null) {
        await updatePengumuman(editingAnnouncementId, payload);
        setActionMessage("Pengumuman berhasil diperbarui.");
      } else {
        await createPengumuman(payload);
        setActionMessage("Pengumuman berhasil ditambahkan.");
      }

      await reloadAnnouncements();
      resetAnnouncementForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan pengumuman.";
      setErrorMessage(message);
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncementId(announcement.id);
    setAnnouncementForm(mapAnnouncementToForm(announcement));
    setActionMessage("");
    setErrorMessage("");
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus pengumuman ini?");
    if (!isConfirmed) return;

    setActionMessage("");
    setErrorMessage("");

    try {
      await deletePengumuman(announcementId);
      await reloadAnnouncements();
      if (
        editingAnnouncementId !== null &&
        String(editingAnnouncementId) === String(announcementId)
      ) {
        resetAnnouncementForm();
      }
      setActionMessage("Pengumuman berhasil dihapus.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus pengumuman.";
      setErrorMessage(message);
    }
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    setActionMessage("");
    setErrorMessage("");

    if (!profileName.trim() || !profileEmail.trim()) {
      setErrorMessage("Nama dan email wajib diisi.");
      return;
    }

    setIsSavingProfile(true);

    try {
      onProfileUpdate?.(profileName.trim(), profileEmail.trim());
      setActionMessage("Pengaturan profil berhasil disimpan.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pengaturan profil.";
      setErrorMessage(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <div className="bg-white border border-[#E3EAF5] rounded-2xl p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-[#111827]">
          {activeMenu.charAt(0).toUpperCase() +
            activeMenu.slice(1).replace("-", " ")}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Halo {userName}, halaman ini disiapkan untuk role{" "}
          <span className="font-semibold capitalize">{role}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-2xl p-4 hover:shadow-md transition"
          >
            <p className="text-xs text-[#6B7280] mb-1">{card.title}</p>
            <h3 className="text-2xl font-extrabold text-[#111827]">
              {card.value}
            </h3>
            <p className="text-xs text-[#4B5563] mt-2">{card.desc}</p>
          </div>
        ))}
      </div>

      {menuConfig && (
        <div className="bg-white border border-[#E3EAF5] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111827]">
              {menuConfig.title} (API)
            </h3>
            {!isLoading && !errorMessage && (
              <span className="text-xs text-[#6B7280]">
                Total: {items.length} data
              </span>
            )}
          </div>

          {isLoading && (
            <p className="text-sm text-[#6B7280]">Memuat data dari API...</p>
          )}

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          {actionMessage && (
            <p className="text-sm text-green-700">{actionMessage}</p>
          )}

          {isStudentsMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitStudent}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="NIS"
                  value={studentForm.nis}
                  onChange={(e) =>
                    handleStudentFieldChange("nis", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Nama Siswa"
                  value={studentForm.name}
                  onChange={(e) =>
                    handleStudentFieldChange("name", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Email"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) =>
                    handleStudentFieldChange("email", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder={
                    editingStudentId ? "Password baru (opsional)" : "Password"
                  }
                  type="password"
                  value={studentForm.password}
                  onChange={(e) =>
                    handleStudentFieldChange("password", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="No HP"
                  value={studentForm.phone}
                  onChange={(e) =>
                    handleStudentFieldChange("phone", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Kelas ID"
                  value={studentForm.kelasId}
                  onChange={(e) =>
                    handleStudentFieldChange("kelasId", e.target.value)
                  }
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={studentForm.gender}
                  onChange={(e) =>
                    handleStudentFieldChange("gender", e.target.value)
                  }
                >
                  <option value="">Pilih Gender</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="date"
                  value={studentForm.tanggalLahir}
                  onChange={(e) =>
                    handleStudentFieldChange("tanggalLahir", e.target.value)
                  }
                />

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingStudent}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingStudent
                      ? "Menyimpan..."
                      : editingStudentId
                        ? "Simpan Perubahan"
                        : "Tambah Siswa"}
                  </button>
                  {editingStudentId && (
                    <button
                      type="button"
                      onClick={resetStudentForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && studentPreviewItems.length > 0 && (
                <div className="space-y-3">
                  {studentPreviewItems.map((student) => (
                    <div
                      key={student.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {student.name}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {student.nis} • {student.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditStudent(student)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                studentPreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data siswa untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {isTeachersMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitTeacher}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="NIP"
                  value={teacherForm.nip}
                  onChange={(e) =>
                    handleTeacherFieldChange("nip", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Nama Guru"
                  value={teacherForm.name}
                  onChange={(e) =>
                    handleTeacherFieldChange("name", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Email"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) =>
                    handleTeacherFieldChange("email", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder={
                    editingTeacherId ? "Password baru (opsional)" : "Password"
                  }
                  type="password"
                  value={teacherForm.password}
                  onChange={(e) =>
                    handleTeacherFieldChange("password", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="No HP"
                  value={teacherForm.phone}
                  onChange={(e) =>
                    handleTeacherFieldChange("phone", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Alamat"
                  value={teacherForm.address}
                  onChange={(e) =>
                    handleTeacherFieldChange("address", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Kelas ID"
                  value={teacherForm.kelasId}
                  onChange={(e) =>
                    handleTeacherFieldChange("kelasId", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Mapel ID"
                  value={teacherForm.mapelId}
                  onChange={(e) =>
                    handleTeacherFieldChange("mapelId", e.target.value)
                  }
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={teacherForm.gender}
                  onChange={(e) =>
                    handleTeacherFieldChange("gender", e.target.value)
                  }
                >
                  <option value="">Pilih Gender</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="date"
                  value={teacherForm.birthDate}
                  onChange={(e) =>
                    handleTeacherFieldChange("birthDate", e.target.value)
                  }
                />

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingTeacher}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingTeacher
                      ? "Menyimpan..."
                      : editingTeacherId
                        ? "Simpan Perubahan"
                        : "Tambah Guru"}
                  </button>
                  {editingTeacherId && (
                    <button
                      type="button"
                      onClick={resetTeacherForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && teacherPreviewItems.length > 0 && (
                <div className="space-y-3">
                  {teacherPreviewItems.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {teacher.name}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {teacher.nip} • {teacher.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditTeacher(teacher)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                teacherPreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data guru untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {isClassesMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitClass}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Nama Kelas"
                  value={classForm.name}
                  onChange={(e) =>
                    handleClassFieldChange("name", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Tingkat (X/XI/XII)"
                  value={classForm.tingkat}
                  onChange={(e) =>
                    handleClassFieldChange("tingkat", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Jurusan"
                  value={classForm.jurusan}
                  onChange={(e) =>
                    handleClassFieldChange("jurusan", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Kapasitas"
                  type="number"
                  min={1}
                  value={classForm.kapasitas}
                  onChange={(e) =>
                    handleClassFieldChange("kapasitas", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Jumlah Siswa"
                  type="number"
                  min={0}
                  value={classForm.jumlahSiswa}
                  onChange={(e) =>
                    handleClassFieldChange("jumlahSiswa", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Wali Kelas ID"
                  type="number"
                  min={1}
                  value={classForm.waliKelasId}
                  onChange={(e) =>
                    handleClassFieldChange("waliKelasId", e.target.value)
                  }
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={classForm.status}
                  onChange={(e) =>
                    handleClassFieldChange("status", e.target.value)
                  }
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingClass}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingClass
                      ? "Menyimpan..."
                      : editingClassId
                        ? "Simpan Perubahan"
                        : "Tambah Kelas"}
                  </button>
                  {editingClassId && (
                    <button
                      type="button"
                      onClick={resetClassForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && classPreviewItems.length > 0 && (
                <div className="space-y-3">
                  {classPreviewItems.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {classItem.name}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {classItem.tingkat} {classItem.jurusan} • Kapasitas{" "}
                          {classItem.kapasitas} • Siswa {classItem.jumlahSiswa}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClass(classItem)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                classPreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data kelas untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {isSubjectsMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitSubject}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Kode Mapel"
                  value={subjectForm.kodeMapel}
                  onChange={(e) =>
                    handleSubjectFieldChange("kodeMapel", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Nama Mapel"
                  value={subjectForm.name}
                  onChange={(e) =>
                    handleSubjectFieldChange("name", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Guru ID"
                  type="number"
                  min={1}
                  value={subjectForm.guruId}
                  onChange={(e) =>
                    handleSubjectFieldChange("guruId", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Kelas ID"
                  type="number"
                  min={1}
                  value={subjectForm.kelasId}
                  onChange={(e) =>
                    handleSubjectFieldChange("kelasId", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Hari"
                  value={subjectForm.hari}
                  onChange={(e) =>
                    handleSubjectFieldChange("hari", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Durasi Menit"
                  type="number"
                  min={1}
                  value={subjectForm.durasiMenit}
                  onChange={(e) =>
                    handleSubjectFieldChange("durasiMenit", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Waktu Mulai (HH:mm:ss)"
                  value={subjectForm.waktuMulai}
                  onChange={(e) =>
                    handleSubjectFieldChange("waktuMulai", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Waktu Selesai (HH:mm:ss)"
                  value={subjectForm.waktuSelesai}
                  onChange={(e) =>
                    handleSubjectFieldChange("waktuSelesai", e.target.value)
                  }
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={subjectForm.status}
                  onChange={(e) =>
                    handleSubjectFieldChange("status", e.target.value)
                  }
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingSubject}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingSubject
                      ? "Menyimpan..."
                      : editingSubjectId
                        ? "Simpan Perubahan"
                        : "Tambah Mapel"}
                  </button>
                  {editingSubjectId && (
                    <button
                      type="button"
                      onClick={resetSubjectForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && subjectPreviewItems.length > 0 && (
                <div className="space-y-3">
                  {subjectPreviewItems.map((subject) => (
                    <div
                      key={subject.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {subject.name}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {subject.kodeMapel} • {subject.hari || "-"} •{" "}
                          {subject.waktuMulai || "-"}-
                          {subject.waktuSelesai || "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditSubject(subject)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                subjectPreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data mapel untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {isScheduleMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitSchedule}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Mapel ID"
                  type="number"
                  min={1}
                  value={scheduleForm.mapelId}
                  onChange={(e) =>
                    handleScheduleFieldChange("mapelId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Guru ID"
                  type="number"
                  min={1}
                  value={scheduleForm.guruId}
                  onChange={(e) =>
                    handleScheduleFieldChange("guruId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Kelas ID"
                  type="number"
                  min={1}
                  value={scheduleForm.kelasId}
                  onChange={(e) =>
                    handleScheduleFieldChange("kelasId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Hari"
                  value={scheduleForm.hari}
                  onChange={(e) =>
                    handleScheduleFieldChange("hari", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="time"
                  value={scheduleForm.jamMulai}
                  onChange={(e) =>
                    handleScheduleFieldChange("jamMulai", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="time"
                  value={scheduleForm.jamSelesai}
                  onChange={(e) =>
                    handleScheduleFieldChange("jamSelesai", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Ruangan"
                  value={scheduleForm.ruangan}
                  onChange={(e) =>
                    handleScheduleFieldChange("ruangan", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Tipe (teori/praktikum)"
                  value={scheduleForm.tipe}
                  onChange={(e) =>
                    handleScheduleFieldChange("tipe", e.target.value)
                  }
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={scheduleForm.isActive ? "true" : "false"}
                  onChange={(e) =>
                    handleScheduleFieldChange(
                      "isActive",
                      e.target.value === "true",
                    )
                  }
                >
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingSchedule}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingSchedule
                      ? "Menyimpan..."
                      : editingScheduleId !== null
                        ? "Simpan Perubahan"
                        : "Tambah Jadwal"}
                  </button>
                  {editingScheduleId !== null && (
                    <button
                      type="button"
                      onClick={resetScheduleForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && schedulePreviewItems.length > 0 && (
                <div className="space-y-3">
                  {schedulePreviewItems.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {schedule.hari} • {schedule.jamMulai} -{" "}
                          {schedule.jamSelesai}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Kelas #{schedule.kelasId} • Mapel #{schedule.mapelId}{" "}
                          • Guru #{schedule.guruId} • Ruang{" "}
                          {schedule.ruangan || "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditSchedule(schedule)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                schedulePreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data jadwal untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {isAttendanceMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitAttendance}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Siswa ID"
                  type="number"
                  min={1}
                  value={attendanceForm.siswaId}
                  onChange={(e) =>
                    handleAttendanceFieldChange("siswaId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Jadwal ID"
                  value={attendanceForm.jadwalId}
                  onChange={(e) =>
                    handleAttendanceFieldChange("jadwalId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Guru ID"
                  type="number"
                  min={1}
                  value={attendanceForm.guruId}
                  onChange={(e) =>
                    handleAttendanceFieldChange("guruId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Mapel ID"
                  type="number"
                  min={1}
                  value={attendanceForm.mapelId}
                  onChange={(e) =>
                    handleAttendanceFieldChange("mapelId", e.target.value)
                  }
                  required
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={attendanceForm.status}
                  onChange={(e) =>
                    handleAttendanceFieldChange("status", e.target.value)
                  }
                >
                  <option value="hadir">Hadir</option>
                  <option value="izin">Izin</option>
                  <option value="sakit">Sakit</option>
                  <option value="alfa">Alfa</option>
                </select>
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="date"
                  value={attendanceForm.tanggal}
                  onChange={(e) =>
                    handleAttendanceFieldChange("tanggal", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="time"
                  value={attendanceForm.jamMasuk}
                  onChange={(e) =>
                    handleAttendanceFieldChange("jamMasuk", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="time"
                  value={attendanceForm.jamKeluar}
                  onChange={(e) =>
                    handleAttendanceFieldChange("jamKeluar", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Metode (manual/qr/fingerprint)"
                  value={attendanceForm.metode}
                  onChange={(e) =>
                    handleAttendanceFieldChange("metode", e.target.value)
                  }
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={attendanceForm.divalidasi ? "true" : "false"}
                  onChange={(e) =>
                    handleAttendanceFieldChange(
                      "divalidasi",
                      e.target.value === "true",
                    )
                  }
                >
                  <option value="false">Belum Validasi</option>
                  <option value="true">Sudah Validasi</option>
                </select>
                <textarea
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm md:col-span-2 min-h-24"
                  placeholder="Keterangan"
                  value={attendanceForm.keterangan}
                  onChange={(e) =>
                    handleAttendanceFieldChange("keterangan", e.target.value)
                  }
                />

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingAttendance}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingAttendance
                      ? "Menyimpan..."
                      : editingAttendanceId !== null
                        ? "Simpan Perubahan"
                        : "Tambah Absensi"}
                  </button>
                  {editingAttendanceId !== null && (
                    <button
                      type="button"
                      onClick={resetAttendanceForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && attendancePreviewItems.length > 0 && (
                <div className="space-y-3">
                  {attendancePreviewItems.map((attendance) => (
                    <div
                      key={attendance.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {attendance.tanggal} •{" "}
                          {attendance.status.toUpperCase()}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Siswa #{attendance.siswaId} • Mapel #
                          {attendance.mapelId} • Guru #{attendance.guruId} • Jam{" "}
                          {attendance.jamMasuk || "-"}-
                          {attendance.jamKeluar || "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditAttendance(attendance)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttendance(attendance.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                attendancePreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data absensi untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {isGradesMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitGrade}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Siswa ID"
                  type="number"
                  min={1}
                  value={gradeForm.siswaId}
                  onChange={(e) =>
                    handleGradeFieldChange("siswaId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Guru ID"
                  type="number"
                  min={1}
                  value={gradeForm.guruId}
                  onChange={(e) =>
                    handleGradeFieldChange("guruId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Mapel ID"
                  type="number"
                  min={1}
                  value={gradeForm.mapelId}
                  onChange={(e) =>
                    handleGradeFieldChange("mapelId", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Nilai"
                  type="number"
                  min={0}
                  max={100}
                  value={gradeForm.nilai}
                  onChange={(e) =>
                    handleGradeFieldChange("nilai", e.target.value)
                  }
                  required
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={gradeForm.jenis}
                  onChange={(e) =>
                    handleGradeFieldChange("jenis", e.target.value)
                  }
                >
                  <option value="tugas">Tugas</option>
                  <option value="uts">UTS</option>
                  <option value="uas">UAS</option>
                  <option value="praktik">Praktik</option>
                </select>
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="date"
                  value={gradeForm.tanggal}
                  onChange={(e) =>
                    handleGradeFieldChange("tanggal", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Tugas ID"
                  value={gradeForm.tugasId}
                  onChange={(e) =>
                    handleGradeFieldChange("tugasId", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Bobot"
                  type="number"
                  min={0}
                  max={100}
                  value={gradeForm.bobot}
                  onChange={(e) =>
                    handleGradeFieldChange("bobot", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Semester"
                  value={gradeForm.semester}
                  onChange={(e) =>
                    handleGradeFieldChange("semester", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Tahun Ajaran"
                  value={gradeForm.tahunAjaran}
                  onChange={(e) =>
                    handleGradeFieldChange("tahunAjaran", e.target.value)
                  }
                />

                <textarea
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm md:col-span-2 min-h-24"
                  placeholder="Catatan"
                  value={gradeForm.catatan}
                  onChange={(e) =>
                    handleGradeFieldChange("catatan", e.target.value)
                  }
                />

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingGrade}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingGrade
                      ? "Menyimpan..."
                      : editingGradeId !== null
                        ? "Simpan Perubahan"
                        : "Tambah Nilai"}
                  </button>
                  {editingGradeId !== null && (
                    <button
                      type="button"
                      onClick={resetGradeForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && gradePreviewItems.length > 0 && (
                <div className="space-y-3">
                  {gradePreviewItems.map((grade) => (
                    <div
                      key={grade.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          Nilai {grade.jenis.toUpperCase()} • {grade.nilai}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Siswa #{grade.siswaId} • Mapel #{grade.mapelId} • Guru
                          #{grade.guruId} • {grade.semester || "-"} •{" "}
                          {grade.tahunAjaran || "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditGrade(grade)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGrade(grade.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                gradePreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data nilai untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {isAnnouncementsMenu && (
            <div className="space-y-4">
              <form
                onSubmit={handleSubmitAnnouncement}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Judul Pengumuman"
                  value={announcementForm.title}
                  onChange={(e) =>
                    handleAnnouncementFieldChange("title", e.target.value)
                  }
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Target (contoh: all/admin/guru/siswa)"
                  value={announcementForm.target}
                  onChange={(e) =>
                    handleAnnouncementFieldChange("target", e.target.value)
                  }
                />

                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={announcementForm.priority}
                  onChange={(e) =>
                    handleAnnouncementFieldChange("priority", e.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <select
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={announcementForm.isPublished ? "true" : "false"}
                  onChange={(e) =>
                    handleAnnouncementFieldChange(
                      "isPublished",
                      e.target.value === "true",
                    )
                  }
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="datetime-local"
                  value={announcementForm.publishAt}
                  onChange={(e) =>
                    handleAnnouncementFieldChange("publishAt", e.target.value)
                  }
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  type="datetime-local"
                  value={announcementForm.expiredAt}
                  onChange={(e) =>
                    handleAnnouncementFieldChange("expiredAt", e.target.value)
                  }
                />

                <textarea
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm md:col-span-2 min-h-28"
                  placeholder="Isi pengumuman"
                  value={announcementForm.content}
                  onChange={(e) =>
                    handleAnnouncementFieldChange("content", e.target.value)
                  }
                  required
                />

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingAnnouncement}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingAnnouncement
                      ? "Menyimpan..."
                      : editingAnnouncementId !== null
                        ? "Simpan Perubahan"
                        : "Tambah Pengumuman"}
                  </button>
                  {editingAnnouncementId !== null && (
                    <button
                      type="button"
                      onClick={resetAnnouncementForm}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm font-semibold text-[#374151]"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {!isLoading && announcementPreviewItems.length > 0 && (
                <div className="space-y-3">
                  {announcementPreviewItems.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {announcement.title}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {announcement.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DCE7F8] text-[#374151]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteAnnouncement(announcement.id)
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                announcementPreviewItems.length === 0 &&
                !errorMessage && (
                  <p className="text-sm text-[#6B7280]">
                    Belum ada data pengumuman untuk ditampilkan.
                  </p>
                )}
            </div>
          )}

          {(isProfileMenu || isSettingsMenu) && (
            <div className="space-y-4">
              <form
                onSubmit={handleSaveProfile}
                className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Nama Lengkap"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  placeholder="Email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value={role}
                  disabled
                />

                <input
                  className="px-3 py-2 rounded-lg border border-[#DCE7F8] bg-white text-sm"
                  value="Sinkron ke local session"
                  disabled
                />

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#8A52E8] text-white text-sm font-semibold disabled:opacity-60"
                  >
                    {isSavingProfile ? "Menyimpan..." : "Simpan Pengaturan"}
                  </button>
                </div>
              </form>

              <div className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#111827] mb-1">
                  Catatan Penggunaan
                </p>
                <p className="text-xs text-[#6B7280]">
                  Perubahan profil di sini tersimpan di sesi login saat ini agar
                  tampilan nama/email di dashboard langsung sinkron.
                </p>
              </div>
            </div>
          )}

          {!isStudentsMenu &&
            !isTeachersMenu &&
            !isClassesMenu &&
            !isSubjectsMenu &&
            !isScheduleMenu &&
            !isAttendanceMenu &&
            !isGradesMenu &&
            !isAnnouncementsMenu &&
            !isSettingsMenu &&
            !isProfileMenu &&
            !isLoading &&
            !errorMessage &&
            filteredPreviewItems.length === 0 && (
              <p className="text-sm text-[#6B7280]">
                Belum ada data untuk ditampilkan.
              </p>
            )}

          {!isStudentsMenu &&
            !isTeachersMenu &&
            !isClassesMenu &&
            !isSubjectsMenu &&
            !isScheduleMenu &&
            !isAttendanceMenu &&
            !isGradesMenu &&
            !isAnnouncementsMenu &&
            !isSettingsMenu &&
            !isProfileMenu &&
            !isLoading &&
            !errorMessage &&
            filteredPreviewItems.length > 0 && (
              <div className="space-y-3">
                {filteredPreviewItems.map((item, idx) => (
                  <div
                    key={String(item.id ?? item.uuid ?? idx)}
                    className="bg-[#EEF4FF] border border-[#DCE7F8] rounded-xl p-4"
                  >
                    <p className="text-sm font-semibold text-[#111827]">
                      {menuConfig.primaryText(item)}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {menuConfig.secondaryText(item)}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
