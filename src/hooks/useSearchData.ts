// src/hooks/useSearchData.ts
import { useState, useEffect } from "react";

export interface SearchProduct {
  id: number;
  name: string;
  price: number;
  product_image: string | null;
  shop?: { id: number; name: string };
  category?: { id: number; name: string };
}

// Tambahkan parameter categoryId
export const useSearchData = (keyword: string | null, categoryId: string | null) => {
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jika tidak ada keyword DAN tidak ada categoryId, jangan fetch
    if (!keyword && !categoryId) {
      setProducts([]);
      return;
    }

    const fetchSearchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const headers = {
          "x-service-password": import.meta.env.VITE_PASSWORD || "",
          "Content-Type": "application/json",
        };

        // 💡 LOGIKA PERCABANGAN API
        let apiUrl = "";
        
        if (categoryId) {
          // Jika URL memiliki ?category=1, tembak API filter kategori
          apiUrl = `${import.meta.env.VITE_API_URL}/products/category/${categoryId}`;
        } else if (keyword) {
          // Jika URL memiliki ?q=baju, tembak API search standar
          apiUrl = `${import.meta.env.VITE_API_URL}/products/search?keyword=${encodeURIComponent(keyword)}`;
        }

        const response = await fetch(apiUrl, { method: "GET", headers });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data produk");
        }

        setProducts(result.data || []);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, [keyword, categoryId]); // Efek dipicu ulang jika salah satu parameter ini berubah

  return { products, isLoading, error };
};