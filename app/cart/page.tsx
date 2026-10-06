"use client";

import React from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, getTotalWeightGrams } = useCartStore();
  const { customer, openAuthModal } = useAuthStore();

  const total = getTotal();
  const totalWeight = getTotalWeightGrams();
  const weightKg = (totalWeight / 1000).toFixed(1);

  const handleCheckout = () => {
    if (!customer) {
      openAuthModal();
    } else {
      router.push("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-300">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Keranjang Belanja Kosong</h1>
        <p className="text-xs text-slate-500 mb-6">
          Belum ada produk yang dimasukkan ke dalam keranjang belanja Anda.
        </p>
        <Link href="/">
          <Button className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs">Jelajahi Produk</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Keranjang Belanja</h1>
        <p className="text-xs text-slate-500">
          Periksa kembali daftar perangkat dan jumlah unit yang ingin Anda pesan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate mb-1">{item.name}</h3>
                  <div className="text-xs text-slate-400">
                    Rp {item.price.toLocaleString("id-ID")} • {item.weight}g
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right flex items-center gap-4">
                  <span className="text-xs sm:text-sm font-bold text-[#002c60]">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Ringkasan Belanja</h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Total Estimasi Berat</span>
                <span className="font-semibold text-slate-700">{weightKg} kg</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Harga Barang</span>
                <span className="font-semibold text-slate-700">Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Subtotal</span>
                <span className="text-[#002c60]">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-11 bg-[#002c60] hover:bg-[#001f44] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Lanjut ke Checkout <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garansi Resmi & Bebas Retur Cacat Unit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
