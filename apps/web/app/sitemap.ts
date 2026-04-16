import type { MetadataRoute } from "next";

const BASE_URL = "https://snappinapp.com";

type SitemapEntry = {
    path: string;
    lastModified: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
};

const routes: SitemapEntry[] = [
    {
        path: "/",
        lastModified: "2025-04-01",
        changeFrequency: "daily",
        priority: 1.0,
    },
    {
        path: "/blog",
        lastModified: "2025-01-01",
        changeFrequency: "daily",
        priority: 0.3,
    },
        {
        path: "/docs",
        lastModified: "2025-01-01",
        changeFrequency: "monthly",
        priority: 0.6,
    },
    {
        path: "/pricing",
        lastModified: "2025-04-01",
        changeFrequency: "monthly",
        priority: 0.9,
    },
    {
        path: "/login",
        lastModified: "2025-01-01",
        changeFrequency: "yearly",
        priority: 0.5,
    },
    {
        path: "/signup",
        lastModified: "2025-01-01",
        changeFrequency: "yearly",
        priority: 0.6,
    },
    {
        path: "/terms",
        lastModified: "2025-01-01",
        changeFrequency: "yearly",
        priority: 0.3,
    },
    {
        path: "/policy",
        lastModified: "2025-01-01",
        changeFrequency: "yearly",
        priority: 0.3,
    },
    {
        path: "/contact",
        lastModified: "2025-01-01",
        changeFrequency: "yearly",
        priority: 0.4,
    },
];

export default function sitemap(): MetadataRoute.Sitemap {
    return routes.map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: new Date(route.lastModified),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}