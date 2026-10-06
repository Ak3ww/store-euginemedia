import { z } from "zod";

// In-Memory Rate Limiter (Sliding Window)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, maxRequests: number, windowSeconds: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// -----------------------------------------------------------------------------
// Validation Schemas
// -----------------------------------------------------------------------------

// OTP Send Request
export const SendOtpSchema = z.object({
  phone: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(16, "Nomor WhatsApp maksimal 16 digit")
    .regex(/^[0-9+]+$/, "Format nomor WhatsApp tidak valid"),
});

// OTP Verify Request
export const VerifyOtpSchema = z.object({
  phone: z.string().min(9).max(16),
  code: z.string().length(6, "Kode OTP harus 6 digit angka").regex(/^[0-9]+$/, "OTP hanya boleh angka"),
  name: z.string().optional(),
});

// Checkout Order Request
export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  customerPhone: z.string().min(9, "Nomor WhatsApp minimal 9 digit"),
  customerEmail: z.string().email("Format email tidak valid").optional().nullable(),
  
  // Mandatory Address
  shippingAddress: z.string().min(8, "Alamat lengkap pengiriman wajib diisi"),
  province: z.string().min(2, "Provinsi wajib diisi"),
  city: z.string().min(2, "Kota / Kabupaten wajib diisi"),
  district: z.string().min(2, "Kecamatan wajib diisi"),
  postalCode: z.string().min(4, "Kode pos minimal 4 digit").optional().nullable(),

  // Shipping
  courier: z.string().default("JNE"),
  courierService: z.string().default("REG"),
  shippingCost: z.number().nonnegative(),
  notes: z.string().optional().nullable(),

  paymentMethod: z.enum(["QRIS", "BANK_TRANSFER"]).default("QRIS"),

  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive("Jumlah minimal 1"),
      })
    )
    .min(1, "Keranjang belanja tidak boleh kosong"),
});

// Admin Product Create / Update Schema
export const ProductSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  slug: z.string().min(2),
  sku: z.string().optional().nullable(),
  description: z.string().min(10, "Deskripsi produk wajib diisi"),
  specifications: z.record(z.string(), z.any()).optional().nullable(),
  price: z.number().positive("Harga produk harus positif"),
  originalPrice: z.number().optional().nullable(),
  weight: z.number().positive("Berat produk dalam gram harus positif"),
  stock: z.number().int().nonnegative("Stok tidak boleh negatif"),
  imageUrl: z.string().optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  categoryId: z.string(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  shopeeUrl: z.string().url("URL Shopee tidak valid").optional().nullable().or(z.literal("")),
  tokopediaUrl: z.string().url("URL Tokopedia tidak valid").optional().nullable().or(z.literal("")),
  tiktokUrl: z.string().url("URL TikTok tidak valid").optional().nullable().or(z.literal("")),
});
