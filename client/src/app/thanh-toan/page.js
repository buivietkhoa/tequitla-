"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import api, { getErrorMessage } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 500000;

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  const [form, setForm] = useState({ city: "", detail: "", note: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  useEffect(() => {
    if (searchParams.get("payment") === "invalid") {
      toast.error("Không xác thực được kết quả thanh toán, vui lòng thử lại");
    }
  }, [searchParams]);

  if (!isAuthLoading && !user) {
    router.replace("/dang-nhap?next=/thanh-toan");
    return null;
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const shippingForm = {
    fullName: form.fullName ?? user?.name ?? "",
    phone: form.phone ?? user?.phone ?? "",
    city: form.city ?? "",
    detail: form.detail ?? "",
    note: form.note ?? "",
  };

  function handleChange(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: shippingForm,
        paymentMethod,
      });
      const order = data.order;

      if (paymentMethod === "COD") {
        toast.success("Đặt hàng thành công!");
        router.push(`/tai-khoan/don-hang/${order._id}`);
        return;
      }

      const endpoint =
        paymentMethod === "VNPAY" ? "/payments/vnpay/create-payment-url" : "/payments/momo/create-payment-url";
      const { data: paymentData } = await api.post(endpoint, { orderId: order._id });
      window.location.href = paymentData.paymentUrl;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Thanh toán</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Thông tin giao hàng</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              name="fullName"
              value={shippingForm.fullName}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              required
              name="phone"
              value={shippingForm.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              required
              name="city"
              value={shippingForm.city}
              onChange={handleChange}
              placeholder="Tỉnh / Thành phố"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              required
              name="detail"
              value={shippingForm.detail}
              onChange={handleChange}
              placeholder="Địa chỉ cụ thể (số nhà, đường, phường/xã)"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <textarea
              name="note"
              value={shippingForm.note}
              onChange={handleChange}
              placeholder="Ghi chú (tuỳ chọn)"
              rows={2}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
            />
          </div>

          <h2 className="pt-2 text-sm font-semibold">Phương thức thanh toán</h2>
          <div className="space-y-2">
            {[
              { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
              { value: "VNPAY", label: "Thanh toán qua VNPay" },
              { value: "MOMO", label: "Thanh toán qua Momo" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${
                  paymentMethod === option.value
                    ? "border-black bg-neutral-50"
                    : "border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={() => setPaymentMethod(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white disabled:bg-neutral-300"
          >
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </form>

        <div className="h-fit space-y-3 rounded-lg border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold">Đơn hàng ({items.length} sản phẩm)</h2>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="truncate pr-2 text-neutral-600">
                {item.product?.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-neutral-200 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-neutral-500">Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
            </div>
            <div className="mt-2 flex justify-between text-base font-semibold">
              <span>Tổng cộng</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
