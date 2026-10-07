"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, LogOut, Package, ShieldCheck, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, checkSession } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const currentUser = await checkSession();
      if (!currentUser) {
        router.push("/auth/signin?redirect=/profile");
        return;
      }

      // Load customer orders
      try {
        const res = await fetch("/api/customer/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.orders) setOrders(data.orders);
        }
      } catch (e) {
        console.warn("Could not load orders:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, checkSession]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#ed1c24] mb-2" />
        <span className="text-xs font-semibold">Memuat profil akun Anda...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 font-['Roboto',sans-serif]">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-black text-white font-['Archivo'] font-black text-xl shadow-sm">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "ES"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 font-['Archivo'] tracking-tight">
                {user.name || "Pelanggan EugineStore"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                <span className="flex items-center gap-1 font-mono font-bold text-neutral-800">
                  <Phone className="h-3.5 w-3.5 text-[#ed1c24]" />
                  {user.phone}
                </span>
                {user.email && (
                  <span className="text-neutral-500">
                    • {user.email}
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Terverifikasi WhatsApp
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => logout()}
            className="flex items-center gap-2 border-red-200 text-[#ed1c24] hover:bg-red-50 hover:text-red-700 font-['Archivo'] text-xs font-bold uppercase tracking-wider h-10 px-4"
          >
            <LogOut className="h-4 w-4" />
            Keluar Akun
          </Button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Alamat Pengiriman */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#ed1c24]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-['Archivo']">
                  Alamat Pengiriman Utama
                </h2>
              </div>
            </div>

            {user.address ? (
              <div className="text-xs text-neutral-700 space-y-1">
                <p className="font-semibold text-neutral-900">{user.address}</p>
                <p className="text-neutral-500">
                  {[user.district, user.city, user.province, user.postalCode].filter(Boolean).join(", ")}
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">
                Alamat tersimpan otomatis saat Anda menyelesaikan pesanan pertama kali.
              </p>
            )}
          </div>

          {/* Keamanan & Akun */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-['Archivo']">
                Keamanan & Akses
              </h2>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Akun Anda diproteksi oleh Autentikasi OTP WhatsApp resmi PT Eugine Media Group tanpa password yang rentan dicuri.
            </p>
            <div className="mt-3">
              <Link href="/products">
                <Button size="sm" className="bg-black hover:bg-[#ed1c24] text-white font-['Archivo'] text-xs font-bold uppercase tracking-wider">
                  Mulai Belanja Produk
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Riwayat Pesanan */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#ed1c24]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-['Archivo']">
                Riwayat Pesanan Anda
              </h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-500">
              <p>Belum ada pesanan aktif atau pesanan sedang diproses.</p>
              <Link href="/products" className="inline-block mt-3 text-[#ed1c24] font-bold hover:underline">
                Jelajahi Katalog Produk &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 overflow-hidden">
              {orders.map((ord: any) => (
                <div key={ord.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-neutral-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 font-['Archivo'] text-xs">{ord.orderNumber}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      {new Date(ord.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-black text-neutral-900 font-['Archivo'] text-xs">
                      Rp {ord.totalAmount.toLocaleString("id-ID")}
                    </span>
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      className="inline-flex items-center text-xs font-bold text-[#ed1c24] hover:underline gap-1"
                    >
                      Lihat Detail <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
