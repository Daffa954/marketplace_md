// src/pages/Search/SearchPage.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearchData } from "../hooks/useSearchData";
import { MainLayout } from "../components/layouts/MainLayout";
import { SearchBar } from "../components/commons/Searchbar";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tangkap kedua kemungkinan parameter dari URL
  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("category") || null;

  // Panggil hook dengan kedua parameter
  const { products, isLoading, error } = useSearchData(query, categoryId);

  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery.trim()) {
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
      {/* HEADER SECTION */}
      <div className="bg-white pt-6 pb-6 border-b border-gray-100 shadow-sm relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto mb-6">
            <SearchBar onSearch={handleSearchSubmit} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <h1 className="text-lg text-gray-700">
                {categoryId ? (
                  <>
                    Menampilkan produk dalam <span className="font-bold text-[#00AA5B] text-xl">Kategori Pilihan</span>
                  </>
                ) : (
                  <>
                    Hasil pencarian untuk <span className="font-bold text-[#00AA5B] text-xl">"{query}"</span>
                  </>
                )}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Ditemukan <span className="font-bold text-gray-700">{products.length}</span> produk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[60vh]">
        {error && (
          <div className="flex items-center justify-center p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <span className="font-medium">Gagal memuat data:</span> {error}
          </div>
        )}

        {isLoading ? (
          /* SKELETON LOADING */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          /* PRODUCT GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {/* Image Container dengan rasio 1:1 (Square) */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={`http://localhost:8002/storage/${product.product_image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badge Kategori */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#00AA5B] shadow-sm uppercase tracking-wider">
                    {product.category?.name || "Kategori Umum"}
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="text-gray-700 text-sm font-medium line-clamp-2 mb-2 group-hover:text-[#00AA5B] transition-colors leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-[#00AA5B] font-bold text-base md:text-lg mb-3">
                    {formatRupiah(product.price)}
                  </p>
                  
                  {/* Bagian Toko di bawah agar menempel ke dasar kartu */}
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-[#00AA5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="truncate font-medium">
                      {product.shop?.name || "Toko UC"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-5xl">🛒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops, barang tidak ditemukan</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Kami tidak dapat menemukan produk yang sesuai dengan pencarianmu. Coba gunakan kata kunci lain atau periksa ejaan.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#00AA5B] hover:bg-[#008f4c] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-green-200"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}