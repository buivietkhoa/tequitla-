export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
}

export function getDisplayPrice(product) {
  if (!product) return 0;
  return product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;
}

export function getDiscountPercent(product) {
  if (!product?.salePrice || product.salePrice >= product.price) return 0;
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}
