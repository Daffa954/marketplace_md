import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AddAddressPage from "./pages/AddAddressPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import CreateShopPage from "./pages/CreateShop";
import AddProductPage from "./pages/AddProductPage";
import SellerProductsPage from "./pages/SellerProductPage";
import ProductDetailPage from "./pages/ProductDetail";
import CheckoutPage from "./pages/CheckoutPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { CartPage } from "./pages/CartPage";
import SearchPage from "./pages/searchPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      {/* Rute Halaman Tambah Alamat (Anak dari Profile) */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/profile/add-address" element={<AddAddressPage />} />
      <Route path="/order" element={<OrderHistoryPage />} />
      <Route path="/order/:transactionId" element={<OrderDetailPage />} />
      <Route path="/seller" element={<SellerDashboardPage />} />
      <Route path="/seller/create-shop" element={<CreateShopPage />} />
      <Route path="/seller/products/add" element={<AddProductPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/seller/products" element={<SellerProductsPage />} />
    </Routes>
  );
}

export default App;
