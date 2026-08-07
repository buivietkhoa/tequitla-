import Link from "next/link";

const CARDS = [
  { href: "/admin/san-pham", title: "Sản phẩm", description: "Thêm, sửa, xóa sản phẩm và biến thể" },
  { href: "/admin/danh-muc", title: "Danh mục", description: "Quản lý danh mục Nam / Nữ" },
  { href: "/admin/don-hang", title: "Đơn hàng", description: "Xem và cập nhật trạng thái đơn hàng" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Trang quản trị</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-neutral-200 p-5 hover:border-black"
          >
            <p className="font-semibold">{card.title}</p>
            <p className="mt-1 text-sm text-neutral-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
