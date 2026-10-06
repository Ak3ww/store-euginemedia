import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const AddressUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(5, "Alamat lengkap wajib diisi"),
  province: z.string().min(2, "Provinsi wajib diisi"),
  city: z.string().min(2, "Kota / Kabupaten wajib diisi"),
  district: z.string().min(2, "Kecamatan wajib diisi"),
  postalCode: z.string().optional().nullable(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Sesi telah berakhir. Silakan login kembali." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = AddressUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Data alamat tidak valid" }, { status: 400 });
    }

    const updated = await prisma.customer.update({
      where: { id: session.id },
      data: {
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
        address: parsed.data.address,
        province: parsed.data.province,
        city: parsed.data.city,
        district: parsed.data.district,
        postalCode: parsed.data.postalCode,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Alamat tersimpan di profil",
      customer: updated,
    });
  } catch (error: any) {
    console.error("[Update Address Error]:", error);
    return NextResponse.json({ error: "Gagal menyimpan alamat" }, { status: 500 });
  }
}
