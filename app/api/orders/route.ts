import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { CreateOrderSchema } from "@/lib/security";
import { createOrderQris } from "@/lib/qrin";
import { sendOrderNotificationWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Silakan masuk ke akun Anda terlebih dahulu sebelum melakukan checkout." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data formulir pesanan tidak lengkap" },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      province,
      city,
      district,
      postalCode,
      courier,
      courierService,
      shippingCost,
      notes,
      paymentMethod,
      items,
    } = parsed.data;

    // 1. Fetch products & validate stock
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: "Satu atau lebih produk tidak ditemukan atau sudah tidak aktif" }, { status: 400 });
    }

    let subtotalAmount = 0;
    let totalWeight = 0;
    const orderItemsData: any[] = [];
    const notificationItems: Array<{ name: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const prod = dbProducts.find((p) => p.id === item.productId);
      if (!prod) continue;

      if (prod.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stok produk "${prod.name}" tidak mencukupi (Tersisa: ${prod.stock})` },
          { status: 400 }
        );
      }

      const itemSubtotal = prod.price * item.quantity;
      subtotalAmount += itemSubtotal;
      totalWeight += prod.weight * item.quantity;

      orderItemsData.push({
        productId: prod.id,
        productName: prod.name,
        price: prod.price,
        quantity: item.quantity,
        weight: prod.weight,
        subtotal: itemSubtotal,
      });

      notificationItems.push({
        name: prod.name,
        quantity: item.quantity,
        price: prod.price,
      });
    }

    const totalAmount = subtotalAmount + shippingCost;

    // 2. Generate Order Number: ES-YYMM-RANDOM
    const now = new Date();
    const yearMonth = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ES-${yearMonth}-${randomSuffix}`;

    // 3. Auto-save customer address to profile
    await prisma.customer.update({
      where: { id: session.id },
      data: {
        name: customerName,
        address: shippingAddress,
        province,
        city,
        district,
        postalCode,
      },
    });

    // 4. Generate QRIS if payment method is QRIS
    let qrisString: string | null = null;
    let qrisInvoiceId: string | null = null;

    if (paymentMethod === "QRIS") {
      const qrisResult = await createOrderQris({
        orderNumber,
        totalAmount,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        productNames: notificationItems.map((it) => `${it.name} (x${it.quantity})`),
      });

      qrisString = qrisResult.qrisString;
      qrisInvoiceId = qrisResult.invoiceId;
    }

    // 5. Create Order in Database (with atomic stock deduction)
    const order = await prisma.$transaction(async (tx) => {
      // Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create order
      return tx.order.create({
        data: {
          orderNumber,
          customerId: session.id,
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          province,
          city,
          district,
          postalCode,
          courier,
          courierService,
          shippingCost,
          totalWeight,
          subtotalAmount,
          totalAmount,
          status: "PENDING",
          paymentMethod,
          qrisString,
          qrisInvoiceId,
          notes,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });
    });

    // 6. Send WhatsApp Notification asynchronously (non-blocking)
    sendOrderNotificationWhatsApp({
      phone: customerPhone,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      items: notificationItems,
      paymentMethod,
      qrisUrl: qrisString || undefined,
    }).catch((err) => console.warn("[WA Alert Error]:", err));

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat",
      orderNumber: order.orderNumber,
      order,
    });
  } catch (error: any) {
    console.error("[Create Order Error]:", error);
    return NextResponse.json({ error: "Gagal membuat pesanan" }, { status: 500 });
  }
}
