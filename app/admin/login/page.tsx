"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || "Login gagal");
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#002c60] text-white flex items-center justify-center font-bold text-lg mx-auto mb-3 shadow-md">
            ES
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin EugineStore</h1>
          <p className="text-xs text-slate-400 mt-1">Masuk untuk mengelola katalog, pesanan & pengiriman</p>
        </div>

        {errorMsg && (
          <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700 text-xs rounded-lg">
            <AlertCircle className="w-4 h-4 mr-2" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username / Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@euginemediagroup.com"
                className="pl-9 h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-[#002c60] hover:bg-[#001f44] text-white font-bold text-xs rounded-lg shadow-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Masuk ke Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
