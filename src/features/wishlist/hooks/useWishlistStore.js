import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (!existingItem) {
          set({ items: [...items, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set((store) => ({
          items: store.items.filter((item) => item.id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: "wishlist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export default useWishlistStore;
