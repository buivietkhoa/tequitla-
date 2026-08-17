const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  const str = query.toString();
  return str ? `?${str}` : "";
}

// revalidate: seconds before Next.js regenerates this page in the background (ISR).
// Product/category data changes rarely enough that a short revalidate window keeps
// pages fast (served from cache) while still staying reasonably fresh.
const DEFAULT_REVALIDATE = 300;
const FETCH_TIMEOUT_MS = 4500;

// The API may be temporarily unreachable (backend down, build running without a DB).
// Returning null instead of throwing keeps pages rendering with empty/fallback data
// rather than crashing the whole route.
async function safeFetch(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCategories({ gender } = {}) {
  const data = await safeFetch(`${API_URL}/categories${buildQuery({ gender })}`, {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["categories"] },
  });
  return data?.categories || [];
}

export async function getCategoryBySlug(slug) {
  const data = await safeFetch(`${API_URL}/categories/${slug}`, {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["categories"] },
  });
  return data?.category || null;
}

export async function getProducts(params = {}) {
  const data = await safeFetch(`${API_URL}/products${buildQuery(params)}`, {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["products"] },
  });
  return data || { products: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
}

export async function getProductBySlug(slug) {
  const data = await safeFetch(`${API_URL}/products/${slug}`, {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["products", `product:${slug}`] },
  });
  return data || { product: null, related: [] };
}

export async function getFeaturedProducts(gender) {
  const data = await getProducts({ gender, featured: "true", limit: 8 });
  return data.products || [];
}

export async function getNewestProducts(gender, limit = 10) {
  const data = await getProducts({ gender, sort: "newest", limit });
  return data.products || [];
}

export async function getOnSaleProducts(gender, limit = 10) {
  // Fetch a larger batch (max the API allows) and rank by discount size in JS,
  // since "biggest discount" isn't a stored/sortable field in MongoDB.
  const data = await getProducts({ gender, onSale: "true", sort: "newest", limit: 48 });
  const products = data.products || [];
  return products
    .map((p) => ({ ...p, discountPercent: Math.round(((p.price - p.salePrice) / p.price) * 100) }))
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, limit);
}
