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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Kết quả tìm kiếm cho &quot;{q}&quot;</h1>
      <p className="mt-1 text-sm text-neutral-500">{pagination.total} sản phẩm</p>

      {products.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          Không tìm thấy sản phẩm phù hợp với từ khóa của bạn.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
