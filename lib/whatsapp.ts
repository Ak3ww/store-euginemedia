/**
 * EugineStore WhatsApp Bot Bridge
 * Connects directly to local EugineBill-wa service on VPS port 3002
 */

interface SendMessagePayload {
  recipient: string;
  message: string;
}

export async function sendWhatsAppMessage(recipient: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const waUrl = process.env.WA_SERVICE_URL || "http://127.0.0.1:3002/api/send-message";
    
    // Normalize recipient format: Ensure format is e.g. 628123456789 (strip leading 0 or +)
    let cleanedPhone = recipient.replace(/\D/g, "");
    if (cleanedPhone.startsWith("0")) {
      cleanedPhone = "62" + cleanedPhone.slice(1);
    } else if (cleanedPhone.startsWith("8")) {
      cleanedPhone = "62" + cleanedPhone;
    }

    const res = await fetch(waUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: cleanedPhone,
        message,
      }),
      // Set 5s timeout so store checkout doesn't hang if WA is offline
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "HTTP Error");
      console.warn(`[WA Bridge] Failed to send message to ${cleanedPhone}: ${res.status} ${errText}`);
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (err: any) {
    console.warn(`[WA Bridge] Error dispatching WA message: ${err?.message || err}`);
    return { success: false, error: err?.message };
  }
}

/**
 * Format & Send OTP Message
 */
export async function sendOtpWhatsApp(phone: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  const message = `*EUGINESTORE — KODE VERIFIKASI*\n\nKode OTP login Anda: *${otpCode}*\n\nKode berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun termasuk pihak Eugine Media Group demi keamanan akun Anda.\n\n_Pesan otomatis dikirim oleh EugineStore Security System_`;
  return sendWhatsAppMessage(phone, message);
}

/**
 * Format & Send Order Notification to Customer
 */
export async function sendOrderNotificationWhatsApp(params: {
  phone: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  paymentMethod: string;
  qrisUrl?: string;
}): Promise<void> {
  const itemsText = params.items.map((it, idx) => `${idx + 1}. ${it.name} (${it.quantity}x) — Rp ${(it.price * it.quantity).toLocaleString("id-ID")}`).join("\n");
  
  let paymentInfo = "";
  if (params.paymentMethod === "QRIS") {
    paymentInfo = `\n💳 *Metode:* QRIS Real-Time (Otomatis)\n📲 *Cek & Bayar QRIS:* ${process.env.NEXT_PUBLIC_APP_URL || "https://store.euginemediagroup.com"}/orders/${params.orderNumber}`;
  } else {
    paymentInfo = `\n💳 *Metode:* Transfer Bank Manual\n🏦 *BCA:* 1234567890 a/n PT Eugine Media Group\n🏦 *Mandiri:* 1330012345678 a/n PT Eugine Media Group\nSetelah transfer, harap upload bukti pembayaran di halaman order.`;
  }

  const message = `*EUGINESTORE — PESANAN BERHASIL DIBUAT* 🛍️\n\nHalo *${params.customerName}*,\nTerima kasih telah berbelanja di EugineStore! Pesanan Anda telah tercatat dengan detail berikut:\n\n📦 *No. Pesanan:* ${params.orderNumber}\n💰 *Total Pembayaran:* Rp ${params.totalAmount.toLocaleString("id-ID")}\n${paymentInfo}\n\n📋 *Rincian Barang:*\n${itemsText}\n\n🔗 *Lacak Pesanan:* ${process.env.NEXT_PUBLIC_APP_URL || "https://store.euginemediagroup.com"}/orders/${params.orderNumber}\n\nJika ada pertanyaan teknis atau bantuan, silakan balas pesan ini.`;

  await sendWhatsAppMessage(params.phone, message);
}

/**
 * Format & Send Shipping Resi Alert to Customer
 */
export async function sendShippingResiWhatsApp(params: {
  phone: string;
  orderNumber: string;
  customerName: string;
  courier: string;
  trackingNumber: string;
}): Promise<void> {
  const message = `*EUGINESTORE — PESANAN SEDANG DIKIRIM* 🚚\n\nHalo *${params.customerName}*,\nKabar baik! Paket Anda untuk pesanan *${params.orderNumber}* telah diserahkan ke kurir dan sedang dalam perjalanan.\n\n📦 *Kurir Ekspedisi:* ${params.courier.toUpperCase()}\n🏷️ *Nomor Resi:* *${params.trackingNumber}*\n\nAnda dapat melacak posisi barang di website ekspedisi atau di tautan berikut:\n${process.env.NEXT_PUBLIC_APP_URL || "https://store.euginemediagroup.com"}/orders/${params.orderNumber}\n\nTerima kasih telah mempercayai EugineStore!`;

  await sendWhatsAppMessage(params.phone, message);
}
