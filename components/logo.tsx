import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2.5 group">
      <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-neutral-900 text-white font-['Archivo'] font-black text-sm tracking-wider group-hover:bg-[#ed1c24] transition-colors">
        ES
      </div>
      <div className="flex flex-col">
        <span className="font-['Archivo'] text-base font-black tracking-tight text-neutral-900 leading-tight">
          Eugine<span className="text-[#ed1c24]">Store</span>
        </span>
        <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest font-['Roboto'] -mt-0.5">
          Eugine Media Group
        </span>
      </div>
    </Link>
  );
}
