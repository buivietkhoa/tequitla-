import CategoryListingPage from "@/components/product/CategoryListingPage";

export const metadata = {
  title: "Thời trang Nam",
  description:
    "Mua sắm áo thun, sơ mi, quần jean, áo khoác nam chính hãng, giá tốt tại SHMILY.",
};

export default async function MenPage({ searchParams }) {
  const sp = await searchParams;
  return <CategoryListingPage gender="nam" searchParams={sp} />;
}
