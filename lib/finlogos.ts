/**
 * idn-finlogos Helper & Brand Resolver for EugineStore
 * Integrasi resmi brand mark ekspedisi logistik, marketplace, bank & e-wallet Indonesia.
 */

export interface BrandMetadata {
  slug: string;
  category: 'courier' | 'marketplace' | 'bank' | 'ewallet' | 'other';
  localPath: string;
  cdnUrl: string;
  displayName: string;
}

// Dictionary pemetaan kurir logistik Indonesia
const COURIER_ALIASES: Record<string, string> = {
  'jne': 'jne',
  'jne express': 'jne',
  'j&t': 'j-and-t-express',
  'j&t express': 'j-and-t-express',
  'jnt': 'j-and-t-express',
  'j and t': 'j-and-t-express',
  'j&t cargo': 'j-and-t-cargo',
  'sicepat': 'sicepat-ekspres',
  'sicepat ekspres': 'sicepat-ekspres',
  'sicepat express': 'sicepat-ekspres',
  'anteraja': 'anteraja',
  'anter aja': 'anteraja',
  'pos': 'pos-indonesia',
  'pos indonesia': 'pos-indonesia',
  'lion': 'lion-parcel',
  'lion parcel': 'lion-parcel',
  'ninja': 'ninja-xpress',
  'ninja xpress': 'ninja-xpress',
  'ninja express': 'ninja-xpress',
  'spx': 'spx-express',
  'spx express': 'spx-express',
  'shopee express': 'spx-express',
  'shopee xpress': 'spx-express',
  'wahana': 'wahana-express',
  'wahana express': 'wahana-express',
  'tiki': 'tiki',
  'dakota': 'dakota-cargo',
  'dakota cargo': 'dakota-cargo',
  'dakota logistik': 'dakota-logistik',
  'lalamove': 'lalamove',
  'dhl': 'dhl-express',
  'dhl express': 'dhl-express',
  'fedex': 'fedex-express',
  'fedex express': 'fedex-express',
  'id express': 'id-express',
  'idexpress': 'id-express',
  'indah': 'indah-cargo',
  'indah cargo': 'indah-cargo',
  'sap': 'sap-express',
  'sap express': 'sap-express',
  'gosend': 'gosend',
  'grabexpress': 'grabexpress',
};

// Dictionary pemetaan marketplace
const MARKETPLACE_ALIASES: Record<string, string> = {
  'shopee': 'shopee',
  'tokopedia': 'tokopedia',
  'tiktok': 'tiktok-shop',
  'tiktok shop': 'tiktok-shop',
  'lazada': 'lazada',
  'blibli': 'blibli',
  'bukalapak': 'bukalapak',
};

// Dictionary pemetaan bank & fintech
const FIN_ALIASES: Record<string, string> = {
  'bca': 'bca',
  'bank bca': 'bca',
  'mandiri': 'mandiri',
  'bank mandiri': 'mandiri',
  'bri': 'bri',
  'bank bri': 'bri',
  'bni': 'bni',
  'bank bni': 'bni',
  'bsi': 'bsi',
  'cimb': 'cimb-niaga',
  'cimb niaga': 'cimb-niaga',
  'permata': 'permata',
  'danamon': 'danamon',
  'btn': 'btn',
  'seabank': 'seabank',
  'jago': 'jago',
  'blu': 'blu-bca',
  'jenius': 'jenius',
  'qris': 'qris',
  'gopay': 'gopay',
  'ovo': 'ovo',
  'dana': 'dana',
  'shopeepay': 'shopee-pay',
  'linkaja': 'linkaja',
  'indomaret': 'indomaret',
  'alfamart': 'alfamart',
};

// Local files available in EugineStore
const LOCAL_COURIERS = new Set([
  'anteraja', 'dakota-cargo', 'dakota-logistik', 'dhl-express', 'fedex-express',
  'id-express', 'indah-cargo', 'j-and-t-cargo', 'j-and-t-express', 'jne', 'jnt',
  'lalamove', 'lion-parcel', 'ninja-xpress', 'pos-indonesia', 'sap-express',
  'sicepat-ekspres', 'sicepat', 'spx-express', 'tiki', 'wahana-express'
]);

const LOCAL_MARKETPLACES = new Set([
  'blibli', 'bukalapak', 'lazada', 'shopee', 'tiktok-shop', 'tiktok', 'tokopedia'
]);

const LOCAL_FINLOGOS = new Set([
  'alfamart', 'alfamidi', 'astrapay', 'bank-bjb', 'bank-jateng', 'bank-jatim',
  'bca', 'blu-bca', 'bni', 'bri', 'bsi', 'btn', 'cimb-niaga', 'dana',
  'danamon', 'doku', 'gopay', 'indomaret', 'jago', 'jenius', 'linkaja',
  'mandiri', 'midtrans', 'neobank', 'ovo', 'paninbank', 'permata', 'qris',
  'seabank', 'shopee-pay', 'sinarmas', 'superbank', 'xendit'
]);

/**
 * Normalisasi query menjadi slug dan sumber file URL
 */
export function getStoreBrandMeta(
  query: string,
  categoryHint?: 'courier' | 'marketplace' | 'fin'
): {
  slug: string;
  category: 'courier' | 'marketplace' | 'fin' | 'other';
  src: string;
  isLocal: boolean;
} {
  if (!query) {
    return { slug: '', category: 'other', src: '', isLocal: false };
  }

  const clean = query.toLowerCase().trim().replace(/[()]/g, '');

  // 1. Cek Courier jika ada hint atau match
  if (categoryHint === 'courier' || COURIER_ALIASES[clean]) {
    const slug = COURIER_ALIASES[clean] || clean.replace(/\s+/g, '-');
    if (LOCAL_COURIERS.has(slug)) {
      return { slug, category: 'courier', src: `/images/couriers/${slug}.svg`, isLocal: true };
    }
    // Cek partial match di courier
    for (const [k, v] of Object.entries(COURIER_ALIASES)) {
      if (clean.includes(k) && LOCAL_COURIERS.has(v)) {
        return { slug: v, category: 'courier', src: `/images/couriers/${v}.svg`, isLocal: true };
      }
    }
  }

  // 2. Cek Marketplace jika ada hint atau match
  if (categoryHint === 'marketplace' || MARKETPLACE_ALIASES[clean]) {
    const slug = MARKETPLACE_ALIASES[clean] || clean.replace(/\s+/g, '-');
    if (LOCAL_MARKETPLACES.has(slug)) {
      return { slug, category: 'marketplace', src: `/images/marketplaces/${slug}.svg`, isLocal: true };
    }
  }

  // 3. Cek Fin (Bank, E-Wallet, QRIS)
  if (categoryHint === 'fin' || FIN_ALIASES[clean]) {
    const slug = FIN_ALIASES[clean] || clean.replace(/\s+/g, '-');
    if (LOCAL_FINLOGOS.has(slug)) {
      return { slug, category: 'fin', src: `/images/finlogos/${slug}.svg`, isLocal: true };
    }
  }

  // 4. Fallback search across all sets
  for (const [k, v] of Object.entries(COURIER_ALIASES)) {
    if (clean.includes(k) && LOCAL_COURIERS.has(v)) {
      return { slug: v, category: 'courier', src: `/images/couriers/${v}.svg`, isLocal: true };
    }
  }
  for (const [k, v] of Object.entries(FIN_ALIASES)) {
    if (clean.includes(k) && LOCAL_FINLOGOS.has(v)) {
      return { slug: v, category: 'fin', src: `/images/finlogos/${v}.svg`, isLocal: true };
    }
  }

  // 5. Fallback ke CDN jsDelivr jika slug dikenali
  const fallbackSlug = clean.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  return {
    slug: fallbackSlug,
    category: 'other',
    src: `https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/${fallbackSlug}.svg`,
    isLocal: false,
  };
}
