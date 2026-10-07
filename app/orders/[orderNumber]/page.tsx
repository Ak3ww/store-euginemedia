"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  CreditCard,
  Copy,
  Printer,
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import CheckoutSteps from "@/components/cart/CheckoutSteps";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    async function loadOrder() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#ed1c24] mb-2" />
        <span className="text-xs font-medium">Memuat detail pesanan {orderNumber}...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-1">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mb-6">Nomor pesanan {orderNumber} tidak ditemukan dalam sistem kami.</p>
        <Link href="/">
          <Button variant="outline" className="text-xs">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Katalog
          </Button>
        </Link>
      </div>
    );
  }

  const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
    PENDING: { label: "Menunggu Pembayaran", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    PAID: { label: "Pembayaran Diterima", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
    PROCESSING: { label: "Sedang Diproses Gudang", bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700" },
    SHIPPED: { label: "Dalam Pengiriman", bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
    COMPLETED: { label: "Pesanan Selesai", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
    CANCELLED: { label: "Dibatalkan", bg: "bg-red-50 border-red-200", text: "text-red-700" },
  };

  const currentStatus = statusLabels[order.status] || statusLabels.PENDING;

  return (
    <div className="min-h-screen bg-white pb-16">
      <CheckoutSteps activeStep={3} />

      <div className="max-w-4xl mx-auto px-4 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#ed1c24]">
          <ArrowLeft className="w-4 h-4" /> Kembali Belanja
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Cetak Invoice
        </button>
      </div>

      {/* Main Order Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#1f1f1f] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#ed1c24]">
          <div>
            <div className="text-xs text-neutral-400 font-medium mb-1 font-['Archivo'] uppercase">Status Transaksi</div>
            <div className="text-xl sm:text-2xl font-black tracking-tight font-['Archivo']">{order.orderNumber}</div>
            <div className="text-xs text-neutral-400 mt-1 font-['Roboto']">
              Dibuat pada: {new Date(order.createdAt).toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.bg} ${currentStatus.text} bg-white`}
            >
              {currentStatus.label}
            </span>
            <span className="text-xs text-slate-300 mt-2 font-medium">Metode: {order.paymentMethod}</span>
          </div>
        </div>

        {/* Resi Tracking Banner (If Shipped) */}
        {order.status === "SHIPPED" && order.trackingNumber && (
          <div className="p-4 bg-purple-50 border-b border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-purple-900">Pesanan Sedang Dikirim ({order.courier})</div>
                <div className="text-xs text-purple-700">Nomor Resi: <strong className="font-mono text-sm">{order.trackingNumber}</strong></div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(order.trackingNumber, "resi")}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-800 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied === "resi" ? "Tersalin!" : "Salin Resi"}</span>
            </button>
          </div>
        )}

        {/* Payment Instructions (If Pending) */}
        {order.status === "PENDING" && (
          <div className="p-6 bg-amber-50/50 border-b border-amber-100">
            {order.paymentMethod === "QRIS" ? (
              <div className="max-w-md mx-auto text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Selesaikan pembayaran dalam 2 jam
                </div>

                <h3 className="text-sm font-bold text-slate-900">Pindai QRIS untuk Pembayaran Otomatis</h3>

                {order.qrisString ? (
                  <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded-xl inline-block shadow-sm">
                    {/* QR Code image via standard API */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                        order.qrisString
                      )}`}
                      alt="QRIS Barcode"
                      className="w-56 h-56 mx-auto object-contain"
                    />
                    <div className="mt-2 flex items-center justify-center gap-1.5">
                      <img src="/images/banks/qris.svg" alt="QRIS" className="h-4 object-contain" />
                      <span className="text-[10px] text-slate-400 font-semibold">NMID Standar Nasional</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-500">
                    QRIS sedang disiapkan atau gunakan transfer bank di bawah ini.
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  Dukung pembayaran: <strong>BCA Mobile, Mandiri Livin, BRImo, BNI, GoPay, OVO, DANA, ShopeePay</strong>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-3">
                <h3 className="text-sm font-bold text-slate-900 text-center">Rekening Pembayaran Resmi PT Eugine Media Group</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Bank BCA</div>
                      <div className="font-mono text-sm text-neutral-900 font-bold">1234-5678-90</div>
                      <div className="text-[11px] text-slate-400">a/n PT Eugine Media Group</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard("1234567890", "bca")}
                      className="px-2.5 py-1 rounded border border-slate-200 text-xs hover:bg-slate-50"
                    >
                      {copied === "bca" ? "Tersalin" : "Salin"}
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Bank Mandiri</div>
                      <div className="font-mono text-sm text-neutral-900 font-bold">133-00-1234567-8</div>
                      <div className="text-[11px] text-slate-400">a/n PT Eugine Media Group</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard("1330012345678", "mandiri")}
                      className="px-2.5 py-1 rounded border border-slate-200 text-xs hover:bg-slate-50"
                    >
                      {copied === "mandiri" ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Shipping Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Tujuan Pengiriman:</h4>
              <div className="text-slate-700 font-semibold">{order.customerName} ({order.customerPhone})</div>
              <div className="text-slate-500 mt-1">{order.shippingAddress}</div>
              <div className="text-slate-500">
                {order.district}, {order.city}, {order.province} {order.postalCode}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Kurir & Layanan:</h4>
              <div className="text-slate-700 font-semibold">{order.courier} — {order.courierService}</div>
              <div className="text-slate-500 mt-1">Total Berat: {order.totalWeight} gram ({(order.totalWeight / 1000).toFixed(1)} kg)</div>
            </div>
          </div>

          {/* Purchased Items */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">Daftar Barang</h4>
            <div className="divide-y divide-slate-100 text-xs">
              {order.items.map((it: any) => (
                <div key={it.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-800">{it.productName}</div>
                    <div className="text-[11px] text-slate-400">{it.quantity} x Rp {it.price.toLocaleString("id-ID")}</div>
                  </div>
                  <span className="font-bold text-slate-900">Rp {it.subtotal.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations Summary */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs max-w-xs ml-auto">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal Barang</span>
              <span className="font-semibold text-slate-700">Rp {order.subtotalAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Ongkos Kirim</span>
              <span className="font-semibold text-slate-700">Rp {order.shippingCost.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
              <span className="font-['Archivo'] uppercase">Total Tagihan</span>
              <span className="text-[#ed1c24] font-black font-['Archivo'] text-lg">Rp {order.totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
