"use client";

import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, Package, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t placed any orders yet. Start exploring our catalog!
            </p>
            <div className="mt-4">
              <Link href="/products">
                <Button size="sm">Browse Products</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Your account is secured with email authentication.
            </p>
            <div className="mt-4">
              <Link href="/auth/forgot-password">
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
