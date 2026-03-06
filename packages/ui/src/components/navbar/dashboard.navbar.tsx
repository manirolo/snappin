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
} from "../sidebar";
import { IconType } from "react-icons";
import {
  HiOutlineCollection,
  HiOutlineDeviceMobile,
  HiOutlineInbox,
  HiOutlineDocument ,
  HiOutlinePuzzle,
  HiOutlineCog ,
} from "react-icons/hi";
import { cn } from "@snappin/ui/lib/utils";
import { usePathname } from "next/navigation";

export type Navbar = {
  href?: string;
  icon: IconType;
  label: string;
};

const mainNav: Navbar[] = [
  { href: "/home", label: "Home", icon: HiOutlineCollection },
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
    icon: HiOutlineInbox ,
  },
  {
    href: "/mobile-scanners",
    label: "Mobile Scanners",
    icon: HiOutlineDeviceMobile,
  },
];

const settingsNav: Navbar[] = [
  { href: "/integrations", label: "Integration", icon: HiOutlinePuzzle },
  { href: "/settings", label: "Settings", icon: HiOutlineCog  },
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
      <Link
        className={cn(
          "flex items-center hover:bg-sidebar-accent py-2 rounded-lg px-2 gap-3 text-sm font-medium text-center",
          active && "bg-sidebar-accent text-sidebar-accent-foreground [&_svg]:text-primary",
        )}
        href={href ?? ""}
      >
        <Icon className="size-5" />
        {label}
      </Link>
    </SidebarMenuItem>
  );
};

export const AppSidebar = () => {
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="pt-5">
        <Logo darkLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Accounting</SidebarGroupLabel>
          <SidebarMenu>
            {accountingNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Sources</SidebarGroupLabel>
          <SidebarMenu>
            {sourceNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {settingsNav.map((nav, i) => (
              <NavItem key={i} {...nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
