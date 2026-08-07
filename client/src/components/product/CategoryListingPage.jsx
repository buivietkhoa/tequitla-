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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-2 text-xs text-neutral-500">
        Trang chủ / {GENDER_LABEL[gender]}
        {category && ` / ${category.name}`}
      </nav>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-neutral-500">{pagination.total} sản phẩm</p>

      <ProductFilters categories={categories} gender={gender} />

      {products.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          Không tìm thấy sản phẩm phù hợp.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
