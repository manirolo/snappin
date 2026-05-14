"use client";

import { LogoSymbol } from "../logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
  UserIcon,
  DollarCircleIcon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  Comment02Icon,
  Logout01Icon,
  MoneyBag02Icon,
  Settings01Icon as SettingsIcon,
  Home01Icon as HomeIcon,
  Book04Icon,
} from "@hugeicons-pro/core-stroke-rounded";
// import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { Badge } from "../badge";
import React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type User = {
  fullName?: string | null;
  imageUrl?: string;
  primaryEmailAddress?: { emailAddress: string | null } | null;
};

type NavItem = {
  href: string;
  icon: IconSvgElement;
  label: string;
};

type NavbarVariant = "dashboard" | "admin";

// ─── Nav Configs ─────────────────────────────────────────────────────────────

const dashboardNav: NavItem[] = [
  { href: "/dashboard", icon: Home01Icon, label: "Dashboard" },
  { href: "/integrations", icon: MenuSquareIcon, label: "Integrations" },
];

const adminNav: NavItem[] = [
  { href: "/", icon: Home01Icon, label: "Dashboard" },
  { href: "/users", icon: UserIcon, label: "Users" },
  { href: "/pricing", icon: DollarCircleIcon, label: "Pricing" },
];

const navConfigs: Record<NavbarVariant, NavItem[]> = {
  dashboard: dashboardNav,
  admin: adminNav,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NavItems = ({ variant }: { variant: NavbarVariant }) => {
  const pathname = usePathname();
  const items = navConfigs[variant];

  return (
    <>
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          // <Tooltip key={item.href}>
          //   <TooltipTrigger>
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-center hover:bg-bg-a2 gap-2 p-2 rounded-full border border-transparent text-sm font-semibold transition-all duration-200",
              active
                ? "text-accent-foreground"
                : "text-fg-1 hover:text-foreground hover:bg-bg-a1",
            )}
          >
            <HugeiconsIcon
              className="size-6"
              strokeWidth={0.5}
              icon={item.icon}
            />
            {/* {item.label} */}
          </Link>
          // </TooltipTrigger>
          //<TooltipContent side="bottom" sideOffset={4}>
          //  {item.label}
          //</TooltipContent>
          //</Tooltip> */}
        );
      })}
    </>
  );
};

// ─── User Dropdown ────────────────────────────────────────────────────────────

const UserDropdown = ({
  user,
  planId,
  signOut,
  variant,
  billingButton,
}: {
  user: User;
  planId: string;
  signOut: () => void;
  variant: NavbarVariant;
  billingButton?: React.ReactNode;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="cursor-pointer rounded-md flex items-center gap-2 p-1 transition-all duration-200 hover:bg-bg-a1">
      <Avatar className="size-8">
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback />
      </Avatar>
      {/* <Small className="text-foreground leading-4">{user?.fullName}</Small> */}
    </DropdownMenuTrigger>

    <DropdownMenuContent sideOffset={4} align="end" className="min-w-68 p-0">
      {/* User info */}
      <DropdownMenuGroup className="w-full gap-2 p-0 m-0">
        <div className="bg-bg-1 flex flex-col gap-5 p-3 min-h-28">
          <Badge
            size={"xs"}
            variant={"mono"}
            className="w-fit uppercase rounded-full"
          >
            {planId}
          </Badge>
          <div className="flex items-center gap-4">
            <Avatar className="size-9">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback />
            </Avatar>
            <div className="flex flex-col min-w-0">
              <Small className="text-foreground leading-4 truncate">
                {user?.primaryEmailAddress?.emailAddress?.split("@")[0]}
              </Small>
              <Small className="text-[12px] text-fg-2 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </Small>
            </div>
          </div>
          {billingButton}
        </div>
      </DropdownMenuGroup>

      {/* Dashboard-only items */}
      {variant === "dashboard" && (
        <>
          <DropdownMenuGroup className="px-2 pt-2">
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center justify-between w-full"
              >
                Settings{" "}
                <HugeiconsIcon
                  className="size-4 text-fg-2"
                  strokeWidth={2}
                  icon={SettingsIcon}
                />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="https://snappin.lemonsqueezy.com/affiliates"
                target="_blank"
                className="flex items-center justify-between w-full"
              >
                Affiliate{" "}
                <HugeiconsIcon
                  className="size-4 text-fg-2"
                  strokeWidth={2}
                  icon={MoneyBag02Icon}
                />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="https://snappinapp.userjot.com/"
                target="_blank"
                className="flex items-center justify-between w-full"
              >
                Feedback{" "}
                <HugeiconsIcon
                  className="size-4 text-fg-2"
                  strokeWidth={2}
                  icon={Comment02Icon}
                />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/"
                className="flex items-center justify-between w-full"
              >
                Home{" "}
                <HugeiconsIcon
                  className="size-4 text-fg-2"
                  strokeWidth={2}
                  icon={HomeIcon}
                />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/docs"
                className="flex items-center justify-between w-full"
              >
                Documentations{" "}
                <HugeiconsIcon
                  className="size-4 text-fg-2"
                  strokeWidth={2}
                  icon={Book04Icon}
                />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}

      <DropdownMenuGroup className="px-2 pb-2">
        <DropdownMenuItem
          onSelect={signOut}
          className="flex items-center justify-between w-full hover:bg-destructive/5! hover:text-destructive!"
        >
          Sign Out{" "}
          <HugeiconsIcon
            className="size-4"
            strokeWidth={2}
            icon={Logout01Icon}
          />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const LOGO_REDIRECT: Record<NavbarVariant, string> = {
  dashboard: "/dashboard",
  admin: "/",
};

export const Navbar = ({
  user,
  signOut,
  variant = "dashboard",
  showNavItems = true,
  planId,
  billingButton,
  organization,
}: {
  user: User;
  signOut: () => void;
  variant?: NavbarVariant;
  showNavItems?: boolean;
  planId?: string;
  billingButton?: React.ReactNode;
  organization?: React.ReactNode;
}) => (
  <div>
    {/* Top bar */}
    <div className="flex items-center justify-between h-18 px-4 xl:px-8 border-b border-b-bg-3">
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex">
          <LogoSymbol onClickRedirectLink={LOGO_REDIRECT[variant]}><span className="text-lg">Snappin</span></LogoSymbol>
        </div>
        <div className="flex lg:hidden">
          <LogoSymbol onClickRedirectLink={LOGO_REDIRECT[variant]} />
        </div>
      </div>
      {/* Secondary nav */}
      {showNavItems && (
        <div className="border-b-0 max-w-fit mx-auto">
          <div className="flex items-center gap-8">
            <NavItems variant={variant} />
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <div>{organization}</div>
        <UserDropdown
          billingButton={billingButton}
          planId={planId ?? "basic"}
          user={user}
          signOut={signOut}
          variant={variant}
        />
      </div>
    </div>
  </div>
);

// ─── Named aliases (backwards compat) ────────────────────────────────────────

export const DashboardNavbar = (
  props: Omit<React.ComponentProps<typeof Navbar>, "variant">,
) => <Navbar {...props} variant="dashboard" />;

export const AdminNavbar = (
  props: Omit<React.ComponentProps<typeof Navbar>, "variant">,
) => <Navbar {...props} variant="admin" />;
