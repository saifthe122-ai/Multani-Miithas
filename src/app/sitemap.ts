import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://multani-mithas.vercel.app";
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/privacy-policy`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/refund-return`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/order-cancellation`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/reviews`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
