'use client';

import React, { useState } from 'react';
import { getStoreBrandMeta } from '@/lib/finlogos';
import { Truck, CreditCard, ShoppingBag } from 'lucide-react';

export interface BrandLogoProps {
  /** Nama brand / kode kurir / bank / marketplace (e.g. 'JNE', 'J&T', 'SiCepat', 'Shopee', 'BCA') */
  name: string;
  /** Kategori opsional untuk prioritas pencarian */
  category?: 'courier' | 'marketplace' | 'fin';
  /** Ukuran logo */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Format container: 'badge' (kotak rapi) atau 'raw' (hanya gambar) */
  variant?: 'badge' | 'raw';
  /** Custom container class */
  className?: string;
  /** Custom image class */
  imgClassName?: string;
  /** Tampilkan label teks nama di samping */
  showLabel?: boolean;
}

const SIZE_CONFIGS = {
  xs: {
    container: 'h-6 px-1.5 py-0.5 min-w-[28px]',
    img: 'h-3.5 max-w-[48px]',
    icon: 'w-3 h-3',
    text: 'text-xs',
  },
  sm: {
    container: 'h-8 px-2 py-1 min-w-[40px]',
    img: 'h-5 max-w-[64px]',
    icon: 'w-4 h-4',
    text: 'text-xs font-semibold',
  },
  md: {
    container: 'h-10 px-2.5 py-1.5 min-w-[54px]',
    img: 'h-6 max-w-[80px]',
    icon: 'w-5 h-5',
    text: 'text-sm font-semibold',
  },
  lg: {
    container: 'h-12 px-3 py-2 min-w-[68px]',
    img: 'h-7 max-w-[96px]',
    icon: 'w-6 h-6',
    text: 'text-base font-bold',
  },
  xl: {
    container: 'h-16 px-4 py-2.5 min-w-[88px]',
    img: 'h-9 max-w-[120px]',
    icon: 'w-7 h-7',
    text: 'text-lg font-bold',
  },
};

export function BrandLogo({
  name,
  category,
  size = 'md',
  variant = 'raw',
  className = '',
  imgClassName = '',
  showLabel = false,
}: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);
  const meta = getStoreBrandMeta(name, category);
  const cfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  if (!name) return null;

  const FallbackIcon =
    meta.category === 'courier' || category === 'courier'
      ? Truck
      : meta.category === 'marketplace' || category === 'marketplace'
      ? ShoppingBag
      : CreditCard;

  const content = (
    <>
      {!hasError && meta.src ? (
        <img
          src={meta.src}
          alt={name}
          onError={() => setHasError(true)}
          className={`object-contain transition-opacity duration-150 ${cfg.img} ${imgClassName}`}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center gap-1.5 text-neutral-500">
          <FallbackIcon className={`${cfg.icon} shrink-0 text-neutral-800`} />
          <span className="text-[11px] font-bold uppercase tracking-wider line-clamp-1">
            {name.substring(0, 10)}
          </span>
        </div>
      )}
      {showLabel && (
        <span className={`text-neutral-900 ${cfg.text} ml-2 whitespace-nowrap`}>
          {name}
        </span>
      )}
    </>
  );

  if (variant === 'raw') {
    return (
      <span className={`inline-flex items-center shrink-0 ${className}`}>
        {content}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 bg-white border border-neutral-200 rounded-md shadow-2xs select-none overflow-hidden ${cfg.container} ${className}`}
      title={name}
    >
      {content}
    </div>
  );
}

export default BrandLogo;
