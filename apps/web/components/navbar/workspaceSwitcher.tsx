"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
import { useFullScreenLoading } from "@snappin/ui/hooks/useGlobalLoader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@snappin/ui/components/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@snappin/ui/components/select";
import toast from "react-hot-toast";

import { Small } from "@snappin/ui/components/typography";
import React from "react";
import { Label } from "@snappin/ui/components/label";

export const WorkspaceSwitcher = () => {
  const { show, clear } = useFullScreenLoading();
  const { user } = useUser();
  const { organization } = useOrganization();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: true,
  });

  const switchOrganization = async (id: string | null) => {
    if (!setActive) {
      toast.error("Unable to switch organization");
      return;
    }
    const org = userMemberships?.data?.find((m) => m.organization.id === id);

    show({
      title: `Switching to ${org?.organization.name ?? "Personal Organization"}`,
      logo: org?.organization.imageUrl ?? undefined,
    });

    try {
      await setActive({ organization: org?.organization.id ?? null });
    } catch {
      toast.error("Failed to switch organization");
    } finally {
      clear();
    }
  };

  return (
    <div className="space-y-2 my-4 lg:w-full">
      <Select
        value={organization?.id}
        onValueChange={(value) => switchOrganization(value)}
      >
        <SelectTrigger className="hover:bg-transparent bg-transparent shadow-none hover:shadow-none border-0 hover:border-0 w-full text-gray-8 transition-all duration-300 cursor-pointer justify-between">
          <SelectValue
            placeholder="Select a workspace"
            className="text-gray-8!"
          />
        </SelectTrigger>
        <SelectContent position="popper" side="bottom" align="start">
          <SelectGroup>
            <SelectLabel>Organization</SelectLabel>
            {userMemberships?.data?.map((org) => (
              <SelectItem
                key={org.organization.id}
                value={org.organization.id}
                className="flex w-full items-center gap-0.5 justify-between"
              >
                <div className="flex items-center gap-0.5">
                  <Avatar className="size-6">
                    <AvatarImage src={org.organization.imageUrl} />
                    <AvatarFallback>{org.organization.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <Small className="text-gray-12">
                      {org.organization.name}
                    </Small>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
