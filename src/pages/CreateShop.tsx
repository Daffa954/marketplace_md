// src/pages/Seller/CreateShopPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../contexts/AddressContext";
import { InputField } from "../components/commons/inputFields";
import { MyButton } from "../components/commons/button";
import { SellerLayout } from "../components/layouts/SellerLayout";

export default function CreateShopPage() {
  const navigate = useNavigate();
  const { 
    provinces, cities, districts, 
    fetchProvinces, fetchCities, fetchDistricts, 
    resetCities, resetDistricts 
  } = useAddress();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "", // Alamat jalan detail
    province: "",
    province_id: 0,
    city: "",
    city_id: 0,
    district: "",
    district_id: 0,
  });

  // Load Provinsi saat pertama kali dibuka
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Load Kota saat Provinsi berubah
  useEffect(() => {
    if (formData.province_id > 0) {
      fetchCities(formData.province_id);
    } else {
      resetCities();
    }
  }, [formData.province_id]);

  // Load Kecamatan saat Kota berubah
  useEffect(() => {
    if (formData.city_id > 0) {
      fetchDistricts(formData.city_id);
    } else {
      resetDistricts();
    }
  }, [formData.city_id]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      province_id: parseInt(e.target.value),
      province: e.target.options[e.target.selectedIndex].text,
      city_id: 0, city: "", district_id: 0, district: "",
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      city_id: parseInt(e.target.value),
      city: e.target.options[e.target.selectedIndex].text,
      district_id: 0, district: "",
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      district_id: parseInt(e.target.value),
      district: e.target.options[e.target.selectedIndex].text,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");
      
      // Tembak ke API Gateway (yang nantinya diteruskan ke Product Service / Shop Controller)
      const response = await fetch("http://localhost:2000/shops", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-service-password": "passwordAPIGateway", // Sesuaikan password service-mu
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat toko");
      }

      alert("Toko berhasil dibuat! Selamat berjualan.");
      // Redirect kembali ke dashboard seller, halaman akan otomatis memuat toko baru
      navigate("/seller"); 
      
    } catch (error: any) {
      alert(error.message);
      console.error("Create Shop Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Buka Toko Baru 🏪</h2>
          <p className="text-gray-500 mt-1">Lengkapi informasi di bawah ini untuk mulai berjualan.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Informasi Dasar */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informasi Toko</h3>
            
            <InputField
              label="Nama Toko"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleTextChange}
              placeholder="Contoh: Toko Buku Teknik UC"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Toko</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white"
                placeholder="Ceritakan tentang barang apa saja yang kamu jual di sini..."
              />
            </div>
          </div>

          {/* Lokasi Toko */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Lokasi Pengiriman</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                <select value={formData.province_id} onChange={handleProvinceChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white" required>
                  <option value={0} disabled>Pilih Provinsi</option>
                  {provinces.map((prov: any) => (
                    <option key={prov.id || prov.province_id} value={prov.id || prov.province_id}>{prov.name || prov.province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
                <select value={formData.city_id} onChange={handleCityChange} disabled={!formData.province_id} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white disabled:bg-gray-100" required>
                  <option value={0} disabled>Pilih Kota</option>
                  {cities.map((city: any) => (
                    <option key={city.id || city.city_id} value={city.id || city.city_id}>{city.name || city.city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                <select value={formData.district_id} onChange={handleDistrictChange} disabled={!formData.city_id} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white disabled:bg-gray-100" required>
                  <option value={0} disabled>Pilih Kecamatan</option>
                  {districts.map((district: any) => (
                    <option key={district.id || district.district_id} value={district.id || district.district_id}>{district.name || district.district}</option>
                  ))}
                </select>
              </div>

              <div>
                <InputField
                  label="Alamat Detail (Jalan, RT/RW, Patokan)"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleTextChange}
                  placeholder="Misal: CitraLand, Jl. Taman..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/seller")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Batal
            </button>
            <MyButton type="submit" isLoading={isLoading} className="px-8">
              Simpan & Buka Toko
            </MyButton>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}