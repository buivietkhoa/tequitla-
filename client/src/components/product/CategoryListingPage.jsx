import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api-server";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import Pagination from "./Pagination";

const GENDER_LABEL = { nam: "Nam", nu: "Nữ" };

export default async function CategoryListingPage({ gender, categorySlug, searchParams }) {
  let category = null;
  if (categorySlug) {
    category = await getCategoryBySlug(categorySlug);
    if (!category || category.gender !== gender) notFound();
  }

  const categories = await getCategories({ gender });

  const { products, pagination } = await getProducts({
    gender,
    category: category?._id,
    size: searchParams.size,
    color: searchParams.color,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort,
    page: searchParams.page,
  });

  const title = category ? category.name : `Thời trang ${GENDER_LABEL[gender]}`;
  const pathname = category ? `/${gender}/${categorySlug}` : `/${gender}`;
  const paramsForPagination = new URLSearchParams(searchParams);

  return (
    <div className="mx-auto max-w-[1700px] px-5 py-10 sm:px-8">
      <nav className="mb-3 text-xs font-semibold uppercase text-[#707072]">
        Trang chủ / {GENDER_LABEL[gender]}
        {category && ` / ${category.name}`}
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-[38px] font-semibold uppercase leading-none text-[#111111] sm:text-[64px]">
            {title}
          </h1>
          <p className="mt-3 text-sm font-medium text-[#707072]">{pagination.total} sản phẩm</p>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#707072]">
          Những phom dáng được chọn lọc cho tủ đồ hằng ngày, gọn, sắc và dễ phối.
        </p>
      </div>

      <ProductFilters categories={categories} gender={gender} />

      {products.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          Không tìm thấy sản phẩm phù hợp.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product, idx) => (
            <ProductCard key={product._id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}

      <Pagination
        pathname={pathname}
        searchParams={paramsForPagination}
        pagination={pagination}
      />
    </div>
  );
}
