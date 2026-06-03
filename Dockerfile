# ==========================================
# Tahap 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Tangkap variabel dari docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_PASSWORD
ENV VITE_PASSWORD=$VITE_PASSWORD

# Build aplikasi dengan variabel yang sudah disuntikkan
RUN npm run build

# ==========================================
# Tahap 2: Runner
# ==========================================
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]