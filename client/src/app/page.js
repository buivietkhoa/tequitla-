import Link from "next/link";
import { getFeaturedProducts, getNewestProducts, getOnSaleProducts, getCategories } from "@/lib/api-server";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrendingSection from "@/components/home/TrendingSection";
import TodaysDrops from "@/components/home/TodaysDrops";
import BiggestSales from "@/components/home/BiggestSales";

export default async function HomePage() {
  const [
    menProducts,
    womenProducts,
    categories,
    newestWomen,
    newestMen,
    saleWomen,
    saleMen,
  ] = await Promise.all([
    getFeaturedProducts("nam"),
    getFeaturedProducts("nu"),
    getCategories(),
    getNewestProducts("nu"),
    getNewestProducts("nam"),
    getOnSaleProducts("nu"),
    getOnSaleProducts("nam"),
  ]);

  return (
    <div className="bg-[#f3f0ea] pb-20 pt-6">
      <section className="mx-auto max-w-[1700px] px-5 sm:px-8">
        <HeroCarousel />
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-[1700px] px-5 pt-7 sm:px-8">
          <div className="flex items-center gap-2 overflow-x-auto border-y border-[#111111]/10 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="mr-2 shrink-0 text-xs font-semibold uppercase text-[#707072]">
              Shop by edit
            </span>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/${cat.gender}/${cat.slug}`}
                className="motion-surface motion-press h-10 shrink-0 rounded-full border border-[#111111]/15 bg-white/70 px-5 py-2 text-sm font-semibold text-[#111111] hover:border-[#111111] hover:bg-[#111111] hover:text-white"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <TrendingSection womenProducts={womenProducts} menProducts={menProducts} />
      <TodaysDrops womenProducts={newestWomen} menProducts={newestMen} />
      <BiggestSales womenProducts={saleWomen} menProducts={saleMen} />
    </div>
  );
}
