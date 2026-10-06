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

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const url = `/api/admin/orders?status=${statusFilter}${search ? `&q=${search}` : ""}`;
      const res = await fetch(url);
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Pesanan Pembeli</h1>
          <p className="text-xs text-slate-500">Proses pesanan masuk, input nomor resi, dan kirim notifikasi WhatsApp otomatis</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {["ALL", "PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-[#002c60] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
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
            <span className="text-xs">Memuat pesanan...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">Tidak ada pesanan ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
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
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link href={`/orders/${ord.orderNumber}`} className="text-[#002c60] hover:underline">
                        {ord.orderNumber}
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
                    <td className="py-3 px-4 font-extrabold text-[#002c60]">
                      Rp {ord.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          ord.status === "PAID"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : ord.status === "SHIPPED"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : ord.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openOrderModal(ord)}
                        className="text-xs h-8 border-slate-200"
                      >
                        Kelola
                      </Button>
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
            <DialogTitle className="text-base font-bold text-slate-900">
              Kelola Pesanan {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div>
                  Penerima: <strong className="text-slate-900">{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})
                </div>
                <div>
                  Kurir Pilihan: <strong className="text-slate-900">{selectedOrder.courier} — {selectedOrder.courierService}</strong>
                </div>
                <div>
                  Total Tagihan: <strong className="text-[#002c60]">Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}</strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perbarui Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="PENDING">PENDING (Menunggu Pembayaran)</option>
                  <option value="PAID">PAID (Pembayaran Diterima)</option>
                  <option value="PROCESSING">PROCESSING (Sedang Diproses)</option>
                  <option value="SHIPPED">SHIPPED (Dalam Pengiriman)</option>
                  <option value="COMPLETED">COMPLETED (Selesai)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Resi Pengiriman</label>
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
                  className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs font-semibold"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Simpan Status
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
