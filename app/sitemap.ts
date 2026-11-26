import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.brand.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...site.halls.map((h) => ({
      url: `${site.brand.url}/halls/${h.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site.brand.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
