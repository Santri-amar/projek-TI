import { ArrowLeft, Save, Send } from "lucide-react";

export function AddTeacherPage({ onBack }) {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#030213]" />
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Tambah Guru</h1>
        </div>
      </div>

      <form className="space-y-8">
        {/* Detail Pribadi */}
        <div className="form-section-card">
          <div className="form-section-header">Detail Pribadi</div>
          <div className="form-section-content grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="form-label">Nama Depan *</label>
              <input type="text" className="form-input w-full" placeholder="Maria" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Nama Belakang *</label>
              <input type="text" className="form-input w-full" placeholder="Historia" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input w-full" placeholder="Historia@mail.com" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">No. Telepon *</label>
              <input type="tel" className="form-input w-full" placeholder="+1234567890" required />
            </div>
            <div className="md:col-span-1 space-y-2">
              <label className="form-label">Alamat Lengkap *</label>
              <textarea className="form-input form-textarea w-full" placeholder="Jl. Raya No. 123..." required></textarea>
            </div>
            <div className="space-y-2">
              <label className="form-label">Pas Foto *</label>
              <div className="file-upload-zone">
                <p>Drag and drop or click here to select file</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="form-label">Tanggal Lahir *</label>
              <input type="date" className="form-input w-full" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Tempat Lahir *</label>
              <input type="text" className="form-input w-full" placeholder="Jakarta, Indonesia" required />
            </div>
          </div>
        </div>

        {/* Pendidikan */}
        <div className="form-section-card">
          <div className="form-section-header">Pendidikan</div>
          <div className="form-section-content grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="form-label">Universitas *</label>
              <input type="text" className="form-input w-full" placeholder="University Academy Historia" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Gelar / Jurusan *</label>
              <input type="text" className="form-input w-full" placeholder="History Major" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Tanggal Mulai & Selesai *</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" className="form-input w-full" placeholder="September 2013" />
                <input type="text" className="form-input w-full" placeholder="September 2017" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="form-label">Kota *</label>
              <input type="text" className="form-input w-full" placeholder="Yogyakarta, Indonesia" required />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button type="button" className="btn-draft flex items-center gap-2">
             <Save className="w-4 h-4" />
             Simpan sebagai Draf
          </button>
          <button type="submit" className="btn-submit flex items-center gap-2">
             <Send className="w-4 h-4" />
             Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
