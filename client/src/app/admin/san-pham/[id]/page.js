"use client";

import { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api-client";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/admin/detail/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-neutral-500">Đang tải...</p>;
  if (!product) return <p className="text-sm text-neutral-500">Không tìm thấy sản phẩm.</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sửa sản phẩm</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}
