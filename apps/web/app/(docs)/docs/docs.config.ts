export interface SidebarLink {
    title: string;
    slug: string;
}

export interface SidebarGroup {
    title: string;
    items: SidebarLink[];
}

export const docsConfig = {
    sidebar: [
        {
            title: "Getting Started",
            items: [
                { title: "Introduction", slug: "" },
                { title: "Quickstart", slug: "quickstart" },
            ],
        },
    ] satisfies SidebarGroup[],
};

export function flattenSidebar(): SidebarLink[] {
    return docsConfig.sidebar.flatMap((group) => group.items);
}

export function getAdjacentDocs(currentSlug: string) {
    const flat = flattenSidebar();
    const idx = flat.findIndex((item) => item.slug === currentSlug);
    return {
        prev: idx > 0 ? flat[idx - 1] : null,
        next: idx < flat.length - 1 ? flat[idx + 1] : null,
    };
}

export function getBreadcrumbs(currentSlug: string) {
    for (const group of docsConfig.sidebar) {
        const item = group.items.find((i) => i.slug === currentSlug);
        if (item) {
            return [
                { title: "Docs", slug: "" },
                { title: group.title, slug: group.items[0]?.slug ?? "" },
                { title: item.title, slug: item.slug },
            ];
        }
    }
    return [{ title: "Docs", slug: "" }];
}