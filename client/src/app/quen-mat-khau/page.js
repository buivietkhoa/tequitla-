"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";

export default function ForgotPasswordPage() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const result = await forgotPassword(email);
    setSubmitting(false);

    if (result.success) {
      setSent(true);
    } else {
      toast.error(result.message);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Kiểm tra email của bạn</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Liên kết
          có hiệu lực trong 30 phút.
        </p>
        <Link href="/dang-nhap" className="mt-6 inline-block text-sm font-medium hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết để bạn đặt lại mật khẩu.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white disabled:bg-neutral-300"
        >
          {submitting ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-500">
        <Link href="/dang-nhap" className="font-medium text-black hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
