"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";

export default function VariantSelector({ product }) {
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const addGuestItem = useCartStore((state) => state.addGuestItem);

  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants]
  );
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

  const colorsForSize = useMemo(
    () => product.variants.filter((v) => v.size === selectedSize),
    [product.variants, selectedSize]
  );
  const [selectedColor, setSelectedColor] = useState(colorsForSize[0]?.color || "");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  function handleSizeChange(size) {
    setSelectedSize(size);
    const firstColor = product.variants.find((v) => v.size === size)?.color || "";
    setSelectedColor(firstColor);
    setQuantity(1);
  }

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );
  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;

  async function handleAddToCart() {
    if (!selectedVariant) return;

    setSubmitting(true);
    const result = user
      ? await addItem(product._id, selectedVariant._id, quantity)
      : addGuestItem(product, selectedVariant, quantity);
    setSubmitting(false);

    if (result.success) {
      toast.success("Đã thêm vào giỏ hàng");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium">Kích thước</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`h-11 min-w-11 rounded-full border px-4 text-sm font-semibold ${
                selectedSize === size
                  ? "border-black bg-black text-white"
                  : "border-[#111111]/15 hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Màu sắc</p>
        <div className="flex flex-wrap gap-2">
          {colorsForSize.map((v) => (
            <button
              key={v._id}
              onClick={() => setSelectedColor(v.color)}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold ${
                selectedColor === v.color
                  ? "border-black bg-black text-white"
                  : "border-[#111111]/15 hover:border-black"
              }`}
            >
              {v.color}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">Số lượng</p>
        <div className="flex items-center rounded-full border border-[#111111]/15">
          <button
            className="h-9 w-9 text-lg"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            className="h-9 w-9 text-lg"
            onClick={() =>
              setQuantity((q) => Math.min(selectedVariant?.stock || 1, q + 1))
            }
          >
            +
          </button>
        </div>
        {selectedVariant && (
          <span className="text-xs text-neutral-500">Còn {selectedVariant.stock} sản phẩm</span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock || submitting}
        className="motion-surface motion-press w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {outOfStock ? "Hết hàng" : submitting ? "Đang thêm..." : "Thêm vào giỏ hàng"}
      </button>
    </div>
  );
}
