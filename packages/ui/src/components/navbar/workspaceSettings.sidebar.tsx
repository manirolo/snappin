import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroupLabel,
} from "../sidebar";
import { IconType } from "react-icons";
import { HiOutlineArrowSmLeft, HiOutlineCog, HiOutlineUserGroup } from "react-icons/hi";
import { cn } from "@snappin/ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../button";
import { Logo } from "../logo";

export type Navbar = {
  href?: string;
  icon: IconType;
  label: string;
  target?: React.HTMLAttributeAnchorTarget;
  variant?: "default" | "destructive";
  onClick?: () => void;
};

const mainNav: Navbar[] = [
  { href: "/settings", label: "General", icon: HiOutlineCog },
  { href: "/members", label: "Team", icon: HiOutlineUserGroup },
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
      <SidebarMenuButton asChild>
        <Link
          className={cn(
            "flex items-center hover:bg-sidebar-accent py-2 rounded-lg px-2 gap-3 text-sm font-medium text-center [&_svg]:size-5!",
            active && "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
          href={href ?? ""}
        >
          <Icon className="size-6" />
          {label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const WorkspaceSettingsSidebar = () => {
  const router = useRouter();
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="pt-5 flex flex-col gap-4 mb-4">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-0 text-sidebar-foreground"
          onClick={() => router.push("/home")}
        >
          <HiOutlineArrowSmLeft />
          Back to dashboard
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter className="flex justify-center items-center py-4 pr-6">
        <Logo darkLogo />
      </SidebarFooter> */}
    </Sidebar>
  );
};
