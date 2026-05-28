// src/pages/Checkout/CheckoutPage.tsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCheckout } from "../hooks/useCheckout";
import { MainLayout } from "../components/layouts/MainLayout";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil data yang dikirim dari halaman Product Detail
  const { product, quantity } = location.state || {};

  // Panggil hook logika checkout
  const {
    userProfile,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    subtotal,
    shippingCost,
    total,
    isSubmitting,
    handlePlaceOrder,
    isCalculatingShipping
  } = useCheckout(product, quantity);

  // Jika user mengakses halaman ini langsung tanpa bawa data (langsung ketik URL /checkout)
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tidak ada barang yang di-checkout
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#00AA5B] text-white rounded-lg"
          >
            Kembali Belanja
          </button>
        </div>
      </MainLayout>
    );
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Alamat & Daftar Produk */}
            <div className="lg:col-span-2 space-y-6">
              {/* Seksi Alamat Pengiriman */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Alamat Pengiriman
                  </h2>
                  <Link
                    to="/profile/add-address"
                    className="text-sm text-[#00AA5B] font-medium hover:underline"
                  >
                    + Tambah Alamat
                  </Link>
                </div>

                {addresses && addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address: any) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition ${
                          selectedAddressId === address.id
                            ? "border-[#00AA5B] bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1 text-[#00AA5B] focus:ring-[#00AA5B]"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {userProfile?.fullname}{" "}
                            <span className="font-normal text-gray-500 text-sm ml-2">
                              ({address.label})
                            </span>
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {address.full_address}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {address.district}, {address.city},{" "}
                            {address.province}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-500">
                    Kamu belum memiliki alamat tersimpan. Silakan tambahkan
                    alamat terlebih dahulu.
                  </div>
                )}
              </div>

              {/* Seksi Pesanan */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Detail Pesanan
                </h2>

                <div className="flex gap-4 items-start pb-4 border-b border-gray-100">
                  <img
                    src={`http://localhost:8002/storage/${product.image_url}`}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Berat: {product.weight} gr
                    </p>
                    <p className="font-bold text-[#00AA5B] mt-2">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    x{quantity}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">Subtotal Produk</span>
                  <span className="font-semibold text-gray-800">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Ringkasan Belanja */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Belanja</h2>
                
                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Harga ({quantity} barang)</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  
                  {/* ✅ PERBAIKAN: Menampilkan status Loading Ongkos Kirim Dinamis */}
                  <div className="flex justify-between text-gray-600">
                    <span>Total Ongkos Kirim</span>
                    <span>
                      {isCalculatingShipping ? (
                        <span className="text-blue-500 animate-pulse font-medium">Menghitung...</span>
                      ) : shippingCost > 0 ? (
                        formatRupiah(shippingCost)
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total Tagihan</span>
                    <span className="font-bold text-xl text-[#00AA5B]">
                      {isCalculatingShipping ? "..." : formatRupiah(total)}
                    </span>
                  </div>
                </div>

                {/* ✅ Tombol Disabled jika ongkir belum selesai dihitung */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !selectedAddressId || isCalculatingShipping || shippingCost === 0}
                  className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${
                    isSubmitting || !selectedAddressId || isCalculatingShipping || shippingCost === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#00AA5B] hover:bg-[#008f4c] shadow-md shadow-green-100"
                  }`}
                >
                  {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                </button>

                {!selectedAddressId && (
                  <p className="text-red-500 text-xs mt-2 text-center">Pilih alamat pengiriman terlebih dahulu.</p>
                )}
                {(selectedAddressId && shippingCost === 0 && !isCalculatingShipping) && (
                  <p className="text-red-500 text-xs mt-2 text-center">Gagal menghitung ongkos kirim.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
