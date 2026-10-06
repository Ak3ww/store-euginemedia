import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-24">
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Text */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 rounded-[2px] bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs font-['Archivo'] mb-6">
              <Zap className="h-3.5 w-3.5 text-[#ed1c24]" />
              <span>Official Hardware & Merchandise Store</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-['Archivo'] leading-none">
              PERANGKAT <span className="text-[#ed1c24]">JARINGAN</span> & FTTH RESMI
            </h1>

            <p className="mt-5 text-sm sm:text-base text-neutral-300 font-['Roboto'] max-w-xl leading-relaxed">
              Pusat belanja resmi kebutuhan Router MikroTik, OLT EPON/GPON, Modem ONT, Kabel Fiber Optic, dan Merchandise eksklusif dari Eugine Media Group. Jaminan 100% original bergaransi.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="h-[48px] px-8 bg-[#ed1c24] text-white font-['Archivo'] font-bold text-xs uppercase tracking-wider rounded-[4px] flex items-center justify-center space-x-2 hover:bg-white hover:text-neutral-900 transition-all duration-200">
                <span>Belanja Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/products?category=ftth"
                className="h-[48px] px-6 border border-neutral-700 bg-neutral-800/80 text-white font-['Archivo'] font-bold text-xs uppercase tracking-wider rounded-[4px] flex items-center justify-center hover:border-white transition-all">
                Katalog FTTH & OLT
              </Link>
            </div>
          </div>

          {/* Right Banner Preview Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1170&auto=format&fit=crop"
                alt="Perangkat Jaringan EugineStore"
                className="h-full w-full object-cover rounded-[2px] opacity-90"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-[4px] bg-neutral-900/95 border border-neutral-800 p-4 backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-wider font-['Archivo'] text-[#ed1c24]">
                  Siap Kirim Se-Indonesia
                </p>
                <p className="text-sm font-black font-['Archivo'] text-white">
                  Pengiriman Reguler & Cargo (JNE, J&T, SiCepat)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
