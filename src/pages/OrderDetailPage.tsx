import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const OrderDetailPage = () => {
  // Menangkap transactionId dari parameter URL
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("jwt_token");
        
        // Sesuaikan dengan URL API Gateway kamu (port 2000 atau 8080)
        const response = await fetch(`http://localhost:2000/customer/order/${transactionId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-service-password": "passwordAPIGateway" // Buka komentar jika API Gateway butuh ini
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil detail pesanan");
        }

        // Ekstrak data dari response backend
        const orderData = result.data?.data || result.data || result;
        setOrder(orderData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionId) {
      fetchOrderDetail();
    }
  }, [transactionId]);

  // Helper untuk warna status
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'PROCESSING':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Tampilan Loading & Error
  if (isLoading) return <div className="text-center p-10 mt-10">Memuat detail pesanan...</div>;
  if (error) return <div className="text-center text-red-500 p-10 mt-10 border border-red-200 bg-red-50 rounded-lg max-w-2xl mx-auto">Error: {error}</div>;
  if (!order) return <div className="text-center p-10">Pesanan tidak ditemukan.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white shadow-sm border rounded-xl mt-8">
      
      {/* Header Transaksi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-5 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detail Pesanan</h1>
          <p className="text-gray-500 mt-1">
            ID Transaksi: <span className="font-semibold text-gray-800">{order.transactionId}</span>
          </p>
          <p className="text-sm text-gray-500">
            Tanggal: {new Date(order.orderDate).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <div>
          <span className={`px-4 py-2 text-sm font-bold rounded-full uppercase ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Grid Alamat & Kurir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            📍 Alamat Pengiriman
          </h3>
          <p className="font-medium text-gray-800">{order.customerName}</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{order.shippingAddress}</p>
          <p className="text-sm text-gray-600 mt-1">
            {order.shippingDistrict}, {order.shippingCity}, {order.shippingProvince}
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            🚚 Jasa Pengiriman
          </h3>
          <p className="font-medium text-gray-800 uppercase">
            {order.courierName} - {order.courierService}
          </p>
          <p className="text-sm text-gray-600 mt-1">Estimasi Tiba: {order.etd}</p>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Tarif: Rp {order.shippingCost?.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Daftar Produk */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
          Rincian Produk <span className="text-gray-500 font-normal">({order.shopName})</span>
        </h3>
        <div className="space-y-4">
          {order.orderItems?.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center bg-white border p-4 rounded-lg hover:shadow-sm transition">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{item.productName}</span>
                <span className="text-sm text-gray-500 mt-1">
                  {item.quantity} barang x Rp {item.pricePerUnit?.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-gray-400 mt-1">Berat: {item.weight} gr</span>
              </div>
              <div className="font-bold text-gray-800">
                Rp {item.subTotalPrice?.toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rincian Harga Akhir */}
      <div className="border-t pt-5 bg-gray-50 -mx-4 sm:-mx-8 -mb-4 sm:-mb-8 p-4 sm:p-8 rounded-b-xl mt-6">
        <h3 className="font-semibold text-gray-800 mb-4">Rincian Pembayaran</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Harga Barang</span>
            <span>Rp {(order.totalAmount - order.shippingCost).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Ongkos Kirim</span>
            <span>Rp {order.shippingCost?.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t mt-3">
            <span>Total Belanja</span>
            <span>Rp {order.totalAmount?.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <button 
            onClick={() => navigate('/orders')} 
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Kembali
          </button>
          {order.orderStatus === 'PENDING' && (
            <button 
              onClick={() => alert("Fitur Lanjutkan Pembayaran (Bisa dipanggil ulang API pembayarannya di sini)")} 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              Bayar Sekarang
            </button>
          )}
        </div>
      </div>

    </div>
  );
};