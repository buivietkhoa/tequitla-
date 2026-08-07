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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Tài khoản của tôi</h1>
      <div className="mt-2 text-sm text-neutral-600">
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Lịch sử đơn hàng</h2>
      {loading ? (
        <p className="mt-4 text-sm text-neutral-500">Đang tải...</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/tai-khoan/don-hang/${order._id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:border-black"
            >
              <div>
                <p className="text-sm font-medium">{order.orderCode}</p>
                <p className="text-xs text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")} · {order.items.length} sản phẩm
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(order.totalPrice)}</p>
                <p className="text-xs text-neutral-500">{STATUS_LABEL[order.status]}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
