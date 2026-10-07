"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Store,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render without admin layout shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
      active: pathname.startsWith("/admin/products"),
    },
    {
      label: "Orders & Shipping",
      href: "/admin/orders",
      icon: Truck,
      active: pathname.startsWith("/admin/orders"),
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/me", { method: "DELETE" });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#1f1f1f] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-[#ed1c24] text-white flex items-center justify-center font-black font-['Archivo'] text-sm">
            ES
          </div>
          <span className="font-['Archivo'] font-bold text-sm tracking-wider uppercase">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-neutral-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Cricket-Weapon Styled Dark Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1f1f1f] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded bg-[#ed1c24] text-white flex items-center justify-center font-black font-['Archivo'] text-base shadow-sm">
                ES
              </div>
              <div>
                <h1 className="font-['Archivo'] font-extrabold text-sm tracking-tight text-white uppercase">
                  EugineStore
                </h1>
                <p className="text-[10px] text-neutral-400 font-['Roboto'] font-medium tracking-wide">
                  ADMIN PORTAL 1:1
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-['Archivo']">
              Main Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-md font-['Archivo'] text-xs font-bold tracking-wide transition-all duration-150 ${
                    item.active
                      ? "bg-[#ed1c24] text-white shadow-sm"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.active && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-['Archivo']">
              Quick Shortcuts
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-neutral-300 font-['Archivo'] text-xs font-bold tracking-wide hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Lihat Toko Publik</span>
            </Link>
          </nav>

          {/* Bottom Admin User Badge & Logout */}
          <div className="p-4 border-t border-neutral-800 bg-[#181818]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-200">
                  ADM
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate font-['Archivo']">
                    Admin Eugine
                  </p>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-[#ed1c24] transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
