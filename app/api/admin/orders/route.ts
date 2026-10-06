import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (q) {
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
        { trackingNumber: { contains: q } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRevenue = orders
      .filter((o) => o.status === "PAID" || o.status === "PROCESSING" || o.status === "SHIPPED" || o.status === "COMPLETED")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);

    return NextResponse.json({
      success: true,
      orders,
      stats: {
        totalOrders: orders.length,
        totalRevenue,
        pending: orders.filter((o) => o.status === "PENDING").length,
        paid: orders.filter((o) => o.status === "PAID").length,
        shipped: orders.filter((o) => o.status === "SHIPPED").length,
        completed: orders.filter((o) => o.status === "COMPLETED").length,
      },
    });
  } catch (error: any) {
    console.error("[Admin Orders GET Error]:", error);
    return NextResponse.json({ error: "Gagal memuat daftar pesanan" }, { status: 500 });
  }
}
