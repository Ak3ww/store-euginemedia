"use client";

import React, { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/cart/CheckoutSteps";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, getTotalWeight } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const subtotal = getTotal();
  const totalWeight = getTotalWeight() || 500;

  // Calculate discount (Simulate promo coupon)
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setCouponError("Masukkan kode kupon terlebih dahulu.");
      return;
    }
    if (couponCode.trim().toUpperCase() === "EUGINE10" || couponCode.trim().toUpperCase() === "CRICKET10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Kode kupon tidak valid atau telah kedaluwarsa.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white">
        <CheckoutSteps activeStep={0} />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
            <ShoppingBag className="h-10 w-10 text-neutral-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 font-['Archivo'] uppercase tracking-tight">
            Your Shopping Cart is Empty
          </h1>
          <p className="mt-2 text-sm text-neutral-600 font-['Roboto'] max-w-md mx-auto">
            Nothin' to see here. Let's get shopping!
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-[6px] bg-neutral-900 px-8 font-['Archivo'] text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#ed1c24]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* 1. Cricket-Weapon Checkout Steps */}
      <CheckoutSteps activeStep={0} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2. Cricket-Weapon Header Top */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-neutral-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 font-['Archivo']">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm font-semibold text-neutral-600 font-['Roboto']">
              TOTAL ({items.length} {items.length > 1 ? "items" : "item"}){" "}
              <b className="text-black font-['Archivo']">
                Rp {finalTotal.toLocaleString("id-ID")}
              </b>
            </p>
          </div>

          <Link
            href="/products"
            className="font-['Archivo'] text-sm font-bold uppercase text-neutral-700 underline underline-offset-4 hover:text-[#ed1c24] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* 3. Content 2-Column Wrapper */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Container: Cart Items */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors hover:bg-neutral-50/50"
                >
                  {/* Product Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-20 w-20 shrink-0 rounded-md border border-neutral-200 bg-white p-1 flex items-center justify-center">
                      <img
                        src={item.image || "/images/placeholder-product.png"}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.id}`}
                        className="text-sm font-bold text-neutral-900 font-['Archivo'] hover:text-[#ed1c24] transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs font-semibold text-neutral-500 font-['Roboto']">
                        Harga: Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
                    {/* Stepper [-] QTY [+] */}
                    <div className="flex items-center border border-neutral-300 rounded-[4px] bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="px-2.5 py-1 text-neutral-600 hover:text-[#ed1c24] transition-colors"
                        title="Kurangi"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-['Archivo'] text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:text-[#ed1c24] transition-colors"
                        title="Tambah"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal Item */}
                    <div className="text-right min-w-[110px]">
                      <p className="text-sm font-black font-['Archivo'] text-neutral-900">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Trash Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-400 hover:text-[#ed1c24] transition-colors p-1"
                      title="Hapus barang"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-500 font-['Roboto'] flex items-center justify-between">
              <span>Total Estimasi Berat Kurir: <b>{(totalWeight / 1000).toFixed(1)} Kg</b></span>
              <span>Pengiriman dari: <b>Gudang Cibinong, Kab. Bogor</b></span>
            </div>
          </div>

          {/* Right Container: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-6 sticky top-6 shadow-xs">
              <h4 className="text-base font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900 border-b border-neutral-200 pb-3 mb-5">
                Order Summary &nbsp; ( {items.length} {items.length > 1 ? "items" : "item"} )
              </h4>

              <div className="space-y-3.5 text-sm font-['Roboto']">
                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Original Price</span>
                  <span className="font-bold text-neutral-900 font-['Archivo']">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-bold text-neutral-900 font-['Archivo']">
                    {discountAmount > 0 ? (
                      <span className="text-[#ed1c24]">-Rp {discountAmount.toLocaleString("id-ID")}</span>
                    ) : (
                      <span className="text-neutral-400">Rp 0</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Delivery</span>
                  <span className="font-bold text-neutral-900 font-['Archivo']">
                    Kalkulasi Otomatis
                  </span>
                </div>

                <div className="border-t border-neutral-200 my-4" />

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <h5 className="font-black uppercase tracking-tight text-neutral-900 font-['Archivo'] text-base">
                      Total Price
                    </h5>
                    <p className="text-[11px] text-neutral-500 font-normal">
                      (Inclusive of all taxes)
                    </p>
                  </div>
                  <span className="text-xl font-black text-neutral-900 font-['Archivo']">
                    Rp {finalTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="mt-6 border-t border-neutral-200 pt-5">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                    }}
                    placeholder="Enter coupon code (e.g. EUGINE10)"
                    className="flex-1 rounded-[4px] border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-black focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-[4px] bg-neutral-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ed1c24]"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="mt-1.5 text-xs text-[#ed1c24]">{couponError}</p>
                )}
                {couponApplied && (
                  <p className="mt-1.5 text-xs text-emerald-600 font-semibold">
                    Kupon berhasil diterapkan! Diskon 10% aktif.
                  </p>
                )}
              </form>

              {/* Checkout Button */}
              <button
                onClick={() => router.push("/checkout")}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-[6px] bg-[#212121] text-white font-['Archivo'] text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.99] shadow-sm"
              >
                Checkout
              </button>

              <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-neutral-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Garansi Resmi Eugine Media Group & Pembayaran Aman</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
