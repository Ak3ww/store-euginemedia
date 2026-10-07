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
  role?: string;
  // Legacy compatibility fields
  firstName?: string;
  lastName?: string;
}

interface AuthStore {
  user: CustomerUser | null;
  isLoading: boolean;
  setUser: (user: CustomerUser | null) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<CustomerUser | null>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => {
        if (!user) {
          set({ user: null });
          return;
        }
        // Normalize name into firstName & lastName for compatibility
        const nameParts = (user.name || "").trim().split(" ");
        const firstName = nameParts[0] || user.name;
        const lastName = nameParts.slice(1).join(" ") || "";

        set({
          user: {
            ...user,
            firstName,
            lastName,
          },
        });
      },

      checkSession: async () => {
        try {
          const res = await fetch("/api/auth/me");
          const data = await res.json();
          if (data.authenticated && data.customer) {
            const c = data.customer;
            const nameParts = (c.name || "").trim().split(" ");
            const userObj: CustomerUser = {
              ...c,
              firstName: nameParts[0] || c.name,
              lastName: nameParts.slice(1).join(" ") || "",
            };
            set({ user: userObj });
            return userObj;
          } else {
            set({ user: null });
            return null;
          }
        } catch {
          return null;
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/me", { method: "POST" });
        } catch {}
        set({ user: null });
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      },
    }),
    {
      name: "euginestore-auth",
    }
  )
);
