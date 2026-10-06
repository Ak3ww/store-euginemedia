"use client";

import React from "react";
import Link from "next/link";

export default function Navigation() {
  return (
    <div className="flex items-center space-x-6 text-[13px] font-bold uppercase tracking-wider font-['Archivo'] text-neutral-800">
      <Link href="/" className="hover:text-[#ed1c24] transition-colors">
        Beranda
      </Link>
      <Link href="/products" className="hover:text-[#ed1c24] transition-colors">
        Semua Produk
      </Link>
      <Link href="/products?category=router" className="hover:text-[#ed1c24] transition-colors">
        Router & Switch
      </Link>
      <Link href="/products?category=ftth" className="hover:text-[#ed1c24] transition-colors">
        OLT & Fiber Optic
      </Link>
      <Link href="/products?category=merchandise" className="hover:text-[#ed1c24] transition-colors">
        Merchandise
      </Link>
      <Link href="/orders/track" className="hover:text-[#ed1c24] transition-colors text-neutral-500">
        Lacak Pesanan
      </Link>
    </div>
  );
}
