import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, MessageCircle, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#002c60] text-white flex items-center justify-center font-extrabold text-sm">
                ES
              </div>
              <span className="text-lg font-extrabold text-[#002c60]">EugineStore</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distributor resmi perangkat jaringan komputer, MikroTik, OLT GPON/EPON, modem ONT, dan aksesoris fiber
              optik FTTH untuk ISP dan penggiat RT-RW Net seluruh Nusantara.
            </p>
            <div className="pt-2 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#002c60]" />
                <span>Cibinong, Bogor, Jawa Barat</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp: +62 815-4872-7257</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Kategori Produk</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <a href="#katalog" className="hover:text-[#002c60]">
                  Router MikroTik
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#002c60]">
                  OLT GPON & EPON
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#002c60]">
                  Modem ONT XPON
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#002c60]">
                  Kabel Dropcore Preconn
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#002c60]">
                  Alat Ukur OPM & VFL
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Metode Pembayaran</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/banks/qris.svg" alt="QRIS" className="h-4 object-contain" />
              </div>
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/banks/bca.svg" alt="BCA" className="h-3.5 object-contain" />
              </div>
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/banks/mandiri.svg" alt="Mandiri" className="h-3.5 object-contain" />
              </div>
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/banks/bri.svg" alt="BRI" className="h-3.5 object-contain" />
              </div>
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/banks/bni.svg" alt="BNI" className="h-3.5 object-contain" />
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">Ekspedisi Logistik</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/couriers/jne.svg" alt="JNE" className="h-4 object-contain" />
              </div>
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/couriers/jnt.svg" alt="J&T" className="h-4 object-contain" />
              </div>
              <div className="h-7 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <img src="/images/couriers/sicepat.svg" alt="SiCepat" className="h-4 object-contain" />
              </div>
            </div>
          </div>

          {/* Official Marketplace Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Toko Resmi Marketplace</h4>
            <p className="text-xs text-slate-500">
              Anda juga dapat berbelanja produk kami melalui marketplace resmi terpercaya:
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://shopee.co.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#EE4D2D]/30 bg-[#EE4D2D]/5 hover:bg-[#EE4D2D]/10 text-xs font-semibold text-[#EE4D2D] transition-colors"
              >
                <img src="/images/marketplaces/shopee.svg" alt="Shopee" className="w-4 h-4" />
                <span>Shopee Official Store</span>
              </a>

              <a
                href="https://tokopedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#03AC0E]/30 bg-[#03AC0E]/5 hover:bg-[#03AC0E]/10 text-xs font-semibold text-[#03AC0E] transition-colors"
              >
                <img src="/images/marketplaces/tokopedia.svg" alt="Tokopedia" className="w-4 h-4" />
                <span>Tokopedia Official Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-100 bg-slate-50/50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-slate-700">Eugine Media Group</strong>. All
            rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:underline">
              Syarat & Ketentuan
            </Link>
            <Link href="/admin/login" className="hover:underline text-slate-400">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
