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
      <div className="product-hover-shell relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="product-hover-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
        <span className="product-hover-cta absolute bottom-3 left-3 inline-flex h-9 items-center rounded-full bg-white px-4 text-xs font-semibold text-[#111111]">
          Xem nhanh
        </span>
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="truncate text-sm font-medium text-neutral-900">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">{formatCurrency(price)}</span>
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
