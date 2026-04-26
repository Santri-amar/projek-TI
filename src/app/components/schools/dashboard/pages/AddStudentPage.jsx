import { ArrowLeft, Save, Send } from "lucide-react";

export function AddStudentPage({ onBack }) {
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
          <h1 className="text-4xl font-extrabold tracking-tight text-[#030213]">Tambah Murid</h1>
        </div>
      </div>

      <form className="space-y-8">
        {/* Detail Murid */}
        <div className="form-section-card">
          <div className="form-section-header">Detail Murid</div>
          <div className="form-section-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2 lg:row-span-2">
              <label className="form-label">Pas Foto *</label>
              <div className="file-upload-zone h-[180px] flex items-center justify-center">
                <p>Drag and drop or click here to select file</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="form-label">Nama Depan *</label>
              <input type="text" className="form-input w-full" placeholder="Samantha" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Nama Belakang *</label>
              <input type="text" className="form-input w-full" placeholder="William" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Tempat & Tanggal Lahir *</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="form-input w-full" />
                <input type="text" className="form-input w-full" placeholder="Jakarta" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="form-label">Nama Orang Tua *</label>
              <input type="text" className="form-input w-full" placeholder="Mona William" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input w-full" placeholder="william@mail.com" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">No. Telepon *</label>
              <input type="tel" className="form-input w-full" placeholder="+1234567890" required />
            </div>
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="form-label">Alamat Lengkap *</label>
              <textarea className="form-input form-textarea w-full" placeholder="Jl. Raya No. 123..." required></textarea>
            </div>
          </div>
        </div>

        {/* Detail Orang Tua */}
        <div className="form-section-card">
          <div className="form-section-header">Detail Orang Tua</div>
          <div className="form-section-content grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="form-label">Nama Depan *</label>
              <input type="text" className="form-input w-full" placeholder="Mona" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Last Name *</label>
              <input type="text" className="form-input w-full" placeholder="William" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input w-full" placeholder="Mona@mail.com" required />
            </div>
            <div className="space-y-2">
              <label className="form-label">No. Telepon *</label>
              <input type="tel" className="form-input w-full" placeholder="+1234567890" required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="form-label">Alamat *</label>
              <textarea className="form-input form-textarea w-full" placeholder="Jl. Raya No. 123..." required></textarea>
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
