"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "New Collection",
    title: "Wear The Moment",
    subtitle: "Nhung ban phoi moi, duoc chon de len hinh dep va mac that de.",
    ctas: [
      { href: "/nu", label: "Shop Women" },
      { href: "/nam", label: "Shop Men" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "Daily Essentials",
    title: "Quiet But Not Soft",
    subtitle: "Nhung lop trang phuc gon, sac va du khoe de di qua ca ngay dai.",
    ctas: [
      { href: "/nu", label: "Shop Women" },
      { href: "/nam", label: "Shop Men" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "Sale Edit",
    title: "Last Light Deals",
    subtitle: "Gia tot cho nhung item co chat rieng, khong can noi qua nhieu.",
    ctas: [
      { href: "/nu", label: "Shop Women" },
      { href: "/nam", label: "Shop Men" },
    ],
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <div className="relative mx-auto h-[480px] w-full overflow-hidden rounded-lg bg-[#111111] sm:h-[560px] lg:h-[600px]">
      {SLIDES.map((item, slideIndex) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            slideIndex === index ? "scale-100 opacity-100" : "scale-[1.012] opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority={slideIndex === 0}
            sizes="(min-width: 1700px) 1700px, 100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/74 via-black/30 to-black/0" />
      <div className="absolute left-5 top-5 hidden h-[calc(100%-40px)] w-px bg-white/18 sm:block lg:left-7 lg:top-7 lg:h-[calc(100%-56px)]" />
      <div className="absolute right-5 top-5 hidden h-[calc(100%-40px)] w-px bg-white/10 lg:right-7 lg:top-7 lg:block lg:h-[calc(100%-56px)]" />
      <p className="absolute right-10 top-10 hidden origin-top-right rotate-90 text-xs font-semibold uppercase text-white/70 lg:block">
        Fashion archive / 2026
      </p>

      <div
        key={index}
        className="absolute inset-0 flex max-w-4xl flex-col justify-center px-8 py-10 sm:px-14 lg:px-20"
        data-aos="fade-right"
        data-aos-delay="200"
        data-aos-duration="1000"
      >
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-semibold uppercase text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-white" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="animate-live-blink">LIVE</span>
          <span className="h-3 w-px bg-white/30" />
          <span className="normal-case text-white/82">Dang co 328 nguoi xem</span>
        </p>
        <h1 className="max-w-[720px] text-[44px] font-semibold uppercase leading-[0.92] text-white sm:text-[68px] lg:text-[92px]">
          {SLIDES[index].title}
        </h1>
        <p className="mt-5 max-w-md text-base font-medium leading-6 text-white sm:text-lg">
          {SLIDES[index].subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {SLIDES[index].ctas.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className="motion-surface motion-press min-h-12 rounded-full bg-white px-7 py-3 text-base font-semibold text-[#111111] hover:bg-[#f5f5f5]"
            >
              {cta.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-7 left-8 hidden w-[310px] rounded-lg border border-white/18 bg-black/30 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:block lg:left-20"
        data-aos="fade-right"
        data-aos-delay="300"
        data-aos-duration="800"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/58">
              Style dispatch
            </p>
            <p className="mt-1 text-sm font-semibold text-white">Don #SM328 dang dong goi</p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#111111]">
            24h
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/18">
          <div className="animate-live-progress h-full rounded-full bg-white" />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-white/62">
          <span>Picked</span>
          <span>Quality check</span>
          <span>Ship</span>
        </div>
      </div>

      <div
        className="absolute bottom-7 right-8 flex items-center gap-3"
        data-aos="fade-left"
        data-aos-delay="300"
        data-aos-duration="800"
      >
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.image}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`motion-surface h-1.5 rounded-full ${
                i === index ? "w-7 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="motion-surface motion-press flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] hover:bg-[#f5f5f5]"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="motion-surface motion-press flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] hover:bg-[#f5f5f5]"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
