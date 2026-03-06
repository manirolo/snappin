"use client";
import { Logo } from "../logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Small } from "../typography";
import Link from "next/link";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { usePathname } from "next/navigation";
import { cn } from "@snappin/ui/lib/utils";
import {
  Home01Icon,
  MenuSquareIcon,
  Search01Icon,
} from "@hugeicons-pro/core-duotone-rounded";
import { Icon } from "@iconify/react";

type User = {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  fullName?: string | null | undefined;
  imageUrl?: string | undefined;
  primaryEmailAddress?:
    | {
        emailAddress: string | null | undefined;
      }
    | null
    | undefined;
};

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
};

export type Navbar = {
  href?: string;
  icon: IconSvgElement;
  label: string;
  type?: "link" | "dropdown";
};

const nav: Navbar[] = [
  { href: "/home", icon: Home01Icon, label: "Dashboard", type: "link" },
  { href: "/bookkeeping/documents", icon: Home01Icon, label: "Invoices", type: "link" },
  { href: "/accounts", icon: Home01Icon, label: "Email Accounts", type: "link" },
  { href: "/mobile-scanners", icon: Home01Icon, label: "Mobile Scanners", type: "link" },
  {
    href: "/integrations",
    icon: MenuSquareIcon,
    label: "Integrations",
    type: "link",
  },
  { href: "/settings", icon: MenuSquareIcon, label: "Settings", type: "link" },
];

const NavItems = () => {
  const pathname = usePathname();

  return (
    <>
      {nav.map((item, i) => {
        const active = isActivePath(pathname, item.href!);
        return (
          <Link
            key={i}
            href={item.href!}
            className={cn(
              "flex items-center gap-2 p-2 py-1.5 rounded-xl border transition-all duration-300",
              active
                ? "bg-blue-100 border-blue-300 text-blue-500 shadow-[0px_3px_0px_var(--color-blue-300)]"
                : "bg-accent/90 hover:bg-accent",
            )}
          >
            {/* {active &&  <HugeiconsIcon icon={item.icon} className="size-4" />} */}

            <span className="text-[14px] font-rubik font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </>
  );
};

const DesktopNavbar = ({
  user,
  signOut,
  showNavItems = true,
}: {
  user: User;
  signOut: () => void;
  showNavItems?: boolean;
}) => {
  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between py-2.5 px-4 min-h-20 xl:px-0 max-w-5xl mx-auto",
          !showNavItems && "border-b-0",
        )}
      >
        {/* Logo */}
        <Logo />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-gray-4 cursor-pointer rounded-md transition-all duration-300 p-1">
            <Avatar className="size-7">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-1">
              <div>
                <Avatar className="size-7">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-0">
                <Small className="text-foreground leading-4">
                  {user?.fullName}
                </Small>
                <Small className="md:text-[13px]">
                  {user?.primaryEmailAddress?.emailAddress}
                </Small>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/account/settings">Settings</Link>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={signOut}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Center nav */}
      {showNavItems && (
        <div className="flex flex-wrap md:flex-nowrap px-4 xl:px-0 mt-8 justify-start max-w-5xl mx-auto items-center gap-3">
          <NavItems />
        </div>
      )}
    </div>
  );
};

export const DashboardNavbar = ({
  user,
  signOut,
  showNavItems = true,
}: {
  user: User;
  signOut: () => void;
  showNavItems?: boolean;
}) => {
  return (
    <DesktopNavbar showNavItems={showNavItems} user={user} signOut={signOut} />
  );
};