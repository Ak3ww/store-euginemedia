import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EugineStore — Pusat Perangkat Jaringan ISP & FTTH Resmi",
  description:
    "Distributor router MikroTik, OLT EPON/GPON, modem ONT XPON, dan kabel dropcore fiber optic terpercaya di Indonesia dengan garansi resmi dan dukungan teknis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col`}>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">{children}</main>
        <Footer />
        <CartDrawer />
        <AuthModal />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
