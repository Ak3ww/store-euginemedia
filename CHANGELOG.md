# Changelog — EugineStore

Semua perubahan dan rilis arsitektur EugineStore didokumentasikan di sini mengikuti standar *Keep a Changelog*.

---

## [3.0.0] - 2026-10-06

### 🚀 Major Architecture Release: Next.js 14 BundUI Full Stack
- **Latar Belakang (Issue / Context)**:
  - Instalasi WooCommerce sebelumnya menciptakan dependensi legacy blog WordPress ("Hello World", query parameters `?post_type=product`, serta pemakaian RAM VPS yang tinggi).
  - Dibutuhkan platform e-commerce yang cepat, mandiri, berdesain murni BundUI / Shadcn UI dengan palet Oceanic Blue, memiliki alur autentikasi WhatsApp OTP, proteksi alamat ketat, multi-marketplace links (Shopee & Tokopedia), dan integrasi native ke QRIN serta bot WhatsApp EugineBill port 3002.

- **Solusi Arsitektural & Perubahan Teknis**:
  - **Database Prisma MySQL**: Didefinisikan model `Customer`, `CustomerOtp`, `AdminUser`, `Category`, `Product`, `Order`, `OrderItem`, dan `StoreSetting` pada database `euginestore_db`.
  - **Autentikasi WhatsApp OTP**: Flow login/daftar instan dengan nomor WA, 6-digit OTP digenerate dan dikirim via bot WA lokal `EugineBill-wa` (`http://127.0.0.1:3002/api/send-message`), serta integrasi komponen `InputOTP` Shadcn UI.
  - **Checkout Guard & Address Auto-Save**: Pelanggan bebas menjelajah katalog dan menambah keranjang belanja tanpa login; autentikasi & validasi alamat lengkap diwajibkan saat checkout. Alamat otomatis tersimpan ke profil pelanggan untuk transaksi berikutnya (*auto-filled*).
  - **Multi-Marketplace Integration**: Dukungan input link Shopee dan Tokopedia per produk pada dashboard admin, dilengkapi tombol belanja resmi di halaman produk dengan icon resmi beresolusi tinggi.
  - **Aset Resmi Pihak Ketiga**: Ditambahkan vektor resmi QRIS, Bank BCA, Mandiri, BRI, BNI, Seabank, E-Wallet, Shopee, Tokopedia, TikTok, JNE, J&T, dan SiCepat.
  - **Kalkulator Ongkir Indonesia**: Perhitungan biaya pengiriman berdasarkan berat riil (gram) dan kurir JNE, J&T, SiCepat.
  - **Admin Portal Terintegrasi (`/admin`)**: Dashboard metrik, manajemen katalog & stok, update status pesanan & input nomor resi dengan otomatis mengirim alert WA ke pembeli.
  - **1-Command VPS Deploy (`deploy-vps.sh`)**: Otomasi build dan start proses PM2 `euginestore-web` di Port 3005 dengan Nginx reverse proxy dan SSL Certbot.

- **Daftar File yang Ditambahkan / Dimodifikasi (`Files`)**:
  - `prisma/schema.prisma`
  - `prisma/seed.ts`
  - `lib/prisma.ts`
  - `lib/auth.ts`
  - `lib/security.ts`
  - `lib/whatsapp.ts`
  - `lib/qrin.ts`
  - `stores/authStore.ts`
  - `stores/cartStore.ts`
  - `components/layout/navbar.tsx`
  - `components/layout/footer.tsx`
  - `components/auth/AuthModal.tsx`
  - `components/cart/CartDrawer.tsx`
  - `components/FloatingWhatsApp.tsx`
  - `components/ProductCard.tsx`
  - `components/sections/Hero.tsx`
  - `components/sections/ProductCatalog.tsx`
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/products/[id]/page.tsx`
  - `app/checkout/page.tsx`
  - `app/orders/[orderNumber]/page.tsx`
  - `app/profile/page.tsx`
  - `app/admin/login/page.tsx`
  - `app/admin/page.tsx`
  - `app/admin/products/page.tsx`
  - `app/admin/orders/page.tsx`
  - `app/api/auth/otp/send/route.ts`
  - `app/api/auth/otp/verify/route.ts`
  - `app/api/auth/me/route.ts`
  - `app/api/auth/admin/login/route.ts`
  - `app/api/customer/address/route.ts`
  - `app/api/products/route.ts`
  - `app/api/products/[slug]/route.ts`
  - `app/api/orders/route.ts`
  - `app/api/orders/[orderNumber]/route.ts`
  - `app/api/admin/orders/route.ts`
  - `app/api/admin/orders/[id]/status/route.ts`
  - `app/api/shipping/calculate/route.ts`
  - `app/api/categories/route.ts`
  - `deploy-vps.sh`
  - `README.md`
  - `CHANGELOG.md`
