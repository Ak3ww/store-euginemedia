#!/usr/bin/env bash
# ==============================================================================
# EugineStore - 1-Command Production Sync & Repair Script
# ==============================================================================
set -e

APP_DIR="/var/www/store-euginemedia"
cd "$APP_DIR"

echo "======================================================="
echo " 🚀 SINKRONISASI & PERBAIKAN EUGINESTORE"
echo "======================================================="

# 1. Bersihkan perubahan lokal atau file yang tertahan agar git pull tidak error
echo "[1/5] Membersihkan conflict dan menarik kode terbaru dari GitHub..."
git stash || true
git fetch origin main
git reset --hard origin/main

# 2. Pastikan dependensi up-to-date
echo "[2/5] Memeriksa dependensi..."
npm install --legacy-peer-deps

# 3. Jalankan Prisma generate
echo "[3/5] Generate Prisma client..."
npx prisma generate

# 4. Build aplikasi Next.js
echo "[4/5] Membangun aplikasi Next.js (npm run build)..."
npm run build

# 5. Salin aset statis ke folder standalone (agar tidak 404)
echo "[5/5] Menyinkronkan aset statis ke standalone..."
mkdir -p "$APP_DIR/.next/standalone/.next"
mkdir -p "$APP_DIR/.next/standalone/public"
cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/"
cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/"

# 6. Restart PM2
echo "Restarting PM2 process 'euginestore-web'..."
pm2 restart euginestore-web || pm2 start ecosystem.config.js
pm2 save

echo ""
echo "======================================================="
echo " ✅ SELESAI! Seluruh file, logo brand, dan chunk terpasang."
echo " Silakan refresh browser (Ctrl + Shift + R)."
echo "======================================================="
