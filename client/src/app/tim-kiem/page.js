import { getProducts } from "@/lib/api-server";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/product/Pagination";

export const metadata = {
  title: "Kết quả tìm kiếm",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp.q || "";

  const { products, pagination } = q
    ? await getProducts({ search: q, gender: sp.gender, sort: sp.sort, page: sp.page })
    : { products: [], pagination: { page: 1, totalPages: 0, total: 0 } };

  return (
    <div className="mx-auto max-w-[1700px] px-5 py-10 sm:px-8">
      <p className="mb-3 text-xs font-semibold uppercase text-[#707072]">Tìm kiếm</p>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#111111]/10 pb-8">
        <div>
          <h1 className="text-[34px] font-semibold uppercase leading-none text-[#111111] sm:text-[56px]">
            Kết quả cho &quot;{q}&quot;
          </h1>
          <p className="mt-3 text-sm font-medium text-[#707072]">{pagination.total} sản phẩm</p>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#707072]">
          Gợi ý được lọc theo từ khóa, giới tính và độ mới để bạn tìm nhanh hơn.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          Không tìm thấy sản phẩm phù hợp với từ khóa của bạn.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product, idx) => (
            <ProductCard key={product._id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}

      <Pagination
        pathname="/tim-kiem"
        searchParams={new URLSearchParams(sp)}
        pagination={pagination}
      />
    </div>
  );
}
