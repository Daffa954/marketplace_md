// src/hooks/useCheckout.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAddress } from "../contexts/AddressContext"; // <-- Tambahkan ini


export const useCheckout = (product: any, quantity: number) => {
  const navigate = useNavigate();

  // Data Profil User
  const { userProfile, fetchProfile } = useAuth();

  // Data Alamat dari Address Context
  const { addresses, fetchAddresses } = useAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  // State untuk Pengiriman (Ongkos Kirim Dinamis)
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShippingCost, setSelectedShippingCost] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Pastikan data profil dimuat
  useEffect(() => {
    if (!userProfile) fetchProfile();
  }, [userProfile, fetchProfile]);

  // 2. Pastikan daftar alamat dimuat
  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Set alamat default ke alamat pertama dari state `addresses`
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // 4. Hitung Ongkir Otomatis (RajaOngkir API)
  useEffect(() => {
    const calculateShipping = async () => {
      if (!selectedAddressId || !product) return;
      console.log("Cek Syarat Ongkir:", {
        selectedAddressId,
        productId: product?.id,
      });
      // Cari alamat yang dipilih dari array `addresses`
      const selectedAddress = addresses.find(
        (a: any) => a.id === selectedAddressId,
      );
      if (!selectedAddress) return;

      setIsCalculatingShipping(true);
      try {
        const token = localStorage.getItem("jwt_token");

        // Payload ke API RajaOngkir Gateway
        const payload = {
          originDistrictId: product.shop?.district_id?.toString() || "575",
          destinationDistrictId:
            selectedAddress.district_id?.toString() || "123",
          items: [
            {
              productId: product.id,
              weight: product.weight || 0,
              quantity: quantity,
            },
          ],
        };
        console.log("Menembak API Ongkir dengan Payload:", payload);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/rajaongkir_o_s/calculate-cart-options`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "x-service-password": import.meta.env.VITE_PASSWORD || "",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const result = await response.json();
        console.log("Hasil Response Ongkir:", result); // 💡 DEBUGGING
        if (response.ok) {
          // 💡 PERBAIKAN: Tambahkan .data?.data untuk menembus double wrapper API Gateway
          const options = result.data?.data || result.data || result;

          // Pastikan options benar-benar array
          const validOptions = Array.isArray(options) ? options : [];
          setShippingOptions(validOptions);

          // Pilih opsi kurir pertama sebagai default
          if (validOptions.length > 0) {
            // Berdasarkan screenshot, nama propertinya adalah "cost"
            setSelectedShippingCost(validOptions[0].cost || 0);
          } else {
            setSelectedShippingCost(0);
          }
        } else {
          throw new Error(result.message || "Gagal menghitung ongkos kirim");
        }
      } catch (error) {
        console.warn("Menggunakan data ongkir DUMMY karena:", error);

        const dummyShippingOptions = [
          {
            name: "JNE (Dummy)",
            service: "REG",
            cost: 15000,
            etd: "2-3 Hari",
          },
          {
            name: "J&T (Dummy)",
            service: "EZ",
            cost: 18000,
            etd: "1-2 Hari",
          },
          {
            name: "SICEPAT (Dummy)",
            service: "HALU",
            cost: 12000,
            etd: "3-4 Hari",
          },
        ];

        setShippingOptions(dummyShippingOptions);
        setSelectedShippingCost(dummyShippingOptions[0].cost);
      } finally {
        setIsCalculatingShipping(false);
      }
    };

    calculateShipping();
  }, [selectedAddressId, product, quantity, addresses]);

  // Kalkulasi Harga Akhir
  const subtotal = (product?.price || 0) * (quantity || 1);
  const total = subtotal + selectedShippingCost;

  // Fungsi Submit Order
  // Fungsi Submit Order
 // Fungsi Submit Order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return alert("Pilih alamat pengiriman terlebih dahulu.");
    if (selectedShippingCost === 0) return alert("Menunggu perhitungan ongkos kirim selesai.");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("jwt_token");

      // 1. Dapatkan detail alamat yang dipilih
      const selectedAddress = addresses.find((a: any) => a.id === selectedAddressId);
      if (!selectedAddress) throw new Error("Alamat tidak ditemukan");

      // 2. Dapatkan detail kurir
      const selectedCourier = shippingOptions.find((opt: any) => (opt.cost || opt.value) === selectedShippingCost) || shippingOptions[0];

      // 3. Susun Payload
      const orderPayload = {
        customerId: userProfile?.id,
        customerName: userProfile?.fullname || userProfile?.username,
        shippingAddress: selectedAddress.full_address,
        shippingProvince: selectedAddress.province,
        shippingCity: selectedAddress.city,
        shippingDistrict: selectedAddress.district,
        destinationCityId: selectedAddress.city_id,
        shopOrders: [
          {
            shopId: product.shop_id,
            shippingCourier: {
              name: selectedCourier?.name || "Kurir",
              service: selectedCourier?.service || "Reguler",
              cost: selectedShippingCost,
              etd: selectedCourier?.description || selectedCourier?.etd || "2-3 hari",
            },
            items: [
              {
                productId: product.id,
                productName: product.name,
                shopName: product.shop?.name || "Toko User",
                pricePerUnit: product.price,
                quantity: quantity,
                weight: product.weight || 0,
              },
            ],
          },
        ],
      };

      // 4. Tembak ke API Checkout
      const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-service-password": import.meta.env.VITE_PASSWORD || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      // 5. Tangani error dari backend
      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat pesanan");
      }

      // 6. Notifikasi sukses membuat order dari database
      alert(result.message || "Order berhasil dibuat! Anda akan dialihkan ke halaman pembayaran yang aman.");

      // 7. Ekstrak data Midtrans
      const responseData = result.data?.data || result.data || result;

      // 8. KARENA BACKEND TIDAK DIUBAH, KITA GUNAKAN REDIRECT (Link Pembayaran)
      if (responseData.redirectUrl) {
        // Alihkan user ke halaman resmi Midtrans
        window.location.href = responseData.redirectUrl;
      } else {
        alert("Gagal memuat link pembayaran, pesanan Anda dapat dilihat di menu Profil.");
        navigate("/profile");
      }

    } catch (error: any) {
      alert(error.message);
      console.error("Checkout Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kembalikan semua data agar bisa dibaca oleh CheckoutPage.tsx
  return {
    userProfile,
    addresses, // <--- Ini yang paling penting, agar UI bisa baca alamat
    selectedAddressId,
    setSelectedAddressId,
    subtotal,
    shippingCost: selectedShippingCost,
    total,
    isSubmitting,
    isCalculatingShipping,
    shippingOptions,
    handlePlaceOrder,
  };
};
