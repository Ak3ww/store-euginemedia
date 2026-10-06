"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { User, MapPin, ShoppingBag, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function CustomerProfilePage() {
  const { customer, fetchCustomer, updateAddress, openAuthModal, isLoading } = useAuthStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setAddress(customer.address || "");
      setProvince(customer.province || "Jawa Barat");
      setCity(customer.city || "Bogor");
      setDistrict(customer.district || "Cibinong");
      setPostalCode(customer.postalCode || "16913");
    }
  }, [customer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSavedSuccess(false);

    const res = await updateAddress({
      name,
      address,
      province,
      city,
      district,
      postalCode,
    });

    if (!res.success) {
      setErrorMsg(res.error || "Gagal menyimpan alamat");
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  if (!customer) {
    return (
      <div className="py-20 text-center">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">Anda Belum Masuk Akun</h2>
        <p className="text-xs text-slate-500 mb-6">Silakan login via nomor WhatsApp untuk melihat profil dan alamat Anda.</p>
        <Button onClick={openAuthModal} className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs">
          Masuk via WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#002c60]">
        <ArrowLeft className="w-4 h-4" /> Kembali Belanja
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-[#002c60] text-white font-extrabold flex items-center justify-center text-lg">
            {customer.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{customer.name}</h1>
            <div className="text-xs text-slate-500 font-mono">+{customer.phone}</div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Alamat tersimpan! Alamat ini akan otomatis digunakan pada checkout berikutnya.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#002c60]" /> Alamat Pengiriman Utama
          </h2>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 text-xs border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
              <Input
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
              <Input
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap & Patokan</label>
              <Textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-xs border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Pos</label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-10 bg-[#002c60] hover:bg-[#001f44] text-white font-bold text-xs rounded-lg"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
            Simpan Perubahan Alamat
          </Button>
        </form>
      </div>
    </div>
  );
}
