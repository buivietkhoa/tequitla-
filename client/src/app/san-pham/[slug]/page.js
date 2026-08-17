import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/api-server";
import { formatCurrency, getDisplayPrice, getDiscountPercent } from "@/lib/format";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import ReviewsSection from "@/components/product/ReviewsSection";
import ProductCard from "@/components/product/ProductCard";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.seo?.metaTitle || product.name;
  const description =
    product.seo?.metaDescription || product.shortDescription || product.description?.slice(0, 160);
  const image = product.images?.[0];

  return {
    title: product.seo?.metaTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/san-pham/${product.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const { product, related } = await getProductBySlug(slug);
  if (!product) notFound();

  const price = getDisplayPrice(product);
  const discount = getDiscountPercent(product);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    sku: product._id,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/san-pham/${product.slug}`,
      priceCurrency: "VND",
      price,
      availability:
        product.totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(product.numReviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.numReviews,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-[1700px] px-5 py-10 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <nav className="mb-6 text-xs font-semibold uppercase text-[#707072]">
        <Link href="/">Trang chủ</Link> /{" "}
        <Link href={`/${product.gender}`}>{product.gender === "nam" ? "Nam" : "Nữ"}</Link>
        {product.category?.name && (
          <>
            {" "}
            / <Link href={`/${product.gender}/${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] xl:gap-16">
        <ProductGallery images={product.images} name={product.name} product={product} />

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-3 text-xs font-semibold uppercase text-[#707072]">
            {product.brand || "SHMILY selection"}
          </p>
          <h1 className="text-[34px] font-semibold uppercase leading-none text-[#111111] sm:text-[52px]">
            {product.name}
          </h1>
          {product.brand && <p className="mt-3 text-sm text-neutral-500">Brand: {product.brand}</p>}

          <div className="mt-5 flex items-center gap-3">
            <span className={`text-2xl font-semibold ${discount > 0 ? "text-[#d30005]" : "text-[#111111]"}`}>
              {formatCurrency(price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-neutral-400 line-through">{formatCurrency(product.price)}</span>
                <span className="rounded-full bg-[#f7f7f7] px-3 py-1 text-xs font-semibold text-[#d30005]">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {product.numReviews > 0 && (
            <p className="mt-2 text-sm text-neutral-500">
              {"★".repeat(Math.round(product.rating))} ({product.numReviews} đánh giá)
            </p>
          )}

          <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-600">
            {product.shortDescription || product.description}
          </p>

          <div className="mt-7">
            <VariantSelector product={product} />
          </div>

          {product.description && (
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h2 className="text-sm font-semibold uppercase">Mô tả sản phẩm</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-600">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <ReviewsSection
        productId={product._id}
        reviews={product.reviews}
        rating={product.rating}
        numReviews={product.numReviews}
      />

      {related?.length > 0 && (
        <section className="mt-14 border-t border-neutral-200 pt-8">
          <h2 className="mb-6 text-[28px] font-semibold uppercase leading-none text-[#111111]">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
