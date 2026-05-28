// src/contexts/AuthContext.tsx
import  {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface UserProfile {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: string;
  addresses?: any[]; // <--- TAMBAHKAN BARIS INI
  phone_number?: string;
}
// 1. Definisikan tipe data
interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  userProfile: UserProfile | null; // Tambahan state profile
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    fullname: string,
    email: string,
    password: string,
    role: string,
    phone_number: string,
  ) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>; // Tambahan fungsi fetch
}

// 2. Buat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt_token"),
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("user_role"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State penyimpan profil
  const isLoggedIn = !!token;

  // Sesuaikan URL ini dengan port API Gateway kamu (misal: 4000)
  const API_URL = import.meta.env.VITE_API_URL + "/auth";
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-service-password": import.meta.env.VITE_PASSWORD,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUserProfile(result.data);
      } else if (response.status === 401 || response.status === 403) {
        // Jika token invalid/expired, otomatis logout
        logout();
      }
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
    }
  };
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "x-service-password": import.meta.env.VITE_PASSWORD || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Login gagal, periksa kredensial kamu.",
        );
      }

      // Simpan ke Local Storage
      localStorage.setItem("jwt_token", result.data.token);
      localStorage.setItem("user_role", result.data.user.role);

      // Update State Global
      setToken(result.data.token);
      setUserRole(result.data.user.role);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    username: string,
    fullname: string,
    email: string,
    password: string,
    role: string,
    phone_number: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "x-service-password": "passwordAPIGateway",
          "Content-Type": "application/json",
        },
        // Sesuaikan body JSON yang dikirim agar sama persis dengan yang diminta backend
        body: JSON.stringify({
          username,
          fullname,
          email,
          password,
          role,
          phone_number,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registrasi gagal.");
      }

      // Simpan ke Local Storage
      localStorage.setItem("jwt_token", result.data.token);
      localStorage.setItem("user_role", result.data.user.role);

      setToken(result.data.token);
      setUserRole(result.data.user.role);

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    setToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        isLoading,
        error,
        login,
        register,
        logout,
        fetchProfile,
        userProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
