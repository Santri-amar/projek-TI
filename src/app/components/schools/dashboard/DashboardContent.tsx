interface DashboardContentProps {
  role: "admin" | "guru" | "siswa";
  userName: string;
  activeMenu: string;
}

export function DashboardContent({ role, userName, activeMenu }: DashboardContentProps) {
  // This component will render different pages based on activeMenu
  // TODO: Implement different pages for each menu item
  // For now, show a simple message

  return (
    <div className="p-8">
      <div className="bg-[#F5F5F5] rounded-[20px] p-8">
        <h2 className="text-2xl font-bold text-black mb-4">
          {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1).replace('-', ' ')}
        </h2>
        <p className="text-gray-600">
          Halaman ini siap untuk integrasi dengan API. Data akan dimuat dari endpoint yang sesuai.
        </p>
        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500">
            <strong>Role:</strong> {role} | <strong>Menu:</strong> {activeMenu}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            TODO: Implementasi konten untuk menu "{activeMenu}" dengan data dari API
          </p>
        </div>
      </div>
    </div>
  );
}
