import CategoryListingPage from "@/components/product/CategoryListingPage";
import { getCategoryBySlug } from "@/lib/api-server";

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} Nữ`,
    description:
      category.description || `Mua sắm ${category.name.toLowerCase()} nữ chính hãng, giá tốt tại SHMILY.`,
  };
}

export default async function WomenCategoryPage({ params, searchParams }) {
  const { category } = await params;
  const sp = await searchParams;
  return <CategoryListingPage gender="nu" categorySlug={category} searchParams={sp} />;
}
