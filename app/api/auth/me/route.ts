import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, CUSTOMER_COOKIE_NAME, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        province: true,
        city: true,
        district: true,
        postalCode: true,
        role: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    return NextResponse.json({
      authenticated: true,
      customer,
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, customer: null });
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar" });
  response.cookies.delete(CUSTOMER_COOKIE_NAME);
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar" });
  response.cookies.delete(CUSTOMER_COOKIE_NAME);
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
