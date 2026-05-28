// src/contexts/AddressContext.tsx
import  {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Definisikan tipe data
interface LocationOption {
  id: number;
  name: string;
}

interface AddressPayload {
  full_address: string;
  label: string;
  province: string;
  province_id: number;
  city: string;
  city_id: number;
  district: string;
  district_id: number;
}

interface AddressContextType {
  provinces: LocationOption[];
  cities: LocationOption[];
  districts: LocationOption[];
  isLoading: boolean;
  fetchProvinces: () => Promise<void>;
  fetchCities: (provinceId: number) => Promise<void>;
  fetchDistricts: (cityId: number) => Promise<void>;
  saveAddress: (payload: AddressPayload) => Promise<boolean>;
  resetCities: () => void;
  resetDistricts: () => void;
  addresses: any[];
  fetchAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const BASE_URL = import.meta.env.VITE_API_URL ; // Sesuaikan dengan API Gateway kamu

  // Helper untuk mengambil token agar request aman
  const getAuthHeader = () => {
    const token = localStorage.getItem("jwt_token");
    return {
      "x-service-password": import.meta.env.VITE_PASSWORD || "",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };
  console.log(getAuthHeader());
  // Tambahkan state ini di dalam AddressProvider
  const [addresses, setAddresses] = useState<any[]>([]);

  // Tambahkan fungsi fetchAddresses ini
  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/addresses`, {
        method: "GET",
        headers: getAuthHeader(), // Fungsi ini sudah otomatis menyisipkan Authorization: Bearer <token>
      });

      const result = await response.json();

      // Trik anti-crash: mengekstrak data dari double-wrapper
      const extractedData = result.data?.data || result.data || result;

      setAddresses(Array.isArray(extractedData) ? extractedData : []);
    } catch (error) {
      console.error("Gagal mengambil daftar alamat:", error);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Jangan lupa daftarkan `addresses` dan `fetchAddresses` ke dalam return value Provider:
  // value={{ ..., addresses, fetchAddresses, ... }}
  const fetchProvinces = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/provinces`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const result = await response.json();

      // Ambil data yang terdalam (menangani double-wrapper Gateway & Backend)
      const extractedData = result.data?.data || result.data || result;
      // Pastikan yang disimpan adalah Array
      setProvinces(Array.isArray(extractedData) ? extractedData : []);
    } catch (error) {
      console.error("Gagal mengambil provinsi:", error);
      setProvinces([]); // Fallback array kosong
    }
  };

  const fetchCities = async (provinceId: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/locations/cities?province_id=${provinceId}`,
        {
          method: "GET",
          headers: getAuthHeader(),
        },
      );
      const result = await response.json();

      const extractedData = result.data?.data || result.data || result;
      setCities(Array.isArray(extractedData) ? extractedData : []);
    } catch (error) {
      console.error("Gagal mengambil kota:", error);
      setCities([]);
    }
  };

  const fetchDistricts = async (cityId: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/locations/districts?city_id=${cityId}`,
        {
          method: "GET",
          headers: getAuthHeader(),
        },
      );
      const result = await response.json();

      const extractedData = result.data?.districts || result.data || result;
      console.log(extractedData);
      setDistricts(Array.isArray(extractedData) ? extractedData : []);
    } catch (error) {
      console.error("Gagal mengambil kecamatan:", error);
      setDistricts([]);
    }
  };

  const saveAddress = async (payload: AddressPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/addresses`, {
        method: "POST",
        headers: getAuthHeader(), // Kirim header gateway & JWT ke backend
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal menyimpan alamat");

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return false;
    }
  };

  const resetCities = () => setCities([]);
  const resetDistricts = () => setDistricts([]);

  return (
    <AddressContext.Provider
      value={{
        provinces,
        cities,
        districts,
        isLoading,
        fetchProvinces,
        fetchCities,
        fetchDistricts,
        saveAddress,
        resetCities,
        resetDistricts,
        addresses,
        fetchAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress harus digunakan di dalam AddressProvider");
  }
  return context;
};
