const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/tai-khoan", "/gio-hang", "/thanh-toan", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
