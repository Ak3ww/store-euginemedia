import Link from "next/link";
import { Router, Radio, Cable, Wrench, Shirt, Layers } from "lucide-react";

const storeCategories = [
  {
    name: "Router & Mikrotik",
    slug: "router",
    count: "CCR, RB, Hex",
    icon: Router,
  },
  {
    name: "OLT & ONT FTTH",
    slug: "ftth",
    count: "GPON, EPON, XPON",
    icon: Radio,
  },
  {
    name: "Kabel & Dropcore",
    slug: "cables",
    count: "1 Core, Patchcord",
    icon: Cable,
  },
  {
    name: "Tools & Splicer",
    slug: "tools",
    count: "OPM, VFL, Stripper",
    icon: Wrench,
  },
  {
    name: "Merchandise",
    slug: "merchandise",
    count: "T-Shirt, Tumbler",
    icon: Shirt,
  },
  {
    name: "Aksesoris Jaringan",
    slug: "accessories",
    count: "SFP, ODP, Adapter",
    icon: Layers,
  },
];

export default function Categories() {
  return (
    <section className="py-14 sm:py-20 bg-[#f8f9fa] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ed1c24] font-['Archivo']">
            Kategori Perangkat
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 font-['Archivo'] mt-1">
            Pilihan Kategori Produk
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-['Roboto'] max-w-lg mx-auto">
            Temukan perangkat keras telekomunikasi dan merchandise resmi sesuai kebutuhan jaringan Anda.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {storeCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-white rounded-md border border-neutral-200/90 p-5 text-center transition-all duration-200 hover:border-neutral-900 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-[4px] bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-900 group-hover:bg-[#ed1c24] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold font-['Archivo'] text-neutral-900 mb-1 group-hover:text-[#ed1c24] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-neutral-500 font-['Roboto']">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
