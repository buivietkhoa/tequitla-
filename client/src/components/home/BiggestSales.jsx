"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductImages } from "@/lib/fashion-images";
import { formatCurrency, getDisplayPrice, getDiscountPercent } from "@/lib/format";

const TABS = [
  { key: "women", label: "WOMEN" },
  { key: "men", label: "MEN" },
];

const PRICE_FILTERS = [
  { key: "all", label: "Tat ca", min: 0, max: Infinity },
  { key: "under-500k", label: "Duoi 500K", min: 0, max: 500000 },
  { key: "500k-1m", label: "500K - 1M", min: 500000, max: 1000000 },
  { key: "1m-3m", label: "1M - 3M", min: 1000000, max: 3000000 },
  { key: "3m-10m", label: "3M - 10M", min: 3000000, max: 10000000 },
  { key: "10m-plus", label: "Tren 10M", min: 10000000, max: Infinity },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=90";

function SaleCard({ product, revealDelay = 0 }) {
  const image = getProductImages(product)[0] || "/placeholder.svg";
  const [imageSrc, setImageSrc] = useState(image);
  const price = getDisplayPrice(product);
  const discount = getDiscountPercent(product);

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group block w-[66vw] shrink-0 snap-start text-white sm:w-[250px] lg:w-[292px]"
      data-aos="fade-up"
      data-aos-delay={String(revealDelay)}
      data-aos-duration="800"
    >
      <div className="product-hover-shell relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#f5f5f5]">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 292px, (min-width: 640px) 250px, 66vw"
          className="product-hover-image object-cover"
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
        <span className="product-hover-cta absolute bottom-4 left-4 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#111111]">
          Xem nhanh
        </span>
      </div>
      <div className="px-1 pb-2 pt-4 text-left text-sm text-white">
        {product.brand && <p className="truncate text-xs font-semibold uppercase text-white/50">{product.brand}</p>}
        <p className="mt-1 truncate text-[15px] font-semibold text-white">{product.name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white">{formatCurrency(price)}</span>
          <span className="text-xs text-white/45 line-through">
            {formatCurrency(product.price)}
          </span>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#111111]">-{discount}%</span>
        </div>
      </div>
    </Link>
  );
}

export default function BiggestSales({ womenProducts = [], menProducts = [] }) {
  const [activeGender, setActiveGender] = useState("women");
  const [activeFilter, setActiveFilter] = useState("all");
  const scrollerRef = useRef(null);

  const sourceProducts = activeGender === "women" ? womenProducts : menProducts;
  const selectedFilter = PRICE_FILTERS.find((filter) => filter.key === activeFilter);
  const products = useMemo(
    () =>
      sourceProducts.filter((product) => {
        if (!selectedFilter) return true;
        const price = getDisplayPrice(product);
        return price >= selectedFilter.min && price <= selectedFilter.max;
      }),
    [sourceProducts, selectedFilter]
  );

  function scrollBy(amount) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (womenProducts.length === 0 && menProducts.length === 0) return null;

  return (
    <section className="mx-auto mt-14 max-w-[1700px] px-5 sm:px-8">
      <div className="section-shell-dark px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
      <div className="border-b border-white/12 pb-7" data-aos="fade-up" data-aos-duration="800">
        <p className="mb-3 text-xs font-semibold uppercase text-white/55">Limited markdown</p>
        <h2 className="text-[34px] font-semibold uppercase leading-[0.95] text-white sm:text-[52px]">
          Biggest Sales Ever
        </h2>
      </div>

      <div
        className="mt-6 flex items-center justify-between gap-4"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
      >
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveGender(tab.key)}
              className={`motion-surface motion-press h-11 rounded-full border px-6 text-sm font-semibold ${
                activeGender === tab.key
                  ? "border-white bg-white text-[#111111]"
                  : "border-white/20 bg-white/8 text-white hover:border-white/55 hover:bg-white/12"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden gap-3 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            aria-label="Previous sales"
            className="motion-surface motion-press flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-[#111111]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            aria-label="Next sales"
            className="motion-surface motion-press flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-[#111111]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-aos="fade-up"
        data-aos-delay="200"
        data-aos-duration="800"
      >
        {PRICE_FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`motion-surface motion-press h-10 shrink-0 rounded-full border px-4 text-sm font-medium ${
              activeFilter === filter.key
                ? "border-white bg-white text-[#111111]"
                : "border-white/20 bg-white/8 text-white hover:border-white/55 hover:bg-white/12"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-6 text-sm text-white/55">Khong co san pham giam gia trong khoang gia nay.</p>
      ) : (
        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, idx) => (
            <SaleCard key={product._id} product={product} revealDelay={(idx % 4) * 100} />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
