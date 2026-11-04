import type { MetadataRoute } from "next";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.SITE_URL || "https://multani-mithas.vercel.app").replace(/\/$/, "");

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/privacy-policy`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/refund-return`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/order-cancellation`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/reviews`, lastModified, changeFrequency: "weekly", priority: 0.5 },
  ];

  if (!process.env.DATABASE_URL) return staticPages;

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT DISTINCT category FROM products
      WHERE is_active = true AND NULLIF(BTRIM(category), '') IS NOT NULL
      ORDER BY category ASC`;
    const categoryPages = rows
      .map((row) => String(row.category ?? "").trim())
      .filter(Boolean)
      .map((category) => ({
        url: `${SITE_URL}/shop/${slugify(category)}`,
        lastModified,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
    return [...staticPages, ...categoryPages];
  } catch (error) {
    console.error("Dynamic sitemap category lookup failed:", error);
    return staticPages;
  }
}
