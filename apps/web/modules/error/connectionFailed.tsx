import { Alert01Icon } from "@hugeicons-pro/core-bulk-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@snappin/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, EmptyContent } from "@snappin/ui/components/empty";
import Link from "next/link";
import React from "react";

export const ConnectionFailed = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <HugeiconsIcon
              className="size-10 text-yellow-500"
              icon={Alert01Icon}
            />
          </EmptyMedia>
          <EmptyTitle>Connection failed</EmptyTitle>
          <EmptyDescription>An unexpected error occurred while we performing the action. Our engineers working hard to fix it.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-row justify-center">
            <Button variant="outline" asChild>
                <Link href="/dashboard">Home</Link>
            </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};
