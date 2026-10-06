"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { customer, openAuthModal } = useAuthStore();

  useEffect(() => {
    if (customer) {
      router.push("/");
    } else {
      openAuthModal();
    }
  }, [customer, openAuthModal, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
        <MessageSquare className="w-7 h-7" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Masuk ke EugineStore</h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        Masuk dan daftar akun sekarang menggunakan nomor WhatsApp aktif dengan verifikasi 6-digit kode OTP instan.
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={openAuthModal} className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs font-semibold">
          Buka Form Login WhatsApp
        </Button>
        <Link href="/">
          <Button variant="outline" className="text-xs border-slate-200">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Kembali Belanja
          </Button>
        </Link>
      </div>
    </div>
  );
}
