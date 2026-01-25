"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'
import { Button } from '../button'
import { usePathname, useRouter } from 'next/navigation'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import { Icon } from "@iconify/react"
import { ExtraSmall } from '../typography'

export type TabProps = {
    icon?: IconSvgElement,
    name: string,
    value: string,
    href?: string,
    content?: React.ReactNode
}

export type TabCategory = {
    title: string
    tabs: TabProps[]
}
export const getActiveTabFromPath = (pathname: string, tabs: { value: string }[]) => {
    const path = pathname.replace(/^\/+/, "");

    const match = tabs.find(tab =>
        path === tab.value || path.startsWith(`${tab.value}/`)
    );

    return match?.value ?? tabs[0]?.value;
};

export const Sidebar = ({ enableGoBackButton, children, tabs }: { enableGoBackButton?: boolean, children: React.ReactNode, tabs: TabCategory[] }) => {
    const router = useRouter();
    const pathname = usePathname()


    const flatTabs = React.useMemo(
        () => tabs.flatMap((c) => c.tabs),
        [tabs]
    );

    const [activeTab, setActiveTab] = React.useState(
        getActiveTabFromPath(pathname, flatTabs)
    )

    const changeTab = (value: string) => {
        setActiveTab(value)
        router.push(`/${value}`)
    }

    return (
        <div className='w-full max-w-md'>
            {/* ================= MOBILE / TABLET MENU BUTTON ================= */}
            <Tabs value={activeTab} onValueChange={changeTab} className='flex flex-row'>
                <div className="hidden lg:flex flex-col">
                    <div>
                        {enableGoBackButton && (
                            <div className="pt-2">
                                <Button variant="ghost" onClick={() => router.push("/")}>
                                    <Icon icon={"si:arrow-left-duotone"} />
                                    Back to dashboard
                                </Button>
                            </div>
                        )}
                    </div>
                    {tabs.map((category, i) => (
                        <TabsList key={i} className='bg-background min-w-48 my-4 gap-0.5 flex-col text-start items-start rounded-none p-0'>
                            <ExtraSmall className='mb-2 text-gray-12'>{category.title}</ExtraSmall>
                            {category.tabs.map((tab, j) => (
                                <TabsTrigger key={j} value={tab.value} className='p-2.5 text-start justify-start rounded-md min-w-full gap-3 items-center'>
                                    {tab.icon && (
                                        <HugeiconsIcon
                                            icon={tab.icon}
                                            className="size-7"
                                        />
                                    )}

                                    {tab.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    ))}
                </div>

                {flatTabs.map((tab, i) => (
                    <TabsContent
                        key={i}
                        value={tab.value}
                        className="py-3 px-2 overflow-y-auto"
                    >
                        {children}
                    </TabsContent>
                ))}
            </Tabs>
        </div>

    )
}
