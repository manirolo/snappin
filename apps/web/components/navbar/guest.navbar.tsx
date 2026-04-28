"use client";

import { Logo } from "@snappin/ui/components/logo";
import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@snappin/ui/components/avatar";
import posthog from "posthog-js";
import { WorkspaceSwitcher } from "./workspaceSwitcher";

export const GuestNavbar = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n![0])
    .join("")
    .toUpperCase();

  return (
    <div className="h-screen max-w-3xl mx-auto">
      <div className="min-h-18 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2">
          <WorkspaceSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-7 cursor-pointer">
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.fullName ?? "User"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-medium text-fg-4">
                  {user?.fullName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => {
                  posthog.reset();
                  signOut({ redirectUrl: "/login" });
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <main className="mt-10">{children}</main>
    </div>
  );
};
