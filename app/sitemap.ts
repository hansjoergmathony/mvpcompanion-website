import type { MetadataRoute } from "next";
import { sitemapPaths } from "@/content/en/site";
import { site } from "@/content/en/site";
import { localizePath } from "@/lib/i18n/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapPaths.flatMap((path) => {
    const englishPath = localizePath(path, "en");
    const germanPath = localizePath(path, "de");
    const english = englishPath === "/" ? site.domain : `${site.domain}${englishPath}`;
    const german = `${site.domain}${germanPath}`;

    return [
      {
        url: english,
        lastModified,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.7,
        alternates: { languages: { en: english, de: german } },
      },
      {
        url: german,
        lastModified,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 0.9 : 0.6,
        alternates: { languages: { en: english, de: german } },
      },
    ] satisfies MetadataRoute.Sitemap;
  });
}
