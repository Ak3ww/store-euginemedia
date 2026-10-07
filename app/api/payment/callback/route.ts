import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getQrinToken, createQrinClient } from "@/lib/qrin";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

/**
 * Payment Gateway Webhook Receiver (QRIN / Midtrans Style)
 * URL: https://store.euginemediagroup.com/api/payment/callback
 * Also aliased at: /handle-qrin
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-callback-signature") || req.headers.get("x-signature") || "";

    const tokenQrin = getQrinToken();
    if (tokenQrin && signature) {
      const qrin = createQrinClient(tokenQrin);
      const isVerified = qrin.verifyCallbackSignature(rawBody, signature);
      if (!isVerified && process.env.NODE_ENV === "production") {
        console.warn("[Webhook] Invalid HMAC signature rejected");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Extract Order Reference and Status
    const orderNumber = payload.no_ref_merchant || payload.order_id || payload.data?.no_ref_merchant;
    const paymentStatus = (payload.status || payload.transaction_status || payload.data?.status || "").toUpperCase();

    if (!orderNumber) {
      return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
    }

    // 1. Fetch Order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { customer: true, items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Idempotency Check: If already PAID, ignore duplicate notification safely
    if (order.status === "PAID" || order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "COMPLETED") {
      return NextResponse.json({ success: true, message: "Order already fulfilled" });
    }

    // 3. Process Status
    if (paymentStatus === "SUCCESS" || paymentStatus === "PAID" || paymentStatus === "SETTLEMENT") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // Send WhatsApp confirmation
      const waMsg = `*PEMBAYARAN DITERIMA* ✅\n\nHalo *${order.customerName}*,\nPembayaran sebesar *Rp ${order.totalAmount.toLocaleString("id-ID")}* untuk pesanan *${order.orderNumber}* telah berhasil kami verifikasi.\n\nPesanan Anda sekarang sedang disiapkan oleh tim logistik EugineStore.\n\nTerima kasih telah berbelanja di EugineStore!`;
      sendWhatsAppMessage(order.customerPhone, waMsg).catch((err) => console.warn("[Webhook WA Error]:", err));

      return NextResponse.json({ success: true, message: "Payment settled successfully" });
    } else if (paymentStatus === "EXPIRED" || paymentStatus === "CANCELLED") {
      // Restore Stock atomically if expired or cancelled
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        });
      });

      return NextResponse.json({ success: true, message: "Order cancelled and stock restored" });
    }

    return NextResponse.json({ success: true, message: "Webhook acknowledged" });
  } catch (error: any) {
    console.error("[Payment Webhook Error]:", error);
    return NextResponse.json({ error: "Internal webhook processing error" }, { status: 500 });
  }
}
