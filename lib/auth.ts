import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "euginestore-super-secure-jwt-secret-2026";
const CUSTOMER_COOKIE_NAME = "euginestore_customer_token";
const ADMIN_COOKIE_NAME = "euginestore_admin_token";

export interface CustomerSession {
  id: string;
  phone: string;
  name: string;
  email?: string | null;
  role: string;
}

export interface AdminSession {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

// -----------------------------------------------------------------------------
// Passwords
// -----------------------------------------------------------------------------
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

// -----------------------------------------------------------------------------
// Customer Session
// -----------------------------------------------------------------------------
export function createCustomerToken(payload: CustomerSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyCustomerToken(token: string): CustomerSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as CustomerSession;
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}

// -----------------------------------------------------------------------------
// Admin Session
// -----------------------------------------------------------------------------
export function createAdminToken(payload: AdminSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export { CUSTOMER_COOKIE_NAME, ADMIN_COOKIE_NAME };
