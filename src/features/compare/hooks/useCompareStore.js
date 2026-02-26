import { create } from "zustand";
import deepEqual from "../utils/compareUtils";

const useCompareStore = create((set, get) => ({
  compareList: [],
  addToCompareList: (product) => {
    const items = get().compareList;
    const existing = items.find((i) => deepEqual(i, product));
    if (existing) return; // don't add if identical

    if (items.length === 1 && items[0]?.category !== product?.category) {
      return;
    } else if (items.length >= 2) {
      const filtered = items.filter((_, index) => index !== 0);
      set({ compareList: [...filtered, product] });
      return;
    } else {
      set({ compareList: [...items, product] });
    }
  },
  removeFromCompareList: (productId) => {
    set((state) => ({
      compareList: state.compareList.filter((i) => i.id !== productId),
    }));
  },
  isInCompareList: (productId) =>
    get().compareList.some((i) => i.id === productId),
}));

export default useCompareStore;
