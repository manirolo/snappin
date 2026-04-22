import { Button } from "@snappin/ui/components/button";
import { H2, Small } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";

export const AlreadyConnected = () => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <div className="flex flex-col max-w-xl mx-auto items-center justify-center gap-4 mt-6 text-center min-h-[50vh]">
          <H2 className="font-bold">Already connected</H2>
          <Small>
            This account is already connected to this organization or another
            organization.
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
