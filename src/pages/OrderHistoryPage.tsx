import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Pastikan path import ini sesuai

export const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { userProfile, fetchProfile } = useAuth(); // Mengambil data user yang sedang login

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Pastikan profil user sudah termuat agar kita punya user ID-nya
  useEffect(() => {
    if (!userProfile) {
      fetchProfile();
    }
  }, [userProfile, fetchProfile]);

  // 2. Ambil daftar pesanan dari backend
  useEffect(() => {
    const fetchOrders = async () => {
      // Tunggu sampai userProfile (dan userProfile.id) tersedia
      if (!userProfile?.id) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("jwt_token");
        
        // Sesuaikan URL ini dengan rute di Spring Boot / API Gateway kamu
        // Contoh: http://localhost:2000/orders/user/6
        const response = await fetch(`http://localhost:2000/customer/${userProfile.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,

            "Content-Type": "application/json",
            "x-service-password": "passwordAPIGateway"
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil daftar pesanan");
        }

        // Ekstrak data (antisipasi double wrapper dari API Gateway)
        const ordersData = result.data?.data || result.data || result;
        
        // Pastikan ordersData adalah array
        setOrders(Array.isArray(ordersData) ? ordersData : []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userProfile]);

  // Helper untuk warna status pesanan
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'PROCESSING':
      case 'SETTLEMENT':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
      case 'FAILED':
      case 'EXPIRE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Tampilan Loading & Error
  if (isLoading) return <div className="text-center p-10 mt-10">Memuat riwayat pesanan...</div>;
  if (error) return <div className="text-center text-red-500 p-10 mt-10">Error: {error}</div>;
  console.log(orders)
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Riwayat Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="text-center bg-gray-50 rounded-lg p-10 border border-gray-200">
          <p className="text-gray-500 mb-4">Kamu belum memiliki pesanan sama sekali.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mapping/Looping semua order yang didapat dari Backend */}
          {orders.map((order: any, index: number) => (
            <div key={index} className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition">
              
              {/* Header Card Order */}
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700">Toko: {order.shopName || order.shop_name}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.orderDate || order.order_date).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getStatusColor(order.orderStatus || order.order_status)}`}>
                  {order.orderStatus || order.order_status}
                </span>
              </div>

              {/* Body Card Order */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID Transaksi</p>
                  <p className="font-medium text-gray-800">{order.transactionId || order.transaction_id}</p>
                </div>
                
                <div className="sm:text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Belanja</p>
                  <p className="font-bold text-lg text-gray-800">
                    Rp {Number(order.finalTotalPrice).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t flex justify-end gap-3">
                {/* Tombol untuk melihat detail lengkap (mengarah ke halaman yang kita buat sebelumnya) */}
                <button 
                  onClick={() => navigate(`/order/${order.transactionId || order.transaction_id}`)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition text-sm"
                >
                  Lihat Detail
                </button>

                {/* Tombol Bayar Sekarang (Jika Statusnya Masih PENDING) */}
                {(order.orderStatus === 'PENDING' || order.order_status === 'PENDING') && (
                  <button 
                    onClick={() => alert("Fitur Lanjut Bayar bisa dipanggil di sini!")}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition text-sm"
                  >
                    Bayar Sekarang
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};