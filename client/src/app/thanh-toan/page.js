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
    if (user) fetchCart();
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
    <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8">
      <div className="border-b border-[#111111]/10 pb-8">
        <p className="mb-3 text-xs font-semibold uppercase text-[#707072]">Thanh toán an toàn</p>
        <h1 className="text-[38px] font-semibold uppercase leading-none text-[#111111] sm:text-[56px]">
          Thanh toán
        </h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={handleSubmit} className="space-y-7">
          <section className="commerce-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase text-[#111111]">Thông tin giao hàng</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                required
                name="fullName"
                value={shippingForm.fullName}
                onChange={handleChange}
                placeholder="Họ và tên"
                className="field-soft h-12 px-4 text-sm"
              />
              <input
                required
                name="phone"
                value={shippingForm.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="field-soft h-12 px-4 text-sm"
              />
              <input
                required
                name="city"
                value={shippingForm.city}
                onChange={handleChange}
                placeholder="Tỉnh / Thành phố"
                className="field-soft h-12 px-4 text-sm sm:col-span-2"
              />
              <input
                required
                name="detail"
                value={shippingForm.detail}
                onChange={handleChange}
                placeholder="Địa chỉ cụ thể"
                className="field-soft h-12 px-4 text-sm sm:col-span-2"
              />
              <textarea
                name="note"
                value={shippingForm.note}
                onChange={handleChange}
                placeholder="Ghi chú tùy chọn"
                rows={3}
                className="field-soft px-4 py-3 text-sm sm:col-span-2"
              />
            </div>
          </section>

          <section className="commerce-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase text-[#111111]">Phương thức thanh toán</h2>
            <div className="mt-5 grid gap-3">
              {[
                { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
                { value: "VNPAY", label: "Thanh toán qua VNPay" },
                { value: "MOMO", label: "Thanh toán qua Momo" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`motion-surface flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm font-semibold ${
                    paymentMethod === option.value
                      ? "border-black bg-[#f7f7f7]"
                      : "border-[#111111]/12 hover:border-[#111111]/35"
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
          </section>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="motion-surface motion-press w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:bg-neutral-300"
          >
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </form>

        <aside className="commerce-card h-fit p-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase text-[#707072]">Tóm tắt đơn hàng</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111111]">{items.length} sản phẩm</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between gap-4 text-sm">
                <span className="min-w-0 truncate text-neutral-600">
                  {item.product?.name} x {item.quantity}
                </span>
                <span className="shrink-0 font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-neutral-200 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-neutral-500">Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Tổng cộng</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
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
