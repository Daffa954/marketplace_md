import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { InputField } from '../../components/commons/inputFields';
import { MyButton } from '../../components/commons/button';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // 1. Sesuaikan state dengan JSON payload
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER', 
    phone_number: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    
    setIsLoading(true);
    
    const success = await register(
      formData.username,
      formData.fullname,
      formData.email,
      formData.password,
      formData.role,
      formData.phone_number
    );
    
    if (success) {
      alert('Registrasi berhasil!');
      // Logika pengarahan otomatis berdasarkan role
      if (formData.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } else {
      setIsLoading(false);
      alert('Registrasi gagal! Email atau Username mungkin sudah digunakan.');
    }
  };

  return (
    <AuthLayout title="Daftar Akun Baru">
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Input Username */}
        <InputField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Buat username"
        />

        {/* Input Fullname (sebelumnya Name) */}
        <InputField
          label="Nama Lengkap"
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="contoh@email.com"
        />

        {/* Input Nomor Telepon */}
        <InputField
          label="Nomor Telepon"
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="08xxxxxxxxxx"
        />

        {/* Dropdown Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daftar Sebagai
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AA5B] bg-white"
          >
            <option value="USER">Pembeli (USER)</option>
            <option value="SELLER">Penjual (SELLER)</option>
          </select>
        </div>

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Buat password"
        />
        <InputField
          label="Konfirmasi Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Ulangi password"
        />
        
        <MyButton type="submit" isLoading={isLoading} className="mt-4 w-full">
          Daftar Sekarang
        </MyButton>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-[#00AA5B] font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </AuthLayout>
  );
}