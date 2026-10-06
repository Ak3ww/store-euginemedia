import Link from "next/link";
import Logo from "@/components/logo";
import { ShieldCheck, Truck, Clock, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      {/* Guarantees Bar (Cricket Weapon Accent Style) */}
      <div className="border-b border-neutral-100 bg-neutral-50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-neutral-900 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900">
                  Pengiriman Cepat
                </p>
                <p className="text-[11px] text-neutral-500 font-['Roboto']">JNE, J&T, SiCepat Domestik</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-neutral-900 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900">
                  100% Produk Original
                </p>
                <p className="text-[11px] text-neutral-500 font-['Roboto']">Garansi Resmi Distribusi</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-neutral-900 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900">
                  QRIS Real-Time
                </p>
                <p className="text-[11px] text-neutral-500 font-['Roboto']">Verifikasi Otomatis 24/7</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Headphones className="h-6 w-6 text-neutral-900 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900">
                  Bantuan WhatsApp
                </p>
                <p className="text-[11px] text-neutral-500 font-['Roboto']">+62 815-4872-7257</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <Logo />
            <p className="text-xs text-neutral-600 font-['Roboto'] max-w-md leading-relaxed">
              EugineStore adalah official e-commerce store di bawah naungan <strong>PT Eugine Media Group</strong>. Menyediakan perangkat keras jaringan, perlengkapan FTTH, dan merchandise resmi dengan jaminan keaslian dan layanan purna jual terbaik.
            </p>
            <p className="text-xs text-neutral-500 font-['Roboto']">
              📍 Gudang Pusat: Cibinong, Kabupaten Bogor, Jawa Barat 16911
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900 mb-3">
              Katalog Kategori
            </h3>
            <ul className="space-y-2 text-xs font-medium text-neutral-600 font-['Roboto']">
              <li><Link href="/products?category=router" className="hover:text-[#ed1c24] transition-colors">Router & Mikrotik</Link></li>
              <li><Link href="/products?category=ftth" className="hover:text-[#ed1c24] transition-colors">Modem ONT & OLT EPON/GPON</Link></li>
              <li><Link href="/products?category=cables" className="hover:text-[#ed1c24] transition-colors">Kabel Dropcore & Patch Cord</Link></li>
              <li><Link href="/products?category=tools" className="hover:text-[#ed1c24] transition-colors">Splicer & Optical Power Meter</Link></li>
              <li><Link href="/products?category=merchandise" className="hover:text-[#ed1c24] transition-colors">Merchandise Eugine Media</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900 mb-3">
              Layanan Pelanggan
            </h3>
            <ul className="space-y-2 text-xs font-medium text-neutral-600 font-['Roboto']">
              <li><Link href="/orders/track" className="hover:text-[#ed1c24] transition-colors">Lacak Status Pengiriman</Link></li>
              <li><Link href="/shipping" className="hover:text-[#ed1c24] transition-colors">Informasi Tarif & Ekspedisi</Link></li>
              <li><Link href="/terms" className="hover:text-[#ed1c24] transition-colors">Syarat & Ketentuan Pembelian</Link></li>
              <li><Link href="/privacy" className="hover:text-[#ed1c24] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/admin/login" className="text-neutral-400 hover:text-neutral-900 transition-colors">Portal Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-['Roboto']">
          <p>© {new Date().getFullYear()} EugineStore — Eugine Media Group. Hak Cipta Dilindungi.</p>
          <p className="mt-2 sm:mt-0 font-medium">Bukan Marketplace Multi-Vendor • Single Brand Store</p>
        </div>
      </div>
    </footer>
  );
}
