import type { MetadataRoute } from "next";

const SITE_URL = (process.env.SITE_URL || "https://multani-mithas.vercel.app").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin-login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
