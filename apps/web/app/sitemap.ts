import type { MetadataRoute } from "next";
import { getBlogPosts, getDocs } from "../utils/blog";

const BASE_URL = "https://snappinapp.com";

type SitemapEntry = {
    path: string;
    lastModified: string;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
};

const routes: SitemapEntry[] = [
    {
        path: "/",
        lastModified: "2025-04-01",
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
        priority: 1,
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
    {
        path: "/tools/receipt-to-excel-converter",
        lastModified: "2026-05-10",
        changeFrequency: "yearly",
        priority: 0.4,
    },
];

export default function sitemap(): MetadataRoute.Sitemap {

    const blogPosts = getBlogPosts();
    const blogRoutes: SitemapEntry[] = blogPosts.map((post) => {
        const publishedAt =
            "publishedAt" in post.metadata
                ? post.metadata.publishedAt
                : new Date().toISOString();
        const publishDate = new Date(publishedAt);
        publishDate.setHours(9, 0, 0, 0); // Set time to 9:00 AM
        return {
            path: `/blog/${post.slug}`,
            lastModified: publishDate.toISOString(),
            changeFrequency: "monthly",
            priority: 0.8
        };
    });

    // Add docs routes
    const docs = getDocs();
    const docsRoutes: SitemapEntry[] = docs.map((doc) => ({
        path: `/docs/${doc.slug}`,
        lastModified: new Date().toISOString(), // You might want to add a publishedAt to doc metadata
        priority: 0.5
    }));

    return [...routes, ...blogRoutes, ...docsRoutes].map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: new Date(route.lastModified),
        priority: route.priority,
    }));
}