import Link from "next/link";

export default function Pagination({ pathname, searchParams, pagination }) {
  const { page, totalPages } = pagination;
  if (!totalPages || totalPages <= 1) return null;

  function hrefFor(pageNum) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageNum));
    return `${pathname}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      {pages.map((p, idx) => (
        <span key={p} className="flex items-center gap-2">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="text-neutral-400">…</span>}
          <Link
            href={hrefFor(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
              p === page ? "bg-black text-white" : "border border-neutral-300 hover:border-black"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}
    </nav>
  );
}
