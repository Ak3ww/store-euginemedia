# EugineStore — Platform E-Commerce Perangkat Jaringan & FTTH

Platform e-commerce modern, mandiri, dan berkinerja tinggi berbasis **Next.js 14 (App Router) + Tailwind CSS + BundUI / Shadcn UI** dengan palet resmi **Oceanic Blue** (`#002c60`).

---

## 🚀 Fitur Unggulan

### 1. Storefront Mobile-Friendly (Pure BundUI)
- **Desain Modern**: Hairline border, shadow lembut, font Inter, dan palet warna korporat Oceanic Blue.
- **Mobile 2-Kolom Grid**: Tampilan katalog 2 kolom di smartphone ala Shopee/Tokopedia yang ramah layar sentuh.
- **Category Filter Pills**: Filter tab instan untuk Router MikroTik, OLT FTTH, Modem ONT, Kabel Fiber, dan Tools.
- **Multi-Marketplace Integration**: Dukungan tombol belanja resmi di **Shopee** dan **Tokopedia** pada setiap produk.
- **Slide-over Cart Drawer**: Melihat keranjang belanja tanpa reload halaman.

### 2. Autentikasi Pelanggan (WhatsApp OTP & Google)
- **Login Instan via WhatsApp**: Masukkan nomor WhatsApp $\rightarrow$ terima 6 digit kode OTP via bot EugineBill $\rightarrow$ langsung login.
- **Bebas Jelajah**: Pengunjung bebas melihat produk dan menambah ke keranjang tanpa login.
- **Checkout Guard**: Login diwajibkan saat masuk ke tahap checkout.
- **Auto-Save Alamat**: Alamat pengiriman otomatis tersimpan ke profil pelanggan untuk transaksi berikutnya (*1-click auto-fill*).

### 3. Pembayaran & Pengiriman Indonesia
- **QRIS Real-Time**: Dynamic QRIS barcode otomatis via QRIN API.
- **Transfer Bank Manual**: Rekening resmi BCA & Mandiri dengan tombol salin nomor rekening 1-klik.
- **Kalkulator Ongkir Logistik**: JNE (Reg/Cargo), J&T, SiCepat berdasarkan berat gram barang.
- **Notifikasi WhatsApp Otomatis**: Invoice pesanan dan nomor resi pengiriman dikirim langsung ke WhatsApp pembeli via service lokal port 3002.

### 4. Admin Portal Terintegrasi (`/admin`)
- **Dashboard Metrik**: Total omset, pesanan masuk, pesanan siap kirim, dan grafik tren.
- **Manajemen Produk**: Tambah/edit produk, upload foto, atur stok & harga, dan input link Shopee/Tokopedia.
- **Manajemen Pesanan**: Update status pesanan & input nomor resi dengan otomatis mengirim alert WA ke pembeli.

---

## 🛠️ Stack Teknologi

- **Frontend**: Next.js 14, React 19, Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Zustand
- **Backend**: Next.js App Router API Routes, Zod Validation, Jose & JWT, BcryptJS
- **Database**: MySQL 8.0 via Prisma ORM
- **Payment**: QRIN QRIS Gateway API
- **Messaging**: EugineBill-wa (Port 3002)

---

## 📦 Deployment ke VPS Ubuntu (1-Command)

Buka terminal SSH VPS Anda di direktori `/var/www/store-euginemedia`, lalu jalankan:

```bash
cd /var/www/store-euginemedia
git pull origin main
sudo bash deploy-vps.sh
```

Aplikasi akan otomatis terpasang dan berjalan di **PM2 port 3005** (`euginestore-web`) di balik reverse proxy Nginx pada domain `store.euginemediagroup.com` lengkap dengan sertifikat SSL Certbot!

---

## 🔐 Kredensial Default Admin
- **URL Admin**: `https://store.euginemediagroup.com/admin`
- **Username**: `admin@euginemediagroup.com`
- **Password**: `EugineStore2026!`
