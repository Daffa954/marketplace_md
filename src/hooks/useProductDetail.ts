// src/hooks/useProductDetail.ts
import { useState, useEffect } from "react";

// 1. Perbaiki Interface sesuai dengan respons backend ProductController
export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  stock: number;
  weight: number;
  description: string;
  image_url: string | null;
  shop_id: number;
  shop_name?: string; // Dari relasi shop di backend
  category?: string;  // Dari relasi category di backend
  
  // (Opsional) Jika sewaktu-waktu backend mengembalikan format object utuh
  shop?: { name: string; city?: string }; 
}

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jika tidak ada ID, hentikan eksekusi
    if (!productId) {
      setIsLoading(false);
      return;
    }

    // 2. Gunakan AbortController untuk membatalkan fetch jika user pindah halaman terlalu cepat
    const abortController = new AbortController();

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${productId}`,
          {
            signal: abortController.signal, // Hubungkan signal
            headers: {
              "x-service-password": import.meta.env.VITE_PASSWORD || "",
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil detail produk");
        }

        // 3. Tangani potensi 'Double Wrapper' dari API Gateway
        const productData = result.data?.data || result.data || result;
        setProduct(productData);

      } catch (err: any) {
        // Abaikan error jika itu disebabkan oleh AbortController (komponen di-unmount)
        if (err.name === "AbortError") {
          console.log("Fetch dibatalkan karena pindah halaman.");
          return;
        }
        
        console.error("Fetch Product Detail Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();

    // Cleanup function: batalkan request jika komponen dilepas (unmount)
    return () => {
      abortController.abort();
    };
  }, [productId]); // Hanya dijalankan ulang jika productId di URL berubah

  return { product, isLoading, error };
};