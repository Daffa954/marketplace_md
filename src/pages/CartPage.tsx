import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Sesuaikan Interface dengan JSON aslimu
interface CartItem {
  id: number; // ID unik item di keranjang (misal: 5)
  cart_id: number;
  product_id: number;
  product_name: string;
  product_image?: string; 
  shop_name: string;
  shop_id: number;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mendapatkan URL gambar utuh (Sesuaikan URL Backend kamu)
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    // Menggabungkan base URL backend kamu dengan path dari database
    return `http://localhost:2000/storage/${imagePath}`; 
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      
      const response = await fetch("http://localhost:2000/cart", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-service-password": "passwordAPIGateway"
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data keranjang");
      }

      // 2. PERBAIKAN: Ambil array dari properti "products"
      // Jika API kamu punya wrapper standar, mungkin result.data.products
      const cartData = result.data || result;
      const itemsArray = cartData.products || [];
      
      setCartItems(itemsArray);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );

      const token = localStorage.getItem("jwt_token");
      await fetch(`http://localhost:2000/cart/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (error) {
      console.error("Gagal update jumlah", error);
      fetchCartItems(); 
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));

      const token = localStorage.getItem("jwt_token");
      await fetch(`http://localhost:2000/cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Gagal menghapus item", error);
      fetchCartItems();
    }
  };

  // 3. PERBAIKAN: Hitung subtotal menggunakan "unit_price"
  const subtotalKeseluruhan = cartItems.reduce(
    (total, item) => total + (item.unit_price * item.quantity), 
    0
  );

  if (isLoading) return <div className="text-center p-10 mt-10">Memuat keranjang Anda...</div>;
  if (error) return <div className="text-center text-red-500 p-10 mt-10">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div className="text-center bg-gray-50 rounded-xl p-12 border border-gray-200">
          <p className="text-gray-500 mb-4 text-lg">Keranjang Anda masih kosong 🛒</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm">
                
                {/* 4. PERBAIKAN: Render Gambar */}
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 shrink-0 overflow-hidden border">
                  {item.product_image ? (
                    <img 
                      src={getImageUrl(item.product_image)} 
                      alt={item.product_name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : "Foto"}
                </div>

                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase">{item.shop_name}</p>
                  <h3 className="font-bold text-gray-800 text-lg">{item.product_name}</h3>
                  {/* 5. PERBAIKAN: Gunakan unit_price */}
                  <p className="font-bold text-blue-600">Rp {item.unit_price.toLocaleString('id-ID')}</p>
                </div>

                <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    🗑️ Hapus
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white border rounded-xl p-5 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Ringkasan Belanja</h2>
              
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Total Harga ({cartItems.length} barang)</span>
                <span>Rp {subtotalKeseluruhan.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Tagihan</span>
                <span className="font-bold text-xl text-blue-600">Rp {subtotalKeseluruhan.toLocaleString('id-ID')}</span>
              </div>

              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Checkout Sekarang
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};