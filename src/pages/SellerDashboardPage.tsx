// src/pages/Seller/SellerDashboardPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Shop } from "../hooks/useShop";
import { SellerLayout } from "../components/layouts/SellerLayout";


// Karena kita mengirim props dari Layout, kita definisikan interface-nya
interface DashboardProps {
  activeShop?: Shop | null;
  isShopsLoading?: boolean;
}

// Gunakan komponen internal agar bisa menerima props dari Layout
const DashboardContent: React.FC<DashboardProps> = ({ activeShop, isShopsLoading }) => {
  if (isShopsLoading) {
    return <div className="text-center py-10 text-gray-500">Memuat data toko...</div>;
  }

  // KONDISI 1: User belum memiliki toko sama sekali
  if (!activeShop) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-2xl mx-auto mt-10">
        <div className="text-6xl mb-4">🏪</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Kamu belum memiliki toko</h2>
        <p className="text-gray-500 mb-8">
          Mulai hasilkan uang dengan menjual produk atau buku kuliahmu ke sesama mahasiswa Universitas Ciputra.
        </p>
        <Link 
          to="/seller/create-shop" 
          className="inline-block px-8 py-3 bg-[#00AA5B] text-white font-semibold rounded-lg hover:bg-[#008f4c] transition-colors"
        >
          + Buka Toko Sekarang
        </Link>
      </div>
    );
  }

  // KONDISI 2: User sudah punya minimal 1 toko
  const stats = [
    { title: "Total Penjualan", value: "Rp 0", color: "text-[#00AA5B]" },
    { title: "Pesanan Baru", value: "0", color: "text-blue-600" },
    { title: "Produk Aktif", value: "0", color: "text-purple-600" },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Performa {activeShop.name} 📈
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Lokasi Pengiriman: {activeShop.district}, {activeShop.city}
          </p>
        </div>
        
        {/* Kelompok Tombol Aksi */}
        <div className="flex items-center gap-3">
          <Link 
            to="/seller/create-shop" 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            + Tambah Toko Baru
          </Link>
          <Link 
            to="/seller/products/add" 
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            + Tambah Produk Baru
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.title}</h3>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Pesanan Terbaru</h2>
        </div>
        <div className="p-6 text-center text-gray-500 py-12">
          Belum ada pesanan masuk untuk toko ini.
        </div>
      </div>
    </>
  );
};

// Ekspor komponen utama yang dibungkus Layout
export default function SellerDashboardPage() {
  return (
    <SellerLayout>
      <DashboardContent />
    </SellerLayout>
  );
}