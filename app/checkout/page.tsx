"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import {
  ShoppingBag,
  Truck,
  CreditCard,
  MapPin,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface ShippingOption {
  courier: string;
  service: string;
  etd: string;
  cost: number;
  logo: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getTotalWeightGrams, clearCart } = useCartStore();
  const { customer, isAuthModalOpen, openAuthModal, fetchCustomer } = useAuthStore();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [province, setProvince] = useState("Jawa Barat");
  const [city, setCity] = useState("Bogor");
  const [district, setDistrict] = useState("Cibinong");
  const [postalCode, setPostalCode] = useState("16913");
  const [notes, setNotes] = useState("");

  // Shipping & Payment
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<ShippingOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "BANK_TRANSFER">("QRIS");

  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-fill from logged-in customer profile
  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  useEffect(() => {
    if (customer) {
      if (customer.name) setCustomerName(customer.name);
      if (customer.phone) setCustomerPhone(customer.phone);
      if (customer.email) setCustomerEmail(customer.email);
      if (customer.address) setShippingAddress(customer.address);
      if (customer.province) setProvince(customer.province);
      if (customer.city) setCity(customer.city);
      if (customer.district) setDistrict(customer.district);
      if (customer.postalCode) setPostalCode(customer.postalCode);
    }
  }, [customer]);

  // Calculate Shipping Costs
  const totalWeight = getTotalWeightGrams();
  useEffect(() => {
    if (totalWeight <= 0) return;

    async function fetchShipping() {
      setIsLoadingShipping(true);
      try {
        const res = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weightInGrams: totalWeight, city, province }),
        });
        const data = await res.json();
        if (data.options && data.options.length > 0) {
          setShippingOptions(data.options);
          setSelectedCourier(data.options[0]); // default to first courier
        }
      } catch (err) {
        console.error("Error fetching shipping:", err);
      } finally {
        setIsLoadingShipping(false);
      }
    }

    fetchShipping();
  }, [totalWeight, city, province]);

  const subtotal = getTotal();
  const shippingCost = selectedCourier ? selectedCourier.cost : 0;
  const grandTotal = subtotal + shippingCost;
  const weightKg = (totalWeight / 1000).toFixed(1);

  // Address validation
  const isAddressComplete =
    customerName.trim().length >= 2 &&
    customerPhone.trim().length >= 9 &&
    shippingAddress.trim().length >= 8 &&
    province.trim().length >= 2 &&
    city.trim().length >= 2 &&
    district.trim().length >= 2;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customer) {
      openAuthModal();
      return;
    }

    if (!isAddressComplete) {
      setErrorMsg("Mohon lengkapi seluruh data nama, nomor WhatsApp, dan alamat pengiriman sebelum membayar.");
      return;
    }

    if (!selectedCourier) {
      setErrorMsg("Mohon pilih layanan kurir pengiriman.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          shippingAddress,
          province,
          city,
          district,
          postalCode,
          courier: selectedCourier.courier,
          courierService: selectedCourier.service,
          shippingCost: selectedCourier.cost,
          notes,
          paymentMethod,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal membuat pesanan");
        return;
      }

      // Clear cart and redirect to order tracking page
      clearCart();
      router.push(`/orders/${data.orderNumber}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || "Terjadi kesalahan saat memproses pesanan");
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-300">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Keranjang Belanja Kosong</h2>
        <p className="text-xs text-slate-500 mb-6">Silakan pilih produk yang ingin Anda beli terlebih dahulu.</p>
        <Link href="/">
          <Button className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs">Jelajahi Produk</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Checkout Pesanan</h1>
        <p className="text-xs text-slate-500">
          Lengkapi alamat tujuan pengiriman dan pilih metode pembayaran resmi EugineStore
        </p>
      </div>

      {/* Guest Checkout Guard Banner (if not logged in) */}
      {!customer && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-xs text-amber-800">
              <strong className="font-bold">Anda belum masuk akun.</strong> Silakan masuk via WhatsApp OTP dalam 10
              detik agar data pesanan tercatat di profil Anda.
            </div>
          </div>
          <Button
            onClick={openAuthModal}
            size="sm"
            className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs flex-shrink-0"
          >
            Masuk / Daftar
          </Button>
        </div>
      )}

      {errorMsg && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700 text-xs rounded-lg">
          <AlertCircle className="w-4 h-4 mr-2" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address, Shipping, & Payment (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Alamat Pengiriman */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#002c60]" />
              <h2 className="text-sm font-bold text-slate-900">Alamat Pengiriman (Wajib Lengkap)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Penerima *</label>
                <Input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
                <Input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Opsional)</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="nama@email.com"
                className="h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Provinsi *</label>
                <Input
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Provinsi"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten *</label>
                <Input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Kota / Kab"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan *</label>
                <Input
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Kecamatan"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap & Patokan Rumah *
              </label>
              <Textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Jalan, Nomor Rumah, RT/RW, Blok, Kelurahan, Patokan Rumah..."
                rows={3}
                className="text-xs border-slate-200 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Alamat ini akan otomatis tersimpan di profil Anda untuk transaksi berikutnya.
              </span>
            </div>
          </div>

          {/* 2. Pilihan Ekspedisi Logistik */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#002c60]" />
                <h2 className="text-sm font-bold text-slate-900">Kurir Pengiriman</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Berat: {weightKg} kg</span>
            </div>

            {isLoadingShipping ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#002c60]" />
                <span>Menghitung ongkir logistik...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {shippingOptions.map((opt) => (
                  <button
                    key={`${opt.courier}-${opt.service}`}
                    type="button"
                    onClick={() => setSelectedCourier(opt)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedCourier?.courier === opt.courier && selectedCourier?.service === opt.service
                        ? "border-[#002c60] bg-[#002c60]/5 ring-1 ring-[#002c60]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <img src={opt.logo} alt={opt.courier} className="h-4 object-contain" />
                      {selectedCourier?.courier === opt.courier && selectedCourier?.service === opt.service && (
                        <Check className="w-4 h-4 text-[#002c60]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-800">{opt.service}</div>
                    <div className="text-[11px] text-slate-400 mb-1">{opt.etd}</div>
                    <div className="text-xs font-extrabold text-[#002c60]">Rp {opt.cost.toLocaleString("id-ID")}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Metode Pembayaran */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-[#002c60]" />
              <h2 className="text-sm font-bold text-slate-900">Pilihan Metode Pembayaran</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* QRIS */}
              <button
                type="button"
                onClick={() => setPaymentMethod("QRIS")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === "QRIS"
                    ? "border-[#002c60] bg-[#002c60]/5 ring-1 ring-[#002c60]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src="/images/banks/qris.svg" alt="QRIS" className="h-4 object-contain" />
                    <span className="text-xs font-bold text-slate-800">QRIS Dinamis</span>
                  </div>
                  {paymentMethod === "QRIS" && <Check className="w-4 h-4 text-[#002c60]" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Verifikasi otomatis via BCA, Mandiri, BRI, BNI, GoPay, DANA, OVO.
                </p>
              </button>

              {/* Transfer Bank */}
              <button
                type="button"
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-[#002c60] bg-[#002c60]/5 ring-1 ring-[#002c60]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Transfer Bank Manual</span>
                  {paymentMethod === "BANK_TRANSFER" && <Check className="w-4 h-4 text-[#002c60]" />}
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <img src="/images/banks/bca.svg" alt="BCA" className="h-3 object-contain" />
                  <img src="/images/banks/mandiri.svg" alt="Mandiri" className="h-3 object-contain" />
                  <img src="/images/banks/bri.svg" alt="BRI" className="h-3 object-contain" />
                </div>
                <p className="text-[11px] text-slate-500">Transfer ke rekening resmi PT Eugine Media Group.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Ringkasan Pesanan</h2>

            {/* Item List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 truncate">{it.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {it.quantity} x Rp {it.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <span className="font-bold text-slate-800">
                    Rp {(it.price * it.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Barang</span>
                <span className="font-semibold text-slate-700">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Ongkos Kirim ({selectedCourier?.courier || "Kurir"})</span>
                <span className="font-semibold text-slate-700">Rp {shippingCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Tagihan</span>
                <span className="text-[#002c60]">Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Submit Button with Address Lock Guard */}
            <Button
              type="submit"
              disabled={isSubmitting || !isAddressComplete}
              className={`w-full h-11 text-xs font-bold rounded-lg shadow-sm transition-all ${
                isAddressComplete
                  ? "bg-[#002c60] hover:bg-[#001f44] text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Memproses Pesanan...
                </>
              ) : !isAddressComplete ? (
                "Lengkapi Alamat Pengiriman Dahulu"
              ) : (
                <>
                  Bayar Sekarang Rp {grandTotal.toLocaleString("id-ID")} <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garansi Resmi & Enkripsi Keamanan SSL</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
