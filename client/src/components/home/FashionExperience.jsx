"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Search, Sparkles } from "lucide-react";

const SEARCH_HINTS = ["ao khoac nam", "dam du tiec", "chan vay cong so", "ao so mi linen", "phu kien toi gian"];

const STATS = [
  { value: 15000, suffix: "+", label: "don da giao" },
  { value: 4.9, decimals: 1, label: "diem danh gia" },
  { value: 98, suffix: "%", label: "khach quay lai" },
  { value: 24, suffix: "h", label: "giao nhanh" },
];

const COLLECTIONS = {
  signature: {
    label: "Signature",
    note: "Nhung form gon, sac va de mac moi ngay.",
    products: [
      {
        name: "Minimal Blazer",
        type: "Womenswear",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=84",
      },
      {
        name: "Clean Shirt Set",
        type: "Menswear",
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=84",
      },
      {
        name: "Soft Day Dress",
        type: "Womenswear",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=84",
      },
    ],
  },
  trend: {
    label: "Trend",
    note: "Mau moi co diem nhan nhung van giu chat thanh lich.",
    products: [
      {
        name: "Cropped Jacket",
        type: "Street edit",
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=84",
      },
      {
        name: "Denim Column",
        type: "Daily look",
        image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=84",
      },
      {
        name: "Sharp Black Layer",
        type: "Evening",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=84",
      },
    ],
  },
  accessories: {
    label: "Phu kien",
    note: "Nhung chi tiet nho giup bo phoi trong co gu hon.",
    products: [
      {
        name: "Quilted Bag",
        type: "Bag edit",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=84",
      },
      {
        name: "Satin Scarf",
        type: "Accessory",
        image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=84",
      },
      {
        name: "Slim Sunglasses",
        type: "Finish",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=84",
      },
    ],
  },
};

const PROCESS = ["Chon edit", "Chot size", "Kiem kho", "Dong goi", "Giao 24h"];

const TESTIMONIALS = [
  {
    quote: "Form len dep, anh san pham dung voi ben ngoai. Don cua minh duoc cap nhat lien tuc.",
    name: "Minh Anh",
    tag: "Womenswear",
  },
  {
    quote: "Mua ao so mi va quan jean rat vua, phan goi y size lam minh quyet nhanh hon.",
    name: "Quoc Bao",
    tag: "Menswear",
  },
  {
    quote: "Minh thich cach shop chia edit, nhin vao la biet ngay nen mix mon nao voi mon nao.",
    name: "Ha Linh",
    tag: "Signature edit",
  },
  {
    quote: "Hang giao nhanh, dong goi gon va co cam giac rat duoc cham chut.",
    name: "Gia Han",
    tag: "Accessories",
  },
];

function formatStat(stat, progress) {
  const value = stat.value * progress;
  if (stat.decimals) return `${value.toFixed(stat.decimals)}${stat.suffix || ""}`;
  return `${Math.round(value).toLocaleString("vi-VN")}${stat.suffix || ""}`;
}

export default function FashionExperience() {
  const [hintIndex, setHintIndex] = useState(0);
  const [activeCollection, setActiveCollection] = useState("signature");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const statRef = useRef(null);

  const collection = COLLECTIONS[activeCollection];

  useEffect(() => {
    const timer = setInterval(() => {
      setHintIndex((current) => (current + 1) % SEARCH_HINTS.length);
    }, 2100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 }
    );

    if (statRef.current) observer.observe(statRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const next = Math.min((now - start) / 1150, 1);
      setProgress(1 - Math.pow(1 - next, 3));
      if (next < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  const tabs = useMemo(() => Object.entries(COLLECTIONS), []);

  return (
    <section className="mx-auto mt-12 max-w-[1700px] px-5 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.25fr]">
        <div
          className="commerce-card relative overflow-hidden p-6 sm:p-8"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#707072]">Live edit</p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#111111]/10 bg-[#f7f7f7] px-3 py-1 text-xs font-semibold text-[#111111]">
              <span className="h-2 w-2 rounded-full bg-[#111111] animate-live-blink" />
              dang mo
            </span>
          </div>

          <h2 className="mt-6 max-w-[520px] text-[34px] font-semibold uppercase leading-[0.95] text-[#111111] sm:text-[50px]">
            Tim dung item trong vai giay
          </h2>
          <p className="mt-4 max-w-md text-base font-medium leading-7 text-[#4f4f4f]">
            Goi y theo edit, loc nhanh theo phong cach va nhin duoc trang thai don hang nhu mot live board nho.
          </p>

          <div className="mt-8 rounded-lg border border-[#c99b74] bg-white px-4 py-3 shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
            <div className="flex items-center gap-3">
              <Search size={22} className="shrink-0 text-[#111111]" />
              <div className="min-w-0 flex-1 overflow-hidden text-[16px] font-semibold text-[#111111]">
                <span className="text-[#707072]">Search...</span>
                <span key={hintIndex} className="ml-3 inline-block animate-suggestion-slide">
                  {SEARCH_HINTS[hintIndex]}
                </span>
              </div>
              <span className="hidden h-6 w-px bg-[#111111]/12 sm:block" />
              <span className="hidden text-sm font-semibold text-[#111111] sm:block">Women</span>
            </div>
          </div>

          <div ref={statRef} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-[#111111]/10 bg-[#fafafa] p-4">
                <p className="text-[28px] font-semibold leading-none text-[#111111]">{formatStat(stat, progress)}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#707072]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="commerce-card overflow-hidden p-6 sm:p-8"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#707072]">Collection tabs</p>
              <h2 className="mt-3 text-[30px] font-semibold uppercase leading-none text-[#111111] sm:text-[42px]">
                Chon bo suu tap
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setActiveCollection(key)}
                  className={`motion-surface motion-press h-10 shrink-0 rounded-full border px-5 text-sm font-semibold ${
                    activeCollection === key
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-[#111111]/12 bg-[#f7f7f7] text-[#111111] hover:border-[#111111]/35 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm font-medium leading-6 text-[#707072]">{collection.note}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {collection.products.map((product, index) => (
              <div
                key={`${activeCollection}-${product.name}`}
                className="group overflow-hidden rounded-lg border border-[#111111]/10 bg-white animate-editorial-rise"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f3f3]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 260px, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-[#707072]">{product.type}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#111111]">{product.name}</p>
                    <ArrowRight size={16} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div
          className="commerce-card p-6 sm:p-8"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#707072]">5 buoc quy trinh</p>
          <div className="mt-7 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="relative flex min-w-[640px] items-start justify-between gap-4">
              <div className="absolute left-6 right-6 top-5 h-px bg-[#111111]/12" />
              {PROCESS.map((step, index) => (
                <div key={step} className="relative z-10 flex w-28 flex-col items-center text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#111111] bg-white text-sm font-semibold text-[#111111]">
                    {index + 1}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#111111]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="commerce-card overflow-hidden p-6 sm:p-8"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#707072]">Khach hang noi gi</p>
              <h3 className="mt-3 text-[28px] font-semibold uppercase leading-none text-[#111111]">Review that, cuon ngang</h3>
            </div>
            <Sparkles size={26} className="hidden text-[#111111] sm:block" />
          </div>
          <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TESTIMONIALS.map((item) => (
              <article key={item.name} className="min-w-[280px] snap-start rounded-lg border border-[#111111]/10 bg-[#fafafa] p-5">
                <CheckCircle2 size={18} className="text-[#111111]" />
                <p className="mt-4 text-sm font-medium leading-6 text-[#303030]">"{item.quote}"</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="font-semibold text-[#111111]">{item.name}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#707072]">{item.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
