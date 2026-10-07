import { NextRequest, NextResponse } from "next/server";
import { trackOrderResi } from "@/lib/shipping-api";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courier = searchParams.get("courier") || "jne";
    const trackingNumber = searchParams.get("trackingNumber");
    const orderNumber = searchParams.get("orderNumber");

    let targetCourier = courier;
    let targetResi = trackingNumber;

    if (orderNumber && !targetResi) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        select: { courier: true, trackingNumber: true },
      });
      if (order && order.trackingNumber) {
        targetCourier = order.courier || targetCourier;
        targetResi = order.trackingNumber;
      }
    }

    if (!targetResi) {
      return NextResponse.json(
        { error: "Nomor resi pengiriman tidak ditemukan atau belum diinput" },
        { status: 400 }
      );
    }

    const result = await trackOrderResi(targetCourier, targetResi);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Tracking Route Error]:", error);
    return NextResponse.json(
      { error: "Gagal melacak nomor resi" },
      { status: 500 }
    );
  }
}
