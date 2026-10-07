"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Truck,
  Users,
  BarChart3,
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      setIsUnauthorized(false);
      try {
        const res = await fetch("/api/admin/orders");
        if (res.status === 401) {
          setIsUnauthorized(true);
          setIsLoading(false);
          return;
        }
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
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#ed1c24] mb-2" />
        <span className="text-xs font-medium font-['Roboto']">Memuat metrik dashboard admin...</span>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-white border border-neutral-200 rounded-2xl shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-neutral-900 font-['Archivo'] uppercase">
          Sesi Admin Belum Masuk
        </h2>
        <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-5 font-['Roboto']">
          Silakan masuk menggunakan akun administrator EugineStore untuk melihat ringkasan omset dan mengelola pesanan.
        </p>
        <Link
          href="/admin/login?redirect=/admin"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-[#ed1c24] hover:bg-[#c90504] text-white font-['Archivo'] font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
        >
          Masuk ke Admin Panel &rarr;
        </Link>
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-['Archivo'] uppercase">
            Admin Dashboard
          </h1>
          <p className="text-xs text-neutral-500 font-['Roboto'] mt-1">
            Ringkasan omset penjualan, status pesanan masuk & logistik gudang EugineStore
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center px-4 py-2 rounded-md border border-neutral-300 bg-white font-['Archivo'] text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <Package className="w-3.5 h-3.5 mr-1.5" />
            Kelola Produk
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 rounded-md bg-[#ed1c24] font-['Archivo'] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c90504] transition-colors shadow-xs"
          >
            <Truck className="w-3.5 h-3.5 mr-1.5" />
            Pesanan & Resi
          </Link>
        </div>
      </div>

      {/* Cricket-Weapon Signature Dark Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Products */}
        <Link
          href="/admin/products"
          className="group relative overflow-hidden rounded-xl bg-[#2a2a2a] p-6 text-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-[#ed1c24] hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Archivo'] text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center text-white">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Archivo'] text-3xl font-black text-white">
            {stats.totalProducts ?? 32}
          </div>
          <p className="mt-2 text-[11px] text-neutral-400 group-hover:text-white/90 font-['Roboto']">
            Item katalog aktif & terdaftar
          </p>
        </Link>

        {/* 2. Total Orders */}
        <Link
          href="/admin/orders"
          className="group relative overflow-hidden rounded-xl bg-[#2a2a2a] p-6 text-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-[#ed1c24] hover:shadow-xl cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Archivo'] text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Archivo'] text-3xl font-black text-white">
            {stats.totalOrders}
          </div>
          <p className="mt-2 text-[11px] text-neutral-400 group-hover:text-white/90 font-['Roboto']">
            Semua transaksi masuk
          </p>
        </Link>

        {/* 3. Total Users */}
        <div className="group relative overflow-hidden rounded-xl bg-[#2a2a2a] p-6 text-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-[#ed1c24] hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Archivo'] text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white">
              Total Users
            </span>
            <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Archivo'] text-3xl font-black text-white">
            {stats.totalCustomers ?? 18}
          </div>
          <p className="mt-2 text-[11px] text-neutral-400 group-hover:text-white/90 font-['Roboto']">
            Akun pelanggan terdaftar
          </p>
        </div>

        {/* 4. Total Revenue */}
        <div className="group relative overflow-hidden rounded-xl bg-[#1c1c1c] border border-neutral-700/60 p-6 text-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-[#ed1c24] hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Archivo'] text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-emerald-400 group-hover:text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Archivo'] text-2xl font-black text-white">
            Rp {stats.totalRevenue.toLocaleString("id-ID")}
          </div>
          <p className="mt-2 text-[11px] text-emerald-400 group-hover:text-white/90 font-semibold font-['Roboto']">
            Omset pembayaran terverifikasi
          </p>
        </div>
      </div>

      {/* Order Status Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-neutral-500 font-['Archivo'] uppercase">Menunggu Bayar</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-['Archivo']">{stats.pending}</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-neutral-500 font-['Archivo'] uppercase">Perlu Diproses</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 font-['Archivo']">{stats.paid}</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-neutral-500 font-['Archivo'] uppercase">Sedang Dikirim</span>
            <Truck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-purple-600 font-['Archivo']">{stats.shipped}</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-neutral-500 font-['Archivo'] uppercase">Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-['Archivo']">{stats.completed}</div>
        </div>
      </div>

      {/* Recent Orders Datatable */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-['Archivo']">
            Pesanan Masuk Terbaru
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-[#ed1c24] hover:underline flex items-center gap-1 font-['Archivo']"
          >
            Lihat Semua Pesanan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400 font-['Roboto']">
            Belum ada pesanan yang tercatat dalam sistem.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['Roboto']">
              <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200 font-['Archivo']">
                <tr>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Kurir Ekspedisi</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900 font-['Archivo']">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-800">{ord.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-700 uppercase">
                        {ord.courier}
                      </span>{" "}
                      <span className="text-[11px] text-neutral-400">({ord.courierService})</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-neutral-900 font-['Archivo']">
                      Rp {ord.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-['Archivo'] ${
                          ord.status === "PAID"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "SHIPPED"
                            ? "bg-purple-100 text-purple-800"
                            : ord.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        target="_blank"
                        className="inline-flex items-center text-xs font-semibold text-neutral-600 hover:text-[#ed1c24] transition-colors"
                      >
                        Detail <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
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
