"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";

export default function ResetPasswordPage({ params }) {
  const { token } = use(params);
  const router = useRouter();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    setSubmitting(true);
    const result = await resetPassword(token, password);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dang-nhap");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          type="password"
          minLength={6}
          placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white disabled:bg-neutral-300"
        >
          {submitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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
