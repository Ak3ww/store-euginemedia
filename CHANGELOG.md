# Changelog — EugineStore

Semua perubahan dan rilis arsitektur EugineStore didokumentasikan di sini mengikuti standar *Keep a Changelog*.

---

## [3.1.0] - 2026-10-09

### 📦 Indonesian Logistics & Brand Marks Overhaul via idn-finlogos

- **Latar Belakang (Issue / Context)**:
  - Pilihan ekspedisi kurir di checkout sebelumnya hanya memiliki 3 file hardcoded (JNE, J&T, SiCepat), di mana opsi kurir lainnya (AnterAja, Pos Indonesia, Lion Parcel, SPX, Wahana, TIKI, dll.) salah di-fallback ke logo SiCepat.
  - Halaman produk membutuhkan penayangan visual kurir yang didukung dan tombol marketplace terstandar dengan logo vektor resolusi tinggi.

- **Solusi Arsitektural & Perubahan Teknis**:
  - **Aset Kurasi SVGO Lokal**: Menyalin ~20 logo kurir ekspedisi ke `/public/images/couriers/`, ~7 marketplace ke `/public/images/marketplaces/`, dan ~30 logo bank & e-wallet ke `/public/images/finlogos/` dari library resmi `idn-finlogos` (v2.5.1).
  - **Modul Resolver (`lib/finlogos.ts`)**: Pencocokan cerdas alias nama kurir Indonesia (`j&t`, `jnt`, `sicepat`, `pos indonesia`, `anteraja`, `spx express`, dll.) dan marketplace resmi (`shopee`, `tokopedia`, `tiktok shop`, `lazada`, `blibli`, `bukalapak`).
  - **Universal Component `<BrandLogo />` (`components/ui/brand-logo.tsx`)**: Komponen terpadu dengan fallback graceful ke icon Lucide (`Truck`, `ShoppingBag`, `CreditCard`) dan fallback CDN jika query di luar kurasi lokal.
  - **Pembaruan Halaman Checkout (`app/checkout/page.tsx`)**:
    - Seluruh opsi kurir ekspedisi kini menampilkan logo resmi masing-masing (`<BrandLogo name={opt.courier} category="courier" size="sm" />`).
    - Logo metode pembayaran QRIS, e-wallet, dan rekening bank resmi kini terhubung ke aset `idn-finlogos`.
  - **Pembaruan Detail Produk (`app/products/[id]/product-detail.tsx`)**:
    - Menambahkan badge bar resmi ekspedisi pengiriman didukung (JNE, J&T Express, SiCepat, AnterAja, Pos Indonesia).
    - Tombol "Juga Tersedia di Marketplace Resmi" (Shopee Official & Tokopedia).

- **Daftar File yang Ditambahkan / Dimodifikasi (`Files`)**:
  - Added: `lib/finlogos.ts`
  - Added: `components/ui/brand-logo.tsx`
  - Added: `public/images/couriers/*` (~20 SVG files)
  - Added: `public/images/marketplaces/*` (~7 SVG files)
  - Added: `public/images/finlogos/*` (~30 SVG files)
  - Modified: `app/checkout/page.tsx`
  - Modified: `app/products/[id]/product-detail.tsx`
  - Modified: `CHANGELOG.md`

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
