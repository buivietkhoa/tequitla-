"use client";

import { useState } from "react";
import Image from "next/image";
import { getProductImages } from "@/lib/fashion-images";

export default function ProductGallery({ images = [], name, product }) {
  const list = product ? getProductImages(product) : images.length > 0 ? images : ["/placeholder.svg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#f5f5f5]">
        <Image
          src={list[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {list.map((img, idx) => (
            <button
              key={img + idx}
              onClick={() => setActive(idx)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border ${
                active === idx ? "border-black" : "border-[#111111]/10 opacity-70"
              }`}
            >
              <Image src={img} alt={`${name} ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
