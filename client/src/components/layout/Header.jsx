"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgePercent,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  UserRound,
  X,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";

const NAV_LINKS = [
  { href: "/nu", label: "WOMENSWEAR" },
  { href: "/nam", label: "MENSWEAR" },
  { href: "/tim-kiem?q=couple", label: "COUPLE" },
];

const WOMENSWEAR_MENU = [
  {
    title: "Trang phục",
    columns: [
      [
        "Áo blazer",
        "Áo ngực",
        "Áo khoác dài",
        "Đầm",
        "Áo hoodie",
        "Áo khoác",
        "Quần jean",
        "Quần dài",
      ],
      [
        "Áo sơ mi",
        "Quần short",
        "Chân váy",
        "Áo len",
        "Đồ bơi",
        "Áo thun",
        "Áo kiểu",
        "Đồ lót",
      ],
    ],
  },
  {
    title: "Phụ kiện",
    columns: [["Thắt lưng", "Mũ và nón", "Găng tay", "Khăn choàng", "Kính râm"]],
  },
  {
    title: "Giày dép",
    columns: [["Bốt", "Dép sandal", "Giày", "Giày sneaker"]],
  },
  {
    title: "Túi xách",
    columns: [["Ba lô", "Túi xách", "Bao hộ chiếu", "Ví"]],
  },
];

const MENSWEAR_MENU = [
  {
    title: "Trang phục",
    columns: [
      [
        "Áo khoác dài",
        "Áo hoodie",
        "Áo khoác",
        "Quần jean",
        "Quần dài",
        "Áo sơ mi",
        "Quần short",
        "Com-lê & blazer",
      ],
      ["Áo len", "Đồ bơi", "Áo thun", "Đồ lót"],
    ],
  },
  {
    title: "Phụ kiện",
    columns: [["Thắt lưng", "Mũ và nón", "Găng tay", "Khăn choàng", "Kính râm", "Cà vạt"]],
  },
  {
    title: "Giày dép",
    columns: [["Bốt", "Dép sandal", "Giày", "Giày sneaker"]],
  },
  {
    title: "Túi xách",
    columns: [["Ba lô", "Túi xách", "Bao hộ chiếu", "Ví"]],
  },
];

function MenuItemIcon({ label }) {
  const lower = label.toLowerCase();
  if (lower.includes("blazer") || lower.includes("áo khoác") || lower.includes("khoác dài") || lower.includes("com-lê")) {
    return <FashionIcon type="outerwear" />;
  }
  if (lower.includes("ngực") || lower.includes("đồ lót") || lower.includes("đồ bơi")) {
    return <FashionIcon type="intimates" />;
  }
  if (lower.includes("đầm") || lower.includes("chân váy")) {
    return <FashionIcon type={lower.includes("đầm") ? "dress" : "skirt"} />;
  }
  if (lower.includes("hoodie") || lower.includes("áo len") || lower.includes("sơ mi") || lower.includes("áo thun") || lower.includes("áo kiểu")) {
    return <FashionIcon type={lower.includes("hoodie") ? "hoodie" : "top"} />;
  }
  if (lower.includes("jean") || lower.includes("quần dài") || lower.includes("short")) {
    return <FashionIcon type={lower.includes("short") ? "shorts" : "pants"} />;
  }
  if (lower.includes("thắt lưng")) return <FashionIcon type="belt" />;
  if (lower.includes("mũ") || lower.includes("nón")) return <FashionIcon type="hat" />;
  if (lower.includes("găng")) return <FashionIcon type="glove" />;
  if (lower.includes("khăn")) return <FashionIcon type="scarf" />;
  if (lower.includes("kính")) return <FashionIcon type="sunglasses" />;
  if (lower.includes("cà vạt")) return <FashionIcon type="tie" />;
  if (lower.includes("ba lô")) return <FashionIcon type="backpack" />;
  if (lower.includes("túi")) return <FashionIcon type="bag" />;
  if (lower.includes("hộ chiếu")) return <FashionIcon type="passport" />;
  if (lower.includes("ví")) return <FashionIcon type="wallet" />;
  if (lower.includes("giày") || lower.includes("sandal") || lower.includes("bốt") || lower.includes("sneaker")) {
    return <FashionIcon type={lower.includes("bốt") ? "boot" : "shoe"} />;
  }
  if (lower.includes("blazer") || lower.includes("áo khoác") || lower.includes("khoác dài")) {
    return <FashionIcon type="outerwear" />;
  }
  if (lower.includes("ngực") || lower.includes("đồ lót") || lower.includes("đồ bơi")) {
    return <FashionIcon type="intimates" />;
  }
  if (lower.includes("đầm") || lower.includes("chân váy")) {
    return <FashionIcon type={lower.includes("đầm") ? "dress" : "skirt"} />;
  }
  if (lower.includes("hoodie") || lower.includes("áo len") || lower.includes("sơ mi") || lower.includes("áo thun") || lower.includes("áo kiểu")) {
    return <FashionIcon type={lower.includes("hoodie") ? "hoodie" : "top"} />;
  }
  if (lower.includes("jean") || lower.includes("quần dài") || lower.includes("short")) {
    return <FashionIcon type={lower.includes("short") ? "shorts" : "pants"} />;
  }
  if (lower.includes("thắt lưng")) return <FashionIcon type="belt" />;
  if (lower.includes("mũ") || lower.includes("nón")) return <FashionIcon type="hat" />;
  if (lower.includes("găng")) return <FashionIcon type="glove" />;
  if (lower.includes("khăn")) return <FashionIcon type="scarf" />;
  if (lower.includes("kính")) return <FashionIcon type="sunglasses" />;
  if (lower.includes("ba lô")) return <FashionIcon type="backpack" />;
  if (lower.includes("túi")) return <FashionIcon type="bag" />;
  if (lower.includes("hộ chiếu")) return <FashionIcon type="passport" />;
  if (lower.includes("ví")) return <FashionIcon type="wallet" />;
  if (lower.includes("giày") || lower.includes("sandal") || lower.includes("bốt") || lower.includes("sneaker")) {
    return <FashionIcon type={lower.includes("bốt") ? "boot" : "shoe"} />;
  }
  return <FashionIcon type="top" />;
}

function FashionIcon({ type }) {
  const common = {
    className: "h-[15px] w-[15px] shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "outerwear") {
    return (
      <svg {...common}>
        <path d="M8 4 5 7v13h14V7l-3-3" />
        <path d="M9 4c.8 1.4 1.8 2.3 3 2.8 1.2-.5 2.2-1.4 3-2.8" />
        <path d="M12 7v13" />
        <path d="M8 10h2M14 10h2" />
      </svg>
    );
  }
  if (type === "intimates") {
    return (
      <svg {...common}>
        <path d="M4 9c2.5-3 5.5-3 8 1 2.5-4 5.5-4 8-1" />
        <path d="M4 9v5c2 1.5 5 1.5 8-1 3 2.5 6 2.5 8 1V9" />
      </svg>
    );
  }
  if (type === "dress") {
    return (
      <svg {...common}>
        <path d="M9 4h6l1 4-2 2 4 10H6l4-10-2-2 1-4Z" />
        <path d="M10 10h4" />
      </svg>
    );
  }
  if (type === "skirt") {
    return (
      <svg {...common}>
        <path d="M8 5h8l1.5 15h-11L8 5Z" />
        <path d="M8 9h8M10 9l-1 11M14 9l1 11" />
      </svg>
    );
  }
  if (type === "hoodie") {
    return (
      <svg {...common}>
        <path d="M8 9a4 4 0 0 1 8 0v2" />
        <path d="M6 10h12l1 10H5l1-10Z" />
        <path d="M9 14h6M10 18h4" />
      </svg>
    );
  }
  if (type === "top") {
    return (
      <svg {...common}>
        <path d="M9 4h6l4 4-3 3-1-1v10H9V10l-1 1-3-3 4-4Z" />
      </svg>
    );
  }
  if (type === "pants") {
    return (
      <svg {...common}>
        <path d="M8 4h8l1 16h-4l-1-9-1 9H7L8 4Z" />
        <path d="M8 8h8M12 4v7" />
      </svg>
    );
  }
  if (type === "shorts") {
    return (
      <svg {...common}>
        <path d="M7 5h10l1 10h-5l-1-4-1 4H6L7 5Z" />
        <path d="M7 8h10M12 5v6" />
      </svg>
    );
  }
  if (type === "belt") {
    return (
      <svg {...common}>
        <path d="M3 10h18v4H3z" />
        <path d="M9 9h5v6H9zM14 12h4" />
      </svg>
    );
  }
  if (type === "hat") {
    return (
      <svg {...common}>
        <path d="M6 12c1-4 3-6 6-6s5 2 6 6" />
        <path d="M3 14c5 2 13 2 18 0" />
      </svg>
    );
  }
  if (type === "glove") {
    return (
      <svg {...common}>
        <path d="M8 12V6M11 12V4M14 12V5M17 13V8" />
        <path d="M7 12c-2 2-1 8 5 8h3c3 0 5-2 5-5v-2" />
      </svg>
    );
  }
  if (type === "scarf") {
    return (
      <svg {...common}>
        <path d="M9 4h6v10H9z" />
        <path d="M9 14l-2 6M15 14l2 6M10 8h4" />
      </svg>
    );
  }
  if (type === "sunglasses") {
    return (
      <svg {...common}>
        <circle cx="8" cy="12" r="3" />
        <circle cx="16" cy="12" r="3" />
        <path d="M11 12h2M3 10l2 1M21 10l-2 1" />
      </svg>
    );
  }
  if (type === "tie") {
    return (
      <svg {...common}>
        <path d="M10 4h4l1 3-3 3-3-3 1-3Z" />
        <path d="M12 10 8 20h8l-4-10Z" />
      </svg>
    );
  }
  if (type === "boot") {
    return (
      <svg {...common}>
        <path d="M9 4h5v10l5 2v4H8c-2 0-3-1-3-3h4V4Z" />
      </svg>
    );
  }
  if (type === "shoe") {
    return (
      <svg {...common}>
        <path d="M4 15c5 1 8 0 11-4l5 4v3H5c-1 0-2-1-1-3Z" />
        <path d="M12 13l2 2M15 11l2 2" />
      </svg>
    );
  }
  if (type === "backpack") {
    return (
      <svg {...common}>
        <path d="M8 8a4 4 0 0 1 8 0v12H8V8Z" />
        <path d="M8 11H6v6M16 11h2v6M10 14h4M10 5h4" />
      </svg>
    );
  }
  if (type === "bag") {
    return (
      <svg {...common}>
        <path d="M6 9h12l1 11H5L6 9Z" />
        <path d="M9 9a3 3 0 0 1 6 0" />
      </svg>
    );
  }
  if (type === "passport") {
    return (
      <svg {...common}>
        <path d="M7 4h11v16H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M9 16h6" />
      </svg>
    );
  }
  if (type === "wallet") {
    return (
      <svg {...common}>
        <path d="M4 7h15v11H4z" />
        <path d="M15 11h5v4h-5z" />
        <path d="M17 13h.1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M9 4h6l4 4-3 3-1-1v10H9V10l-1 1-3-3 4-4Z" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItemCount = useCartStore((state) => state.itemCount());
  const guestItemCount = useCartStore((state) => state.guestItemCount());
  const itemCount = user ? cartItemCount : guestItemCount;
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("nu");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scopeLabel = scope === "nu" ? "Women" : "Men";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    setScopeOpen(false);
    if (q) router.push(`/tim-kiem?q=${encodeURIComponent(q)}&gender=${scope}`);
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[#111111] transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-white/82 shadow-[0_12px_34px_rgba(17,17,17,0.08)] backdrop-blur-2xl"
          : "bg-white/95 shadow-none backdrop-blur-xl"
      }`}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-[1700px] items-center justify-between px-5 sm:px-8">
        <div className="flex min-w-0 items-center justify-self-start gap-4">
          <button
            className="md:hidden"
            aria-label="Mở menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden h-16 items-center gap-6 md:flex">
            <div className="group flex h-full items-center">
              <Link
                href="/nu"
                className="motion-surface relative py-2 text-[13px] font-semibold uppercase leading-none text-[#111111] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#111111] after:transition-[width] after:duration-300 hover:after:w-full group-hover:after:w-full"
              >
                WOMENSWEAR
              </Link>

              <div className="invisible pointer-events-none absolute left-0 top-16 z-50 w-full -translate-y-3 border-y border-[#111111]/10 bg-white/96 opacity-0 shadow-[0_22px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="grid min-h-[385px] grid-cols-[1.4fr_1fr_0.9fr_0.9fr_1.1fr] gap-12 px-5 py-10 sm:px-8 lg:px-[256px]">
                  {WOMENSWEAR_MENU.map((group) => (
                    <div key={group.title}>
                      <Link
                        href="/nu"
                        className="inline-block border-b border-neutral-700 pb-1 text-[20px] font-bold leading-none text-black hover:text-neutral-600"
                      >
                        {group.title}
                      </Link>
                      <div className={`mt-5 grid gap-x-8 gap-y-3 ${group.columns.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {group.columns.map((column, columnIndex) => (
                          <ul key={`${group.title}-${columnIndex}`} className="space-y-4">
                            {column.map((item) => (
                              <li key={item}>
                                <Link
                                  href="/nu"
                                  className="flex items-center gap-2 text-[15px] leading-none text-black hover:text-[#b88658]"
                                >
                                  <MenuItemIcon label={item} />
                                  <span>{item}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="space-y-10 pt-1">
                    <Link href="/nu" className="flex items-center gap-3 text-[26px] font-normal text-black hover:text-[#b88658]">
                      <Tag size={25} strokeWidth={1.8} />
                      <span>Thương hiệu</span>
                    </Link>
                    <Link href="/nu" className="flex items-center gap-3 text-[26px] font-normal text-black hover:text-[#b88658]">
                      <BadgePercent size={25} strokeWidth={1.8} />
                      <span>Giảm giá</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex h-full items-center">
              <Link
                href="/nam"
                className="motion-surface relative py-2 text-[13px] font-semibold uppercase leading-none text-[#111111] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#111111] after:transition-[width] after:duration-300 hover:after:w-full group-hover:after:w-full"
              >
                MENSWEAR
              </Link>

              <div className="invisible pointer-events-none absolute left-0 top-16 z-50 w-full -translate-y-3 border-y border-[#111111]/10 bg-white/96 opacity-0 shadow-[0_22px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="grid min-h-[385px] grid-cols-[1.4fr_1fr_0.9fr_0.9fr_1.1fr] gap-12 px-5 py-10 sm:px-8 lg:px-[256px]">
                  {MENSWEAR_MENU.map((group) => (
                    <div key={group.title}>
                      <Link
                        href="/nam"
                        className="inline-block border-b border-neutral-700 pb-1 text-[20px] font-bold leading-none text-black hover:text-neutral-600"
                      >
                        {group.title}
                      </Link>
                      <div className={`mt-5 grid gap-x-8 gap-y-3 ${group.columns.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {group.columns.map((column, columnIndex) => (
                          <ul key={`${group.title}-${columnIndex}`} className="space-y-4">
                            {column.map((item) => (
                              <li key={item}>
                                <Link
                                  href="/nam"
                                  className="flex items-center gap-2 text-[15px] leading-none text-black hover:text-[#b88658]"
                                >
                                  <MenuItemIcon label={item} />
                                  <span>{item}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="space-y-10 pt-1">
                    <Link href="/nam" className="flex items-center gap-3 text-[26px] font-normal text-black hover:text-[#b88658]">
                      <Tag size={25} strokeWidth={1.8} />
                      <span>Thương hiệu</span>
                    </Link>
                    <Link href="/nam" className="flex items-center gap-3 text-[26px] font-normal text-black hover:text-[#b88658]">
                      <BadgePercent size={25} strokeWidth={1.8} />
                      <span>Giảm giá</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/tim-kiem?q=couple"
              className="motion-surface relative py-2 text-[13px] font-semibold uppercase leading-none text-[#111111] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#111111] after:transition-[width] after:duration-300 hover:after:w-full"
            >
              COUPLE
            </Link>
          </nav>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-black"
          aria-label="SHMILY home"
        >
          <Sparkles size={29} strokeWidth={2.25} className="hidden sm:block" />
          <span
            className="text-[34px] font-semibold italic leading-none tracking-[0.015em] sm:text-[40px]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            SHMILY
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-8">
          <form
            onSubmit={handleSearch}
            className="motion-surface relative hidden h-10 w-[425px] items-center rounded-[9px] border border-[#c99b74] bg-white px-4 focus-within:border-[#9b6a45] focus-within:shadow-[0_8px_24px_rgba(153,106,69,0.12)] xl:flex"
          >
            <Search size={22} strokeWidth={2} className="mr-4 shrink-0 text-[#111111]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[#111111] placeholder:text-[#707072] outline-none"
            />
            <span className="mx-4 h-6 w-px shrink-0 bg-[#111111]/12" />
            <div className="relative flex shrink-0 items-center">
              <button
                type="button"
                className="flex h-9 min-w-[84px] items-center justify-between gap-3 bg-transparent text-left text-[16px] font-semibold text-[#111111] outline-none"
                aria-haspopup="listbox"
                aria-expanded={scopeOpen}
                onClick={() => setScopeOpen((open) => !open)}
              >
                <span>{scopeLabel}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.9}
                  className={`text-black transition-transform duration-300 ${scopeOpen ? "rotate-180" : ""}`}
                />
              </button>

              {scopeOpen && (
                <div className="absolute right-[-15px] top-[38px] z-50 w-[112px] rounded-[9px] border border-[#111111]/10 bg-white py-1 shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
                  {[
                    { value: "nu", label: "Women" },
                    { value: "nam", label: "Men" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="block w-full px-4 py-2 text-left text-[15px] font-semibold leading-5 text-[#111111] hover:bg-[#f4f1ed]"
                      onClick={() => {
                        setScope(option.value);
                        setScopeOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          <Link href="/gio-hang" className="relative hidden md:block" aria-label="Giỏ hàng">
            <ShoppingBag size={22} strokeWidth={1.5} className="text-black" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="group relative">
              <button
                className="motion-surface motion-press flex h-[30px] w-[30px] items-center justify-center rounded-full border border-black hover:bg-[#111111] hover:text-white"
                aria-label="Tài khoản"
              >
                <UserRound size={18} strokeWidth={1.6} />
              </button>
              <div className="invisible absolute right-0 mt-2 w-44 translate-y-2 rounded-lg border border-neutral-200 bg-white py-2 opacity-0 shadow-lg transition-all duration-[250ms] ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <p className="truncate px-4 py-1 text-xs text-neutral-500">{user.name}</p>
                <Link href="/tai-khoan" className="block px-4 py-2 text-sm hover:bg-neutral-50">
                  Tài khoản của tôi
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-neutral-50">
                    Trang quản trị
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-50"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="motion-surface motion-press flex h-[30px] w-[30px] items-center justify-center rounded-full border border-black hover:bg-[#111111] hover:text-white"
              aria-label="Đăng nhập"
            >
              <UserRound size={18} strokeWidth={1.6} />
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="section-shell mx-4 mb-4 flex flex-col gap-1 border-t border-neutral-200 px-4 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#f7f7f7]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <form
            onSubmit={handleSearch}
            className="mt-3 flex h-11 items-center gap-2 rounded-lg border border-[#c99b74] px-3"
          >
            <Search size={15} className="text-neutral-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none"
            />
            <ChevronDown size={14} className="shrink-0 text-neutral-500" />
          </form>
          <Link
            href="/gio-hang"
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#f7f7f7]"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag size={16} strokeWidth={1.6} />
            GIỎ HÀNG{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </nav>
      )}
    </header>
  );
}
