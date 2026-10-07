"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";

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
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)] font-['Roboto',sans-serif]">
        {/* ============================================================ */}
        {/* 1. TOP BAR (Cricket-Weapon Authentic: #252525, 33px height)  */}
        {/* ============================================================ */}
        <div className="w-full bg-[#252525] text-white text-[12px] h-[33px] flex items-center justify-between px-4 sm:px-10">
          <div className="flex items-center space-x-2">
            <p className="font-[500] text-[13px] sm:text-[14px] text-white">
              We Offer's Free Shipping se-Jabodetabek
            </p>
          </div>

          <div className="flex items-center space-x-6 text-[12px]">
            {/* FIND LOCATION */}
            <div className="hidden md:flex items-center space-x-1.5 text-white/90 hover:text-white transition-colors cursor-pointer">
              <MapPin className="h-3.5 w-3.5 text-[#ed1c24]" />
              <span className="uppercase text-[11px] font-[500] tracking-wider">FIND LOCATION</span>
            </div>

            {/* Login / My Account Button (#4b4242 background, 110px width, hover #ed1c24) */}
            <div className="h-[33px] bg-[rgb(75,66,66)] px-5 flex items-center justify-center transition-colors">
              <Link
                href="/auth/signin"
                className="text-white text-[12px] font-[400] tracking-wide hover:text-[#ed1c24] transition-colors flex items-center space-x-1"
              >
                <User className="h-3 w-3" />
                <span>My Account</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. MAIN NAV BAR (Cricket-Weapon Authentic: #ffffff, 64px)    */}
        {/* ============================================================ */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 h-[64px] flex items-center justify-between">
          {/* Logo & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-black lg:hidden hover:text-[#e7070f] transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-black text-white font-['Archivo'] font-black text-sm tracking-wider">
                ES
              </div>
              <div className="flex flex-col">
                <span className="font-['Archivo'] text-lg font-black tracking-tight text-black leading-tight">
                  Eugine<span className="text-[#ed1c24]">Store</span>
                </span>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest font-['Roboto'] -mt-0.5">
                  Eugine Media Group
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Menu Links (Cricket-Weapon #121212 font 15px hover #E30605) */}
          <nav className="hidden lg:flex items-center space-x-8 text-[15px] font-[500] text-[#121212]">
            <Link href="/" className="hover:text-[#E30605] transition-colors py-2">
              Home
            </Link>
            <Link href="/products" className="hover:text-[#E30605] transition-colors py-2">
              Product
            </Link>
            <Link href="/products?category=ftth" className="hover:text-[#E30605] transition-colors py-2">
              FTTH & Fiber
            </Link>
            <Link href="/products?category=hardware" className="hover:text-[#E30605] transition-colors py-2">
              Hardware
            </Link>
            <Link href="/contact" className="hover:text-[#E30605] transition-colors py-2">
              Contact
            </Link>

            {/* Ecosystem Services Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setServicesDropdown(true)}
                className="flex items-center space-x-1 hover:text-[#E30605] transition-colors py-2"
              >
                <span>Services</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <div
                onMouseLeave={() => setServicesDropdown(false)}
                className={`absolute top-full -left-4 w-72 bg-[rgb(29,28,28)] text-white p-3 rounded-[3px] shadow-xl border border-neutral-800 transition-all duration-200 z-50 ${
                  servicesDropdown
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="space-y-1.5 text-xs">
                  <a
                    href="https://euginemediagroup.com/#harga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded hover:bg-[#E30605] transition-colors"
                  >
                    <p className="font-bold text-white">Internet FTTH Service</p>
                    <p className="text-[11px] text-neutral-300">Koneksi dedicated kecepatan tinggi rumah & bisnis</p>
                  </a>
                  <a
                    href="https://wa.me/6285169990995?text=Halo,%20saya%20tertarik%20dengan%20IT%20Infrastructure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded hover:bg-[#E30605] transition-colors"
                  >
                    <p className="font-bold text-white">IT Infrastructure</p>
                    <p className="text-[11px] text-neutral-300">Instalasi jaringan kantor, gedung & perumahan</p>
                  </a>
                  <a
                    href="https://euginemediagroup.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded hover:bg-[#E30605] transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-white">Eugine Bill Platform</p>
                      <p className="text-[11px] text-neutral-300">Billing ISP & RT-RW Net otomatis</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-white shrink-0 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Header Icons (Search & Cart) */}
          <div className="flex items-center space-x-5 text-neutral-800">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 hover:text-[#E30605] transition-colors"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart Icon with Red Counter Badge */}
            <Link href="/cart" className="relative p-1.5 hover:text-[#E30605] transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ed1c24] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-100 px-4 py-3 shadow-inner">
            <div className="mx-auto max-w-3xl">
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-10 px-4 text-sm bg-white border border-neutral-300 rounded-[3px] focus:outline-none focus:border-black font-['Roboto'] text-black"
                />
                <button
                  type="submit"
                  className="h-10 px-6 bg-black text-white font-['Archivo'] font-bold text-xs uppercase tracking-wider rounded-[3px] hover:bg-[#ed1c24] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 bg-white px-5 py-4 lg:hidden">
            <div className="flex flex-col space-y-3 text-sm font-bold uppercase font-['Archivo'] text-neutral-900">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                Home
              </Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                Product
              </Link>
              <Link href="/products?category=ftth" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                FTTH & Fiber
              </Link>
              <Link href="/products?category=hardware" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                Hardware
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ed1c24]">
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Header Spacer */}
      <div className="h-[97px]" />
    </>
  );
}
