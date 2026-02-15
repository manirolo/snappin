import React from "react"
import { IconSvgElement } from "@hugeicons/react";

export type BadgeVariant = "primary" | "secondary" | "destructive" | "outline" | null | undefined

export type TabProps = {
    icon?: IconSvgElement,
    name: string,
    value: string,
    content?: React.ReactNode,
    badge?: string,
    badgeVariant?: BadgeVariant
}

export type TabCategory = {
    title: string
    tabs: TabProps[]
}
export interface IDashboardNavItem {
    title: string;
    url: string
    icon: IconSvgElement,
    description: string,
    subMenu?: {
        title: string,
        url: string,
        icon: IconSvgElement,
        description: string
    }[]
}

export interface IDropDownUserItem {
    icon: IconSvgElement,
    label: string,
    url?: string,
}

export interface IDropDownUserMenu {
    menu: IDropDownUserItem[]
}