// src/hooks/useAddProduct.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Shop } from "./useShop";

// Sesuaikan path jika berbeda

export const useAddProduct = (activeShop?: Shop | null) => {
  const navigate = useNavigate();

  // States
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: 0,
    description: "",
    price: "",
    weight: "",
    stock: "",
  });

  // Fetch Kategori saat hook dipanggil
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
          headers: { "x-service-password": import.meta.env.VITE_PASSWORD || "" },
        });
        const result = await response.json();
        if (response.ok) setCategories(result.data || result);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handler Teks
  const handleTextChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShop) return alert("Pilih atau buat toko terlebih dahulu.");
    if (!imageFile) return alert("Silakan unggah gambar produk.");

    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");

      const dataToSend = new FormData();
      dataToSend.append("shop_id", activeShop.id.toString());
      dataToSend.append("category_id", formData.category_id.toString());
      dataToSend.append("name", formData.name);
      dataToSend.append("description", formData.description);
      dataToSend.append("price", formData.price);
      dataToSend.append("weight", formData.weight);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("product_image", imageFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-service-password": import.meta.env.VITE_PASSWORD || "",
        },
        body: dataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan produk");
      }

      alert("Produk berhasil ditambahkan!");
      navigate("/seller");
    } catch (error: any) {
      alert(error.message);
      console.error("Add Product Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Kembalikan semua data dan fungsi agar bisa digunakan oleh View
  return {
    categories,
    formData,
    isLoading,
    imagePreview,
    handleTextChange,
    handleImageChange,
    handleSubmit,
    navigate, // Dikembalikan jika View butuh tombol "Batal"
  };
};
