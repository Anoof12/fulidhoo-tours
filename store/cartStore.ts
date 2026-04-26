"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  itemId: string;
  excursionId: string;
  title: string;
  date: string;
  participants: number;
  pricePerPerson: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "itemId">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, participants: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, itemId: `${item.excursionId}-${item.date}` }],
        })),
      removeFromCart: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.itemId !== itemId),
        })),
      updateQuantity: (itemId, participants) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.itemId === itemId ? { ...item, participants } : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "fulidhoo-cart" },
  ),
);
