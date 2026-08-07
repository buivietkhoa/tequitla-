import CategoryListingPage from "@/components/product/CategoryListingPage";

export const metadata = {
  title: "Thời trang Nữ",
  description:
    "Mua sắm đầm, áo kiểu, chân váy, quần jean nữ chính hãng, giá tốt tại SHMILY.",
};

export default async function WomenPage({ searchParams }) {
  const sp = await searchParams;
  return <CategoryListingPage gender="nu" searchParams={sp} />;
}
