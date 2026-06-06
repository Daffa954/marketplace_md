// src/pages/Home/HomePage.tsx
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { SearchBar } from "../components/commons/Searchbar";
import { useHomeData } from "../hooks/useHomeData";

export default function HomePage() {
  const navigate = useNavigate();
  // Panggil data dari custom hook
  const { categories, products, isLoading, error } = useHomeData();
  console.log(products);
  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_PASSWORD)
  // Helper untuk format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Temukan Barang Impianmu di Sini
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Platform jual beli yang aman, cepat, dan terpercaya untuk seluruh
            kebutuhan kampus dan harianmu.
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearchSubmit} />
          </div>
        </div>
      </section>

      {/* Tampilkan pesan error jika API gagal */}
      {error && (
        <div className="container mx-auto px-4 mt-8 text-center text-red-500 bg-red-50 py-3 rounded">
          ⚠️ Gagal memuat data: {error}
        </div>
      )}

      {/* Kategori Populer */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Kategori Pilihan
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-500">Memuat kategori...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate(`/search?category=${category.id}`)}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition cursor-pointer hover:border-[#00AA5B]"
              >
                {/* Tampilkan gambar kategori jika ada, jika tidak biarkan teks saja */}
                
               
                <h3 className="font-semibold text-gray-700">{category.name}</h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Produk Rekomendasi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Rekomendasi Untukmu
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* Skeleton Loading saat data masih diambil */}
              {[1, 2, 3, 4, 5].map((skeleton) => (
                <div
                  key={skeleton}
                  className="bg-gray-50 rounded-lg h-64 animate-pulse border border-gray-200"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition cursor-pointer group"
                  >
                    {/* Placeholder atau Gambar Asli */}
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      <img
                        src={`http://localhost:8002/storage/${product.product_image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="p-4">
                      <h4 className="text-gray-800 font-medium mb-2 line-clamp-2 text-sm">
                        {product.name}
                      </h4>
                      <p className="text-[#00AA5B] font-bold">
                        {formatRupiah(product.price)}
                      </p>
                      <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                        <span className="truncate">
                          {product.shop?.name|| "Toko UC"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  Belum ada produk yang tersedia saat ini.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
