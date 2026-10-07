import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { sendShippingResiWhatsApp, sendWhatsAppMessage } from "@/lib/whatsapp";
import { z } from "zod";

const UpdateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]),
  trackingNumber: z.string().optional().nullable(),
  notifyWhatsApp: z.boolean().default(true),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Data status tidak valid" }, { status: 400 });
    }

    const { status, trackingNumber, notifyWhatsApp } = parsed.data;

    const existing = await prisma.order.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const updateData: any = { status };
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }
    if (status === "PAID" && !existing.paidAt) {
      updateData.paidAt = new Date();
    }
    if (status === "SHIPPED" && !existing.shippedAt) {
      updateData.shippedAt = new Date();
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // Send automated WhatsApp notifications
    if (status === "PAID" && notifyWhatsApp) {
      const waMsg = `*PEMBAYARAN TERVERIFIKASI* ✅\n\nHalo *${updated.customerName}*,\nPembayaran sebesar *Rp ${updated.totalAmount.toLocaleString("id-ID")}* untuk pesanan *${updated.orderNumber}* telah kami verifikasi.\n\nPesanan Anda sekarang sedang dipersiapkan oleh tim logistik EugineStore.\n\nTerima kasih telah berbelanja di EugineStore!`;
      sendWhatsAppMessage(updated.customerPhone, waMsg).catch((err) => console.warn("[WA Paid Alert Error]:", err));
    }

    if (status === "SHIPPED" && trackingNumber && notifyWhatsApp) {
      sendShippingResiWhatsApp({
        phone: updated.customerPhone,
        orderNumber: updated.orderNumber,
        customerName: updated.customerName,
        courier: updated.courier || "JNE",
        trackingNumber,
      }).catch((err) => console.warn("[WA Resi Alert Error]:", err));
    }

    return NextResponse.json({
      success: true,
      message: "Status pesanan berhasil diperbarui",
      order: updated,
    });
  } catch (error: any) {
    console.error("[Admin Order Status Error]:", error);
    return NextResponse.json({ error: "Gagal memperbarui status pesanan" }, { status: 500 });
  }
}
