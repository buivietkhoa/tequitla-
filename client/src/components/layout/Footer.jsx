"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const footerGroups = [
  {
    title: "MUA SẮM",
    links: [
      { href: "/nu", label: "Womenswear" },
      { href: "/nam", label: "Menswear" },
      { href: "/tim-kiem?q=couple", label: "Couple" },
      { href: "/tim-kiem", label: "Tìm kiếm" },
    ],
  },
  {
    title: "DỊCH VỤ",
    links: [
      { href: "/tai-khoan", label: "Tài khoản" },
      { href: "/gio-hang", label: "Giỏ hàng" },
      { href: "/thanh-toan", label: "Thanh toán" },
    ],
  },
  {
    title: "LIÊN HỆ",
    items: ["Hotline: 1900 0000", "support@shmily.vn", "Thứ 2 - Thứ 7 / 09:00 - 21:00"],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleNewsletterSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
    setEmail("");
  }

  return (
    <footer className="mt-20 border-t border-[#111111] bg-white text-black">
      <div className="mx-auto grid max-w-[1700px] gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:py-16">
        <div>
          <Link href="/" className="inline-flex items-center text-black" aria-label="SHMILY home">
            <span
              className="text-[40px] font-semibold italic leading-none tracking-[0.02em] sm:text-[56px]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              SHMILY
            </span>
          </Link>
          <p className="mt-5 max-w-[520px] text-sm leading-6 text-neutral-600">
            Thời trang nam và nữ được chọn lọc theo tinh thần gọn, sắc, dễ mặc và đủ nổi bật cho nhịp sống hằng ngày.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setJoined(false);
              }}
              placeholder="Email để nhận bộ sưu tập mới"
              required
              className="field-soft h-12 flex-1 px-4 text-sm"
            />
            <button
              type="submit"
              className="motion-surface motion-press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Đăng ký
              <ArrowRight size={16} />
            </button>
          </form>
          {joined && (
            <p className="mt-3 text-sm font-medium text-[#111111]">
              Cảm ơn bạn. SHMILY sẽ gửi những drop mới nhất tới email này.
            </p>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase text-[#707072]">{group.title}</p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-neutral-700">
                {group.links?.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="motion-surface hover:text-black">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {group.items?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex min-h-12 max-w-[1700px] flex-col gap-2 border-t border-neutral-200 px-5 py-4 text-xs font-medium text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} SHMILY. All rights reserved.</span>
        <span>WOMENSWEAR / MENSWEAR / COUPLE</span>
      </div>
    </footer>
  );
}
