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
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=90";

function DropCard({ product, revealDelay = 0 }) {
  const image = getProductImages(product)[0] || "/placeholder.svg";
  const [imageSrc, setImageSrc] = useState(image);
  const price = getDisplayPrice(product);
  const discount = getDiscountPercent(product);

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group block w-[66vw] shrink-0 snap-start bg-white p-2 sm:w-[250px] lg:w-[292px]"
      data-aos="fade-up"
      data-aos-delay={String(revealDelay)}
      data-aos-duration="800"
    >
      <div className="product-hover-shell relative aspect-[4/5] w-full overflow-hidden bg-[#f5f5f5]">
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
      <div className="px-2 pb-2 pt-4 text-left text-sm text-[#111111]">
        {product.brand && <p className="truncate font-semibold">{product.brand}</p>}
        <p className="truncate text-[#707072]">{product.name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold">{formatCurrency(price)}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-[#707072] line-through">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs font-semibold text-[#d30005]">-{discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function TodaysDrops({ womenProducts = [], menProducts = [] }) {
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
      <div className="border-y border-[#111111]/10 py-8">
      <div data-aos="fade-up" data-aos-duration="800">
        <p className="mb-3 text-xs font-semibold uppercase text-[#707072]">Fresh arrivals</p>
        <h2 className="text-[34px] font-black uppercase leading-[0.9] text-[#111111] sm:text-[56px]">
          Today&apos;s Drops
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
              className={`motion-surface motion-press h-10 rounded-full border px-5 text-sm font-semibold ${
                activeGender === tab.key
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-[#cacacb] bg-white text-[#111111] hover:border-[#111111]"
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
            aria-label="Previous drops"
            className="motion-surface motion-press flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#111111] hover:bg-[#e5e5e5]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            aria-label="Next drops"
            className="motion-surface motion-press flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#111111] hover:bg-[#e5e5e5]"
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
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-[#cacacb] bg-white text-[#111111] hover:border-[#111111]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-6 text-sm text-[#707072]">Khong co san pham phu hop trong khoang gia nay.</p>
      ) : (
        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, idx) => (
            <DropCard key={product._id} product={product} revealDelay={(idx % 4) * 100} />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
