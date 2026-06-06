// src/pages/Search/SearchPage.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearchData } from "../hooks/useSearchData";
import { SearchBar } from "../components/commons/Searchbar";
import { MainLayout } from "../components/layouts/MainLayout";


export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Mengambil query '?q=' dari URL
  const query = searchParams.get("q") || "";

  // Memanggil custom hook
  const { products, isLoading, error } = useSearchData(query);

  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery.trim()) {
      // Perbarui URL dengan kata kunci baru, halaman akan otomatis memuat ulang data
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <MainLayout>
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          {/* Kolom Pencarian Ulang */}
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearchSubmit} />
          </div>
          
          <div className="mt-8">
            <h1 className="text-xl font-medium text-gray-800">
              Hasil pencarian untuk: <span className="font-bold text-[#00AA5B]">"{query}"</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Ditemukan {products.length} produk</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 min-h-[50vh]">
        {error && (
          <div className="text-center text-red-500 bg-red-50 py-3 rounded mb-6">
            ⚠️ Gagal memuat data: {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Skeleton Loading */}
            {[1, 2, 3, 4, 5].map((skeleton) => (
              <div
                key={skeleton}
                className="bg-gray-100 rounded-lg h-64 animate-pulse border border-gray-200"
              ></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition cursor-pointer group"
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {/* Gunakan link API yang sesuai untuk gambar (disesuaikan dengan config backend-mu) */}
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
                  <p className="text-xs text-gray-500 mt-3 flex flex-col gap-1">
                    <span className="font-medium truncate">
                      {product.shop?.name || "Toko UC"}
                    </span>
                    <span className="text-gray-400 truncate">
                      {product.category?.name || "Kategori Umum"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <span className="text-4xl mb-4">🔍</span>
            <h3 className="text-lg font-semibold text-gray-700">Oops, produk tidak ditemukan</h3>
            <p className="text-gray-500 mt-2">
              Coba gunakan kata kunci lain atau ejaan yang lebih umum.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}