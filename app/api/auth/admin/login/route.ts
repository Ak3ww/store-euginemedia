import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { z } from "zod";

const AdminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AdminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Username atau password tidak valid" }, { status: 400 });
    }

    const { username, password } = parsed.data;

    const user = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Kredensial login admin salah" }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Kredensial login admin salah" }, { status: 401 });
    }

    const token = createAdminToken({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login admin berhasil",
      admin: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat login" }, { status: 500 });
  }
}
