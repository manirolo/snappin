import { Button } from "@snappin/ui/components/button";
import { H2, Small } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";

export const ConnectionFailed = () => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <div className="flex flex-col max-w-xl mx-auto items-center justify-center gap-4 mt-6 text-center min-h-[50vh]">
          <H2 className="font-bold">Something went wrong :(</H2>
          <Small>
            An unexpected error occurred while we performing the action. Our
            engineers working hard to fix it.
          </Small>

          <div className="flex mt-8 flex-row justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
