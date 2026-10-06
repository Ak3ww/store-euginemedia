"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const waUrl =
    "https://wa.me/6281548727257?text=" +
    encodeURIComponent("Halo Sales EugineStore, saya mau tanya-tanya mengenai perangkat jaringan & FTTH.");

  return (
    <aside aria-label="Kontak WhatsApp Sales" className="fixed bottom-6 right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/30 font-semibold text-xs transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5 text-white fill-white/20" />
        <span className="hidden sm:inline">Konsultasi Sales</span>
      </a>
    </aside>
  );
}
