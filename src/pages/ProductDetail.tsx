// src/pages/Product/ProductDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProductDetail } from "../hooks/useProductDetail";
import { MainLayout } from "../components/layouts/MainLayout";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Panggil data produk dari Hook
  const { product, isLoading, error } = useProductDetail(id);
  // State untuk mengatur jumlah pesanan
  const [quantity, setQuantity] = useState<number>(1);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Fungsi Tambah ke Keranjang
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert(
        "Silakan login terlebih dahulu untuk menambahkan barang ke keranjang.",
      );
      navigate("/login");
      return;
    }

    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");

      await fetch("http://localhost:2000/cart/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-service-password": "passwordAPIGateway",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: product?.id, quantity }),
      });

      // Simulasi loading
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert("Berhasil ditambahkan ke keranjang! 🛒");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan ke keranjang.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fungsi Checkout Langsung
  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk melakukan pembelian.");
      navigate("/login");
      return;
    }
    // Arahkan ke halaman checkout dengan membawa data produk dan kuantitas
    navigate("/checkout", { state: { product, quantity } });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat detail produk...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 max-w-2xl mt-10">
          <span className="text-4xl block mb-3">⚠️</span>
          <p className="font-semibold">
            Produk tidak ditemukan atau terjadi kesalahan.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 py-10 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Kolom Kiri: Gambar Produk (5 kolom) */}
              <div className="md:col-span-5 p-6 md:p-8 flex justify-center items-start bg-white md:border-r border-gray-100">
                <div className="w-full aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                  <img
                   src={`${import.meta.env.VITE_API_URL}/storage/${product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Kolom Tengah: Detail Info (4 kolom) */}
              <div className="md:col-span-4 p-6 md:p-8 md:border-r border-gray-100">
                {/* Kategori / Breadcrumb */}
                <p className="text-sm text-blue-600 font-semibold mb-3 tracking-wide uppercase">
                  {product.category || "Kategori Umum"}
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                  {product.name}
                </h1>

                {/* Meta info produk */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <p className="text-sm text-gray-500">
                    Terjual{" "}
                    <span className="font-semibold text-gray-700">12+</span>
                  </p>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm text-gray-500">
                    Berat{" "}
                    <span className="font-semibold text-gray-700">
                      {product.weight} gr
                    </span>
                  </p>
                </div>

                {/* Harga */}
                <div className="mb-8">
                  <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {formatRupiah(product.price)}
                  </p>
                </div>

                {/* Deskripsi Produk */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    Detail Produk
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Info Toko */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-auto">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-lg shadow-sm border border-blue-200">
                    {product.shop_name?.charAt(0) || "T"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">
                      {product.shop_name || "Toko Mahasiswa"}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Beroperasi di Surabaya
                    </p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Beli / Keranjang (3 kolom) */}
              <div className="md:col-span-3 p-6 bg-slate-50">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Atur Jumlah Catatan
                  </h3>

                  {/* Pengatur Kuantitas */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10 shadow-sm">
                      <button
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="w-10 h-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold disabled:opacity-50 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-12 h-full text-center text-sm font-bold border-x border-gray-300 focus:outline-none bg-white"
                      />
                      <button
                        onClick={handleIncrease}
                        disabled={quantity >= product.stock}
                        className="w-10 h-full bg-gray-50 hover:bg-gray-100 text-blue-600 font-bold disabled:opacity-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Stok:{" "}
                      <span className="font-bold text-gray-700">
                        {product.stock > 0 ? product.stock : "Habis"}
                      </span>
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200 mb-6">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-bold text-xl text-gray-800">
                      {formatRupiah(product.price * quantity)}
                    </span>
                  </div>

                  {/* Tombol Aksi */}
                  {product.stock > 0 ? (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={isActionLoading}
                        className="w-full py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors duration-200 flex justify-center items-center gap-2"
                      >
                        {isActionLoading ? (
                          <span className="animate-pulse">Memproses...</span>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Keranjang
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCheckout}
                        disabled={isActionLoading}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-200"
                      >
                        Beli Langsung
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed"
                    >
                      Stok Habis
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
