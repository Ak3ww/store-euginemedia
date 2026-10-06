"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { ShoppingBag, User, LogOut, Search, MapPin, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { getItemCount, openCartDrawer } = useCartStore();
  const { customer, fetchCustomer, openAuthModal, logout } = useAuthStore();
  const itemCount = getItemCount();

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner Announcement */}
      <div className="bg-[#002c60] text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Pusat Perangkat Jaringan ISP & FTTH Resmi • Garansi Tukar Baru & Dukungan Teknis</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#002c60] to-[#1b437c] text-white flex items-center justify-center shadow-md shadow-[#002c60]/15">
            <span className="font-extrabold text-base tracking-tighter">ES</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#002c60] tracking-tight leading-none">
              Eugine<span className="text-[#1b437c]">Store</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Network & FTTH Solutions
            </div>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari router MikroTik, OLT, ONT, kabel dropcore..."
              className="w-full h-10 pl-10 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-full focus:bg-white focus:border-[#002c60] focus:ring-2 focus:ring-[#002c60]/10 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Chat Sales Button */}
          <a
            href="https://wa.me/6281548727257?text=Halo%20Tim%20Sales%20EugineStore,%20saya%20ingin%20konsultasi%20perangkat%20jaringan."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat Sales</span>
          </a>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={openCartDrawer}
            className="relative flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-slate-700 text-xs font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-[#002c60]" />
            <span className="hidden sm:inline">Keranjang</span>
            {itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#002c60] text-white text-[10px] font-bold flex items-center justify-center -ml-0.5">
                {itemCount}
              </span>
            )}
          </button>

          {/* Customer Auth Profile or Login Button */}
          {customer ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-[#002c60] text-white flex items-center justify-center text-[10px] font-bold">
                    {customer.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{customer.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border border-slate-200 bg-white shadow-lg">
                <DropdownMenuLabel className="font-semibold text-xs text-slate-900 pb-1">
                  {customer.name}
                  <div className="text-[11px] text-slate-400 font-normal">+{customer.phone}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="text-xs cursor-pointer flex items-center gap-2 py-2">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Profil & Alamat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-xs text-red-600 focus:text-red-700 cursor-pointer flex items-center gap-2 py-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={openAuthModal}
              className="h-9 px-4 rounded-full bg-[#002c60] hover:bg-[#001f44] text-white text-xs font-semibold shadow-sm"
            >
              Masuk / Daftar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
