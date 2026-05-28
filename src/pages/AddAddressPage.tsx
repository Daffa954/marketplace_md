// src/pages/User/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useAddress } from "../contexts/AddressContext";
import { InputField } from "../components/commons/inputFields";
import { MyButton } from "../components/commons/button";


export default function AddAddressPage() {
  // Ambil state dan fungsi dari Context
  const { 
    provinces, cities, districts, isLoading, 
    fetchProvinces, fetchCities, fetchDistricts, 
    saveAddress, resetCities, resetDistricts 
  } = useAddress();

  const [formData, setFormData] = useState({
    label: "",
    full_address: "",
    province: "",
    province_id: 0,
    city: "",
    city_id: 0,
    district: "",
    district_id: 0,
  });

  // 1. Load Provinsi saat pertama kali dibuka
  useEffect(() => {
    fetchProvinces();
  }, []);

  // 2. Load Kota saat Provinsi berubah
  useEffect(() => {
    if (formData.province_id > 0) {
      fetchCities(formData.province_id);
    } else {
      resetCities();
    }
  }, [formData.province_id]);

  // 3. Load Kecamatan saat Kota berubah
  useEffect(() => {
    if (formData.city_id > 0) {
      fetchDistricts(formData.city_id);
    } else {
      resetDistricts();
    }
  }, [formData.city_id]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      province_id: parseInt(e.target.value),
      province: e.target.options[e.target.selectedIndex].text,
      city_id: 0, city: "", district_id: 0, district: "", // Reset anak-anaknya
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      city_id: parseInt(e.target.value),
      city: e.target.options[e.target.selectedIndex].text,
      district_id: 0, district: "", // Reset anaknya
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
    
    // Panggil fungsi dari Context!
    const success = await saveAddress(formData);
    
    if (success) {
      alert("Alamat berhasil disimpan!");
      // Reset form jika diperlukan
    } else {
      alert("Gagal menyimpan alamat, silakan coba lagi.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Alamat Baru</h2>
        
        <form onSubmit={handleSubmit}>
          <InputField
            label="Label Alamat"
            type="text"
            name="label"
            value={formData.label}
            onChange={handleTextChange}
            placeholder="Misal: Rumah, Kampus"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
            <select
              value={formData.province_id}
              onChange={handleProvinceChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white"
              required
            >
              <option value={0} disabled>Pilih Provinsi</option>
              {provinces.map((prov: any) => (
                <option key={prov.id || prov.province_id} value={prov.id || prov.province_id}>
                  {prov.name || prov.province}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
            <select
              value={formData.city_id}
              onChange={handleCityChange}
              disabled={!formData.province_id}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white disabled:bg-gray-100"
              required
            >
              <option value={0} disabled>Pilih Kota</option>
              {cities.map((city: any) => (
                <option key={city.id || city.city_id} value={city.id || city.city_id}>
                  {city.name || city.city}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
            <select
              value={formData.district_id}
              onChange={handleDistrictChange}
              disabled={!formData.city_id}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white disabled:bg-gray-100"
              required
            >
              <option value={0} disabled>Pilih Kecamatan</option>
              {districts.map((district: any) => (
                <option key={district.id || district.district_id} value={district.id || district.district_id}>
                  {district.name || district.district}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Alamat Lengkap"
            type="text"
            name="full_address"
            value={formData.full_address}
            onChange={handleTextChange}
            placeholder="Jalan, RT/RW, Patokan"
          />

          <MyButton type="submit" isLoading={isLoading} className="mt-6 w-full">
            Simpan Alamat
          </MyButton>
        </form>
      </div>
    </div>
  );
}