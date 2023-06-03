import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://door.link",
      lastModified: new Date(),
    },
  ];
}
