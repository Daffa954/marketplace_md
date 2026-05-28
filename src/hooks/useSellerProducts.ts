// src/hooks/useSellerProducts.ts
import { useState, useEffect } from "react";
import type { Shop } from "./useShop";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  weight: number;
  product_image: string | null;
  category_id: number;
  category?: { name: string }; // Jika backend mereturn relasi kategori
}

export const useSellerProducts = (activeShop?: Shop | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jika belum ada toko yang aktif, kosongkan produk dan berhenti
    if (!activeShop) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("jwt_token");
        // Kita mengirim query parameter ?shop_id=... agar backend hanya mereturn produk dari toko ini
        const response = await fetch(`${import.meta.env.VITE_API_URL}/shops/products?shop_id=${activeShop.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "x-service-password": import.meta.env.VITE_PASSWORD || "",
            "Content-Type": "application/json"
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil daftar produk");
        }

        setProducts(result.data || result);
      } catch (err: any) {
        console.error("Fetch Products Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeShop]); // Efek ini akan berjalan ulang jika activeShop berubah!

  return { products, isLoading, error };
};