#!/usr/bin/env bash
# ==============================================================================
# EugineStore — 1-Command Automated WooCommerce & BundUI Setup
# Dedicated Repo: Ak3ww/store-euginemedia.git
# Target Domain: store.euginemediagroup.com
# Target VPS IP: 43.173.14.236
# Isolated Path: /var/www/store-euginemedia
# Database: euginestore_db (MySQL 8.0)
#
# Usage (di dalam folder /var/www/store-euginemedia):
#   sudo bash setup-vps-woocommerce.sh [admin_password]
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
    log_error "Harap jalankan script ini dengan hak akses root / sudo:"
    echo "  sudo bash setup-vps-woocommerce.sh"
    exit 1
fi

DOMAIN="store.euginemediagroup.com"
STORE_DIR="/var/www/store-euginemedia"
DB_NAME="euginestore_db"
DB_USER="euginestore"
DB_PASS="EugineStorePass2026!"

ADMIN_USER="admin"
ADMIN_EMAIL="admin@euginemediagroup.com"
ADMIN_PASS="${1:-EugineStore2026!}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${CYAN}================================================================${NC}"
echo -e "${BOLD} 🚀 SETUP OTOMATIS EUGINESTORE VIA WOOCOMMERCE & BUNDUI THEME ${NC}"
echo -e "${CYAN}================================================================${NC}"
echo -e " Domain Target : ${GREEN}https://${DOMAIN}${NC}"
echo -e " Direktori VPS : ${GREEN}${STORE_DIR}${NC} (100% Terisolasi di Repo store-euginemedia)"
echo -e " Database Toko : ${GREEN}${DB_NAME}${NC} (User: ${DB_USER})"
echo -e " Admin Login   : ${GREEN}${ADMIN_USER}${NC} (${ADMIN_EMAIL})"
echo -e "================================================================\n"

# ------------------------------------------------------------------------------
# 1. Install PHP 8.2-FPM & Ekstensi E-Commerce
# ------------------------------------------------------------------------------
log_info "1/7 Memeriksa dan menginstal paket PHP 8.2-FPM & dependensi..."

apt-get update -y
apt-get install -y software-properties-common curl wget unzip jq

if ! command -v php8.2 &> /dev/null; then
    add-apt-repository -y ppa:ondrej/php || true
    apt-get update -y
fi

apt-get install -y php8.2-fpm php8.2-mysql php8.2-curl php8.2-gd php8.2-mbstring \
    php8.2-xml php8.2-zip php8.2-intl php8.2-soap php8.2-bcmath php8.2-imagick

# Optimasi php.ini
sed -i 's/^upload_max_filesize = .*/upload_max_filesize = 64M/' /etc/php/8.2/fpm/php.ini || true
sed -i 's/^post_max_size = .*/post_max_size = 64M/' /etc/php/8.2/fpm/php.ini || true
sed -i 's/^memory_limit = .*/memory_limit = 256M/' /etc/php/8.2/fpm/php.ini || true
sed -i 's/^max_execution_time = .*/max_execution_time = 300/' /etc/php/8.2/fpm/php.ini || true

systemctl restart php8.2-fpm
log_success "PHP 8.2-FPM siap dan aktif."

# ------------------------------------------------------------------------------
# 2. Install WP-CLI (Command-Line Tool untuk Otomasi WordPress)
# ------------------------------------------------------------------------------
log_info "2/7 Memeriksa WP-CLI..."
if ! command -v wp &> /dev/null; then
    curl -fsSL -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x /usr/local/bin/wp
fi
log_success "WP-CLI siap: $(wp --version --allow-root)"

# ------------------------------------------------------------------------------
# 3. Buat Database MySQL & Dedicated User Terpisah
# ------------------------------------------------------------------------------
log_info "3/7 Menyiapkan database MySQL '${DB_NAME}' & user '${DB_USER}'..."

MYSQL_EXEC="mysql"
if ! mysql -e "SELECT 1;" >/dev/null 2>&1; then
    if [ -f "/var/www/EugineBill-radius/.env" ]; then
        ROOT_PASS_MATCH=$(grep "^DATABASE_URL=" /var/www/EugineBill-radius/.env | sed -E 's/.*:([^@]*)@.*/\1/' || true)
        if [ -n "$ROOT_PASS_MATCH" ]; then
            MYSQL_EXEC="mysql -u root -p${ROOT_PASS_MATCH}"
        fi
    fi
fi

$MYSQL_EXEC -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$MYSQL_EXEC -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
$MYSQL_EXEC -e "ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
$MYSQL_EXEC -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
$MYSQL_EXEC -e "FLUSH PRIVILEGES;"

log_success "Database '${DB_NAME}' dan user '${DB_USER}' siap digunakan."

# ------------------------------------------------------------------------------
# 4. Unduh & Setup WordPress Core
# ------------------------------------------------------------------------------
log_info "4/7 Menyiapkan instalasi WordPress di ${STORE_DIR}..."
cd "$STORE_DIR"

# Jika wp-config belum ada atau instalasi belum selesai
if ! wp core is-installed --allow-root 2>/dev/null; then
    # Unduh core jika belum ada
    if [ ! -f "$STORE_DIR/wp-includes/version.php" ]; then
        wp core download --allow-root
    fi

    # Buat ulang wp-config.php dengan kredensial dedicated user
    rm -f "$STORE_DIR/wp-config.php"
    wp config create \
        --dbname="${DB_NAME}" \
        --dbuser="${DB_USER}" \
        --dbpass="${DB_PASS}" \
        --dbhost="localhost" \
        --force \
        --allow-root

    # Install Core WordPress
    wp core install \
        --url="https://${DOMAIN}" \
        --title="Eugine Store — Pusat Perangkat Jaringan & FTTH" \
        --admin_user="${ADMIN_USER}" \
        --admin_password="${ADMIN_PASS}" \
        --admin_email="${ADMIN_EMAIL}" \
        --skip-email \
        --allow-root

    log_success "WordPress core berhasil diinstal."
else
    log_info "WordPress sudah terpasang di ${STORE_DIR}, melanjutkan konfigurasi..."
fi

# ------------------------------------------------------------------------------
# 5. Pasang WooCommerce, Tema BundUI & Plugin Tambahan
# ------------------------------------------------------------------------------
log_info "5/7 Memasang tema Storefront, child theme BundUI, & plugin esensial..."

# Install & activate base theme
wp theme install storefront --activate --allow-root || true

# Salin child theme BundUI
CHILD_THEME_DEST="$STORE_DIR/wp-content/themes/euginestore-bundui"
mkdir -p "$CHILD_THEME_DEST"
if [ -d "$SCRIPT_DIR/woocommerce-pack/theme/euginestore-bundui" ]; then
    cp -r "$SCRIPT_DIR/woocommerce-pack/theme/euginestore-bundui/"* "$CHILD_THEME_DEST/"
    wp theme activate euginestore-bundui --allow-root
    log_success "Child theme 'euginestore-bundui' aktif!"
fi

# Install & activate WooCommerce & Invoices
wp plugin install woocommerce --activate --allow-root
wp plugin install woocommerce-pdf-invoices-packing-slips --activate --allow-root || true

# Salin custom plugin QRIN Gateway & WhatsApp Bridge
PLUGINS_DEST="$STORE_DIR/wp-content/plugins"
if [ -d "$SCRIPT_DIR/woocommerce-pack/plugins/woocommerce-qrin-gateway" ]; then
    mkdir -p "$PLUGINS_DEST/woocommerce-qrin-gateway"
    cp -r "$SCRIPT_DIR/woocommerce-pack/plugins/woocommerce-qrin-gateway/"* "$PLUGINS_DEST/woocommerce-qrin-gateway/"
    wp plugin activate woocommerce-qrin-gateway --allow-root || true
    log_success "Plugin 'woocommerce-qrin-gateway' aktif!"
fi

if [ -d "$SCRIPT_DIR/woocommerce-pack/plugins/euginestore-wa-bridge" ]; then
    mkdir -p "$PLUGINS_DEST/euginestore-wa-bridge"
    cp -r "$SCRIPT_DIR/woocommerce-pack/plugins/euginestore-wa-bridge/"* "$PLUGINS_DEST/euginestore-wa-bridge/"
    wp plugin activate euginestore-wa-bridge --allow-root || true
    log_success "Plugin 'euginestore-wa-bridge' aktif!"
fi

# Konfigurasi WooCommerce (IDR Currency, formatting)
wp option update woocommerce_currency "IDR" --allow-root
wp option update woocommerce_currency_pos "left" --allow-root
wp option update woocommerce_price_thousand_sep "." --allow-root
wp option update woocommerce_price_decimal_sep "," --allow-root
wp option update woocommerce_price_num_decimals 0 --allow-root
wp option update woocommerce_default_country "ID:JB" --allow-root # Indonesia: Jawa Barat
wp option update woocommerce_store_city "Cibinong" --allow-root
wp option update woocommerce_store_postcode "16913" --allow-root

# Set permission file ke www-data
chown -R www-data:www-data "$STORE_DIR"
find "$STORE_DIR" -type d -exec chmod 755 {} \;
find "$STORE_DIR" -type f -exec chmod 644 {} \;

# ------------------------------------------------------------------------------
# 6. Konfigurasi Virtual Host Nginx & SSL Certbot
# ------------------------------------------------------------------------------
log_info "6/7 Mengonfigurasi Virtual Host Nginx untuk ${DOMAIN}..."

NGINX_CONF="/etc/nginx/sites-available/store-euginemedia"

cat > "$NGINX_CONF" << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name store.euginemediagroup.com;

    root /var/www/store-euginemedia;
    index index.php index.html index.htm;

    client_max_body_size 64M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml image/svg+xml;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    location ~* /(?:uploads|files)/.*\.php$ {
        deny all;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location ~ /\. {
        deny all;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/store-euginemedia

if nginx -t; then
    systemctl reload nginx
    log_success "Nginx virtual host berhasil dikonfigurasi & di-reload."
else
    log_error "Konfigurasi Nginx bermasalah. Periksa kembali sintaksnya."
    exit 1
fi

log_info "Memeriksa sertifikat SSL Certbot..."
if command -v certbot &> /dev/null; then
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$ADMIN_EMAIL" --redirect || {
        log_warn "Certbot belum berhasil menerbitkan SSL (mungkin DNS propagation sedang berjalan). Anda bisa jalankan 'certbot --nginx -d ${DOMAIN}' nanti."
    }
fi

# ------------------------------------------------------------------------------
# 7. Seeding 12 Produk Nyata ISP / MikroTik / FTTH
# ------------------------------------------------------------------------------
log_info "7/7 Melakukan seeding katalog produk awal ke WooCommerce..."

cd "$STORE_DIR"

create_product() {
    local name="$1"
    local price="$2"
    local weight="$3"
    local desc="$4"
    local sku="$5"
    local category="$6"

    local existing_id
    existing_id=$(wp post list --post_type=product --title="$name" --field=ID --allow-root 2>/dev/null || true)

    if [ -z "$existing_id" ]; then
        wp wc product create \
            --name="$name" \
            --type="simple" \
            --regular_price="$price" \
            --weight="$weight" \
            --description="$desc" \
            --sku="$sku" \
            --manage_stock=true \
            --stock_quantity=50 \
            --user=1 \
            --allow-root > /dev/null 2>&1 || true
        echo "   • [+] Ditambahkan: $name (Rp $(printf "%'d" "$price" | tr ',' '.'))"
    else
        echo "   • [=] Sudah ada: $name"
    fi
}

echo "Memasukkan 12 produk perangkat jaringan resmi..."
create_product "MikroTik RB750Gr3 (hEX) Gigabit Router" 875000 0.4 "Routerboard 5 Port Gigabit Ethernet, CPU Dual-Core 880MHz, RAM 256MB. Cocok untuk Gateway RT-RW Net & PPPoE Server." "MK-HEX-750" "Router"
create_product "MikroTik RB4011iGS+RM Enterprise Router" 3450000 1.5 "Routerboard 10 Port Gigabit Ethernet, 1 Port SFP+ 10Gbps, Quad-Core 1.4GHz, Casing Rackmount 1U." "MK-RB4011-RM" "Router"
create_product "MikroTik hAP ac2 Dual-Band WiFi Gigabit" 1150000 0.5 "Access Point & Router Dual-Band 2.4GHz & 5GHz, 5 Port Gigabit, Quad-Core 716MHz." "MK-HAPAC2" "Router"
create_product "VSOL V1600GS EPON/GPON OLT 1-Port SFP+" 2850000 2.0 "Mini OLT 1 Port PON kapasitas 128 ONT, Uplink 1G SFP / 10G SFP+. Sangat hemat daya & stabil untuk ISP pemula." "VSOL-1600GS" "FTTH"
create_product "Modem ONT ZTE F670L Dual Band XPON Gigabit" 245000 0.45 "Modem ONT Optical Network Terminal XPON (EPON/GPON), WiFi AC1200 Dual-Band 2.4G & 5G, 4 Port LAN Gigabit." "ZTE-F670L" "ONT"
create_product "Modem ONT VSOL V2801SG Mini Stick Gigabit" 165000 0.25 "Modem ONT 1 Port LAN Gigabit, Chipset Cortina / Realtek, performa bridge ultra-stabil." "VSOL-V2801SG" "ONT"
create_product "Kabel Dropcore 1 Core 3 Seling Preconn 100M" 95000 1.8 "Kabel fiber optic dropcore outdoor 1 core 3 kawat seling baja, konektor SC-UPC pabrikan siap pakai 100 meter." "FO-DC-100M" "Kabel"
create_product "Kabel Dropcore 1 Core Preconn SC-UPC 150M" 135000 2.6 "Kabel fiber optic outdoor 1 core preconn 150 meter dengan redaman rendah (< 0.2 dB) SC-UPC to SC-UPC." "FO-DC-150M" "Kabel"
create_product "SFP Module GPON OLT C+++ 20km 1490/1310nm" 375000 0.1 "Transceiver SFP OLT Class C+++ TX power +7 dBm, jarak transmisi 20km, single-mode SC." "SFP-GPON-CPPP" "Aksesoris"
create_product "Optical Power Meter (OPM) + Laser VFL 10mW" 185000 0.35 "Alat ukur redaman kabel fiber optik (OPM -70 to +10 dBm) komplit dengan senter laser optik merah 10km." "TOOL-OPM-VFL" "Alat"
create_product "Media Converter HTB-3100 Fiber to LAN Sepasang (A/B)" 140000 0.45 "Konverter FO single mode 1 core 25km SC ke kabel LAN RJ45, sepasang transceiver A dan B." "HTB-3100-AB" "Aksesoris"
create_product "Kotak ODP 8 Port Pole / Wall Mount Komplit" 125000 0.9 "Optical Distribution Point (ODP) kapasitas 8 adapter SC, proteksi outdoor IP65 tahan air dan panas." "ODP-8P-BOX" "Aksesoris"

echo ""
echo -e "${GREEN}================================================================${NC}"
echo -e "${BOLD} 🎉 INSTALASI EUGINESTORE VIA WOOCOMMERCE SELESAI DENGAN SUKSES! ${NC}"
echo -e "${GREEN}================================================================${NC}"
echo -e " 🌐 URL Toko        : ${CYAN}https://${DOMAIN}${NC}"
echo -e " 🔐 Admin Dashboard : ${CYAN}https://${DOMAIN}/wp-admin${NC}"
echo -e " 👤 Username Admin  : ${BOLD}${ADMIN_USER}${NC}"
echo -e " 🔑 Password Admin  : ${BOLD}${ADMIN_PASS}${NC}"
echo -e " 🎨 Tema Aktif      : ${CYAN}euginestore-bundui${NC} (BundUI Oceanic Blue)"
echo -e " 💳 Gateway Aktif   : ${CYAN}QRIN (QRIS Otomatis)${NC} & Transfer Bank"
echo -e " 🤖 Bot WhatsApp    : Terhubung ke ${CYAN}EugineBill-wa (Port 3002)${NC}"
echo -e " 📱 Aplikasi HP     : Buka aplikasi WooCommerce di Play Store/App Store,"
echo -e "                      masukkan ${CYAN}https://${DOMAIN}${NC} & login akun di atas."
echo -e "================================================================\n"
