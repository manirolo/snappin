import type { MetadataRoute } from "next";
import { env } from "@snappin/env";

export default function robots(): MetadataRoute.Robots {
    const isProduction = env.env === "production" || true;

    if (!isProduction) {
        return {
            rules: {
                userAgent: "*",
                disallow: "/",
            },
        };
    }

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/pricing", "/terms", "/policy", "/contact", "/tools/", "/blog", "/blog/", "/docs", "/docs/"],
                disallow: [
                    "/dashboard",
                    "/retroSearch",
                    "/settings",
                    "/integrations",
                    "/already-account-connected",
                    "/connection-failed",
                    "/connect",
                    "/api",
                    "/api/"
                ],
            },
            {
                userAgent: "Googlebot,Bingbot,Slurp,DuckDuckBot,Baiduspider,Yandex,Sogou,Exabot,facebot,facebookexternalhit,Twitterbot,Applebot,AhrefsBot,SemrushBot,MJ12bot",
                allow: ["/", "/pricing", "/terms", "/policy", "/contact", "/tools/", "/blog", "/blog/", "/docs", "/docs/"],
                disallow: [
                    "/dashboard",
                    "/retroSearch",
                    "/settings",
                    "/integrations",
                    "/already-account-connected",
                    "/connection-failed",
                    "/connect",
                    "/api",
                    "/api/"
                ],
            },
        ],
        sitemap: "https://snappinapp.com/sitemap.xml",
    };
}