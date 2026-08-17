"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import api from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/dang-nhap?next=/tai-khoan");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/orders/my")
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#111111]/10 pb-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-[#707072]">Tài khoản thành viên</p>
          <h1 className="text-[38px] font-semibold uppercase leading-none text-[#111111] sm:text-[56px]">
            Tài khoản
          </h1>
        </div>
        <Link
          href="/"
          className="motion-surface motion-press inline-flex h-11 items-center rounded-full border border-[#111111]/15 px-5 text-sm font-semibold hover:border-[#111111]"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="commerce-card p-5">
          <p className="text-xs font-semibold uppercase text-[#707072]">Hồ sơ</p>
          <p className="mt-3 text-lg font-semibold text-[#111111]">{user.name}</p>
          <p className="mt-1 text-sm text-[#707072]">{user.email}</p>
        </div>
        <div className="commerce-card p-5">
          <p className="text-xs font-semibold uppercase text-[#707072]">Đơn hàng</p>
          <p className="mt-3 text-3xl font-semibold text-[#111111]">{orders.length}</p>
        </div>
        <div className="commerce-card p-5">
          <p className="text-xs font-semibold uppercase text-[#707072]">Tổng chi tiêu</p>
          <p className="mt-3 text-2xl font-semibold text-[#111111]">{formatCurrency(totalSpent)}</p>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#707072]">Lịch sử</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111111]">Lịch sử đơn hàng</h2>
          </div>
        </div>

        {loading ? (
          <p className="commerce-card p-5 text-sm text-neutral-500">Đang tải...</p>
        ) : orders.length === 0 ? (
          <p className="commerce-card p-5 text-sm text-neutral-500">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/tai-khoan/don-hang/${order._id}`}
                className="commerce-card motion-surface flex items-center justify-between gap-4 p-5 hover:border-black"
              >
                <div>
                  <p className="text-sm font-semibold text-[#111111]">{order.orderCode}</p>
                  <p className="mt-1 text-xs font-medium uppercase text-[#707072]">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")} / {order.items.length} sản phẩm
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(order.totalPrice)}</p>
                  <p className="mt-1 text-xs font-medium uppercase text-[#707072]">{STATUS_LABEL[order.status]}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
