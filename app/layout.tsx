import type React from "react";
import type { Metadata } from "next";
import { Archivo, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/footer";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://store.euginemediagroup.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "EugineStore — Toko Resmi Perangkat Jaringan & Merchandise",
    template: "%s | EugineStore",
  },
  description: "Belanja perangkat jaringan FTTH, router MikroTik, ONT XPON, kabel fiber, CCTV, dan merchandise resmi Eugine Media Group. Gratis ongkir se-Jabodetabek.",
  keywords: ["perangkat jaringan", "router mikrotik", "ont xpon", "fiber optik", "FTTH", "Eugine Media Group", "EugineStore", "CCTV", "kabel dropcore"],
  authors: [{ name: "PT Eugine Media Group", url: "https://euginemediagroup.com" }],
  creator: "PT Eugine Media Group",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: APP_URL,
    siteName: "EugineStore",
    title: "EugineStore — Toko Resmi Perangkat Jaringan & Merchandise",
    description: "Belanja perangkat jaringan, router, ONT fiber, CCTV, dan merchandise resmi Eugine Media Group. Pengiriman ke seluruh Indonesia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EugineStore — Toko Resmi Perangkat Jaringan",
    description: "Perangkat jaringan FTTH & ISP resmi dari Eugine Media Group.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${archivo.variable} ${roboto.variable} font-sans antialiased text-neutral-900 bg-[#f8f9fa]`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
