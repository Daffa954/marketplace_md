// src/hooks/useProductDetail.ts
import { useState, useEffect } from "react";

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  stock: number;
  weight: number;
  description: string;
 image_url: string | null;
  shop_id: number;
  shop?: { name: string; city: string }; // Jika ada relasi shop
}

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
          headers: {
            "x-service-password": import.meta.env.VITE_PASSWORD || "",
            "Content-Type": "application/json"
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil detail produk");
        }

        setProduct(result.data || result);
      } catch (err: any) {
        console.error("Fetch Product Detail Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, isLoading, error };
};