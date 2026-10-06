#!/usr/bin/env bash
# ==============================================================================
# EugineStore — 1-Command Automated Next.js 14 & BundUI VPS Deployment
# Dedicated Repo: Ak3ww/store-euginemedia.git
# Target Domain: store.euginemediagroup.com
# Port: 3005
# PM2 Process: euginestore-web
# Database: euginestore_db (MySQL 8.0)
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log_info() { echo -e "${CYAN}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ "$EUID" -ne 0 ]; then
    log_error "Harap jalankan script ini dengan hak akses sudo / root:"
    echo "  sudo bash deploy-vps.sh"
    exit 1
fi

DOMAIN="store.euginemediagroup.com"
APP_DIR="/var/www/store-euginemedia"
PORT=3005
PM2_NAME="euginestore-web"
DB_NAME="euginestore_db"
DB_USER="euginestore"
DB_PASS="EugineStorePass2026!"

echo -e "${CYAN}================================================================${NC}"
echo -e "${BOLD} 🚀 DEPLOY EUGINESTORE (NEXT.JS 14 PURE BUNDUI & SHADCN UI) ${NC}"
echo -e "${CYAN}================================================================${NC}"
echo -e " Domain Target : ${GREEN}https://${DOMAIN}${NC}"
echo -e " Direktori VPS : ${GREEN}${APP_DIR}${NC}"
echo -e " Port Internal : ${GREEN}${PORT}${NC} (PM2: ${PM2_NAME})"
echo -e " Database Toko : ${GREEN}${DB_NAME}${NC} (MySQL 8.0)"
echo -e "================================================================\n"

# ------------------------------------------------------------------------------
# 1. Pastikan Database & User MySQL Siap
# ------------------------------------------------------------------------------
log_info "1/7 Menyiapkan database MySQL '${DB_NAME}'..."

mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

log_success "Database & user MySQL siap."

# ------------------------------------------------------------------------------
# 2. Setup Environment .env Produksi
# ------------------------------------------------------------------------------
log_info "2/7 Mengonfigurasi file .env produksi..."
cd "$APP_DIR"

cat > "$APP_DIR/.env" << EOF
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@127.0.0.1:3306/${DB_NAME}"
NEXTAUTH_SECRET="euginestore-secret-jwt-key-2026-production"
NEXT_PUBLIC_APP_URL="https://${DOMAIN}"
WA_SERVICE_URL="http://127.0.0.1:3002/api/send-message"
QRIN_TOKEN="7nOIOzohPZMhiZcV9UkK62Ym73h8FUqbYsGEm4BAEfWWdQuUZhuzCRzsyeL31J6a"
PORT=${PORT}
NODE_ENV=production
EOF

log_success "File .env berhasil dibuat."

# ------------------------------------------------------------------------------
# 3. Install Dependensi NPM
# ------------------------------------------------------------------------------
log_info "3/7 Menginstal paket dependensi Node.js..."
npm install --legacy-peer-deps
npm install -D tsx --legacy-peer-deps
log_success "Paket dependensi berhasil diinstal."

# ------------------------------------------------------------------------------
# 4. Sinkronisasi Database Prisma & Seeding Katalog
# ------------------------------------------------------------------------------
log_info "4/7 Menjalankan migrasi Prisma ke MySQL & Seeding 12 produk..."
npx prisma generate
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts
log_success "Database berhasil disinkronkan dan di-seed."

# ------------------------------------------------------------------------------
# 5. Production Build Next.js
# ------------------------------------------------------------------------------
log_info "5/7 Membangun aplikasi Next.js (npm run build)..."
npm run build
log_success "Build aplikasi Next.js selesai dengan sukses."

# ------------------------------------------------------------------------------
# 6. Jalankan Proses PM2 di Port 3005 (Standalone Mode)
# ------------------------------------------------------------------------------
log_info "6/7 Mengonfigurasi PM2 (${PM2_NAME} port ${PORT} Standalone)..."

# Salin direktori statis ke standalone folder jika belum ada
cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/" 2>/dev/null || true
cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/" 2>/dev/null || true

if command -v pm2 &> /dev/null; then
    pm2 delete "$PM2_NAME" 2>/dev/null || true
    pm2 start "$APP_DIR/ecosystem.config.js"
    pm2 save
    log_success "Aplikasi berjalan di PM2: ${PM2_NAME} (Port ${PORT})."
else
    log_warn "PM2 belum terpasang. Memasang pm2 global..."
    npm install -g pm2
    pm2 start "$APP_DIR/ecosystem.config.js"
    pm2 save
fi

# ------------------------------------------------------------------------------
# 7. Konfigurasi Nginx Reverse Proxy & SSL Certbot
# ------------------------------------------------------------------------------
log_info "7/7 Mengonfigurasi Virtual Host Nginx..."

NGINX_CONF="/etc/nginx/sites-available/store-euginemedia"

cat > "$NGINX_CONF" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 64M;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/store-euginemedia

if nginx -t; then
    systemctl reload nginx
    log_success "Nginx berhasil di-reload."
else
    log_error "Konfigurasi Nginx bermasalah!"
fi

if command -v certbot &> /dev/null; then
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "admin@euginemediagroup.com" --redirect || true
fi

echo ""
echo -e "${GREEN}================================================================${NC}"
echo -e "${BOLD} 🎉 DEPLOYMENT EUGINESTORE BERHASIL 100%! ${NC}"
echo -e "${GREEN}================================================================${NC}"
echo -e " 🌐 Toko Online     : ${CYAN}https://${DOMAIN}${NC}"
echo -e " 🛡️ Admin Dashboard : ${CYAN}https://${DOMAIN}/admin${NC}"
echo -e " 👤 Akun Admin      : ${BOLD}admin@euginemediagroup.com${NC}"
echo -e " 🔑 Password Admin  : ${BOLD}EugineStore2026!${NC}"
echo -e " 💳 QRIS Gateway    : ${CYAN}QRIN Real-Time API${NC}"
echo -e " 🤖 WhatsApp Bot    : ${CYAN}EugineBill-wa (Port 3002)${NC}"
echo -e " ⚡ Status Server   : PM2 '${PM2_NAME}' Aktif di Port ${PORT}"
echo -e "================================================================\n"
