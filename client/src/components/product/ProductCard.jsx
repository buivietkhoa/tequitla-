import Image from "next/image";
import Link from "next/link";
import { formatCurrency, getDisplayPrice, getDiscountPercent } from "@/lib/format";
import { getProductImages } from "@/lib/fashion-images";

export default function ProductCard({ product, priority = false }) {
  const discount = getDiscountPercent(product);
  const price = getDisplayPrice(product);
  const image = getProductImages(product)[0] || "/placeholder.svg";

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div className="product-hover-shell relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#f5f5f5]">
        <Image
          src={image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="product-hover-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/0 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
        <span className="product-hover-cta absolute bottom-4 left-4 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#111111]">
          Xem nhanh
        </span>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#d30005] shadow-[0_8px_20px_rgba(0,0,0,0.10)]">
            -{discount}%
          </span>
        )}
      </div>
      <div className="mt-4 space-y-1 px-1">
        {product.brand && (
          <p className="truncate text-xs font-semibold uppercase text-[#707072]">{product.brand}</p>
        )}
        <p className="truncate text-[15px] font-semibold text-[#111111]">{product.name}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-sm font-semibold ${discount > 0 ? "text-[#d30005]" : "text-[#111111]"}`}>
            {formatCurrency(price)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-neutral-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
