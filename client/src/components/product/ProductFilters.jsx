"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "popular", label: "Phổ biến" },
];

const SIZES = ["S", "M", "L", "XL"];

export default function ProductFilters({ categories = [], gender }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentSort = searchParams.get("sort") || "newest";
  const currentSize = searchParams.get("size") || "";

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 py-4">
      {categories.length > 0 && (
        <select
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm"
          onChange={(e) => router.push(e.target.value)}
          defaultValue=""
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={`/${gender}/${cat.slug}`}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      <select
        value={currentSize}
        onChange={(e) => updateParam("size", e.target.value)}
        className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm"
      >
        <option value="">Tất cả size</option>
        {SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="ml-auto rounded-full border border-neutral-300 px-3 py-1.5 text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sắp xếp: {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
