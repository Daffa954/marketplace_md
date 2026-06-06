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

export const useSearchData = (keyword: string | null) => {
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jika tidak ada keyword, jangan lakukan fetch
    if (!keyword) {
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

        // Memanggil API search yang ada di Laravel
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/search?keyword=${encodeURIComponent(keyword)}`,
          { method: "GET", headers }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data pencarian");
        }

        // Simpan data produk
        setProducts(result.data || []);
      } catch (err: any) {
        console.error("Search Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, [keyword]); // Efek akan berjalan ulang setiap kali keyword URL berubah

  return { products, isLoading, error };
};