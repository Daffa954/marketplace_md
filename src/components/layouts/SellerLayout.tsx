// src/components/layouts/SellerLayout.tsx
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useShops } from "../../hooks/useShop";


interface SellerLayoutProps {
  children: React.ReactNode;
}

export const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userProfile, fetchProfile } = useAuth();
  
  // Ambil data toko
  const { shops, activeShop, isLoading: isShopsLoading, changeActiveShop } = useShops();

  useEffect(() => {
    if (!userProfile) fetchProfile();
  }, [userProfile, fetchProfile]);

  const menuItems = [
    { name: "Ringkasan", path: "/seller", icon: "📊" },
    { name: "Produk Saya", path: "/seller/products", icon: "📦" },
    { name: "Pesanan Masuk", path: "/seller/orders", icon: "🛒" },
    { name: "Pengaturan Toko", path: "/seller/settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : "TM";

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#00AA5B]">UC Seller Center</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
             <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === item.path ? "bg-green-50 text-[#00AA5B]" : "text-gray-600 hover:bg-gray-100"}`}>
               <span>{item.icon}</span>{item.name}
             </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">
            <span>🚪</span> Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            {menuItems.find((m) => m.path === location.pathname)?.name || "Dasbor Seller"}
          </h1>
          
          <div className="flex items-center gap-6">
            {/* SWITCHER TOKO */}
            {!isShopsLoading && shops.length > 0 && (
              <div className="flex items-center gap-2 border-r border-gray-200 pr-6">
                <span className="text-sm text-gray-500">Toko Aktif:</span>
                <select 
                  className="text-sm font-semibold bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#00AA5B]"
                  value={activeShop?.id || ""}
                  onChange={(e) => changeActiveShop(Number(e.target.value))}
                >
                  {shops.map(shop => (
                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* PROFIL USER */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">
                {userProfile?.fullname || "Memuat..."}
              </span>
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold tracking-widest">
                {getInitials(userProfile?.fullname)}
              </div>
            </div>
          </div>
        </header>

        {/* Kirim activeShop ke halaman di dalamnya */}
        <div className="p-8 flex-1">
          {/* Menggunakan teknik React Clone Element untuk melempar props (Atau bisa pakai Context, tapi ini lebih simpel untuk layout) */}
          {React.isValidElement(children) 
            ? React.cloneElement(children as React.ReactElement<any>, { activeShop, isShopsLoading }) 
            : children}
        </div>
      </main>
    </div>
  );
};