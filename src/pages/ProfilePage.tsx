// src/pages/User/ProfilePage.tsx
import { Link } from "react-router-dom";
import { useProfileData } from "../hooks/useProfileData";

export default function ProfilePage() {
  // Panggil semua state hanya dalam satu baris!
  const { profile, addresses, isLoading, userRole } = useProfileData();

  // Handle tampilan loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium">Memuat data profil...</div>
      </div>
    );
  }

  // Handle tampilan utama (View murni)
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profil Saya</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* INFO USER */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-[#00AA5B] text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4 uppercase">
                {profile?.fullname?.charAt(0) || "U"} 
              </div>
              <h2 className="text-xl font-semibold text-gray-800 text-center">{profile?.fullname}</h2>
              <p className="text-gray-500 mb-1 text-sm">{profile?.email}</p>
              <p className="text-gray-500 mb-4 text-sm">{profile?.phone_number || "-"}</p>
              <span className="px-3 py-1 bg-green-50 text-[#00AA5B] text-xs font-bold rounded-full">
                {profile?.role || userRole}
              </span>
            </div>
          </div>
        </div>

        {/* DAFTAR ALAMAT */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Buku Alamat</h2>
              <Link 
                to="/profile/add-address" 
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium transition duration-200"
              >
                + Tambah Alamat
              </Link>
            </div>

            {addresses && addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address: any) => (
                  <div key={address.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#00AA5B] transition-colors">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2 font-medium">
                      {address.label}
                    </span>
                    <p className="font-semibold text-gray-800">{profile?.fullname}</p>
                    <p className="text-gray-600 text-sm mt-1">{address.full_address}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {address.district}, {address.city}, {address.province}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                <p className="text-gray-500 mb-2">Belum ada alamat tersimpan.</p>
                <p className="text-sm text-gray-400">Tambahkan alamat untuk mempermudah proses pemesanan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}