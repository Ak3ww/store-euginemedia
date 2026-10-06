import type React from "react";
import type { Metadata } from "next";
import { Archivo, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
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

export const metadata: Metadata = {
  title: "EugineStore — Toko Resmi Perangkat Jaringan & Merchandise",
  description: "Platform e-commerce resmi di bawah naungan Eugine Media Group. Belanja perangkat jaringan, FTTH, dan merchandise berkualitas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${archivo.variable} ${roboto.variable} font-sans antialiased text-neutral-900 bg-[#f8f9fa]`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
