"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

export default function AdminProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const { data } = await api.get("/products/admin/all");
        if (!ignore) setProducts(data.products);
      } catch (error) {
        if (!ignore) toast.error(getErrorMessage(error));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleDelete(id) {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Đã xóa sản phẩm");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <Link
          href="/admin/san-pham/moi"
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-neutral-500">Đang tải...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-2 pr-4">Sản phẩm</th>
                <th className="py-2 pr-4">Danh mục</th>
                <th className="py-2 pr-4">Giá</th>
                <th className="py-2 pr-4">Tồn kho</th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-neutral-100">
                  <td className="flex items-center gap-3 py-3 pr-4">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate">{product.name}</span>
                  </td>
                  <td className="py-3 pr-4">{product.category?.name}</td>
                  <td className="py-3 pr-4">{formatCurrency(product.price)}</td>
                  <td className="py-3 pr-4">{product.totalStock}</td>
                  <td className="py-3 pr-4 text-right">
                    <Link
                      href={`/admin/san-pham/${product._id}`}
                      className="mr-3 text-sm font-medium hover:underline"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
