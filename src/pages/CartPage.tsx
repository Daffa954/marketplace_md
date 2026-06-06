import { ChevronRight, Minus, Package, Plus, ShoppingBag, Store, Trash2 } from "lucide-react";
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";

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
    <MainLayout>
    <div className="max-w-6xl mx-auto px-4 py-10  min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-blue-600" /> Keranjang Belanja
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800">Keranjang Masih Kosong</h2>
          <p className="text-gray-500 mt-2 mb-6">Yuk, cari produk impianmu sekarang!</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Bagian List Produk */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md">
                {/* Gambar */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  {item.product_image ? (
                    <img src={getImageUrl(item.product_image)} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={32}/></div>
                  )}
                </div>

                {/* Info Produk */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                    <Store size={14} /> {item.shop_name}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.product_name}</h3>
                  <p className="text-blue-600 font-bold mt-2">Rp {item.unit_price.toLocaleString('id-ID')}</p>
                </div>

                {/* Kontrol */}
                <div className="flex flex-col justify-between items-end">
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                  
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-white rounded shadow-sm transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-semibold text-gray-700 min-w-[2.5rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-white rounded shadow-sm transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Ringkasan */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-5">Ringkasan Belanja</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Produk</span> 
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-100">
                  <span>Total</span> 
                  <span className="text-blue-600">Rp {subtotalKeseluruhan.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Checkout Sekarang <ChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
    </MainLayout>
  );
};