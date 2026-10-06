"use client";

import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, getTotalWeight } = useCartStore();

  const subtotal = getTotal();
  const totalWeight = getTotalWeight() || 500;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <ShoppingBag className="h-8 w-8 text-neutral-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Archivo'] uppercase tracking-tight">
          Keranjang Belanja Anda Kosong
        </h1>
        <p className="mt-2 text-sm text-neutral-600 font-['Roboto'] max-w-md mx-auto">
          Anda belum menambahkan perangkat jaringan atau merchandise ke dalam keranjang.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-[4px] bg-neutral-900 px-8 font-['Archivo'] text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#ed1c24]">
          Mulai Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 font-['Archivo']">
          Keranjang Belanja ({items.length} Item)
        </h1>
        <p className="mt-1 text-xs text-neutral-500 font-['Roboto']">
          Estimasi total berat pengiriman kurir: {(totalWeight / 1000).toFixed(1)} Kg
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Items List */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
            <div className="divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={item.image || "/images/placeholder-product.png"}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-[4px] border border-neutral-200 object-contain p-1 bg-white"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-neutral-900 font-['Archivo'] line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-neutral-500 font-['Roboto']">
                        Harga: Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 rounded-[4px] bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="px-2.5 py-1 text-neutral-600 hover:text-neutral-900 transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-['Archivo'] text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:text-neutral-900 transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[100px]">
                      <p className="text-sm font-black font-['Archivo'] text-neutral-900">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      title="Hapus barang">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-md border border-neutral-200 bg-white p-6 sticky top-6 shadow-xs">
            <h2 className="text-base font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900 border-b border-neutral-100 pb-3 mb-4">
              Ringkasan Belanja
            </h2>

            <div className="space-y-3 text-sm font-['Roboto']">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({items.length} Barang)</span>
                <span className="font-bold text-neutral-900 font-['Archivo']">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimasi Berat Total</span>
                <span className="font-semibold text-neutral-800">
                  {(totalWeight / 1000).toFixed(1)} Kg
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 italic">
                *Ongkos kirim kurir dihitung otomatis pada tahap checkout sesuai alamat kecamatan tujuan.
              </p>

              <div className="border-t border-neutral-200 pt-3 flex items-baseline justify-between text-base">
                <span className="font-black uppercase tracking-tight text-neutral-900 font-['Archivo']">
                  Subtotal Produk
                </span>
                <span className="text-xl font-black text-neutral-900 font-['Archivo']">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-6 flex h-[48px] w-full items-center justify-center space-x-2 rounded-[4px] bg-neutral-900 text-white font-['Archivo'] text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.99]">
              <span>Lanjut ke Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Checkout Aman & Terenkripsi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
