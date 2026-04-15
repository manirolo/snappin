import Link from "next/link";
import { Logo } from "../logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarMenuButton,
} from "../sidebar";
import { IconType } from "react-icons";
import {
  HiOutlineCollection,
  HiOutlineDeviceMobile,
  HiOutlineInbox,
  HiOutlineDocument,
  HiOutlinePuzzle,
  HiOutlineCog,
} from "react-icons/hi";
import { cn } from "@snappin/ui/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

export type Navbar = {
  href?: string;
  icon: IconType;
  label: string;
  target?: React.HTMLAttributeAnchorTarget;
  variant?: "default" | "destructive";
  onClick?: () => void;
};

const mainNav: Navbar[] = [
  { href: "/dashboard", label: "Home", icon: HiOutlineCollection },
];

const accountingNav: Navbar[] = [
  {
    href: "/bookkeeping/documents",
    label: "Documents",
    icon: HiOutlineDocument,
  },
];

const sourceNav: Navbar[] = [
  {
    href: "/accounts",
    label: "Email Accounts",
    icon: HiOutlineInbox,
  },
  {
    href: "/mobile-scanners",
    label: "Mobile Scanners",
    icon: HiOutlineDeviceMobile,
  },
];

const settingsNav: Navbar[] = [
  { href: "/integrations", label: "Integration", icon: HiOutlinePuzzle },
  { href: "/settings", label: "Settings", icon: HiOutlineCog },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
};

const NavItem = ({ href, icon: Icon, label }: Navbar) => {
  const pathname = usePathname();
  const active = isActivePath(pathname, href!);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild >
        <Link
          className={cn(
            "flex items-center hover:bg-sidebar-accent py-2 rounded-md px-2 gap-2 text-sm font-medium text-center [&_svg]:size-5!",
            active && "bg-sidebar-accent text-sidebar-accent-foreground [&_svg]:text-primary",
          )}
          href={href ?? ""}
        >
          <Icon className="size-7" />
          {label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const AppSidebar = ({
  footer,
  organization,
}: {
  footer?: React.ReactNode;
  organization?: React.ReactNode;
}) => {
  return (
    <Sidebar className="border-r-0 px-0">
      <SidebarHeader className="pt-5">
        <div className="px-4 mb-5"><Logo darkLogo /></div>
        {organization && <div>{organization}</div> }
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 uppercase text-[11px]">Main</SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 uppercase text-[11px]">Accounting</SidebarGroupLabel>
          <SidebarMenu>
            {accountingNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 uppercase text-[11px]">Sources</SidebarGroupLabel>
          <SidebarMenu>
            {sourceNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 uppercase text-[11px]">Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {settingsNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 ">{footer}</SidebarFooter>
    </Sidebar>
  );
};
