
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AddressProvider } from './contexts/AddressContext.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AddressProvider> {/* 2. Bungkus di sini */}
          <App />
        </AddressProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);