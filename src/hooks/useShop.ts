// src/hooks/useShops.ts
import { useState, useEffect } from "react";

export interface Shop {
  id: number;
  user_id: number;
  name: string;
  image: string | null;
  address: string;
  province: string;
  city: string;
  district: string;
}

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [activeShop, setActiveShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
    
  useEffect(() => {
    const fetchMyShops = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        // Asumsi kamu membuat endpoint ini di backend Laravel-mu
        // untuk mengambil toko berdasarkan user_id yang login
        const response = await fetch(`${import.meta.env.VITE_API_URL}/shops/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "x-service-password": import.meta.env.VITE_PASSWORD || "", // Sesuaikan jika perlu
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok) {
          const fetchedShops = result.data || result;
          setShops(fetchedShops);
          
          // Jadikan toko pertama sebagai toko aktif secara default (jika ada)
          if (fetchedShops.length > 0) {
            setActiveShop(fetchedShops[0]);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data toko:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyShops();
  }, []);

  // Fungsi untuk mengganti toko yang sedang dilihat di dashboard
  const changeActiveShop = (shopId: number) => {
    const selected = shops.find((s) => s.id === shopId);
    if (selected) setActiveShop(selected);
  };

  return { shops, activeShop, isLoading, changeActiveShop };
};