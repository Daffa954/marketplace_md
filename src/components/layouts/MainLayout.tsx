// src/components/layouts/MainLayout/index.tsx
import React from "react";
import { Navbar } from "../commons/navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar Sederhana */}
      <Navbar/>

      {/* Konten Utama */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center mt-auto">
        <p>&copy; {new Date().getFullYear()} UC Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
};