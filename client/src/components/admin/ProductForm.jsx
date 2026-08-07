"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import api, { getErrorMessage } from "@/lib/api-client";

const emptyVariant = { size: "", color: "", colorHex: "", stock: 0 };

export default function ProductForm({ initialProduct }) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(() => ({
    name: initialProduct?.name || "",
    gender: initialProduct?.gender || "nam",
    category: initialProduct?.category?._id || "",
    brand: initialProduct?.brand || "",
    price: initialProduct?.price || "",
    salePrice: initialProduct?.salePrice || "",
    shortDescription: initialProduct?.shortDescription || "",
    description: initialProduct?.description || "",
    isFeatured: initialProduct?.isFeatured || false,
    metaTitle: initialProduct?.seo?.metaTitle || "",
    metaDescription: initialProduct?.seo?.metaDescription || "",
  }));
  const [images, setImages] = useState(initialProduct?.images || []);
  const [variants, setVariants] = useState(
    initialProduct?.variants?.length
      ? initialProduct.variants.map((v) => ({ ...v }))
      : [{ ...emptyVariant }]
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/categories?gender=${form.gender}`).then(({ data }) => setCategories(data.categories));
  }, [form.gender]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateVariant(idx, key, value) {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [key]: value } : v)));
  }

  function addVariant() {
    setVariants((prev) => [...prev, { ...emptyVariant }]);
  }

  function removeVariant(idx) {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    setUploading(true);
    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");
      setImages((prev) => [...prev, ...data.urls.map((u) => apiOrigin + u)]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }
    if (images.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 hình ảnh");
      return;
    }

    const payload = {
      name: form.name,
      gender: form.gender,
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      shortDescription: form.shortDescription,
      description: form.description,
      isFeatured: form.isFeatured,
      images,
      variants: variants
        .filter((v) => v.size && v.color)
        .map((v) => ({ ...v, stock: Number(v.stock) || 0 })),
      seo: { metaTitle: form.metaTitle, metaDescription: form.metaDescription },
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/products/${initialProduct._id}`, payload);
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await api.post("/products", payload);
        toast.success("Đã tạo sản phẩm");
      }
      router.push("/admin/san-pham");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <select
          value={form.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="nam">Nam</option>
          <option value="nu">Nữ</option>
          <option value="unisex">Unisex</option>
        </select>
        <select
          required
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Thương hiệu"
          value={form.brand}
          onChange={(e) => updateField("brand", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField("isFeatured", e.target.checked)}
          />
          Sản phẩm nổi bật
        </label>
        <input
          required
          type="number"
          min="0"
          placeholder="Giá gốc (VND)"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          placeholder="Giá khuyến mãi (tuỳ chọn)"
          value={form.salePrice}
          onChange={(e) => updateField("salePrice", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Mô tả ngắn"
          value={form.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <textarea
          placeholder="Mô tả chi tiết"
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Hình ảnh</p>
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div key={img + idx} className="relative h-24 w-20 overflow-hidden rounded-lg border">
              <Image src={img} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-500">
            {uploading ? "Đang tải..." : "+ Ảnh"}
            <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">Biến thể (Size / Màu / Tồn kho)</p>
          <button type="button" onClick={addVariant} className="text-sm font-medium hover:underline">
            + Thêm biến thể
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((variant, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2">
              <input
                placeholder="Size"
                value={variant.size}
                onChange={(e) => updateVariant(idx, "size", e.target.value)}
                className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
              />
              <input
                placeholder="Màu"
                value={variant.color}
                onChange={(e) => updateVariant(idx, "color", e.target.value)}
                className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                min="0"
                placeholder="Tồn kho"
                value={variant.stock}
                onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() => removeVariant(idx)}
                className="text-sm text-red-600 hover:underline"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">SEO</p>
        <div className="space-y-2">
          <input
            placeholder="Meta title"
            value={form.metaTitle}
            onChange={(e) => updateField("metaTitle", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Meta description"
            rows={2}
            value={form.metaDescription}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:bg-neutral-300"
      >
        {submitting ? "Đang lưu..." : isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
      </button>
    </form>
  );
}
