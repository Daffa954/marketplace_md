# ==========================================
# Tahap 1: Builder (Membina fail statik React)
# ==========================================
FROM node:20-alpine AS builder

# Tetapkan direktori kerja
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua kod sumber aplikasi
COPY . .

# Bina aplikasi React (menghasilkan folder /dist atau /build)
# Jika anda ada VITE_API_URL, ia boleh disuntik menggunakan ARG di sini
RUN npm run build

# ==========================================
# Tahap 2: Runner (Nginx Web Server)
# ==========================================
FROM nginx:alpine

# Salin hasil binaan dari tahap 1 ke direktori awam Nginx
# NOTA: Jika projek anda menggunakan Create React App, tukar /app/dist kepada /app/build
COPY --from=builder /app/dist /usr/share/nginx/html

# Salin konfigurasi Nginx (Sangat penting untuk React Router / SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Buka port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]