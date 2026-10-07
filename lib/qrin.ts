import crypto from "crypto";

export const DEFAULT_QRIN_TOKEN = "m92MHzOlx477ByAsa2Ul0qzZv7z0zU3eqhUTuhN0GmpkcAZA895vqwUBAbirsyeN";

export function getQrinToken(): string {
  return process.env.QRIN_TOKEN || DEFAULT_QRIN_TOKEN;
}

export interface QrinTransactionPayload {
  no_ref_merchant: string;
  amount_value: number;
  amount_currency: string;
  product_details: string; // JSON string of array
  validity: string; // Minutes e.g. "120"
  additional_info?: {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  };
}

export interface QrinCreateResult {
  success: boolean;
  message?: string;
  data?: {
    no_ref_merchant?: string;
    amount_value?: number;
    merchant_cost?: number;
    customer_cost?: number;
    amount_received?: number;
    amount_currency?: string;
    transaction_status?: string;
    qris_data?: string;
    qr_string?: string;
    qris_string?: string;
    qr_url?: string;
    storeId?: string;
    nmid?: string;
    id_transaksi?: string;
    va_bank?: string | null;
    va_number?: string | null;
    payment_url?: string;
  };
}

export function createQrinClient(tokenQrin: string = getQrinToken()) {
  const baseUrl = "https://qrin.web.id/api";

  return {
    getPaymentMethods: async () => {
      const res = await fetch(`${baseUrl}/get-payment-method`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_qrin: tokenQrin }),
      });
      return res.json();
    },

    createTransaction: async (
      paymentMethod: string,
      payload: QrinTransactionPayload
    ): Promise<QrinCreateResult> => {
      const requestBody = {
        token_qrin: tokenQrin,
        payment_method: paymentMethod.toLowerCase(),
        request_payload: payload,
      };

      const res = await fetch(`${baseUrl}/create-transaksi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      return res.json();
    },

    verifyCallbackSignature: (rawBody: string, signature: string) => {
      if (!signature) return false;
      try {
        const expectedHmac = crypto
          .createHmac("sha256", tokenQrin)
          .update(rawBody)
          .digest("hex");
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac));
      } catch (err) {
        return false;
      }
    },
  };
}

/**
 * Universal helper to create QRIS payment for EugineStore orders
 */
export async function createOrderQris(params: {
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productNames: string[];
}): Promise<{ qrisString: string | null; invoiceId: string | null; rawData?: any }> {
  try {
    const client = createQrinClient();
    const details = params.productNames.length > 0 
      ? params.productNames 
      : [`Pesanan EugineStore ${params.orderNumber}`];

    const res = await client.createTransaction("qris", {
      no_ref_merchant: params.orderNumber,
      amount_value: params.totalAmount,
      amount_currency: "IDR",
      product_details: JSON.stringify(details),
      validity: "120", // 2 hours validity
      additional_info: {
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        customer_email: params.customerEmail || undefined,
      },
    });

    if (res && (res.success || res.message === "SUCCESS") && res.data) {
      const d = res.data;
      const qrisString = d.qris_data || d.qr_string || d.qris_string || d.qr_url || null;
      const invoiceId = d.nmid || d.id_transaksi || d.no_ref_merchant || null;
      return { qrisString, invoiceId, rawData: d };
    }
    console.warn("[QRIN Create Failed]:", res?.message || "Unknown error", res);
    return { qrisString: null, invoiceId: null, rawData: res };
  } catch (error) {
    console.error("[QRIN Create Exception]:", error);
    return { qrisString: null, invoiceId: null };
  }
}
