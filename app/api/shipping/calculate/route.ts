import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchAreaAutocomplete, calculateShippingCostRapidApi } from "@/lib/shipping-api";

const ShippingCalcSchema = z.object({
  weightInGrams: z.number().positive(),
  province: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

// Cache in-memory: 30 minutes TTL to save CPU and simulate external logistics rates
interface CacheEntry {
  expiresAt: number;
  data: any;
}
const rateCache = new Map<string, CacheEntry>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ShippingCalcSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data berat barang tidak valid" }, { status: 400 });
    }

    const { weightInGrams, province = "", city = "", district = "" } = parsed.data;
    
    // Chargeable weight in KG (min 1 kg, rounded up)
    const weightInKg = Math.max(1, Math.ceil(weightInGrams / 1000));
    const cacheKey = `${province}:${city}:${district}:${weightInKg}`;

    const cached = rateCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json(cached.data);
    }

    // Attempt live area autocomplete via RapidAPI for destination accuracy
    let liveOptions: any[] | null = null;
    try {
      const searchTarget = district || city;
      if (searchTarget) {
        const auto = await searchAreaAutocomplete(searchTarget);
        if (auto?.success && auto?.results?.length > 0) {
          const destAreaId = parseInt(auto.results[0].value);
          if (!isNaN(destAreaId)) {
            const liveRates = await calculateShippingCostRapidApi(12560, destAreaId, weightInKg);
            if (liveRates?.success && Array.isArray(liveRates?.results) && liveRates.results.length > 0) {
              liveOptions = liveRates.results.map((r: any) => ({
                courier: (r.logistic_name || r.name || "Kurir").toUpperCase(),
                service: r.service_name || r.service || "Standard",
                etd: r.etd ? `${r.etd} Hari` : "1-3 Hari",
                cost: r.tariff || r.cost || r.price,
                logo: (r.logistic_name || "").toLowerCase().includes("jne")
                  ? "/images/couriers/jne.svg"
                  : (r.logistic_name || "").toLowerCase().includes("sicepat")
                  ? "/images/couriers/sicepat.svg"
                  : "/images/couriers/jnt.svg",
              }));
            }
          }
        }
      }
    } catch (e) {
      // Graceful fallback to formula
    }

    // Dynamic base pricing rate multiplier depending on destination region (Jabodetabek vs Pulau Jawa vs Luar Jawa)
    const lowerProv = province.toLowerCase();
    const lowerCity = city.toLowerCase();
    
    let basePerKg = 11000; // Default Jabodetabek/Jawa Barat (origin: Cibinong, Bogor)
    let etdBase = "1-2";

    if (lowerProv.includes("jakarta") || lowerProv.includes("banten") || lowerCity.includes("bogor") || lowerCity.includes("depok") || lowerCity.includes("bekasi") || lowerCity.includes("tangerang")) {
      basePerKg = 10000;
      etdBase = "1-2";
    } else if (lowerProv.includes("jawa tengah") || lowerProv.includes("yogyakarta") || lowerProv.includes("jawa timur")) {
      basePerKg = 16000;
      etdBase = "2-3";
    } else if (lowerProv.includes("sumatera") || lowerProv.includes("lampung")) {
      basePerKg = 24000;
      etdBase = "3-4";
    } else if (lowerProv.includes("bali") || lowerProv.includes("nusa") || lowerProv.includes("kalimantan") || lowerProv.includes("sulawesi")) {
      basePerKg = 32000;
      etdBase = "3-5";
    } else if (lowerProv.includes("papua") || lowerProv.includes("maluku")) {
      basePerKg = 55000;
      etdBase = "5-7";
    }

    // Shipping Services (JNE, J&T, SiCepat)
    const options = liveOptions && liveOptions.length > 0 ? liveOptions : [
      {
        courier: "JNE",
        service: "REG (Reguler)",
        etd: `${etdBase} Hari Kerja`,
        cost: weightInKg * basePerKg,
        logo: "/images/couriers/jne.svg",
      },
      {
        courier: "JNT",
        service: "EZ (Standard)",
        etd: `${etdBase} Hari Kerja`,
        cost: weightInKg * (basePerKg + 1000),
        logo: "/images/couriers/jnt.svg",
      },
      {
        courier: "SICEPAT",
        service: weightInKg >= 5 ? "GOKIL (Cargo Hemat)" : "SIUNTUNG (Reguler)",
        etd: weightInKg >= 5 ? "3-5 Hari Kerja" : `${etdBase} Hari Kerja`,
        cost: weightInKg >= 5 ? Math.round(basePerKg * 2.5 + (weightInKg - 5) * (basePerKg * 0.4)) : weightInKg * (basePerKg + 500),
        logo: "/images/couriers/sicepat.svg",
      },
    ];

    const result = {
      success: true,
      origin: "Cibinong, Kab. Bogor, Jawa Barat",
      destination: { province, city, district },
      weightInGrams,
      chargeableWeightKg: weightInKg,
      options,
    };

    // Cache for 30 minutes
    rateCache.set(cacheKey, {
      expiresAt: Date.now() + 30 * 60 * 1000,
      data: result,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghitung tarif ongkir" }, { status: 500 });
  }
}
