"use client";

import { Suspense, useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api-client";
import useAuthStore from "@/store/useAuthStore";
import { formatCurrency } from "@/lib/format";

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const PAYMENT_METHOD_LABEL = {
  COD: "Thanh toán khi nhận hàng",
  VNPAY: "VNPay",
  MOMO: "Momo",
};

function OrderDetailContent({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingWith, setPayingWith] = useState(null);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [id, user]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") toast.success("Thanh toán thành công");
    else if (payment === "failed") toast.error("Thanh toán không thành công, vui lòng thử lại");
    else if (payment === "invalid") toast.error("Không xác thực được kết quả thanh toán");
  }, [searchParams]);

  async function handleCancel() {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder(data.order);
      toast.success("Đã hủy đơn hàng");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handlePayNow(method) {
    setPayingWith(method);
    try {
      const endpoint =
        method === "VNPAY" ? "/payments/vnpay/create-payment-url" : "/payments/momo/create-payment-url";
      const { data } = await api.post(endpoint, { orderId: id });
      window.location.href = data.paymentUrl;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setPayingWith(null);
    }
  }

  if (loading) return <p className="mx-auto max-w-3xl px-4 py-8 text-sm">Đang tải...</p>;
  if (!order) return <p className="mx-auto max-w-3xl px-4 py-8 text-sm">Không tìm thấy đơn hàng.</p>;

  const canCancel = ["pending", "confirmed"].includes(order.status);
  const canRetryPayment = canCancel && order.paymentMethod !== "COD" && !order.isPaid;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/tai-khoan" className="text-sm text-neutral-500 hover:underline">
        ← Quay lại tài khoản
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">Đơn hàng {order.orderCode}</h1>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 p-4">
        <h2 className="text-sm font-semibold">Địa chỉ giao hàng</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {order.shippingAddress.fullName} · {order.shippingAddress.phone}
        </p>
        <p className="text-sm text-neutral-600">
          {order.shippingAddress.detail}, {order.shippingAddress.city}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between rounded-lg border border-neutral-200 p-4 text-sm">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-neutral-500">
                {item.size} / {item.color} × {item.quantity}
              </p>
            </div>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 rounded-lg border border-neutral-200 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Tạm tính</span>
          <span>{formatCurrency(order.itemsPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Phí vận chuyển</span>
          <span>{order.shippingPrice === 0 ? "Miễn phí" : formatCurrency(order.shippingPrice)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Tổng cộng</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-neutral-500">Thanh toán</span>
          <span>
            {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
            {order.paymentMethod !== "COD" && (
              <span className={order.isPaid ? "ml-2 text-green-600" : "ml-2 text-amber-600"}>
                ({order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"})
              </span>
            )}
          </span>
        </div>
      </div>

      {(canRetryPayment || canCancel) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {canRetryPayment && (
            <button
              onClick={() => handlePayNow(order.paymentMethod)}
              disabled={payingWith !== null}
              className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:bg-neutral-300"
            >
              {payingWith ? "Đang chuyển đến cổng thanh toán..." : `Thanh toán qua ${PAYMENT_METHOD_LABEL[order.paymentMethod]}`}
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              className="rounded-full border border-red-600 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage(props) {
  return (
    <Suspense>
      <OrderDetailContent {...props} />
    </Suspense>
  );
}
