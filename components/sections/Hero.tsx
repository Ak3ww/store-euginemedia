"use client";

import React from "react";
import { ShieldCheck, Truck, Headphones, Award, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden mb-8">
      {/* Hero Banner Box */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#002c60] via-[#0d3870] to-[#1b437c] text-white p-6 sm:p-10 shadow-lg shadow-[#002c60]/10 overflow-hidden">
        {/* Subtle Decorative Ambient Circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#1b437c]/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Distributor Perangkat Jaringan & FTTH Resmi Indonesia</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-3">
            Kebutuhan ISP & RT-RW Net, Lengkap & Terpercaya
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6 max-w-xl">
            Sedia router MikroTik original, Mini OLT GPON/EPON, Modem ONT XPON, dan kabel dropcore fiber optic
            berkualitas dengan garansi tukar baru dan dukungan teknisi jaringan.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#katalog">
              <Button className="h-10 px-5 bg-white hover:bg-slate-100 text-[#002c60] font-bold text-xs rounded-xl shadow-md transition-all">
                Jelajahi Katalog <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </a>

            <a
              href="https://wa.me/6281548727257?text=Halo%20Sales%20EugineStore,%20saya%20ingin%20konsultasi%20kebutuhan%20perangkat%20jaringan."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="h-10 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold text-xs rounded-xl backdrop-blur-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Konsultasi WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Trust Perks Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">100% Produk Original</div>
            <div className="text-[11px] text-slate-400">Garansi resmi distributor</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Garansi Tukar Baru</div>
            <div className="text-[11px] text-slate-400">Rusak pabrik ganti unit</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Kirim Seluruh RI</div>
            <div className="text-[11px] text-slate-400">JNE, J&T, SiCepat, Cargo</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Support Teknis ISP</div>
            <div className="text-[11px] text-slate-400">Bantuan konfigurasi tim ahli</div>
          </div>
        </div>
      </div>
    </section>
  );
}
