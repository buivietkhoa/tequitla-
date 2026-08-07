"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrendingCard from "./TrendingCard";

const TABS = [
  { key: "nu", label: "WOMEN" },
  { key: "nam", label: "MEN" },
];

export default function TrendingSection({ womenProducts = [], menProducts = [] }) {
  const [activeTab, setActiveTab] = useState("nu");
  const scrollerRef = useRef(null);

  const products = activeTab === "nu" ? womenProducts : menProducts;

  function scrollBy(amount) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (womenProducts.length === 0 && menProducts.length === 0) return null;

  return (
    <section className="mx-auto mt-14 max-w-[1700px] overflow-hidden px-5 sm:px-8">
      <div className="rounded-lg border border-[#111111]/10 bg-white/82 px-5 py-7 shadow-[0_1px_0_rgba(17,17,17,0.04)] backdrop-blur sm:px-8 sm:py-9 lg:px-10 lg:py-10">
      <div
        className="flex items-end justify-between gap-6 border-b border-[#111111]/10 pb-7"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-[#707072]">Most watched this week</p>
          <h2 className="text-[34px] font-semibold uppercase leading-[0.95] text-[#111111] sm:text-[52px]">
            Trending Now
          </h2>

          <div className="mt-6 flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`motion-surface motion-press h-11 rounded-full border px-6 text-sm font-semibold ${
                  activeTab === tab.key
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#111111]/12 bg-[#f7f5f1] text-[#111111] hover:border-[#111111]/35 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden gap-3 sm:flex">
          <button
            onClick={() => scrollBy(-320)}
            aria-label="Scroll left"
            className="motion-surface motion-press flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f5f1] text-[#111111] hover:bg-[#111111] hover:text-white"
          >
            <ChevronLeft size={17} strokeWidth={2.2} />
          </button>
          <button
            onClick={() => scrollBy(320)}
            aria-label="Scroll right"
            className="motion-surface motion-press flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f5f1] text-[#111111] hover:bg-[#111111] hover:text-white"
          >
            <ChevronRight size={17} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, idx) => (
          <TrendingCard
            key={product._id}
            product={product}
            priority={idx < 4}
            revealDelay={(idx % 4) * 100}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
