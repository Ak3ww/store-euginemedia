"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Package,
  MapPin,
  MessageCircle,
  Printer,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Resi & Status Modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("SHIPPED");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notifyWA, setNotifyWA] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Invoice & Shipping Label Print Modal (Admin-only for PAID orders)
  const [printOrder, setPrintOrder] = useState<any>(null);

  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    setIsUnauthorized(false);
    try {
      const url = `/api/admin/orders?status=${statusFilter}${search ? `&q=${search}` : ""}`;
      const res = await fetch(url);
      if (res.status === 401) {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const openOrderModal = (ord: any) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setTrackingNumber(ord.trackingNumber || "");
    setNotifyWA(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
          notifyWhatsApp: notifyWA,
        }),
      });

      setIsUpdating(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      setIsUpdating(false);
      alert("Gagal memperbarui status");
    }
  };

  const isPaidOrHigher = (status: string) => {
    return status === "PAID" || status === "PROCESSING" || status === "SHIPPED" || status === "COMPLETED";
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert("Tidak ada pesanan untuk diekspor.");
      return;
    }
    const headers = ["No. Pesanan","Tanggal","Nama Pembeli","Nomor WA","Alamat Pengiriman","Kota","Provinsi","Kode Pos","Kurir","Layanan","No. Resi","Status","Metode Bayar","Subtotal (Rp)","Ongkir (Rp)","Total (Rp)"];
    const rows = orders.map((ord: any) => [
      ord.orderNumber,
      new Date(ord.createdAt).toLocaleDateString("id-ID"),
      `"${(ord.customerName || "").replace(/"/g, '""')}"`,
      ord.customerPhone,
      `"${(ord.shippingAddress || "").replace(/"/g, '""')}"`,
      ord.city || "",
      ord.province || "",
      ord.postalCode || "",
      ord.courier || "",
      ord.courierService || "",
      ord.trackingNumber || "-",
      ord.status,
      ord.paymentMethod,
      ord.subtotalAmount,
      ord.shippingCost,
      ord.totalAmount,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row: any[]) => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
    link.href = url;
    link.download = `EugineStore-Orders-${statusFilter}-${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Overview
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Archivo'] uppercase">
            Manajemen Pesanan Pembeli
          </h1>
          <p className="text-xs text-slate-500 font-['Roboto']">
            Kelola pesanan masuk, verifikasi pembayaran, input resi pengiriman, dan cetak invoice admin
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="text-xs font-semibold border-slate-300 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {["ALL", "PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider font-['Archivo'] whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-[#ed1c24] text-white shadow-xs"
                  : "bg-white border border-neutral-300 text-neutral-700 hover:border-black"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadOrders()}
            placeholder="No. Pesanan, HP, nama..."
            className="pl-9 h-9 text-xs border-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#002c60] mb-2" />
            <span className="text-xs font-semibold">Memuat pesanan...</span>
          </div>
        ) : isUnauthorized ? (
          <div className="p-12 text-center bg-amber-50/60 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Archivo'] uppercase">
                Sesi Administrator Diperlukan
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Anda belum masuk sebagai Admin. Silakan login untuk mengelola daftar pesanan masuk dan memasukkan nomor resi ekspedisi.
              </p>
            </div>
            <Link
              href="/admin/login?redirect=/admin/orders"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#ed1c24] hover:bg-[#c90504] text-white font-['Archivo'] font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              Login ke Admin EugineStore &rarr;
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">Tidak ada pesanan ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['Roboto']">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 font-['Archivo']">
                <tr>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Tujuan</th>
                  <th className="py-3 px-4">Total (IDR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 font-['Archivo']">
                      <Link href={`/orders/${ord.orderNumber}`} target="_blank" className="text-[#002c60] hover:underline flex items-center gap-1">
                        {ord.orderNumber}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {ord.city}, {ord.province}
                    </td>
                    <td className="py-3 px-4 font-black text-neutral-900 font-['Archivo']">
                      Rp {ord.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-['Archivo'] uppercase border ${
                          ord.status === "PAID"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : ord.status === "SHIPPED"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : ord.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ord.status === "CANCELLED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {ord.trackingNumber || <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Cetak Invoice (Hanya jika sudah Lunas / Paid ke atas) */}
                        {isPaidOrHigher(ord.status) && (
                          <button
                            onClick={() => setPrintOrder(ord)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Cetak Invoice & Label Kirim"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#ed1c24]" />
                          </button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openOrderModal(ord)}
                          className="text-xs h-7 px-2.5 border-slate-200 font-semibold"
                        >
                          Kelola
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Order Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 font-['Archivo']">
              Kelola Pesanan {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 text-xs font-['Roboto']">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div>
                  Penerima: <strong className="text-slate-900">{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})
                </div>
                <div>
                  Kurir Pilihan: <strong className="text-slate-900">{selectedOrder.courier} — {selectedOrder.courierService}</strong>
                </div>
                <div>
                  Total Tagihan: <strong className="text-[#ed1c24] font-['Archivo'] font-bold text-sm">Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}</strong>
                </div>
              </div>

              {/* Tombol Cetak Invoice jika Lunas */}
              {isPaidOrHigher(selectedOrder.status) && (
                <button
                  type="button"
                  onClick={() => {
                    setPrintOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-['Archivo'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Printer className="w-4 h-4 text-[#ed1c24]" />
                  Cetak Invoice & Label Pengiriman Paket
                </button>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perbarui Status Pesanan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="PENDING">PENDING (Menunggu Pembayaran)</option>
                  <option value="PAID">PAID (Pembayaran Diterima / Terverifikasi)</option>
                  <option value="PROCESSING">PROCESSING (Sedang Disiapkan Gudang)</option>
                  <option value="SHIPPED">SHIPPED (Dalam Pengiriman Kurir)</option>
                  <option value="COMPLETED">COMPLETED (Pesanan Selesai)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan & Restock)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Resi Ekspedisi</label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Contoh: JNE0123456789 / JNT987654"
                  className="h-10 text-xs border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              {newStatus === "SHIPPED" && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                  <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Kirim nomor resi ini otomatis ke WhatsApp pelanggan via bot port 3002.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setSelectedOrder(null)} className="text-xs">
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-[#ed1c24] hover:bg-[#c90504] text-white text-xs font-['Archivo'] font-bold uppercase tracking-wider shadow-xs"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Simpan Status & Notifikasi
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Printable Invoice & Shipping Label Modal (PAID Only) */}
      <Dialog open={!!printOrder} onOpenChange={(open) => !open && setPrintOrder(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-6 bg-white border border-slate-300 rounded-2xl shadow-2xl">
          <DialogHeader className="print:hidden">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-black font-['Archivo'] uppercase">
                Invoice & Label Pengiriman (Admin Only)
              </DialogTitle>
              <Button
                onClick={() => window.print()}
                className="bg-[#ed1c24] hover:bg-[#c90504] text-white font-['Archivo'] font-bold text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print / Cetak PDF
              </Button>
            </div>
          </DialogHeader>

          {printOrder && (
            <div id="printable-invoice" className="space-y-6 pt-4 text-xs font-['Roboto'] text-neutral-800 border-t border-neutral-200">
              {/* Header Invoice */}
              <div className="flex items-start justify-between border-b pb-4 border-neutral-300">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-black text-white px-2 py-0.5 rounded font-black font-['Archivo'] text-xs">ES</span>
                    <span className="font-black text-base font-['Archivo'] uppercase">EugineStore Official</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">PT EUGINE MEDIA GROUP</p>
                  <p className="text-[11px] text-neutral-500">Cibinong, Kab. Bogor, Jawa Barat 16911</p>
                  <p className="text-[11px] text-neutral-500">WhatsApp Hotline: 0815-4872-7257</p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-['Archivo'] font-black text-xs uppercase tracking-wider mb-2">
                    LUNAS / PAID
                  </span>
                  <p className="font-mono font-bold text-sm text-neutral-900">{printOrder.orderNumber}</p>
                  <p className="text-[11px] text-neutral-500">
                    Tgl Pesan: {new Date(printOrder.createdAt).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-[11px] text-neutral-500">Metode: {printOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Shipping Label Box (Karton Packing Standard) */}
              <div className="border-2 border-dashed border-neutral-400 p-4 rounded-xl bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="font-bold text-[11px] font-['Archivo'] uppercase tracking-wider text-neutral-900">
                    LABEL PENGIRIMAN LOGISTIK
                  </span>
                  <span className="font-bold text-xs uppercase text-[#ed1c24] font-['Archivo']">
                    {printOrder.courier} — {printOrder.courierService}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">PENGIRIM:</span>
                    <p className="font-bold text-neutral-900">EugineStore Gudang Pusat</p>
                    <p className="text-[11px] text-neutral-600">0815-4872-7257</p>
                    <p className="text-[11px] text-neutral-600">Cibinong, Kab. Bogor, Jawa Barat 16911</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">PENERIMA:</span>
                    <p className="font-bold text-neutral-900">{printOrder.customerName}</p>
                    <p className="text-[11px] text-neutral-600 font-mono font-bold">{printOrder.customerPhone}</p>
                    <p className="text-[11px] text-neutral-700 font-medium mt-0.5">{printOrder.shippingAddress}</p>
                    <p className="text-[11px] text-neutral-600">
                      {[printOrder.district, printOrder.city, printOrder.province, printOrder.postalCode].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>

                {printOrder.trackingNumber && (
                  <div className="mt-2 pt-2 border-t border-neutral-200 flex justify-between items-center text-[11px]">
                    <span className="text-neutral-500">Nomor Resi:</span>
                    <span className="font-mono font-bold text-sm text-neutral-900">{printOrder.trackingNumber}</span>
                  </div>
                )}
              </div>

              {/* Order Items Table */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] mb-2 font-['Archivo']">Rincian Barang</h4>
                <table className="w-full border-collapse border border-neutral-200 text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold uppercase font-['Archivo'] text-[10px]">
                    <tr>
                      <th className="border border-neutral-200 p-2">Item Produk</th>
                      <th className="border border-neutral-200 p-2 text-center">Qty</th>
                      <th className="border border-neutral-200 p-2 text-right">Harga Satuan</th>
                      <th className="border border-neutral-200 p-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printOrder.items?.map((it: any) => (
                      <tr key={it.id}>
                        <td className="border border-neutral-200 p-2 font-medium">{it.productName}</td>
                        <td className="border border-neutral-200 p-2 text-center">{it.quantity}</td>
                        <td className="border border-neutral-200 p-2 text-right">Rp {it.price.toLocaleString("id-ID")}</td>
                        <td className="border border-neutral-200 p-2 text-right font-bold">Rp {it.subtotal.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal Barang:</span>
                    <span className="font-semibold">Rp {printOrder.subtotalAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Ongkos Kirim ({printOrder.courier}):</span>
                    <span className="font-semibold">Rp {printOrder.shippingCost.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-1.5 font-black font-['Archivo'] text-sm text-neutral-900">
                    <span>TOTAL LUNAS:</span>
                    <span className="text-[#ed1c24]">Rp {printOrder.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 text-center text-[10px] text-neutral-400">
                Terima kasih telah berbelanja di EugineStore (PT Eugine Media Group). Invoice sah ini diterbitkan secara otomatis oleh sistem.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
