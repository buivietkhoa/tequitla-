import { getCategories, getProducts } from "@/lib/api-server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const staticRoutes = ["", "/nam", "/nu"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  const categories = await getCategories();
  const categoryRoutes = categories
    .filter((cat) => cat.gender !== "unisex")
    .map((cat) => ({
      url: `${siteUrl}/${cat.gender}/${cat.slug}`,
      changeFrequency: "daily",
      priority: 0.7,
    }));

  const { products } = await getProducts({ limit: 48 });
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/san-pham/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
