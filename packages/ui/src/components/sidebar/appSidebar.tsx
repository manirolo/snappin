"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../sidebar"
import { Archive02Icon, InboxIcon, Invoice02Icon, Settings01Icon, ArrowUp02Icon, Comment02Icon } from "@hugeicons-pro/core-bulk-rounded"
import { HugeiconsIcon } from "@hugeicons/react"
import { TabCategory } from '@snappin/ui/components/navbar/sidebar'
import { Logo } from "../logo"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type AppSidebarProps = {
    user: React.ReactNode
}

export const tabs: TabCategory[] = [
    {
        title: "Main",
        tabs: [
            {
                name: "Dashboard",
                value: "",
                href: "/",
                icon: Archive02Icon
            },
            {
                name: "Invoices",
                value: "invoices",
                href: "/invoices",
                icon: Invoice02Icon
            },
            {
                name: "Inbox",
                value: "inbox",
                href: "/inbox",
                icon: InboxIcon
            },
            {
                name: "Settings",
                value: "settings",
                href: "/settings",
                icon: Settings01Icon
            },
        ]
    }
]

const footerNav = [
    // { label: "Buy Credits", icon: ShoppingCart01Icon, href: "/account/settings" },
    { label: "Feedback", icon: Comment02Icon, href: "/account/credit" },
]

export const getActiveTabFromPath = (pathname: string, tabs: { value: string }[]) => {
    const path = pathname.replace(/^\/+/, "");

    const match = tabs.find(tab =>
        path === tab.value || path.startsWith(`${tab.value}/`)
    );

    return match?.value ?? tabs[0]?.value;
};


export const AppSidebar = ({ user }: AppSidebarProps) => {
    const pathname = usePathname()

    const flatTabs = React.useMemo(
        () => tabs.flatMap((c) => c.tabs),
        []
    )

    const activeTab = React.useMemo(
        () => getActiveTabFromPath(pathname, flatTabs),
        [pathname, flatTabs]
    )

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex justify-center items-center min-h-12">
                    <Logo />
                </div>
            </SidebarHeader>
            <SidebarContent>
                {tabs.map((category, i) => (
                    <SidebarGroup key={i}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {category.tabs.map((tab, i) => (
                                    <SidebarMenuItem key={i}>
                                        <SidebarMenuButton isActive={tab.value == activeTab} className="text-sidebar-foreground/60" asChild>
                                            <Link href={tab?.href ?? "#"}>
                                                <div className="flex items-center gap-2">
                                                    {tab.icon && <HugeiconsIcon icon={tab.icon} className="size-5" />}
                                                    <span className="font-medium">{tab.name}</span>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu className="mb-2">
                    {footerNav.map((_, i) => (
                        <SidebarMenuItem key={i}>
                            <SidebarMenuButton className="text-sidebar-foreground/60" asChild>
                                <Link href={_.href ?? "#"} className="flex items-center justify-between gap-2">
                                    <div className='flex items-center gap-2'>
                                        <HugeiconsIcon icon={_.icon} className="size-4" />
                                        <span className="font-medium">{_.label}</span>
                                    </div>
                                    <HugeiconsIcon icon={ArrowUp02Icon} className="size-5 rotate-45" />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                {user && (
                    <div>
                        {user}
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
