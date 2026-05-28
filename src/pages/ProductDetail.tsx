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
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
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
      alert("Silakan login terlebih dahulu untuk menambahkan barang ke keranjang.");
      navigate("/login");
      return;
    }

    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      // TODO: Tembak ke API Keranjang kamu (Cart Service)
      // Contoh:
      
      await fetch("http://localhost:2000/cart/products", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "x-service-password": "passwordAPIGateway", "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product?.id, quantity })
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
        <div className="container mx-auto px-4 py-20 text-center text-gray-500">Memuat detail produk...</div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center text-red-500">
          ⚠️ Produk tidak ditemukan atau terjadi kesalahan.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              
              {/* Kolom Kiri: Gambar Produk (5 kolom) */}
              <div className="md:col-span-5 p-8 flex justify-center items-start bg-white border-r border-gray-100">
                <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                  
                    <img 
                      src={`http://localhost:8002/storage/${product.image_url}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      
                    />
                  
                  
                </div>
              </div>

              {/* Kolom Tengah: Detail Info (4 kolom) */}
              <div className="md:col-span-4 p-8 border-r border-gray-100">
                <p className="text-sm text-[#00AA5B] font-medium mb-2">Buku Kuliah &gt; Teknik Informatika</p>
                <h1 className="text-2xl font-bold text-gray-800 mb-2 leading-snug">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-sm text-gray-500">Terjual <span className="font-semibold text-gray-700">12+</span></p>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm text-gray-500">Berat <span className="font-semibold text-gray-700">{product.weight} gr</span></p>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-extrabold text-gray-900">{formatRupiah(product.price)}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Deskripsi Produk</h3>
                  <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                    {product.shop?.name?.charAt(0) || "T"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{product.shop?.name || "Toko Mahasiswa"}</p>
                    <p className="text-xs text-gray-500">{product.shop?.city || "Surabaya"}</p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Beli / Keranjang (3 kolom) */}
              <div className="md:col-span-3 p-6 bg-gray-50">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                  <h3 className="font-semibold text-gray-800 mb-4">Atur Jumlah</h3>
                  
                  {/* Pengatur Kuantitas */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold disabled:opacity-50"
                      >-</button>
                      <input 
                        type="text" 
                        value={quantity}
                        readOnly
                        className="w-12 text-center text-sm font-semibold border-x border-gray-300 focus:outline-none"
                      />
                      <button 
                        onClick={handleIncrease}
                        disabled={quantity >= product.stock}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[#00AA5B] font-bold disabled:opacity-50"
                      >+</button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Stok: <span className="font-semibold">{product.stock > 0 ? product.stock : "Habis"}</span>
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center mb-6 mt-6">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-lg text-gray-800">{formatRupiah(product.price * quantity)}</span>
                  </div>

                  {/* Tombol Aksi */}
                  {product.stock > 0 ? (
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleAddToCart}
                        disabled={isActionLoading}
                        className="w-full py-2.5 border-2 border-[#00AA5B] text-[#00AA5B] font-semibold rounded-lg hover:bg-green-50 transition duration-200"
                      >
                        {isActionLoading ? "Memproses..." : "+ Keranjang"}
                      </button>
                      <button 
                        onClick={handleCheckout}
                        disabled={isActionLoading}
                        className="w-full py-2.5 bg-[#00AA5B] text-white font-semibold rounded-lg hover:bg-[#008f4c] transition duration-200 shadow-md shadow-green-100"
                      >
                        Beli Langsung
                      </button>
                    </div>
                  ) : (
                    <button disabled className="w-full py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg">
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