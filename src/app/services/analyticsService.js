// Analytics & Reporting Service
// Menggunakan localStorage dan dummy data

import { getSiswaList } from './siswaService';
import { getGuruList } from './guruService';
import { getKelasList } from './kelasService';
import { getMapelList } from './mapelService';
import { getNilaiList } from './nilaiService';
import { getAbsensiList } from './absensiService';
import { getAuditStats } from './auditService';

/**
 * Get dashboard analytics untuk Admin
 * @returns {Object} Analytics data
 */
export async function getAdminAnalytics() {
  try {
    const [students, teachers, classes, subjects, grades, attendance] = await Promise.all([
      getSiswaList(),
      getGuruList(),
      getKelasList(),
      getMapelList(),
      getNilaiList(),
      getAbsensiList(),
    ]);
    
    const auditStats = getAuditStats();
    
    // Student statistics
    const studentByGender = {
      laki: students.filter(s => s.gender === 'laki-laki').length,
      perempuan: students.filter(s => s.gender === 'perempuan').length,
    };
    
    const studentsByClass = classes.map(cls => ({
      className: cls.name,
      count: students.filter(s => s.classId === cls.id || s.kelas === cls.name).length,
      capacity: cls.capacity || 40,
    }));
    
    // Grade statistics
    const avgGrade = grades.length > 0 
      ? (grades.reduce((sum, g) => sum + parseFloat(g.nilai || g.score || 0), 0) / grades.length).toFixed(2)
      : 0;
    
    const gradeDistribution = {
      excellent: grades.filter(g => (g.nilai || g.score) >= 90).length,
      good: grades.filter(g => {
        const score = g.nilai || g.score;
        return score >= 75 && score < 90;
      }).length,
      average: grades.filter(g => {
        const score = g.nilai || g.score;
        return score >= 60 && score < 75;
      }).length,
      poor: grades.filter(g => (g.nilai || g.score) < 60).length,
    };
    
    // Attendance statistics
    const attendanceRate = attendance.length > 0
      ? ((attendance.filter(a => a.status === 'hadir').length / attendance.length) * 100).toFixed(2)
      : 0;
    
    const attendanceByStatus = {
      hadir: attendance.filter(a => a.status === 'hadir').length,
      sakit: attendance.filter(a => a.status === 'sakit').length,
      izin: attendance.filter(a => a.status === 'izin').length,
      alpha: attendance.filter(a => a.status === 'alpha').length,
    };
    
    return {
      overview: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classes.length,
        totalSubjects: subjects.length,
        avgGrade: parseFloat(avgGrade),
        attendanceRate: parseFloat(attendanceRate),
      },
      studentStats: {
        byGender: studentByGender,
        byClass: studentsByClass,
      },
      gradeStats: {
        distribution: gradeDistribution,
        avgGrade: parseFloat(avgGrade),
      },
      attendanceStats: {
        byStatus: attendanceByStatus,
        rate: parseFloat(attendanceRate),
      },
      auditStats,
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
}

/**
 * Get teacher analytics
 * @param {string} teacherId 
 * @returns {Object}
 */
export async function getTeacherAnalytics(teacherId) {
  try {
    const grades = await getNilaiList();
    const attendance = await getAbsensiList();
    
    const teacherGrades = grades.filter(g => g.guruId === teacherId || g.teacherId === teacherId);
    const avgGrade = teacherGrades.length > 0
      ? (teacherGrades.reduce((sum, g) => sum + parseFloat(g.nilai || g.score || 0), 0) / teacherGrades.length).toFixed(2)
      : 0;
    
    return {
      totalGrades: teacherGrades.length,
      avgGrade: parseFloat(avgGrade),
      gradeDistribution: {
        excellent: teacherGrades.filter(g => (g.nilai || g.score) >= 90).length,
        good: teacherGrades.filter(g => {
          const score = g.nilai || g.score;
          return score >= 75 && score < 90;
        }).length,
        average: teacherGrades.filter(g => {
          const score = g.nilai || g.score;
          return score >= 60 && score < 75;
        }).length,
        poor: teacherGrades.filter(g => (g.nilai || g.score) < 60).length,
      },
    };
  } catch (error) {
    console.error('Error getting teacher analytics:', error);
    return null;
  }
}

/**
 * Get student analytics
 * @param {string} studentId 
 * @returns {Object}
 */
export async function getStudentAnalytics(studentId) {
  try {
    const grades = await getNilaiList();
    const attendance = await getAbsensiList();
    
    const studentGrades = grades.filter(g => g.siswaId === studentId || g.studentId === studentId);
    const studentAttendance = attendance.filter(a => a.siswaId === studentId || a.studentId === studentId);
    
    const avgGrade = studentGrades.length > 0
      ? (studentGrades.reduce((sum, g) => sum + parseFloat(g.nilai || g.score || 0), 0) / studentGrades.length).toFixed(2)
      : 0;
    
    const attendanceRate = studentAttendance.length > 0
      ? ((studentAttendance.filter(a => a.status === 'hadir').length / studentAttendance.length) * 100).toFixed(2)
      : 0;
    
    return {
      totalGrades: studentGrades.length,
      avgGrade: parseFloat(avgGrade),
      attendanceRate: parseFloat(attendanceRate),
      attendanceSummary: {
        hadir: studentAttendance.filter(a => a.status === 'hadir').length,
        sakit: studentAttendance.filter(a => a.status === 'sakit').length,
        izin: studentAttendance.filter(a => a.status === 'izin').length,
        alpha: studentAttendance.filter(a => a.status === 'alpha').length,
      },
      gradeBySubject: studentGrades.reduce((acc, grade) => {
        const subject = grade.mapel || grade.subject;
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(parseFloat(grade.nilai || grade.score));
        return acc;
      }, {}),
    };
  } catch (error) {
    console.error('Error getting student analytics:', error);
    return null;
  }
}

/**
 * Generate report summary
 * @param {string} type - 'student', 'teacher', 'class', 'general'
 * @param {string} id - Entity ID
 * @returns {Object}
 */
export async function generateReport(type, id = null) {
  if (type === 'general') {
    return await getAdminAnalytics();
  } else if (type === 'student' && id) {
    return await getStudentAnalytics(id);
  } else if (type === 'teacher' && id) {
    return await getTeacherAnalytics(id);
  }
  
  return null;
}

/**
 * Get chart data for visualization
 * @param {string} chartType - 'student_gender', 'grade_distribution', 'attendance_status', 'students_by_class'
 * @returns {Array} Chart data
 */
export async function getChartData(chartType) {
  const analytics = await getAdminAnalytics();
  
  if (!analytics) return [];
  
  switch (chartType) {
    case 'student_gender':
      return [
        { name: 'Laki-laki', value: analytics.studentStats.byGender.laki },
        { name: 'Perempuan', value: analytics.studentStats.byGender.perempuan },
      ];
    
    case 'grade_distribution':
      return [
        { name: 'Sangat Baik (90-100)', value: analytics.gradeStats.distribution.excellent },
        { name: 'Baik (75-89)', value: analytics.gradeStats.distribution.good },
        { name: 'Cukup (60-74)', value: analytics.gradeStats.distribution.average },
        { name: 'Kurang (<60)', value: analytics.gradeStats.distribution.poor },
      ];
    
    case 'attendance_status':
      return [
        { name: 'Hadir', value: analytics.attendanceStats.byStatus.hadir },
        { name: 'Sakit', value: analytics.attendanceStats.byStatus.sakit },
        { name: 'Izin', value: analytics.attendanceStats.byStatus.izin },
        { name: 'Alpha', value: analytics.attendanceStats.byStatus.alpha },
      ];
    
    case 'students_by_class':
      return analytics.studentStats.byClass.map(c => ({
        name: c.className,
        value: c.count,
      }));
    
    default:
      return [];
  }
}