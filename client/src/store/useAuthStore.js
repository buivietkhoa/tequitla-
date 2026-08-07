"use client";

import { create } from "zustand";
import api, { getErrorMessage } from "@/lib/api-client";
import useCartStore from "./useCartStore";

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, isLoading: false, isInitialized: true });
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  login: async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      set({ user: data.user });
      await useCartStore.getState().mergeGuestCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },

  register: async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      set({ user: data.user });
      await useCartStore.getState().mergeGuestCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null });
    }
  },

  forgotPassword: async (email) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  },
}));

export default useAuthStore;
