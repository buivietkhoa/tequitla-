"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";

export default function Providers({ children }) {
  const init = useAuthStore((state) => state.init);
  const user = useAuthStore((state) => state.user);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const loadGuestCart = useCartStore((state) => state.loadGuestCart);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (user) fetchCart();
    else loadGuestCart();
  }, [user, fetchCart, loadGuestCart]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            return;
          }

          entry.target.classList.remove("aos-animate");
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    const observeElement = (element) => {
      if (!(element instanceof HTMLElement)) return;
      if (!element.matches("[data-aos]")) return;
      observer.observe(element);
    };

    document.querySelectorAll("[data-aos]").forEach(observeElement);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          observeElement(node);
          node.querySelectorAll?.("[data-aos]").forEach(observeElement);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [children]);

  return (
    <>
      {children}
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
    </>
  );
}
