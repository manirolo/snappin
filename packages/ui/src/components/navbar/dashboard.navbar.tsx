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
import { IconSvgElement } from "@hugeicons/react";
import { usePathname } from "next/navigation";
import { cn } from "@snappin/ui/lib/utils";
import {
  Home01Icon,
  MenuSquareIcon,
  // Search01Icon,
} from "@hugeicons-pro/core-duotone-rounded";

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

type Navbar = {
  href?: string;
  icon: IconSvgElement;
  label: string;
  type?: "link" | "dropdown";
};

const nav: Navbar[] = [
  { href: "/home", icon: Home01Icon, label: "Dashboard", type: "link" },
  {
    href: "/bookkeeping/documents",
    icon: Home01Icon,
    label: "Invoices",
    type: "link",
  },
  {
    href: "/retroSearch",
    icon: Home01Icon,
    label: "Retroactive",
    type: "link",
  },
  {
    href: "/accounts",
    icon: Home01Icon,
    label: "Email Accounts",
    type: "link",
  },
  {
    href: "/mobile-scanners",
    icon: Home01Icon,
    label: "Mobile Scanners",
    type: "link",
  },
  {
    href: "/integrations",
    icon: MenuSquareIcon,
    label: "Integrations",
    type: "link",
  },
  // { href: "/settings", icon: MenuSquareIcon, label: "Settings", type: "link" },
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
              "flex items-center gap-2 px-3 cursor-pointer py-1.5 rounded-lg border transition-all duration-300",
              active
                ? "bg-blue-100 border-blue-300 text-blue-500 shadow-[0px_3px_0px_var(--color-blue-300)]"
                : "border bg-black/4 border-black/3 text-black/90",
            )}
          >
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
      <div className="bg-background">
        <div
          className={cn(
            "flex items-center justify-between py-2 px-4 min-h-12 xl:px-2 max-w-5xl mx-auto",
            !showNavItems && "border-b-0",
          )}
        >
          {/* Logo */}
          <Logo onClickRedirectLink="/home" />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-gray-4 cursor-pointer rounded-md flex items-center gap-2 transition-all duration-300 p-1">
              <Avatar className="size-5">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback></AvatarFallback>
              </Avatar>

              <div className="text-sm">{user?.fullName}</div>
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
                <Link href="/account">General</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/billing">Billing</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/account/billing">Feedback</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/billing">Affiliate</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={signOut}
                className="text-destructive hover:bg-destructive/5! hover:text-destructive!"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Center nav */}
      {showNavItems && (
        <div className="border-b-0 border-border/60 pb-5">
          <div className="flex flex-wrap md:flex-nowrap px-4 xl:px-2 mt-6 justify-start max-w-5xl mx-auto items-center gap-3">
            <NavItems />
          </div>
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
