import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VerifyOtpSchema } from "@/lib/security";
import { createCustomerToken, CUSTOMER_COOKIE_NAME } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Data OTP tidak valid" }, { status: 400 });
    }

    let { phone, code, name } = parsed.data;
    phone = phone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);
    else if (phone.startsWith("8")) phone = "62" + phone;

    // Find the latest unexpired OTP for this phone
    const latestOtp = await prisma.customerOtp.findFirst({
      where: {
        phone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!latestOtp) {
      return NextResponse.json(
        { error: "Kode OTP telah kedaluwarsa atau belum diminta. Silakan kirim ulang OTP." },
        { status: 400 }
      );
    }

    // Verify hash
    const isValid = await bcrypt.compare(code, latestOtp.codeHash);
    if (!isValid) {
      return NextResponse.json({ error: "Kode OTP salah. Harap periksa kembali pesan WhatsApp Anda." }, { status: 400 });
    }

    // Mark OTP as verified
    await prisma.customerOtp.update({
      where: { id: latestOtp.id },
      data: { verified: true },
    });

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      const defaultName = name?.trim() || `Pelanggan ${phone.slice(-4)}`;
      customer = await prisma.customer.create({
        data: {
          phone,
          name: defaultName,
          role: "CUSTOMER",
        },
      });
    }

    // Issue JWT Token
    const token = createCustomerToken({
      id: customer.id,
      phone: customer.phone,
      name: customer.name,
      email: customer.email,
      role: customer.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Berhasil masuk ke akun EugineStore",
      customer: {
        id: customer.id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        province: customer.province,
        city: customer.city,
        district: customer.district,
        postalCode: customer.postalCode,
      },
    });

    // Set secure cookie
    response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("[OTP Verify Error]:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat memverifikasi OTP" }, { status: 500 });
  }
}
