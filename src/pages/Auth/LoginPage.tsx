import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../components/commons/inputFields/inputField";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import { MyButton } from "../../components/commons/button";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Panggil fungsi login dari AuthContext
    const success = await login(formData.email, formData.password);
    
    if (success) {
      // Ambil role yang baru saja disimpan oleh fungsi login
      const role = localStorage.getItem("user_role");
      
      // Arahkan ke halaman yang sesuai
      if (role === "SELLER") {
        navigate("/seller");
      } else {
        navigate("/"); // Halaman utama untuk USER
      }
    } else {
      setIsLoading(false);
      alert("Login gagal! Periksa kembali email dan password Anda.");
    }
  };

  return (
    <AuthLayout title="Masuk ke Akun">
      <div className="w-full">
        {/* Teks Sambutan Tambahan */}
        <p className="text-sm text-gray-500 mb-8 text-center px-4">
          Selamat datang kembali! Silakan masukkan email dan password untuk melanjutkan.
        </p>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          {/* Wrapper untuk Input agar jarak konsisten */}
          <div>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
            />
          </div>
          
          <div>
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
            />
            {/* Opsi Lupa Password untuk menambah realistis UI */}
            <div className="flex justify-end mt-2">
              <a 
                href="#" 
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Lupa password?
              </a>
            </div>
          </div>

          <MyButton 
            type="submit" 
            isLoading={isLoading} 
            // Styling khusus warna biru untuk tombol
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all duration-200"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </MyButton>
        </form>

        {/* Pemisah UI / Divider opsional jika ingin ditambahkan nanti */}
        <div className="mt-8 border-t border-gray-100"></div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-colors"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}