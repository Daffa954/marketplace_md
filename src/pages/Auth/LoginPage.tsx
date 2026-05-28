import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Tambahkan useNavigate
import { InputField } from "../../components/commons/inputFields/inputField";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import { MyButton } from "../../components/commons/button";
import { useAuth } from "../../contexts/AuthContext"; // Import custom hook

export default function LoginPage() {
  const { login } = useAuth(); // Ambil fungsi login dari context
  const navigate = useNavigate(); // Inisialisasi navigasi

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
      <form onSubmit={handleSubmit} autoComplete="off">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="contoh@email.com"
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Masukkan password"
        />

        <MyButton type="submit" isLoading={isLoading} className="mt-4 w-full">
          Masuk
        </MyButton>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="text-[#00AA5B] font-semibold hover:underline"
        >
          Daftar di sini
        </Link>
      </p>
    </AuthLayout>
  );
}