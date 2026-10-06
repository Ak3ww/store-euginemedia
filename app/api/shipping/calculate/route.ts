import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
    const options = [
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
