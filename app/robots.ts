import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
