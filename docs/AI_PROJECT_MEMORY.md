# EugineStore — AI Project Memory & Invariants

File ini adalah memori permanen untuk AI Agent (Antigravity) agar tidak mengalami amnesia arsitektural dan selalu mematuhi batasan teknis (*hard invariants*) pada pengembangan **EugineStore**.

---

## 🏛️ Hard Invariants (Aturan Baku Sistem)

1. **Isolasi Folder & Resource VPS**:
   - Direktori Lokal: `C:\EugineStore`
   - Direktori VPS: `/var/www/EugineStore`
   - Port VPS: `3001` (PM2 Process: `EugineStore`)
   - DILARANG KERAS mencampur dependencies `package.json` atau proses `npm run build` Store ke dalam folder Billing (`/var/www/EugineBill-radius`).
2. **Isolasi Database**:
   - Database: MySQL `euginestore` (Database terpisah dari `euginebill`).
   - Integrasi ke billing EugineBill HANYA dilakukan melalui REST API (`/api/external/invoices` atau shared invoice generator), tidak boleh merusak schema database billing.
3. **Strict Hallmark Design & No Text Emojis**:
   - Tema: **Oceanic Blue** (`--color-primary: #002c60`, `--color-accent: #1b437c`).
   - DILARANG menggunakan text emoji (🚀, 🛒, 💳, 🔥, ⚡). WAJIB menggunakan komponen React Icon dari `lucide-react` (`<ShoppingCart />`, `<CreditCard />`, `<Zap />`, `<Package />`, `<ShieldCheck />`).
4. **Multi-Action Buttons pada Produk**:
   - Setiap produk e-commerce mendukung 3 aksi: Beli Langsung (Web Checkout), Order/Konsultasi via WhatsApp, dan Tautan Marketplace (Tokopedia / Shopee).
5. **Auto Documentation & Memory Sync**:
   - Setiap kali fitur baru atau bugfix diimplementasikan, `CHANGELOG.md` dan `README.md` WAJIB diperbarui sebelum perubahan di-push.
6. **BundUI Starter Kit & Unified Zustand State**:
   - Komponen visual storefront mengadopsi struktur `bundui/ecommerce-starter-kit` (Radix UI + Shadcn UI v4) dengan palet tema Hallmark Oceanic Blue (`#002c60`, `#1b437c`).
   - Zustand cart store disatukan (`stores/cartStore.ts` mereferensikan `features/cart/cart-store.ts`) agar badge di navbar, slide-over drawer, product detail, dan formulir checkout selalu reaktif dan terhubung pada satu state yang sama.
7. **Standar Mata Uang & Lokalisasi**:
   - Seluruh harga produk diformat dalam Rupiah Indonesia (`formatRupiah`) dan copy menggunakan Bahasa Indonesia profesional.

