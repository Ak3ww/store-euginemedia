import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ShippingCalcSchema = z.object({
  weightInGrams: z.number().positive(),
  province: z.string().optional(),
  city: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ShippingCalcSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data berat barang tidak valid" }, { status: 400 });
    }

    const { weightInGrams } = parsed.data;
    // Calculate chargeable weight in KG (minimum 1 kg, rounded up)
    const weightInKg = Math.max(1, Math.ceil(weightInGrams / 1000));

    // Shipping Services
    const options = [
      {
        courier: "JNE",
        service: "REG (Reguler)",
        etd: "1-2 Hari Kerja",
        cost: weightInKg * 12000,
        logo: "/images/couriers/jne.svg",
      },
      {
        courier: "JNT",
        service: "EZ (Standard)",
        etd: "1-3 Hari Kerja",
        cost: weightInKg * 13000,
        logo: "/images/couriers/jnt.svg",
      },
      {
        courier: "SICEPAT",
        service: "GOKIL (Cargo Hemat)",
        etd: "2-4 Hari Kerja",
        cost: weightInKg >= 5 ? 35000 + (weightInKg - 5) * 4000 : weightInKg * 12500,
        logo: "/images/couriers/sicepat.svg",
      },
    ];

    return NextResponse.json({
      success: true,
      weightInGrams,
      chargeableWeightKg: weightInKg,
      options,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghitung ongkir" }, { status: 500 });
  }
}
