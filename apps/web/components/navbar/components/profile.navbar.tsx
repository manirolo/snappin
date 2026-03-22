import { useClerk } from "@clerk/nextjs";
import { truncateEnd } from "@snappin/lib/string/truncate";
import { Avatar, AvatarImage } from "@snappin/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import { Small } from "@snappin/ui/components/typography";
import { cn } from "@snappin/ui/lib/utils";
import Link from "next/link";
import React from "react";
import { HiOutlineUser, HiOutlineCreditCard, HiLogout } from "react-icons/hi";
import { IconType } from "react-icons";

type Navbar = {
  href?: string;
  icon: IconType;
  label: string;
  variant?: "default" | "destructive";
  onClick?: () => void;
};

const NavItem = (nav: Navbar) => {
  return (
    <>
      {nav.variant === "destructive" && <DropdownMenuSeparator />}
      <DropdownMenuItem
        onClick={nav.onClick}
        className={cn(
          nav.variant === "destructive" && "hover:bg-red-50! text-red-500!"
        )}
      >
        {nav.href ? (
          <Link href={nav.href} className="flex items-center gap-2 w-full">
            <nav.icon />
            {nav.label}
          </Link>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <nav.icon />
            {nav.label}
          </div>
        )}
      </DropdownMenuItem>
    </>
  );
};

export const ProfileNavbar = () => {
  const { user, signOut } = useClerk();

  const accountNav: Navbar[] = [
    {
      label: "Personal Settings",
      icon: HiOutlineUser,
      href: "/account/settings",
    },
    {
      label: "Billing",
      icon: HiOutlineCreditCard,
      href: "/account/billing",
    },
    {
      label: "Log out",
      icon: HiLogout,
      variant: "destructive",
      onClick: () => signOut(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-2 hover:bg-sidebar-accent rounded-lg flex gap-4 text-start items-center cursor-pointer">
          <Avatar className="size-8">
            <AvatarImage className="rounded-md" src={user?.imageUrl} />
          </Avatar>

          <div>
            <Small className="text-sidebar-foreground">{user?.fullName}</Small>
            <Small className="text-sidebar-foreground/70">
              {truncateEnd(user?.emailAddresses[0]?.emailAddress ?? "")}
            </Small>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        sideOffset={14}
        align="end"
        alignOffset={12}
        className="w-(--radix-dropdown-menu-trigger-width) px-0"
      >
        <DropdownMenuGroup className="px-4">
          {accountNav.map((nav, i) => (
            <NavItem key={i} {...nav} />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};