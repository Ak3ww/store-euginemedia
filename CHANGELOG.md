# Changelog — EugineStore

Semua perubahan penting, pembaruan fitur, dan perbaikan pada proyek **EugineStore** didokumentasikan di file ini dengan prinsip *"Tulis yang dikerjakan, kerjakan yang ditulis"*.

---

## [1.2.0] - 2026-10-05 — Integrasi BundUI Starter Kit & Rich UI Components

### 🎨 Adopsi BundUI E-Commerce Starter Kit & Penguatan Frontend
- **Latar Belakang (Context)**:
  Mempercepat kelengkapan visual toko online dengan mengadopsi struktur komponen kaya dari starter kit terverifikasi (`bundui/ecommerce-starter-kit`), meliputi komponen interaktif canggih (Embla carousel, product filter multi-dimensi, subpages kebijakan, form auth, dan 46+ komponen Shadcn UI) tanpa mengorbankan fondasi gateway dan arsitektur data EugineStore yang telah dibangun.
- **Solusi Arsitektural**:
  - **BundUI UI System**:
    - Porting 46+ komponen Radix UI & Shadcn UI (`accordion`, `alert-dialog`, `aspect-ratio`, `avatar`, `breadcrumb`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `tooltip`).
    - Theme styling di `globals.css` disesuaikan 100% ke standar **Hallmark Oceanic Blue** (`oklch(0.28 0.08 250)` / `#002c60`, `#1b437c`) tanpa teks emoji (100% Lucide React icons).
  - **Unified State Management**:
    - Menyatukan `stores/cartStore.ts` dan `features/cart/cart-store.ts` ke dalam satu Zustand store yang reaktif, mendukung multi-signature `addItem` dan method alias `getItemCount`/`getTotal`.
  - **Lokalisasi & Katalog FTTH**:
    - `lib/data.ts`: Dikonfigurasi ulang dengan katalog resmi PT. Eugine Media Group (MikroTik RB750Gr3 hEX, ONT XPON Gigabit AC1200, Smart CCTV 2K PTZ, Switch Gigabit 8-Port, Kabel Drop Core 1000m, Patchcord FO, OPM/VFL, dsb.) dengan format Rupiah `formatRupiah` IDR.
    - Halaman katalog lengkap `/products` dan `/products/[id]` dengan image carousel interaktif dan tab spesifikasi teknis.
  - **Subpages & Rute Pendukung**:
    - Menambahkan rute `/contact`, `/shipping`, `/returns`, `/terms`, `/privacy`, serta rute autentikasi `/auth/signin`, `/auth/signup`, `/auth/forgot-password`.
    - Menambahkan alias rute `/cart` yang selaras dengan `/keranjang`.
  - **Verifikasi Build**:
    - `npx prisma generate` dan `npm run build` sukses 100% menghasilkan 18 static & dynamic routes tanpa error lint ataupun TypeScript.
- **Files Modified/Added**:
  - `components/ui/*` (46+ components)
  - `components/sections/*` (`Hero.tsx`, `FeaturedProducts.tsx`, `Categories.tsx`, `Testimonials.tsx`, `Newsletter.tsx`)
  - `components/layout/*` (`navbar.tsx`, `footer.tsx`, `navigation.tsx`)
  - `components/ProductCard.tsx`, `components/logo.tsx`
  - `app/products/page.tsx`, `app/products/[id]/page.tsx`, `app/products/[id]/product-detail.tsx`
  - `app/cart/page.tsx`, `app/auth/*`, `app/contact/*`, `app/shipping/*`, `app/returns/*`, `app/terms/*`, `app/privacy/*`
  - `features/cart/cart-store.ts`, `stores/cartStore.ts`
  - `lib/data.ts`, `lib/schemas.ts`, `app/globals.css`, `package.json`

---

## [1.1.0] - 2026-10-05 — Rilis Phase 1 (MVP)

### 🚀 Implementasi E-Commerce Modular Monolith Selesai
- **Latar Belakang (Context)**:
  Membangun toko online resmi PT. Eugine Media Group (`https://store.euginemediagroup.com`) untuk melengkapi layanan Fiber To The Home (FTTH) dengan penjualan perangkat jaringan, smart home, CCTV, dan aksesoris fiber optic.
- **Solusi Arsitektural**:
  - **Modular Monolith `/features`**:
    - `features/catalog`: Listing katalog, tab filter kategori, search input, kartu produk, dan halaman detail produk.
    - `features/cart`: Keranjang belanja terintegrasi dengan Zustand + persistensi LocalStorage, dan slide-over Cart Drawer.
    - `features/checkout`: Formulir pengiriman, pemilihan metode pembayaran (QRIN QRIS Dinamis Instan, Midtrans Snap, Transfer Manual), dan integrasi pembayaran.
  - **Prisma Database Schema**:
    - Model `Product` (id, name, description, price, stock, imageUrl, category, isFeatured).
    - Model `Order` (id, customerName, customerPhone, customerEmail, shippingAddress, totalAmount, status [PENDING, PAID, SHIPPED, COMPLETED, CANCELLED], snapToken, snapRedirectUrl, paymentType).
    - Model `OrderItem` (id, orderId, productId, quantity, price).
    - Script seeding katalog awal: `prisma/seed.ts`.
  - **Gateway Integrations**:
    - **QRIN (Primary Gateway)**: QRIS dinamis instan dengan webhook callback verification via HMAC-SHA256 (`lib/qrin.ts` & `app/api/webhook/qrin`).
    - **Midtrans Snap (Secondary Gateway)**: Snap token generation, script integration, dan webhook handler ber-signature SHA512 (`lib/midtrans.ts` & `app/api/webhook/midtrans`).
    - **Manual Transfer / WA Confirmation**: Instruksi transfer resmi PT Eugine Media Group dengan direct WhatsApp confirmation link.
  - **Admin Orders Dashboard (`/admin/pesanan` & `/admin/orders`)**:
    - Ringkasan KPI: Total Penjualan, Pesanan Menunggu Pembayaran, Perlu Dikirim, Sedang Dikirim.
    - Tabel pesanan real-time dengan filter status, pencarian pembeli, dan 1-click update status (Tandai Lunas, Kirim, Selesai).
- **Files Added**:
  - `prisma/schema.prisma`, `prisma/seed.ts`
  - `lib/prisma.ts`, `lib/utils.ts`, `lib/qrin.ts`, `lib/midtrans.ts`
  - `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx`
  - `components/shared/Navbar.tsx`, `components/shared/Footer.tsx`
  - `features/cart/cart-store.ts`, `features/cart/CartDrawer.tsx`
  - `features/catalog/ProductCard.tsx`, `features/catalog/ProductGrid.tsx`, `features/catalog/ProductDetailView.tsx`
  - `features/checkout/CheckoutForm.tsx`
  - `app/layout.tsx`, `app/globals.css`
  - `app/(shop)/page.tsx`, `app/(shop)/produk/[id]/page.tsx`, `app/(shop)/keranjang/page.tsx`, `app/(shop)/checkout/page.tsx`, `app/(shop)/pesanan/[id]/page.tsx`
  - `app/admin/pesanan/page.tsx`, `app/admin/orders/page.tsx`
  - `app/api/checkout/route.ts`, `app/api/webhook/midtrans/route.ts`, `app/api/webhook/qrin/route.ts`, `app/api/admin/orders/route.ts`, `app/api/admin/orders/[id]/route.ts`

---

## [1.0.0] - 2026-10-05

### 🚀 Inisialisasi Proyek & Fondasi Arsitektur
- **Latar Belakang (Context)**: 
  PT. Eugine Media Group membutuhkan platform e-commerce dan layanan IT mandiri pada subdomain `https://store.euginemediagroup.com` yang berjalan di VPS yang sama dengan `EugineBill-radius` tanpa membebani proses build billing dan memiliki database terpisah (`euginestore`).
- **Solusi Arsitektural**:
  - Inisialisasi arsitektur Next.js 15 dengan App Router, TypeScript, dan Tailwind CSS v4.
  - Setup desain sistem **Hallmark Oceanic Blue** (`#002c60`, `#1b437c`) dengan komponen Shadcn UI dan ikon Lucide React.
  - Alokasi dedicated port `3001` dengan proses PM2 `EugineStore` dan Nginx reverse proxy mandiri.
  - Integrasi kontrak REST API ke engine tagihan dan payment gateway (QRIN QRIS Dinamis) EugineBill.
  - Penyusunan standar dokumentasi otomatis (`README.md`, `CHANGELOG.md`, `docs/AI_PROJECT_MEMORY.md`, `docs/ARCHITECTURE.md`).
- **Files Added**:
  - `README.md`
  - `CHANGELOG.md`
  - `docs/AI_PROJECT_MEMORY.md`
  - `docs/ARCHITECTURE.md`
