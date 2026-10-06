import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  weight: number; // in grams
  imageUrl?: string | null;
  category?: string;
  quantity: number;
}

interface CartStore {
  items: CartProduct[];
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (item: Omit<CartProduct, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotal: () => number;
  getItemCount: () => number;
  getTotalWeightGrams: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartDrawerOpen: false,

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              ),
              isCartDrawerOpen: true,
            };
          }
          return {
            items: [...state.items, { ...product, quantity }],
            isCartDrawerOpen: true,
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getTotalWeightGrams: () => {
        return get().items.reduce((total, item) => total + (item.weight || 500) * item.quantity, 0);
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "euginestore-cart",
    }
  )
);
