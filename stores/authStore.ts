import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  province?: string | null;
  city?: string | null;
  district?: string | null;
  postalCode?: string | null;
  role: string;
}

interface AuthStore {
  customer: CustomerUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  fetchCustomer: () => Promise<void>;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, code: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  updateAddress: (data: { name?: string; address: string; province: string; city: string; district: string; postalCode?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      isLoading: false,
      isAuthModalOpen: false,

      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      fetchCustomer: async () => {
        try {
          const res = await fetch("/api/auth/me");
          const data = await res.json();
          if (data.authenticated && data.customer) {
            set({ customer: data.customer });
          } else {
            set({ customer: null });
          }
        } catch {
          set({ customer: null });
        }
      },

      sendOtp: async (phone: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
          });
          const data = await res.json();
          set({ isLoading: false });
          if (!res.ok) return { success: false, error: data.error };
          return { success: true };
        } catch (err: any) {
          set({ isLoading: false });
          return { success: false, error: err?.message || "Gagal mengirim OTP" };
        }
      },

      verifyOtp: async (phone: string, code: string, name?: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/otp/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, code, name }),
          });
          const data = await res.json();
          set({ isLoading: false });
          if (!res.ok) return { success: false, error: data.error };

          set({ customer: data.customer, isAuthModalOpen: false });
          return { success: true };
        } catch (err: any) {
          set({ isLoading: false });
          return { success: false, error: err?.message || "Gagal verifikasi OTP" };
        }
      },

      updateAddress: async (addr) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/customer/address", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addr),
          });
          const data = await res.json();
          set({ isLoading: false });
          if (!res.ok) return { success: false, error: data.error };

          set((state) => ({
            customer: state.customer ? { ...state.customer, ...addr } : null,
          }));
          return { success: true };
        } catch (err: any) {
          set({ isLoading: false });
          return { success: false, error: err?.message || "Gagal menyimpan alamat" };
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/me", { method: "POST" });
        } catch {}
        set({ customer: null });
      },
    }),
    {
      name: "euginestore-auth",
    }
  )
);
