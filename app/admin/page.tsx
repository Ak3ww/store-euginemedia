"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Truck,
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/orders");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#002c60] mb-2" />
        <span className="text-xs font-medium">Memuat metrik dashboard admin...</span>
      </div>
    );
  }

  const stats = data?.stats || {
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0,
    paid: 0,
    shipped: 0,
    completed: 0,
  };

  const recentOrders = data?.orders?.slice(0, 8) || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal EugineStore</h1>
          <p className="text-xs text-slate-500">Kelola katalog produk perangkat jaringan, pesanan pembeli & resi pengiriman</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="text-xs border-slate-200">
              <Package className="w-3.5 h-3.5 mr-1.5" /> Kelola Produk
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button size="sm" className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs">
              <Truck className="w-3.5 h-3.5 mr-1.5" /> Semua Pesanan
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Penjualan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              Rp
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            Rp {stats.totalRevenue.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Dari pesanan terbayar</span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pesanan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002c60] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalOrders}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Semua status transaksi</span>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Menunggu Bayar</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{stats.pending}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Perlu difollow-up</span>
        </div>

        {/* Shipped / Perlu Kirim */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Dalam Pengiriman</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-600">{stats.shipped}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Resi sudah diterbitkan</span>
        </div>
      </div>

      {/* Recent Orders Datatable */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Pesanan Masuk Terbaru</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#002c60] hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">Belum ada pesanan yang masuk.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link href={`/orders/${ord.orderNumber}`} className="text-[#002c60] hover:underline">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      Rp {ord.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 font-medium">{ord.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === "PAID"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : ord.status === "SHIPPED"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : ord.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {ord.trackingNumber || <span className="text-slate-300">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
