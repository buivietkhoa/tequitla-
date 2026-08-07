"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { getProductImages } from "@/lib/fashion-images";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=90";

export default function TrendingCard({ product, priority = false, revealDelay = 0 }) {
  const image = getProductImages(product)[0] || FALLBACK_IMAGE;
  const [imageSrc, setImageSrc] = useState(image);
  const href = product.slug ? `/san-pham/${product.slug}` : "#";

  return (
    <Link
      href={href}
      className="group block w-[74vw] shrink-0 snap-start sm:w-[300px] lg:w-[340px]"
      data-aos="fade-up"
      data-aos-delay={String(revealDelay)}
      data-aos-duration="800"
    >
      <div className="product-hover-shell relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#f5f5f5]">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 300px, 74vw"
          className="product-hover-image object-cover"
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />

        <button
          type="button"
          aria-label={`Yeu thich ${product.name}`}
          className="motion-surface motion-press absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/86 text-[#111111] opacity-90 backdrop-blur hover:bg-white hover:opacity-100"
          onClick={(event) => event.preventDefault()}
        >
          <Heart size={15} strokeWidth={1.9} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
        <div className="product-hover-panel absolute inset-x-4 bottom-4 rounded-lg bg-white/94 p-4 backdrop-blur">
          <p className="text-[11px] font-semibold uppercase text-[#707072]">Featured</p>
          <p className="mt-1 truncate text-base font-semibold leading-6 text-[#111111]">
            {product.name}
          </p>
          <span className="product-hover-cta mt-4 inline-flex h-10 items-center rounded-full bg-[#111111] px-5 text-sm font-semibold text-white">
            Xem san pham
          </span>
        </div>
      </div>
    </Link>
  );
}
