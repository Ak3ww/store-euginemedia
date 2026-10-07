"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowRight, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-900" />
        </div>
      }>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Send OTP to WhatsApp
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setDebugOtp(null);

    let cleaned = phone.replace(/\D/g, "");
    if (!cleaned) {
      setErrorMsg("Harap masukkan nomor WhatsApp Anda.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirimkan kode OTP");

      setSuccessMsg(data.message || "Kode OTP 6-digit telah dikirimkan ke WhatsApp Anda.");
      if (data.debugOtp) {
        setDebugOtp(data.debugOtp);
      }
      setStep("OTP");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (otp.length !== 6) {
      setErrorMsg("Kode OTP harus terdiri dari 6 digit angka.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ""),
          code: otp,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kode OTP salah atau kedaluwarsa.");

      // Success -> Redirect to target checkout or home
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memverifikasi OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center">
          <span className="inline-block bg-neutral-900 text-white font-['Archivo'] text-xs font-black px-2.5 py-1 uppercase tracking-widest rounded-xs mb-3">
            EugineStore
          </span>
          <h1 className="text-2xl font-black text-neutral-900 font-['Archivo'] tracking-tight">
            {step === "PHONE" ? "Masuk atau Daftar" : "Verifikasi WhatsApp OTP"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-['Roboto'] leading-relaxed">
            {step === "PHONE"
              ? "Masukkan nomor WhatsApp aktif Anda untuk login instan tanpa ribet mengingat password."
              : `Masukkan 6-digit kode verifikasi yang kami kirimkan ke WhatsApp Anda.`}
          </p>
        </div>

        {errorMsg && (
          <div className="mt-5 flex items-center space-x-2 rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-5 flex items-center space-x-2 rounded-md bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === "PHONE" ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                Nomor WhatsApp (+62 / 08) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full h-11 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
                />
              </div>
              <p className="mt-1 text-[11px] text-neutral-500 font-['Roboto']">
                Format nomor otomatis dinormalisasi ke standar Indonesia (+62).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                Nama Lengkap (Jika pengguna baru)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full h-11 px-3 border border-neutral-300 rounded-[4px] text-sm focus:outline-none focus:border-neutral-900 font-['Roboto']"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-[46px] w-full items-center justify-center space-x-2 rounded-[4px] bg-neutral-900 text-white font-['Archivo'] text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.99] disabled:opacity-50">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mengirim Kode OTP...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  <span>Kirim OTP WhatsApp</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo'] mb-1">
                6-Digit Kode OTP *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full h-12 text-center text-xl tracking-[0.4em] font-black border border-neutral-300 rounded-[4px] focus:outline-none focus:border-neutral-900 font-['Archivo']"
              />
              {debugOtp && (
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setOtp(debugOtp)}
                    className="inline-flex items-center text-xs font-semibold text-[#ed1c24] hover:underline bg-red-50 px-2.5 py-1 rounded border border-red-100"
                  >
                    Tempel Kode Verifikasi: <strong className="ml-1 tracking-widest">{debugOtp}</strong>
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="flex h-[46px] w-full items-center justify-center space-x-2 rounded-[4px] bg-neutral-900 text-white font-['Archivo'] text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.99] disabled:opacity-50">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verifikasi & Lanjutkan</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep("PHONE")}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline font-['Roboto']">
                Ganti Nomor WhatsApp
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 border-t border-neutral-100 pt-4 text-center">
          <div className="flex items-center justify-center space-x-1 text-xs text-neutral-500 font-['Roboto']">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Sistem Autentikasi Resmi Eugine Media Group</span>
          </div>
        </div>
      </div>
    </div>
  );
}
