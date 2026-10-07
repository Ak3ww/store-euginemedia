import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderQris } from "@/lib/qrin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const { orderNumber } = await params;

    let order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
      include: {
        items: {
          include: {
            product: {
              select: { imageUrl: true, slug: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Auto-generate QRIS dynamically if pending order doesn't have qrisString yet
    if (order.status === "PENDING" && (order.paymentMethod || "").toUpperCase() === "QRIS" && !order.qrisString) {
      try {
        const qrisResult = await createOrderQris({
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail || undefined,
          productNames: order.items.map((it: any) => `${it.productName} (x${it.quantity})`),
        });

        if (qrisResult.qrisString) {
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              qrisString: qrisResult.qrisString,
              qrisInvoiceId: qrisResult.invoiceId,
            },
            include: {
              items: {
                include: {
                  product: {
                    select: { imageUrl: true, slug: true },
                  },
                },
              },
            },
          });
        }
      } catch (err) {
        console.warn("[On-demand QRIS Gen Error]:", err);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("[Order Tracking Error]:", error);
    return NextResponse.json({ error: "Gagal memuat detail pesanan" }, { status: 500 });
  }
}
