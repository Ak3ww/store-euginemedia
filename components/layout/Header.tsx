"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  Menu, 
  X, 
  User, 
  Phone,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function Header() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-white shadow-sm font-['Roboto',sans-serif]">
        {/* ============================================================ */}
        {/* 1. TOP BAR (Cricket-Weapon Authentic: #252525, 33px height)  */}
        {/* ============================================================ */}
        <div className="w-full bg-[#252525] text-white text-[12px] h-[33px] flex items-center justify-between px-4 sm:px-10">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-white/90">
              Gratis Ongkos Kirim se-Jabodetabek dan Subsidi Seluruh Indonesia
            </span>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-[12px]">
            {/* Location Indicator */}
            <div className="hidden md:flex items-center space-x-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer">
              <MapPin className="h-3.5 w-3.5 text-[#ed1c24]" />
              <span className="uppercase text-[11px] font-semibold tracking-wider">Cibinong, Bogor</span>
            </div>

            {/* Eugine Media Hotline */}
            <a
              href="https://wa.me/6285169990995?text=Halo%20Eugine%20Media%20Group"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1 text-neutral-300 hover:text-[#ed1c24] transition-colors">
              <Phone className="h-3 w-3" />
              <span>+62 851-6999-0995</span>
            </a>

            {/* Cricket-Weapon Style Account Button (#4b4242 with #ed1c24 hover) */}
            <div className="h-[33px] bg-[#4b4242] px-4 flex items-center transition-colors hover:bg-[#383131]">
              <Link
                href="/auth/signin"
                className="text-white text-[12px] font-medium tracking-wide hover:text-[#ed1c24] transition-colors flex items-center space-x-1.5">
                <User className="h-3.5 w-3.5" />
                <span>Akun Saya</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. MAIN NAV BAR (Cricket-Weapon Authentic: #ffffff, 64px)    */}
        {/* ============================================================ */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 h-[64px] flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-neutral-900 text-white font-['Archivo'] font-black text-sm tracking-wider">
              ES
            </div>
            <div className="flex flex-col">
              <span className="font-['Archivo'] text-lg font-black tracking-tight text-neutral-900 leading-tight">
                Eugine<span className="text-[#ed1c24]">Store</span>
              </span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-['Roboto'] -mt-0.5">
                Eugine Media Group
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Cricket-Weapon Font & Spacing) */}
          <nav className="hidden lg:flex items-center space-x-7 text-[15px] font-medium text-[#121212]">
            <Link href="/" className="hover:text-[#E30605] transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-[#E30605] transition-colors">
              Semua Produk
            </Link>
            <Link href="/products?category=hardware" className="hover:text-[#E30605] transition-colors">
              Hardware & PC
            </Link>
            <Link href="/products?category=ftth" className="hover:text-[#E30605] transition-colors">
              FTTH & Jaringan
            </Link>
            <Link href="/products?category=cctv" className="hover:text-[#E30605] transition-colors">
              CCTV & Security
            </Link>

            {/* Eugine Media Ecosystem Services Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setServicesDropdown(true)}
                className="flex items-center space-x-1 hover:text-[#E30605] transition-colors py-2">
                <span>Layanan Ekosistem</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <div
                onMouseLeave={() => setServicesDropdown(false)}
                className={`absolute top-full -left-4 w-72 bg-[#1d1c1c] text-white p-3 rounded-[3px] shadow-xl border border-neutral-800 transition-all duration-200 z-50 ${
                  servicesDropdown ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
                }`}>
                <div className="space-y-2 text-xs">
                  <a
                    href="https://euginemediagroup.com/#harga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded hover:bg-[#E30605] transition-colors">
                    <p className="font-bold text-white">Internet FTTH Service</p>
                    <p className="text-[11px] text-neutral-300">Koneksi dedicated kecepatan tinggi rumah & bisnis</p>
                  </a>
                  <a
                    href="https://wa.me/6285169990995?text=Halo,%20saya%20tertarik%20dengan%20IT%20Infrastructure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded hover:bg-[#E30605] transition-colors">
                    <p className="font-bold text-white">IT Infrastructure</p>
                    <p className="text-[11px] text-neutral-300">Instalasi jaringan kantor, gedung & perumahan</p>
                  </a>
                  <a
                    href="https://euginemediagroup.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded hover:bg-[#E30605] transition-colors">
                    <p className="font-bold text-white flex items-center justify-between">
                      <span>Eugine Bill Platform</span>
                      <ExternalLink className="h-3 w-3" />
                    </p>
                    <p className="text-[11px] text-neutral-300">Software billing ISP & RT-RW Net otomatis</p>
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Action Icons (Search + Cart + Mobile Toggle) */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-neutral-700 hover:text-[#E30605] transition-colors"
              title="Cari Produk">
              <Search className="h-5 w-5" />
            </button>

            {/* Cart Icon with Red Counter Badge */}
            <Link href="/cart" className="relative p-1.5 text-neutral-700 hover:text-[#E30605] transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ed1c24] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-800 lg:hidden">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown Banner */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 shadow-inner">
            <div className="mx-auto max-w-3xl">
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Ketik nama produk perangkat jaringan, modem, pc, kabel..."
                  className="w-full h-10 px-4 text-sm bg-white border border-neutral-300 rounded-[3px] focus:outline-none focus:border-neutral-900 font-['Roboto']"
                />
                <button
                  type="submit"
                  className="h-10 px-6 bg-neutral-900 text-white font-['Archivo'] font-bold text-xs uppercase tracking-wider rounded-[3px] hover:bg-[#ed1c24] transition-colors">
                  Cari
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col space-y-3 text-sm font-bold uppercase font-['Archivo'] text-neutral-900">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                Home
              </Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                Semua Produk
              </Link>
              <Link href="/products?category=hardware" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                Hardware & PC
              </Link>
              <Link href="/products?category=ftth" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                FTTH & Jaringan
              </Link>
              <Link href="/products?category=cctv" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                CCTV & Security
              </Link>
              <a
                href="https://euginemediagroup.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ed1c24] flex items-center justify-between pt-2 border-t border-neutral-100">
                <span>Buka Eugine Bill</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Spacing compensation for 7rem fixed header */}
      <div className="h-[97px]" />
    </>
  );
}
