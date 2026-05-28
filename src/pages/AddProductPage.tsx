// src/pages/Seller/AddProductPage.tsx
import React from "react";
import type { Shop } from "../hooks/useShop";
import { useAddProduct } from "../hooks/useAddProduct";
import { InputField } from "../components/commons/inputFields";
import { MyButton } from "../components/commons/button";
import { SellerLayout } from "../components/layouts/SellerLayout";

// Karena kita mengirim props dari Layout, kita definisikan interface-nya
interface AddProductProps {
  activeShop?: Shop | null;
  isShopsLoading?: boolean;
}

// 1. Komponen Konten (View Murni)
const AddProductContent: React.FC<AddProductProps> = ({ activeShop, isShopsLoading }) => {
  // Panggil SEMUA logika dari Hook hanya dengan 1 baris kode!
  const { 
    categories, formData, isLoading, imagePreview, 
    handleTextChange, handleImageChange, handleSubmit, navigate 
  } = useAddProduct(activeShop);

  // Loading State
  if (isShopsLoading) return <div className="text-center py-10 text-gray-500">Memuat data toko...</div>;

  // Error State (Belum punya toko)
  if (!activeShop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">Kamu belum memiliki toko</h2>
        <p className="text-gray-500 mt-2">Buka toko terlebih dahulu untuk mulai menjual produk.</p>
      </div>
    );
  }

  // Tampilan Form Utama
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Tambah Produk Baru 📦</h2>
        <p className="text-gray-500 mt-1">
          Toko saat ini: <span className="font-semibold text-[#00AA5B]">{activeShop.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Nama Produk" type="text" name="name" value={formData.name} onChange={handleTextChange} placeholder="Contoh: Buku Pemrograman Web" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select name="category_id" value={formData.category_id} onChange={handleTextChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white" required >
              <option value={0} disabled>Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Harga (Rp)" type="number" name="price" value={formData.price} onChange={handleTextChange} placeholder="Contoh: 150000" required />
          <InputField label="Berat (Gram)" type="number" name="weight" value={formData.weight} onChange={handleTextChange} placeholder="Contoh: 500" required />
          <InputField label="Stok Tersedia" type="number" name="stock" value={formData.stock} onChange={handleTextChange} placeholder="Contoh: 12" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
          <textarea name="description" value={formData.description} onChange={handleTextChange} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white" placeholder="Jelaskan spesifikasi dan keunggulan produkmu..." required />
        </div>

        {/* Area Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-white" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-3xl mb-2">📸</span>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk unggah</span></p>
                  <p className="text-xs text-gray-500">PNG, JPG (Maks. 2MB)</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <button type="button" onClick={() => navigate("/seller")} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
            Batal
          </button>
          <MyButton type="submit" isLoading={isLoading} className="px-8">
            Simpan Produk
          </MyButton>
        </div>
      </form>
    </div>
  );
};

// 2. Pembungkus Layout
export default function AddProductPage() {
  return (
    <SellerLayout>
      <AddProductContent />
    </SellerLayout>
  );
}