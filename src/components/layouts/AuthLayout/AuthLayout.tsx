import React from 'react';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {/* Kotak Card melayang dengan sudut lebih membulat (rounded-2xl) */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md relative overflow-hidden">
        
        {/* Aksen pita hijau di bagian atas ujung kotak */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00AA5B]"></div>

        {/* Judul dinamis dengan margin bawah yang lebih lega */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mt-2 mb-8">
          {title}
        </h2>
        
        {/* Tempat formulir dan link akan di-render */}
        {children}
      </div>
    </div>
  );
};