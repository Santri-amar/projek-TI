import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import "./StudentsPage.css"; 

export function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState("7A");

  const scheduleData = [
    { time: "07:40 - 08:20", mon: "Upacara", tue: { s: "B.Indo", t: "Lilis Lusiana" }, wed: { s: "Mat", t: "Hj. Setiya Rohman" }, thu: { s: "B.Indo", t: "Lilis Lusiana" }, fri: "" },
    { time: "08:20 - 09:00", mon: { s: "IPA", t: "(Wahyu)" }, tue: { s: "B.Indo", t: "Lilis Lusiana" }, wed: { s: "Mat", t: "Hj. Setiya Rohman" }, thu: { s: "B.Indo", t: "Lilis Lusiana" }, fri: "" },
    { time: "09:00 - 09:40", mon: { s: "IPA", t: "(Wahyu)" }, tue: { s: "B.Ingg", t: "Ade Rokhman" }, wed: { s: "Mat", t: "Hj. Setiya Rohman" }, thu: { s: "IPS", t: "Sugiarto" }, fri: { s: "IPA", t: "Wahyu" } },
    { time: "10:00 - 10:40", mon: { s: "IPA", t: "(Wahyu)" }, tue: { s: "B.Ingg", t: "Ade Rokhman" }, wed: { s: "PAI", t: "Encep Rahmat" }, thu: { s: "IPS", t: "Sugiarto" }, fri: { s: "IPA", t: "Wahyu" } },
    { time: "10:40 - 11:20", mon: { s: "PPKN", t: "Sriwastuti" }, tue: { s: "DTW", t: "Yeni Yan Yuliani" }, wed: { s: "PAI", t: "Encep Rahmat" }, thu: { s: "DTW", t: "Yeni Yan Yuliani" }, fri: { s: "Mat", t: "Hj. Setiya Rohman" } },
    { time: "11:20 - 12:00", mon: { s: "PPKN", t: "Sriwastuti" }, tue: { s: "DTW", t: "Yeni Yan Yuliani" }, wed: { s: "PAI", t: "Encep Rahmat" }, thu: { s: "OR", t: "Maman" }, fri: { s: "Mat", t: "Hj. Setiya Rohman" } },
  ];

  const renderCell = (data) => {
    if (!data) return null;
    if (typeof data === 'string') return <span className="schedule-subject">{data}</span>;
    return (
      <>
        <span className="schedule-subject">{data.s}</span>
        <span className="schedule-teacher">{data.t}</span>
      </>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Jadwal</h1>

      <div className="form-section-card shadow-xl shadow-black/[0.02]">
        <div className="view-content space-y-12 py-12">
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
             <div className="flex flex-col items-center gap-4">
                <span className="text-sm font-extrabold text-[#030213]">Kelas</span>
                <button className="flex items-center justify-between gap-4 px-6 py-2 bg-white border border-slate-200 rounded-lg w-48 font-bold text-xs">
                  <span>7A</span>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>
             </div>
             <div className="flex flex-col items-center gap-4">
                <span className="text-sm font-extrabold text-[#030213]">Guru</span>
                <button className="flex items-center justify-between gap-4 px-6 py-2 bg-white border border-slate-200 rounded-lg w-48 font-bold text-xs">
                  <span></span>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>
             </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-center text-xl font-extrabold text-[#030213]">Jadwal Pelajaran Siswa</h2>
            
            <div className="schedule-table-container mx-auto max-w-5xl">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th className="w-32">Jam</th>
                    <th>Senin</th>
                    <th>Selasa</th>
                    <th>Rabu</th>
                    <th>Kamis</th>
                    <th>Jum'at</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="schedule-time-col">{row.time}</td>
                      <td className="schedule-cell">{renderCell(row.mon)}</td>
                      <td className="schedule-cell">{renderCell(row.tue)}</td>
                      <td className="schedule-cell">{renderCell(row.wed)}</td>
                      <td className="schedule-cell">{renderCell(row.thu)}</td>
                      <td className="schedule-cell">{renderCell(row.fri)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
