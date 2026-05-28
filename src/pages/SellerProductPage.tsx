// src/pages/Seller/SellerProductsPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Shop } from "../hooks/useShop";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { SellerLayout } from "../components/layouts/SellerLayout";

interface SellerProductsProps {
  activeShop?: Shop | null;
  isShopsLoading?: boolean;
}

const SellerProductsContent: React.FC<SellerProductsProps> = ({
  activeShop,
  isShopsLoading,
}) => {
  // Panggil hook untuk mendapatkan data produk
  const { products, isLoading, error } = useSellerProducts(activeShop);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  if (isShopsLoading) {
    return (
      <div className="text-center py-10 text-gray-500">Memuat data toko...</div>
    );
  }

  // Jika belum punya toko
  if (!activeShop) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          Kamu belum memiliki toko
        </h2>
        <p className="text-gray-500 mt-2 mb-6">
          Buka toko terlebih dahulu untuk mengelola produk.
        </p>
        <Link
          to="/seller/create-shop"
          className="px-6 py-2 bg-[#00AA5B] text-white rounded-lg font-medium"
        >
          + Buka Toko
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Produk Saya 📦</h2>
          <p className="text-gray-500 text-sm mt-1">
            Kelola semua produk di toko{" "}
            <span className="font-semibold">{activeShop.name}</span>
          </p>
        </div>
        <Link
          to="/seller/products/add"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Produk
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Tabel Produk */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Info Produk</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold">Stok</th>
                <th className="px-6 py-4 font-semibold">Berat</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Memuat daftar produk...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    <div className="text-4xl mb-3">🛍️</div>
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      Belum ada produk
                    </p>
                    <p className="text-sm">
                      Toko ini masih kosong. Yuk, tambahkan produk pertamamu!
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {/* Pastikan URL gambar lengkap dari backend (Storage::url) */}
                      {product.product_image ? (
                        <img
                          src={`http://localhost:8002/storage/${product.product_image}`}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {product.name}
                        </p>
                        {/* Jika ada relasi kategori, tampilkan di sini */}
                        <p className="text-xs text-gray-400">
                          {product.category?.name ||
                            "ID Kategori: " + product.category_id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#00AA5B]">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                      >
                        {product.stock} pcs
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.weight} gram</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium text-sm transition">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. Bungkus View dengan SellerLayout
export default function SellerProductsPage() {
  return (
    <SellerLayout>
      <SellerProductsContent />
    </SellerLayout>
  );
}
