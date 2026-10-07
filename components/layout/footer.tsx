"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Globe, Mail, Phone, MapPin } from "lucide-react";

const footMenu = [
  {
    id: 1,
    title: "Help & Services",
    menu: [
      { id: 1, link: "Track Order", path: "/cart" },
      { id: 2, link: "FAQs & Panduan", path: "/terms" },
      { id: 3, link: "Garansi Resmi", path: "/terms" },
      { id: 4, link: "Konfirmasi Bayar", path: "/contact" },
      { id: 5, link: "Layanan Ekosistem FTTH", path: "https://euginemediagroup.com" },
    ],
  },
  {
    id: 2,
    title: "Policies",
    menu: [
      { id: 1, link: "Ketentuan Pengiriman", path: "/shipping" },
      { id: 2, link: "Kebijakan Privasi", path: "/privacy" },
      { id: 3, link: "Syarat & Ketentuan", path: "/terms" },
      { id: 4, link: "Kebijakan Retur", path: "/returns" },
      { id: 5, link: "Portal Admin", path: "/admin/login" },
    ],
  },
  {
    id: 3,
    title: "Company",
    menu: [
      { id: 1, link: "Tentang Eugine Media", path: "/about" },
      { id: 2, link: "Hubungi Kami", path: "/contact" },
      { id: 3, link: "Layanan Jaringan FTTH", path: "https://euginemediagroup.com/#harga" },
      { id: 4, link: "Software Billing ISP", path: "https://euginemediagroup.site" },
      { id: 5, link: "IT Infrastructure Services", path: "/contact" },
    ],
  },
];

export default function Footer() {
  const [subValue, setSubValue] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subValue.trim()) {
      setSubscribed(true);
      setSubValue("");
    }
  };

  const currYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-[30px] w-full font-['Roboto',sans-serif] overflow-x-hidden border-t border-neutral-900">
      {/* Wrapper Footer Content (Exact Cricket-Weapon hsla(0,0%,6%,.95)) */}
      <div className="bg-[hsla(0,0%,6%,0.95)] w-full py-10 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-between gap-8">
          {/* 1. Foot About & Newsletter */}
          <div className="w-full lg:w-[320px]">
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-white text-black font-['Archivo'] font-black text-sm">
                  ES
                </div>
                <h1 className="text-[24px] font-bold text-[#a29d9d] font-['Archivo']">
                  Eugine<span className="text-[#ed1c24]">Store</span>
                </h1>
              </Link>
            </div>

            <div className="w-full">
              <h5 className="text-[18px] font-bold mb-2.5 text-white">Newsletter</h5>
              {subscribed ? (
                <p className="text-xs text-emerald-400 mb-4">
                  Terima kasih! Anda telah terdaftar untuk menerima info produk dan promo terbaru.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-[300px]">
                  <input
                    type="email"
                    required
                    value={subValue}
                    onChange={(e) => setSubValue(e.target.value)}
                    placeholder="Email Address*"
                    className="w-full h-[38px] px-3 mb-2.5 bg-[#4036368f] text-[#f5f1f1] text-[12px] border-none rounded-[1px] outline-none placeholder-[#b7afaf] font-['Roboto']"
                  />
                  <p className="text-[10px] text-[#ab9999] mb-2.5">
                    By submitting your email address you agree to the{" "}
                    <Link href="/terms" className="text-white font-bold hover:text-[#f00]">
                      Terms & Conditions
                    </Link>
                  </p>
                  <button
                    type="submit"
                    className="w-full h-[40px] bg-[rgba(222,9,9,0.744)] hover:bg-[rgb(215,6,6)] text-white font-bold text-[14px] uppercase tracking-wider rounded-[1px] transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 2. Foot Menu 3-Columns (Exact Cricket-Weapon foot_menu_container) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 min-w-[280px]">
            {footMenu.map((group) => (
              <div key={group.id} className="foot_menu">
                <h4 className="text-[16px] font-bold text-white mb-3 font-['Archivo']">{group.title}</h4>
                <ul className="space-y-2">
                  {group.menu.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className="text-[#f5f1f1] text-[12px] font-[500] hover:text-[#f00] transition-colors"
                      >
                        {item.link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Foot Links / Ecosystem info */}
          <div className="w-full sm:w-[240px]">
            <h5 className="text-[16px] font-bold text-white mb-3 font-['Archivo']">Official Warehouse</h5>
            <div className="space-y-2 text-xs text-neutral-400 font-['Roboto'] mb-5">
              <p className="flex items-start space-x-1.5">
                <MapPin className="h-4 w-4 text-[#ed1c24] shrink-0 mt-0.5" />
                <span>Cibinong, Kabupaten Bogor, Jawa Barat 16911</span>
              </p>
              <p className="flex items-center space-x-1.5">
                <Phone className="h-3.5 w-3.5 text-[#ed1c24] shrink-0" />
                <span>+62 851-6999-0995</span>
              </p>
              <p className="flex items-center space-x-1.5">
                <Mail className="h-3.5 w-3.5 text-[#ed1c24] shrink-0" />
                <span>admin@euginemediagroup.com</span>
              </p>
            </div>

            {/* Social media connections */}
            <div className="flex items-center space-x-3 text-white">
              <a
                href="https://wa.me/6285169990995"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-[#ed1c24] transition-colors text-white"
                title="WhatsApp Hotline"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://euginemediagroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-[#ed1c24] transition-colors text-white"
                title="Eugine Media Group Website"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-[rgba(48,47,47,0.712)] w-full" />

      {/* Sub Footer (Exact Cricket-Weapon sub_footer_root) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[12px] text-white/80 gap-3">
        <ul className="flex items-center space-x-6 text-[12px]">
          <li>
            <Link href="/privacy" className="hover:text-[#f00] transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-[#f00] transition-colors uppercase">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-[#f00] transition-colors uppercase">
              Terms of Use
            </Link>
          </li>
        </ul>

        <div className="text-[12px] text-neutral-400">
          <p>
            &copy; {currYear} | EugineStore, All Rights Reserved.{" "}
            <span className="text-[#ed1c24]">| PT Eugine Media Group</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
