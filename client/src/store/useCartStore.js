"use client";

import { create } from "zustand";
import api, { getErrorMessage } from "@/lib/api-client";
import { getDisplayPrice } from "@/lib/format";

const GUEST_CART_KEY = "shmily_guest_cart";

function persistGuestCart(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

const useCartStore = create((set, get) => ({
  cart: null,
  guestItems: [],
  isLoading: false,

  itemCount: () => {
    const cart = get().cart;
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  guestItemCount: () => {
    return get().guestItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Guest (not-logged-in) cart is kept in localStorage only. It exists so people
  // can browse and build up a cart before being asked to log in at checkout.
  loadGuestCart: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      set({ guestItems: raw ? JSON.parse(raw) : [] });
    } catch {
      set({ guestItems: [] });
    }
  },

  addGuestItem: (product, variant, quantity = 1) => {
    const key = `${product._id}:${variant._id}`;
    const items = get().guestItems.map((item) => ({ ...item }));
    const existing = items.find((item) => item.key === key);
    const requestedQty = (existing?.quantity || 0) + quantity;

    if (requestedQty > variant.stock) {
      return { success: false, message: "Số lượng tồn kho không đủ" };
    }

    const price = getDisplayPrice(product);

    if (existing) {
      existing.quantity = requestedQty;
    } else {
      items.push({
        key,
        productId: product._id,
        variantId: variant._id,
        size: variant.size,
        color: variant.color,
        quantity,
        price,
        stock: variant.stock,
        product: { name: product.name, slug: product.slug, images: product.images },
      });
    }

    set({ guestItems: items });
    persistGuestCart(items);
    return { success: true };
  },

  updateGuestItem: (key, quantity) => {
    const items = get()
      .guestItems.map((item) => (item.key === key ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    set({ guestItems: items });
    persistGuestCart(items);
  },

  removeGuestItem: (key) => {
    const items = get().guestItems.filter((item) => item.key !== key);
    set({ guestItems: items });
    persistGuestCart(items);
  },

  clearGuestCart: () => {
    set({ guestItems: [] });
    persistGuestCart([]);
  },

  // Called right after a successful login/register: pushes every locally-held
  // guest item into the user's server cart, then discards the local copy.
  // Items rejected by the server (e.g. gone out of stock) are simply skipped.
  mergeGuestCart: async () => {
    const guestItems = get().guestItems;
    if (guestItems.length > 0) {
      for (const item of guestItems) {
        try {
          await api.post("/cart/items", {
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          });
        } catch {
          // skip items the server rejects; the rest still merge
        }
      }
      set({ guestItems: [] });
      persistGuestCart([]);
    }
    await get().fetchCart();
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/cart");
      set({ cart: data.cart, isLoading: false });
    } catch {
      set({ cart: null, isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    try {
      const { data } = await api.post("/cart/items", { productId, variantId, quantity });
      set({ cart: data.cart });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
      set({ cart: data.cart });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      set({ cart: data.cart });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },

  clearCart: async () => {
    try {
      await api.delete("/cart");
      set({ cart: { items: [] } });
    } catch {
      // no-op: cart will resync on next fetchCart()
    }
  },
}));

export default useCartStore;
