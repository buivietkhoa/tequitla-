import Link from "next/link";

const footerGroups = [
  {
    title: "SHOP",
    links: [
      { href: "/nu", label: "Womenswear" },
      { href: "/nam", label: "Menswear" },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { href: "/tai-khoan", label: "My account" },
      { href: "/gio-hang", label: "Cart" },
    ],
  },
  {
    title: "CONTACT",
    items: ["Hotline: 1900 0000", "support@shmily.vn"],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-neutral-900 bg-white text-black">
      <div className="grid w-full gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-[136px]">
        <div className="max-w-[300px]">
          <Link href="/" className="flex items-center text-black" aria-label="SHMILY home">
            <span
              className="text-[32px] font-semibold italic leading-none tracking-[0.02em]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              SHMILY
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Curated womenswear and menswear with clean silhouettes, daily essentials, and seasonal pieces.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <p className="text-[14px] font-semibold leading-none tracking-normal">{group.title}</p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              {group.links?.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-black">
                    {link.label}
                  </Link>
                </li>
              ))}
              {group.items?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex min-h-12 items-center justify-between border-t border-neutral-200 px-5 py-4 text-xs text-neutral-500 sm:px-8 lg:px-[136px]">
        <span>© {new Date().getFullYear()} SHMILY. All rights reserved.</span>
        <span className="hidden sm:inline">WOMENSWEAR / MENSWEAR</span>
      </div>
    </footer>
  );
}
