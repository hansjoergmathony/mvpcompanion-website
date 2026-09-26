import type { MetadataRoute } from "next";
import { site, sitemapPaths } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapPaths.map((path) => ({
    url: path === "/" ? site.domain : `${site.domain}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
