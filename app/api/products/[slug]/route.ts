import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ProductSchema } from "@/lib/security";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    // Get related products from same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
    });

    return NextResponse.json({ success: true, product, related });
  } catch (error: any) {
    console.error("[Product Detail Error]:", error);
    return NextResponse.json({ error: "Gagal memuat detail produk" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const parsed = ProductSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Data produk tidak valid" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: slug },
      data: parsed.data as any,
      include: { category: true },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("[Product PUT Error]:", error);
    return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const { slug } = await params;
    await prisma.product.update({
      where: { id: slug },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Produk dinonaktifkan" });
  } catch (error: any) {
    console.error("[Product DELETE Error]:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}
