// src/components/commons/Navbar/index.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Mengambil state dan fungsi langsung dari context
  const { isLoggedIn, userRole, logout } = useAuth();
  console.log("isLoggedIn:", isLoggedIn);
  console.log("userRole:", userRole);

  const handleLogout = () => {
    logout(); // Memanggil fungsi dari AuthContext untuk menghapus token
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          UC Marketplace
        </Link>

        <nav className="space-x-4 flex items-center">
          {!isLoggedIn ? (
            // ==========================================
            // TAMPILAN 1: JIKA BELUM LOGIN (GUEST)
            // ==========================================
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition duration-200"
              >
                Daftar
              </Link>
            </>
          ) : (
            // ==========================================
            // TAMPILAN 2 & 3: JIKA SUDAH LOGIN
            // ==========================================
            <>
              {/* Menu Khusus Role USER */}
              {userRole === "USER" && (
                <>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/order"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Order
                  </Link>
                  <Link
                    to="/cart"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Cart
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Profil
                  </Link>
                </>
              )}

              {/* Menu Khusus Role SELLER */}
              {userRole === "SELLER" && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/products"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    List Product
                  </Link>
                  <Link
                    to="/seller/orders"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Order
                  </Link>
                </>
              )}

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium transition duration-200"
              >
                Keluar
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
