import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("[Categories GET Error]:", error);
    return NextResponse.json({ error: "Gagal memuat kategori" }, { status: 500 });
  }
}
