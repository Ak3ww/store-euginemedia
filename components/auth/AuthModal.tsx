"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { MessageSquare, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, sendOtp, verifyOtp, isLoading } = useAuthStore();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!phone || phone.length < 9) {
      setErrorMsg("Masukkan nomor WhatsApp yang valid (minimal 9 digit)");
      return;
    }

    const res = await sendOtp(phone);
    if (!res.success) {
      setErrorMsg(res.error || "Gagal mengirimkan OTP");
    } else {
      setStep("OTP");
      setCountdown(60);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (otpCode.length !== 6) {
      setErrorMsg("Masukkan 6 digit kode OTP");
      return;
    }

    const res = await verifyOtp(phone, otpCode, name);
    if (!res.success) {
      setErrorMsg(res.error || "Kode OTP tidak valid");
    } else {
      setStep("PHONE");
      setPhone("");
      setOtpCode("");
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setErrorMsg(null);
    const res = await sendOtp(phone);
    if (!res.success) {
      setErrorMsg(res.error || "Gagal mengirim ulang OTP");
    } else {
      setCountdown(60);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[420px] p-6 rounded-2xl bg-white border border-slate-200 shadow-xl">
        <DialogHeader className="text-center sm:text-center pb-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            {step === "PHONE" ? <MessageSquare className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            {step === "PHONE" ? "Masuk via WhatsApp" : "Verifikasi Kode OTP"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {step === "PHONE"
              ? "Masukkan nomor WhatsApp Anda untuk masuk atau mendaftar akun EugineStore secara instan."
              : `Masukkan 6-digit kode verifikasi yang telah kami kirimkan ke WhatsApp ${phone}`}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <Alert variant="destructive" className="py-2.5 px-3 bg-red-50 border-red-200 text-red-700 text-xs rounded-lg">
            <AlertCircle className="w-4 h-4 mr-2" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {step === "PHONE" ? (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp Aktif
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  +62
                </span>
                <Input
                  type="tel"
                  placeholder="812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-12 h-11 text-base border-slate-200 focus:border-[#002c60] focus:ring-2 focus:ring-[#002c60]/10 rounded-lg"
                  autoFocus
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Kami akan mengirimkan 6-digit kode OTP langsung ke WhatsApp Anda.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap (Opsional)
              </label>
              <Input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#002c60] focus:ring-2 focus:ring-[#002c60]/10 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#002c60] hover:bg-[#001f44] text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <>
                  Kirim Kode OTP <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5 pt-2">
            <div className="flex flex-col items-center justify-center">
              <InputOTP maxLength={6} value={otpCode} onChange={(val) => setOtpCode(val)} autoFocus>
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-11 h-12 text-lg font-bold border-slate-300 rounded-md" />
                  <InputOTPSlot index={1} className="w-11 h-12 text-lg font-bold border-slate-300 rounded-md" />
                  <InputOTPSlot index={2} className="w-11 h-12 text-lg font-bold border-slate-300 rounded-md" />
                  <InputOTPSlot index={3} className="w-11 h-12 text-lg font-bold border-slate-300 rounded-md" />
                  <InputOTPSlot index={4} className="w-11 h-12 text-lg font-bold border-slate-300 rounded-md" />
                  <InputOTPSlot index={5} className="w-11 h-12 text-lg font-bold border-slate-300 rounded-md" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : "Verifikasi & Masuk"}
            </Button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setStep("PHONE")}
                className="hover:underline text-slate-600"
              >
                Ganti Nomor WA
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className={`font-semibold ${countdown > 0 ? "text-slate-400" : "text-[#002c60] hover:underline"}`}
              >
                {countdown > 0 ? `Kirim Ulang (${countdown}s)` : "Kirim Ulang OTP"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
