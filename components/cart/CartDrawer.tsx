"use client";

import React from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const router = useRouter();
  const { items, isCartDrawerOpen, closeCartDrawer, updateQuantity, removeItem, getTotal, getTotalWeightGrams } =
    useCartStore();
  const { customer, openAuthModal } = useAuthStore();

  const total = getTotal();
  const totalWeight = getTotalWeightGrams();
  const weightKg = (totalWeight / 1000).toFixed(1);

  const handleProceedCheckout = () => {
    closeCartDrawer();
    if (!customer) {
      openAuthModal();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={(open) => !open && closeCartDrawer()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l border-slate-200">
        <SheetHeader className="p-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#002c60]/10 text-[#002c60] flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <SheetTitle className="text-lg font-bold text-slate-900">Keranjang Belanja</SheetTitle>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {items.length} Barang
            </span>
          </div>
          <SheetDescription className="sr-only">Daftar barang di keranjang belanja</SheetDescription>
        </SheetHeader>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-700 mb-1">Keranjang Masih Kosong</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Belum ada produk jaringan yang ditambahkan. Silakan jelajahi katalog kami.
              </p>
              <Button
                onClick={closeCartDrawer}
                variant="outline"
                className="text-xs h-9 border-slate-200 text-slate-700"
              >
                Mulai Belanja
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 mb-0.5">{item.name}</h4>
                  <div className="text-[11px] text-slate-400 mb-2">
                    Rp {item.price.toLocaleString("id-ID")} • {item.weight}g
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-md bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#002c60]">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title="Hapus barang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-white flex-shrink-0 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Total Estimasi Berat</span>
                <span className="font-semibold text-slate-700">{weightKg} kg</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-slate-700">Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Belanja</span>
                <span className="text-[#002c60]">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedCheckout}
              className="w-full h-11 bg-[#002c60] hover:bg-[#001f44] text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              Lanjut ke Checkout <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transaksi Aman & Garansi Resmi Eugine Media Group</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
