// src/hooks/useProfileData.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const useProfileData = () => {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "x-service-password":import.meta.env.VITE_PASSWORD || "", // Sebaiknya gunakan import.meta.env
          "Content-Type": "application/json"
        };

        // Ambil data profil dan alamat secara paralel
        const [profileResponse, addressResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, { method: "GET", headers }),
          fetch(`${import.meta.env.VITE_API_URL}/addresses`, { method: "GET", headers })
        ]);
        
        // 1. Cek Respons Profil
        if (profileResponse.ok) {
          const profileResult = await profileResponse.json();
          setProfile(profileResult.data);
        } else if (profileResponse.status === 401 || profileResponse.status === 403) {
          alert("Sesi Anda telah habis. Silakan login kembali.");
          logout();
          navigate("/login");
          return; // Hentikan eksekusi jika tidak valid
        }

        // 2. Cek Respons Alamat
        if (addressResponse.ok) {
          const addressResult = await addressResponse.json();
          setAddresses(addressResult.data || addressResult); 
        } else {
          console.error("Gagal mengambil data alamat");
        }

      } catch (error) {
        console.error("Kesalahan jaringan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [logout, navigate]);

  // Kembalikan state dan fungsi yang dibutuhkan oleh View
  return { profile, addresses, isLoading, userRole };
};