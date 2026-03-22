"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { IceCubesIcon } from "@hugeicons-pro/core-bulk-rounded";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyContent,
} from "@snappin/ui/components/empty";
import { Button } from "@snappin/ui/components/button";
import { HiArrowSmLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

export const IntegrationNoResult = () => {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon icon={IceCubesIcon} className="size-14 text-primary" />
        </EmptyMedia>

        <EmptyTitle>No integration data found</EmptyTitle>
        <EmptyDescription>
          Connect your email to start extracting invoices automatically.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => router.push("/integrations")}
        >
          <HiArrowSmLeft />
          Back
        </Button>
      </EmptyContent>
    </Empty>
  );
};
