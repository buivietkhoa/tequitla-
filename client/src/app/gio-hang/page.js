"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const user = useAuthStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const guestItems = useCartStore((state) => state.guestItems);
  const loadGuestCart = useCartStore((state) => state.loadGuestCart);
  const updateGuestItem = useCartStore((state) => state.updateGuestItem);
  const removeGuestItem = useCartStore((state) => state.removeGuestItem);

  useEffect(() => {
    if (user) fetchCart();
    else loadGuestCart();
  }, [user, fetchCart, loadGuestCart]);

  const items = user ? cart?.items || [] : guestItems;
  const itemKey = (item) => item._id || item.key;
  const handleUpdate = (item, quantity) =>
    user ? updateItem(item._id, quantity) : updateGuestItem(item.key, quantity);
  const handleRemove = (item) =>
    user ? removeItem(item._id) : removeGuestItem(item.key);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg font-medium">Giỏ hàng của bạn đang trống</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Giỏ hàng</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={itemKey(item)} className="flex gap-4 rounded-lg border border-neutral-200 p-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={item.product?.images?.[0] || "/placeholder.svg"}
                  alt={item.product?.name || "Sản phẩm"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/san-pham/${item.product?.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {item.product?.name}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {item.size} / {item.color}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-neutral-300">
                    <button
                      className="h-8 w-8"
                      onClick={() => handleUpdate(item, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      className="h-8 w-8"
                      onClick={() => handleUpdate(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item)}
                aria-label="Xóa sản phẩm"
                className="self-start text-neutral-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-lg border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold">Tóm tắt đơn hàng</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-neutral-500">Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">Phí vận chuyển tính ở bước thanh toán</p>
          <Link
            href="/thanh-toan"
            className="mt-4 block rounded-full bg-black py-3 text-center text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Tiến hành thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
}
