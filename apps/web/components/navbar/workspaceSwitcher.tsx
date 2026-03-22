"use client";

import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { useFullScreenLoading } from "@snappin/ui/hooks/useGlobalLoader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@snappin/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import { HiCheck, HiPlus, HiSelector } from "react-icons/hi";
import toast from "react-hot-toast";
import React from "react";
import { cn } from "@snappin/ui/lib/utils";

// Adjust this to your actual subscription field on org metadata/publicMetadata
function getPlan(org: { publicMetadata?: Record<string, unknown> }): string {
  return (org.publicMetadata?.plan as string) ?? "Free Plan";
}

export const WorkspaceSwitcher = () => {
  const { show, clear } = useFullScreenLoading();
  const { organization } = useOrganization();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: true,
  });

  const switchOrganization = async (id: string) => {
    if (!setActive) {
      toast.error("Unable to switch organization");
      return;
    }
    const org = userMemberships?.data?.find((m) => m.organization.id === id);
    show({
      title: `Switching to ${org?.organization.name ?? "workspace"}`,
      logo: org?.organization.imageUrl ?? undefined,
    });
    try {
      await setActive({ organization: id });
    } catch {
      toast.error("Failed to switch organization");
    } finally {
      clear();
    }
  };

  return (
    <div className="w-full px-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors outline-none group">
            {/* Logo */}
            <Avatar className="size-8 rounded-md shrink-0">
              <AvatarImage
                src={organization?.imageUrl}
                className="rounded-md object-cover"
              />
              <AvatarFallback className="rounded-md text-xs font-semibold">
                {organization?.name?.[0]?.toUpperCase() ?? "W"}
              </AvatarFallback>
            </Avatar>

            {/* Name + plan */}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white leading-tight truncate">
                {organization?.name ?? "Select workspace"}
              </p>
              <p className="text-xs text-white/50 leading-tight truncate">
                {getPlan(organization ?? {})}
              </p>
            </div>

            {/* Chevron */}
            <HiSelector className="size-4 text-white/50 shrink-0 group-hover:text-white/80 transition-colors" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={20}
          className="w-xs drop-shadow-lg"
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">
            Workspaces
          </DropdownMenuLabel>

          {userMemberships?.data?.map((membership) => {
            const org = membership.organization;
            const isActive = org.id === organization?.id;

            return (
              <DropdownMenuItem
                key={org.id}
                onSelect={() => {
                  if (!isActive) switchOrganization(org.id);
                }}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 cursor-pointer",
                  isActive && "pointer-events-none"
                )}
              >
                <Avatar className="size-6 rounded-md shrink-0">
                  <AvatarImage src={org.imageUrl} className="rounded-md object-cover" />
                  <AvatarFallback className="rounded-md text-[10px] font-semibold">
                    {org.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm truncate">{org.name}</span>
                {isActive && (
                  <HiCheck className="size-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center gap-2 px-2 py-1 cursor-pointer text-primary hover:text-primary"
            onSelect={() => {
              // navigate to create workspace page or open modal
              // e.g. router.push("/create-workspace")
            }}
          >
            <div className="size-6 rounded-md border border-dashed border-primary/50 flex items-center justify-center shrink-0">
              <HiPlus className="size-3 text-primary" />
            </div>
            <span className="text-sm">Add Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};