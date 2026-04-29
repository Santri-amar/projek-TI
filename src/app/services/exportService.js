// Export Service - Export data to PDF, Excel, CSV
// Menggunakan localStorage dan simulation

import { getSiswaList } from './siswaService';
import { getGuruList } from './guruService';
import { getNilaiList } from './nilaiService';
import { getAbsensiList } from './absensiService';

/**
 * Export data to CSV
 * @param {Array} data - Array of objects
 * @param {string} filename - Nama file
 */
export function exportToCSV(data, filename = 'export') {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk di-export!');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value || '').replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to JSON
 * @param {Array} data 
 * @param {string} filename 
 */
export function exportToJSON(data, filename = 'export') {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk di-export!');
    return;
  }
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel (HTML table format)
 * @param {Array} data 
 * @param {string} filename 
 * @param {string} title - Judul tabel
 */
export function exportToExcel(data, filename = 'export', title = 'Data Export') {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk di-export!');
    return;
  }
  
  const headers = Object.keys(data[0]);
  
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${title}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Exported: ${new Date().toLocaleString('id-ID')}</p>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h.toUpperCase()}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.map(row => 
            `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print data as report
 * @param {Array} data 
 * @param {string} title 
 */
export function printReport(data, title = 'Laporan') {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk di-print!');
    return;
  }
  
  const headers = Object.keys(data[0]);
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 30px; }
        .footer { margin-top: 30px; text-align: right; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Sistem Informasi Sekolah - SMA Negeri 1</p>
        <p>Dicetak: ${new Date().toLocaleString('id-ID')}</p>
      </div>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.map(row => 
            `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>Total Records: ${data.length}</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

/**
 * Export students data
 * @param {Array} students 
 */
export async function exportStudents() {
  const students = await getSiswaList();
  exportToExcel(students, 'data_siswa', 'Data Siswa SMA Negeri 1');
}

/**
 * Export teachers data
 * @param {Array} teachers 
 */
export async function exportTeachers() {
  const teachers = await getGuruList();
  exportToExcel(teachers, 'data_guru', 'Data Guru SMA Negeri 1');
}

/**
 * Export grades data
 * @param {Array} grades 
 */
export async function exportGrades() {
  const grades = await getNilaiList();
  exportToExcel(grades, 'data_nilai', 'Data Nilai Siswa');
}

/**
 * Export attendance data
 * @param {Array} attendance 
 */
export async function exportAttendance() {
  const attendance = await getAbsensiList();
  exportToExcel(attendance, 'data_absensi', 'Data Absensi Siswa');
}
