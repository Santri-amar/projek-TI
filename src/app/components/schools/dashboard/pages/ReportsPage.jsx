import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  School, 
  TrendingUp, 
  Download, 
  FileText, 
  PieChart,
  Calendar,
  Award,
  Activity,
  Printer
} from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "../../../ui/PageHeader";
import { getAdminAnalytics, getChartData } from "../../../../services/analyticsService";
import { exportStudents, exportTeachers, exportGrades } from "../../../../services/exportService";

export function ReportsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({
    gender: [],
    grades: [],
    attendance: [],
    byClass: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getAdminAnalytics();
      setAnalytics(data);
      
      // Load chart data
      const [genderData, gradeData, attendanceData, classData] = await Promise.all([
        getChartData('student_gender'),
        getChartData('grade_distribution'),
        getChartData('attendance_status'),
        getChartData('students_by_class'),
      ]);
      
      setChartData({
        gender: genderData,
        grades: gradeData,
        attendance: attendanceData,
        byClass: classData,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleExportStudents = async () => {
    await exportStudents();
  };

  const handleExportTeachers = async () => {
    await exportTeachers();
  };

  const handleExportGrades = async () => {
    await exportGrades();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Gagal memuat data analytics.</p>
      </div>
    );
  }

  const overview = analytics.overview;
  const maxClassCount = Math.max(...analytics.studentStats.byClass.map(c => c.count), 1);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laporan & Analytics" 
        subtitle="Analisis data akademik dan statistik sekolah" 
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <span className="text-3xl font-black">{overview.totalStudents}</span>
          </div>
          <p className="text-sm font-medium opacity-90">Total Siswa</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <GraduationCap className="w-8 h-8" />
            <span className="text-3xl font-black">{overview.totalTeachers}</span>
          </div>
          <p className="text-sm font-medium opacity-90">Total Guru</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-3xl font-black">{overview.avgGrade}</span>
          </div>
          <p className="text-sm font-medium opacity-90">Rata-rata Nilai</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <span className="text-3xl font-black">{overview.attendanceRate}%</span>
          </div>
          <p className="text-sm font-medium opacity-90">Tingkat Kehadiran</p>
        </motion.div>
      </div>

      {/* Export Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-[#E3EAF5] rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-600" />
          Export Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleExportStudents}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Export Data Siswa (Excel)
          </button>
          <button 
            onClick={handleExportTeachers}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Export Data Guru (Excel)
          </button>
          <button 
            onClick={handleExportGrades}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-50 text-purple-600 rounded-xl font-bold hover:bg-purple-100 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Export Data Nilai (Excel)
          </button>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Gender Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-[#E3EAF5] rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Distribusi Gender Siswa
          </h3>
          <div className="space-y-4">
            {chartData.gender.map((item, idx) => {
              const percentage = overview.totalStudents > 0 
                ? ((item.value / overview.totalStudents) * 100).toFixed(1) 
                : 0;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900">{item.value} ({percentage}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-pink-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-[#E3EAF5] rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Distribusi Nilai Siswa
          </h3>
          <div className="space-y-4">
            {chartData.grades.map((item, idx) => {
              const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-red-500'];
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900">{item.value} siswa</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / Math.max(...chartData.grades.map(g => g.value))) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className={`h-full rounded-full ${colors[idx]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Attendance Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white border border-[#E3EAF5] rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Statistik Kehadiran
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Hadir', value: analytics.attendanceStats.byStatus.hadir, color: 'bg-green-500', textColor: 'text-green-600' },
              { label: 'Sakit', value: analytics.attendanceStats.byStatus.sakit, color: 'bg-blue-500', textColor: 'text-blue-600' },
              { label: 'Izin', value: analytics.attendanceStats.byStatus.izin, color: 'bg-amber-500', textColor: 'text-amber-600' },
              { label: 'Alpha', value: analytics.attendanceStats.byStatus.alpha, color: 'bg-red-500', textColor: 'text-red-600' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-slate-50 rounded-xl">
                <div className={`text-3xl font-black ${item.textColor} mb-1`}>{item.value}</div>
                <p className="text-sm font-medium text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Students by Class */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white border border-[#E3EAF5] rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
            <School className="w-5 h-5 text-purple-600" />
            Siswa per Kelas
          </h3>
          <div className="space-y-3">
            {analytics.studentStats.byClass.map((item, idx) => {
              const percentage = (item.count / maxClassCount) * 100;
              const capacityPercentage = (item.count / item.capacity) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.className}</span>
                    <span className="font-bold text-slate-900">{item.count}/{item.capacity}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                      className={`h-full rounded-full ${capacityPercentage >= 90 ? 'bg-red-500' : 'bg-indigo-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Audit Statistics */}
      {analytics.auditStats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white border border-[#E3EAF5] rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Statistik Aktivitas Sistem
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-black text-blue-600 mb-1">{analytics.auditStats.totalLogs}</div>
              <p className="text-xs font-medium text-slate-600">Total Log</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-black text-green-600 mb-1">{analytics.auditStats.todayLogs}</div>
              <p className="text-xs font-medium text-slate-600">Hari Ini</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-black text-purple-600 mb-1">{analytics.auditStats.weekLogs}</div>
              <p className="text-xs font-medium text-slate-600">Minggu Ini</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-black text-amber-600 mb-1">{analytics.auditStats.monthLogs}</div>
              <p className="text-xs font-medium text-slate-600">Bulan Ini</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}