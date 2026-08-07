"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

const STATUSES = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      setLoading(true);
      try {
        const { data } = await api.get("/orders/admin/all");
        if (!ignore) setOrders(data.orders);
      } catch (error) {
        if (!ignore) toast.error(getErrorMessage(error));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleStatusChange(id, status) {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      toast.success("Đã cập nhật trạng thái");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Đơn hàng</h1>

      {loading ? (
        <p className="mt-6 text-sm text-neutral-500">Đang tải...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-2 pr-4">Mã đơn</th>
                <th className="py-2 pr-4">Khách hàng</th>
                <th className="py-2 pr-4">Tổng tiền</th>
                <th className="py-2 pr-4">Ngày đặt</th>
                <th className="py-2 pr-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-neutral-100">
                  <td className="py-3 pr-4 font-medium">{order.orderCode}</td>
                  <td className="py-3 pr-4">
                    <p>{order.user?.name}</p>
                    <p className="text-xs text-neutral-500">{order.user?.email}</p>
                  </td>
                  <td className="py-3 pr-4">{formatCurrency(order.totalPrice)}</td>
                  <td className="py-3 pr-4">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
