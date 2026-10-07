"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  QrCode, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import CheckoutSteps from "@/components/cart/CheckoutSteps";

interface CourierOption {
  courier: string;
  service: string;
  etd: string;
  cost: number;
  logo: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getTotalWeight, clearCart } = useCartStore();

  // Authentication State
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [customer, setCustomer] = useState<any>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [province, setProvince] = useState("Jawa Barat");
  const [city, setCity] = useState("Kab. Bogor");
  const [district, setDistrict] = useState("Cibinong");
  const [postalCode, setPostalCode] = useState("16911");
  const [notes, setNotes] = useState("");

  // Courier & Shipping Calculation
  const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "BANK_TRANSFER">("QRIS");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = getTotal();
  const totalWeightGrams = getTotalWeight() || 500;
  const shippingCost = selectedCourier ? selectedCourier.cost : 0;
  const grandTotal = subtotal + shippingCost;

  // 1. Check Authentication on Mount (Mandatory Authentication Guard)
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.authenticated && json.customer) {
          setCustomer(json.customer);
          setCustomerName(json.customer.name || "");
          setCustomerPhone(json.customer.phone || "");
          setCustomerEmail(json.customer.email || "");
          if (json.customer.address) setShippingAddress(json.customer.address);
          if (json.customer.province) setProvince(json.customer.province);
          if (json.customer.city) setCity(json.customer.city);
          if (json.customer.district) setDistrict(json.customer.district);
          if (json.customer.postalCode) setPostalCode(json.customer.postalCode);
        } else {
          // Mandatory guard: Redirect to sign in with return callback
          router.replace("/auth/signin?redirect=/checkout");
          return;
        }
      } catch (err) {
        router.replace("/auth/signin?redirect=/checkout");
        return;
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch Shipping Options automatically based on total weight and destination
  useEffect(() => {
    if (!province || !city || totalWeightGrams <= 0) return;

    let isMounted = true;
    async function calculateShipping() {
      setLoadingShipping(true);
      try {
        const res = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weightInGrams: totalWeightGrams,
            province,
            city,
            district,
          }),
        });
        const data = await res.json();
        if (isMounted && data.success && data.options?.length > 0) {
          setCourierOptions(data.options);
          // Auto select first option
          setSelectedCourier(data.options[0]);
        }
      } catch (err) {
        console.warn("Shipping calc error:", err);
      } finally {
        if (isMounted) setLoadingShipping(false);
      }
    }

    const timer = setTimeout(calculateShipping, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [province, city, district, totalWeightGrams]);

  // 3. Handle Order Submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Keranjang belanja Anda masih kosong.");
      return;
    }
    if (!shippingAddress.trim() || !city.trim() || !district.trim()) {
      setErrorMessage("Harap lengkapi detail alamat pengiriman Anda.");
      return;
    }
    if (!selectedCourier) {
      setErrorMessage("Harap pilih salah satu kurir pengiriman.");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
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
        notes: notes || undefined,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Gagal membuat pesanan");
      }

      // Success: Clear Cart & Navigate to Order Confirmation / Payment Page
      clearCart();
      router.push(`/orders/${resData.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-900" />
        <p className="text-sm font-medium text-neutral-600 font-['Roboto']">Memeriksa autentikasi...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <CheckoutSteps activeStep={1} />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <ShoppingBag className="h-8 w-8 text-neutral-400" />
        </div>
        <h2 className="text-2xl font-bold font-['Archivo'] text-neutral-900">Keranjang Belanja Kosong</h2>
        <p className="mt-2 text-sm text-neutral-600 font-['Roboto']">
          Pilih produk terlebih dahulu sebelum checkout.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-[4px] bg-neutral-900 px-6 font-['Archivo'] text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#ed1c24]">
          Lihat Katalog Produk
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <CheckoutSteps activeStep={1} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Checkout Title */}
        <div className="mb-8 border-b border-neutral-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Archivo'] uppercase tracking-tight">
            Delivery & Shipping Info
          </h1>
          <p className="mt-1 text-sm text-neutral-600 font-['Roboto']">
            Pengiriman resmi langsung dari Gudang EugineStore (Cibinong, Kab. Bogor)
          </p>
        </div>

      {errorMessage && (
        <div className="mb-6 flex items-center space-x-2 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Data Pengiriman & Metode Pembayaran */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Data Penerima */}
          <div className="rounded-md border border-neutral-200/90 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center space-x-2 border-b border-neutral-100 pb-3">
              <User className="h-5 w-5 text-neutral-800" />
              <h2 className="text-base font-bold uppercase font-['Archivo'] text-neutral-900">
                1. Identitas Pembeli
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                  Nomor WhatsApp (+62) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                  Email (Opsional untuk bukti bayar)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Alamat Pengiriman */}
          <div className="rounded-md border border-neutral-200/90 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center space-x-2 border-b border-neutral-100 pb-3">
              <MapPin className="h-5 w-5 text-neutral-800" />
              <h2 className="text-base font-bold uppercase font-['Archivo'] text-neutral-900">
                2. Alamat Lengkap Pengiriman
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                  Alamat Jalan, Nomor Rumah, RT/RW *
                </label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Jl. Mayor Oking No. 12, RT 02/05..."
                  className="w-full p-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Jawa Barat"
                    className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kab. Bogor"
                    className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                    Kecamatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Cibinong"
                    className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="16911"
                    className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                  Catatan Pengiriman (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Titipkan di pos satpam depan"
                  className="w-full h-10 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pilihan Kurir Logistik */}
          <div className="rounded-md border border-neutral-200/90 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-neutral-800" />
                <h2 className="text-base font-bold uppercase font-['Archivo'] text-neutral-900">
                  3. Pilihan Ekspedisi Pengiriman
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-['Roboto'] font-medium">
                Total Berat: {(totalWeightGrams / 1000).toFixed(1)} Kg
              </span>
            </div>

            {loadingShipping ? (
              <div className="flex items-center justify-center py-6 space-x-2 text-sm text-neutral-600">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-800" />
                <span>Menghitung tarif ongkos kirim...</span>
              </div>
            ) : courierOptions.length === 0 ? (
              <p className="text-sm text-neutral-500 py-3">Masukkan kota dan kecamatan untuk memuat opsi ongkir.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {courierOptions.map((opt) => {
                  const isSelected =
                    selectedCourier?.courier === opt.courier && selectedCourier?.service === opt.service;
                  return (
                    <div
                      key={`${opt.courier}-${opt.service}`}
                      onClick={() => setSelectedCourier(opt)}
                      className={`cursor-pointer rounded-md border p-3 transition-all ${
                        isSelected
                          ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 font-['Archivo']">
                          {opt.courier}
                        </span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-neutral-900" />}
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-neutral-600">{opt.service}</p>
                      <p className="text-[11px] text-neutral-500">Estimasi: {opt.etd}</p>
                      <p className="mt-2 text-sm font-extrabold text-neutral-900 font-['Archivo']">
                        Rp {opt.cost.toLocaleString("id-ID")}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Metode Pembayaran */}
          <div className="rounded-md border border-neutral-200/90 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center space-x-2 border-b border-neutral-100 pb-3">
              <CreditCard className="h-5 w-5 text-neutral-800" />
              <h2 className="text-base font-bold uppercase font-['Archivo'] text-neutral-900">
                4. Metode Pembayaran
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* QRIS */}
              <div
                onClick={() => setPaymentMethod("QRIS")}
                className={`cursor-pointer rounded-md border p-4 transition-all ${
                  paymentMethod === "QRIS"
                    ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-neutral-900" />
                    <span className="text-sm font-bold uppercase font-['Archivo'] text-neutral-900">
                      QRIS Real-Time
                    </span>
                  </div>
                  {paymentMethod === "QRIS" && <CheckCircle2 className="h-4 w-4 text-neutral-900" />}
                </div>
                <p className="mt-1.5 text-xs text-neutral-600 font-['Roboto'] leading-relaxed">
                  BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, DANA & Seluruh Mobile Banking.
                </p>
              </div>

              {/* Transfer Bank */}
              <div
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`cursor-pointer rounded-md border p-4 transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-neutral-900" />
                    <span className="text-sm font-bold uppercase font-['Archivo'] text-neutral-900">
                      Transfer Bank Manual
                    </span>
                  </div>
                  {paymentMethod === "BANK_TRANSFER" && <CheckCircle2 className="h-4 w-4 text-neutral-900" />}
                </div>
                <p className="mt-1.5 text-xs text-neutral-600 font-['Roboto'] leading-relaxed">
                  Transfer langsung ke rekening resmi PT Eugine Media Group (BCA / Mandiri).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary: Ringkasan Keranjang Belanja */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-6 rounded-md border border-neutral-200/90 bg-white p-5 shadow-xs">
            <h2 className="mb-4 text-base font-bold uppercase tracking-wider font-['Archivo'] text-neutral-900 border-b border-neutral-100 pb-3">
              Ringkasan Pesanan ({items.length} Barang)
            </h2>

            {/* List of Cart Items */}
            <div className="max-h-72 divide-y divide-neutral-100 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex py-3 space-x-3 items-center">
                  <img
                    src={item.image || "/images/placeholder-product.png"}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-[4px] border border-neutral-200 object-contain p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 line-clamp-2 font-['Archivo']">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500 font-['Roboto']">
                      {item.quantity}x @ Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right font-['Archivo'] text-xs font-bold text-neutral-900">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="mt-4 space-y-2.5 border-t border-neutral-100 pt-4 text-sm font-['Roboto']">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal Barang</span>
                <span className="font-medium text-neutral-900 font-['Archivo']">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Ongkos Kirim ({selectedCourier?.courier || "Kurir"})</span>
                <span className="font-medium text-neutral-900 font-['Archivo']">
                  Rp {shippingCost.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-neutral-200 pt-3 text-base">
                <span className="font-black uppercase tracking-tight text-neutral-900 font-['Archivo']">
                  Total Pembayaran
                </span>
                <span className="text-xl font-black text-neutral-900 font-['Archivo']">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Submit Button (Cricket-Weapon Signature Action) */}
            <button
              type="submit"
              disabled={submitting || loadingShipping}
              className="mt-6 flex h-[48px] w-full items-center justify-center space-x-2 rounded-[4px] bg-neutral-900 text-white font-['Archivo'] text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.99] disabled:opacity-50">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Memproses Transaksi...</span>
                </>
              ) : (
                <>
                  <span>Bayar Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Guarantee Tag */}
            <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Transaksi Aman Terenkripsi Eugine Media Group</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  );
}
