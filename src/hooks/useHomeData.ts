// src/hooks/useHomeData.ts
import { useState, useEffect } from "react";

// Definisikan tipe data agar TypeScript bisa membantu autocompletion
export interface Category {
  id: number;
  name: string;
  image_url?: string; // Opsional jika ada ikon/gambar
}

export interface Product {
  id: number;
  name: string;
  price: number;
   product_image: string | null;
  shop_name?: string;
  shop?: {
    name: string;
  };
}

export const useHomeData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Konfigurasi header untuk menembus API Gateway
        const headers = {
          "x-service-password": import.meta.env.VITE_PASSWORD || "", // Sesuaikan dengan .env Gateway-mu
          "Content-Type": "application/json",
        };

        // Fetch paralel ke API Gateway
        // Asumsi endpoint-nya adalah /categories dan /products
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/categories`, { method: "GET", headers }),
          fetch(`${import.meta.env.VITE_API_URL}/products`, { method: "GET", headers }),
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        // Sesuaikan ekstraksi datanya (biasanya dibungkus di dalam .data)
        setCategories(categoriesData.data || categoriesData);
        setProducts(productsData.data || productsData);
      } catch (err: any) {
        console.error("Home Data Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return { categories, products, isLoading, error };
};