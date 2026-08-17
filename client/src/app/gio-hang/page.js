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
      <div className="mx-auto max-w-[760px] px-5 py-24 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase text-[#707072]">Giỏ hàng</p>
        <h1 className="mt-3 text-[38px] font-semibold uppercase leading-none text-[#111111] sm:text-[56px]">
          Giỏ hàng trống
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#707072]">
          Chọn thêm một vài item để hoàn thiện outfit của bạn.
        </p>
        <Link
          href="/"
          className="motion-surface motion-press mt-7 inline-flex h-12 items-center rounded-full bg-black px-7 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#111111]/10 pb-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-[#707072]">Giỏ hàng</p>
          <h1 className="text-[38px] font-semibold uppercase leading-none text-[#111111] sm:text-[56px]">
            Túi mua sắm
          </h1>
        </div>
        <p className="text-sm font-medium text-[#707072]">{items.length} item đang được chọn</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={itemKey(item)} className="commerce-card flex gap-4 p-4 sm:p-5">
              <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] sm:h-36 sm:w-28">
                <Image
                  src={item.product?.images?.[0] || "/placeholder.svg"}
                  alt={item.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/san-pham/${item.product?.slug}`}
                      className="text-sm font-semibold text-[#111111] hover:underline"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="mt-1 text-xs font-medium uppercase text-[#707072]">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    aria-label="Xóa sản phẩm"
                    className="motion-surface motion-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#111111]/10 text-neutral-400 hover:border-[#d30005] hover:text-[#d30005]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center rounded-full border border-[#111111]/15">
                    <button
                      className="h-9 w-9 text-lg disabled:cursor-not-allowed disabled:text-neutral-300"
                      disabled={item.quantity <= 1}
                      onClick={() => handleUpdate(item, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      className="h-9 w-9 text-lg"
                      onClick={() => handleUpdate(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-[#111111]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="commerce-card h-fit p-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase text-[#707072]">Tóm tắt</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111111]">Tổng đơn</h2>
          <div className="mt-6 space-y-3 border-y border-[#111111]/10 py-5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#707072]">Tạm tính</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs leading-5 text-[#707072]">Phí vận chuyển được tính ở bước thanh toán.</p>
          </div>
          <Link
            href="/thanh-toan"
            className="motion-surface motion-press mt-5 flex h-12 items-center justify-center rounded-full bg-black text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Tiến hành thanh toán
          </Link>
        </aside>
      </div>
    </div>
  );
}
