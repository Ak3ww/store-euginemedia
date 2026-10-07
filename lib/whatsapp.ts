/**
 * EugineStore WhatsApp Bot Bridge
 * Connects directly to EugineBill-wa Baileys service (Port 4000 / 3002) on VPS
 * Supports automatic multi-endpoint failover & universal payload formatting
 */

const CANDIDATE_ENDPOINTS = [
  // 1. Explicit environment variable if configured
  process.env.WA_SERVICE_URL,
  // 2. EugineBill Baileys native service (PM2 process: EugineBill-wa, default port 4000)
  "http://127.0.0.1:4000/send",
  // 3. Alternative Baileys port 3002
  "http://127.0.0.1:3002/send",
  // 4. Alternative Express webhook wrapper
  "http://127.0.0.1:3002/api/send-message",
  // 5. Internal EugineBill proxy route
  "http://127.0.0.1:3000/api/whatsapp/send",
].filter(Boolean) as string[];

/**
 * Clean & normalize phone number to E.164 without plus sign (e.g., 628123456789)
 */
export function normalizePhoneNumber(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, "");
  if (cleaned.startsWith("620")) {
    cleaned = "62" + cleaned.substring(3);
  } else if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

/**
 * Send WhatsApp Message with Automatic Multi-Endpoint Failover
 */
export async function sendWhatsAppMessage(
  recipient: string,
  message: string
): Promise<{ success: boolean; endpoint?: string; error?: string }> {
  const cleanedPhone = normalizePhoneNumber(recipient);

  // Universal payload compatible with Baileys, Fonnte, MPWA, and Express wrappers
  const payload = {
    phone: cleanedPhone,
    recipient: cleanedPhone,
    target: cleanedPhone,
    to: cleanedPhone,
    message,
  };

  let lastError = "All endpoints failed";

  for (const endpoint of CANDIDATE_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000), // 4s timeout per candidate
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        // Verify response status
        if (data.status !== false && data.success !== false) {
          console.log(`[WA Bridge] Successfully sent message to ${cleanedPhone} via ${endpoint}`);
          return { success: true, endpoint };
        } else {
          lastError = data.message || data.error || `Rejected by ${endpoint}`;
          console.warn(`[WA Bridge] ${endpoint} returned error:`, lastError);
        }
      } else {
        const errText = await res.text().catch(() => `HTTP ${res.status}`);
        lastError = `HTTP ${res.status}: ${errText}`;
      }
    } catch (err: any) {
      lastError = err?.message || "Connection refused";
    }
  }

  console.warn(`[WA Bridge] Warning: Could not dispatch message to ${cleanedPhone}. Last error: ${lastError}`);
  return { success: false, error: lastError };
}

/**
 * Check WhatsApp Service Health & Connection Status
 */
export async function checkWhatsAppStatus(): Promise<{ connected: boolean; status: string; phone?: string }> {
  const statusEndpoints = [
    "http://127.0.0.1:4000/status",
    "http://127.0.0.1:3002/status",
  ];

  for (const url of statusEndpoints) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return {
          connected: data.connected === true || data.status === "connected",
          status: data.status || "connected",
          phone: data.phone,
        };
      }
    } catch {
      // Try next
    }
  }

  return { connected: false, status: "offline" };
}

/**
 * Format & Send OTP Message to Customer WhatsApp
 */
export async function sendOtpWhatsApp(phone: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  const message = `*EUGINESTORE — KODE VERIFIKASI* 🔐\n\nKode OTP login akun Anda:\n*${otpCode}*\n\nKode ini berlaku selama *5 menit*. Jangan berikan kode ini kepada siapapun demi keamanan transaksi Anda.\n\n_Pesan otomatis dikirim oleh EugineStore Security System_`;
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
  const itemsText = params.items
    .map((it, idx) => `${idx + 1}. ${it.name} (${it.quantity}x) — Rp ${(it.price * it.quantity).toLocaleString("id-ID")}`)
    .join("\n");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://store.euginemediagroup.com";
  let paymentInfo = "";

  if (params.paymentMethod === "QRIS") {
    paymentInfo = `\n💳 *Metode Pembayaran:* QRIS Dinamis (Otomatis Real-Time)\n📲 *Selesaikan Pembayaran:* ${appUrl}/orders/${params.orderNumber}`;
  } else {
    paymentInfo = `\n💳 *Metode Pembayaran:* Transfer Bank\n🏦 *BCA:* 1234-5678-90 a/n PT Eugine Media Group\n🏦 *Mandiri:* 133-00-1234567-8 a/n PT Eugine Media Group\nSetelah transfer, pesanan Anda akan segera diverifikasi oleh tim admin.`;
  }

  const message = `*EUGINESTORE — PESANAN BERHASIL DIBUAT* 🛍️\n\nHalo *${params.customerName}*,\nTerima kasih telah berbelanja di EugineStore! Pesanan Anda telah tercatat dengan detail berikut:\n\n📦 *No. Pesanan:* *${params.orderNumber}*\n💰 *Total Tagihan:* Rp ${params.totalAmount.toLocaleString("id-ID")}\n${paymentInfo}\n\n📋 *Rincian Barang:*\n${itemsText}\n\n🔗 *Lacak Pesanan:* ${appUrl}/orders/${params.orderNumber}\n\nJika ada pertanyaan mengenai pesanan, Anda dapat langsung membalas pesan WhatsApp ini.`;

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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://store.euginemediagroup.com";
  const message = `*EUGINESTORE — PESANAN SEDANG DIKIRIM* 🚚\n\nHalo *${params.customerName}*,\nKabar baik! Paket pesanan *${params.orderNumber}* telah diserahkan ke pihak ekspedisi dan sedang dalam perjalanan ke alamat Anda.\n\n📦 *Kurir Ekspedisi:* *${params.courier.toUpperCase()}*\n🏷️ *Nomor Resi:* *${params.trackingNumber}*\n\nAnda dapat memantau status pesanan kapan saja di tautan resmi berikut:\n${appUrl}/orders/${params.orderNumber}\n\nTerima kasih telah mempercayai EugineStore!`;

  await sendWhatsAppMessage(params.phone, message);
}
