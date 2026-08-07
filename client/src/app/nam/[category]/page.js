import CategoryListingPage from "@/components/product/CategoryListingPage";
import { getCategoryBySlug } from "@/lib/api-server";

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} Nam`,
    description:
      category.description || `Mua sắm ${category.name.toLowerCase()} nam chính hãng, giá tốt tại SHMILY.`,
  };
}

export default async function MenCategoryPage({ params, searchParams }) {
  const { category } = await params;
  const sp = await searchParams;
  return <CategoryListingPage gender="nam" categorySlug={category} searchParams={sp} />;
}
