import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SendOtpSchema, checkRateLimit } from "@/lib/security";
import { sendOtpWhatsApp } from "@/lib/whatsapp";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // Rate limit: Max 4 OTP requests per 10 minutes per IP
    const rl = checkRateLimit(`otp:${ip}`, 4, 600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan OTP. Harap tunggu beberapa menit." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = SendOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Format nomor WhatsApp tidak valid" }, { status: 400 });
    }

    let { phone } = parsed.data;
    phone = phone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);
    else if (phone.startsWith("8")) phone = "62" + phone;

    // Generate random 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Store in database
    await prisma.customerOtp.create({
      data: {
        phone,
        codeHash,
        expiresAt,
      },
    });

    // Send via WhatsApp
    const sendResult = await sendOtpWhatsApp(phone, rawOtp);

    // If local dev or WA service offline, log to console
    if (!sendResult.success) {
      console.log(`[DEV OTP FALLBACK] Phone: ${phone} | Code: ${rawOtp}`);
    }

    return NextResponse.json({
      success: true,
      message: "Kode OTP 6-digit telah dikirimkan ke nomor WhatsApp Anda.",
      phoneFormatted: phone,
    });
  } catch (error: any) {
    console.error("[OTP Send Error]:", error);
    return NextResponse.json({ error: "Gagal mengirimkan kode OTP" }, { status: 500 });
  }
}
