import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SHMILY - Thời trang Nam & Nữ chính hãng",
    template: "%s | SHMILY",
  },
  description:
    "SHMILY - mua sắm thời trang nam và nữ chính hãng, giá tốt, giao hàng toàn quốc. Cập nhật xu hướng áo thun, sơ mi, đầm, chân váy, quần jean mới nhất.",
  keywords: ["thời trang nam", "thời trang nữ", "quần áo nam nữ", "shop thời trang online"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "SHMILY",
    title: "SHMILY - Thời trang Nam & Nữ chính hãng",
    description: "Mua sắm thời trang nam và nữ chính hãng, giá tốt, giao hàng toàn quốc.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "SHMILY - Thời trang Nam & Nữ chính hãng",
    description: "Mua sắm thời trang nam và nữ chính hãng, giá tốt, giao hàng toàn quốc.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SHMILY",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  };

  return (
    <html lang="vi" className={`${openSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-neutral-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
