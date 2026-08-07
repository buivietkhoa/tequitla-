const WOMEN_IMAGES = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1520975682031-a6dd7e5f8f04?auto=format&fit=crop&w=900&q=85",
];

const MEN_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506629905607-d9e297d4b9db?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=900&q=85",
];

const ACCESSORY_IMAGES = [
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
];

const ALL_IMAGES = [...WOMEN_IMAGES, ...MEN_IMAGES, ...ACCESSORY_IMAGES];

function hashString(value = "") {
  return [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
}

function isRandomPlaceholder(src = "") {
  return typeof src === "string" && src.includes("picsum.photos");
}

function getImagePool(product = {}) {
  const text = `${product.gender || ""} ${product.name || ""}`.toLowerCase();
  if (text.includes("nu") || text.includes("nữ") || text.includes("dam") || text.includes("vay")) {
    return WOMEN_IMAGES;
  }
  if (text.includes("nam") || text.includes("men")) {
    return MEN_IMAGES;
  }
  if (text.includes("tui") || text.includes("bag")) {
    return ACCESSORY_IMAGES;
  }
  return ALL_IMAGES;
}

export function getFashionImage(product = {}, index = 0) {
  const pool = getImagePool(product);
  const seed = hashString(`${product._id || product.slug || product.name || "product"}-${index}`);
  return pool[seed % pool.length];
}

export function getProductImages(product = {}) {
  const images = product.images?.length ? product.images : [];
  if (images.length === 0) return [getFashionImage(product)];
  return images.map((image, index) => (isRandomPlaceholder(image) ? getFashionImage(product, index) : image));
}
