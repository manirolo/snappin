import { cn } from "@snappin/ui/lib/utils";
import React, { ReactNode } from "react";

export function DotBackgroundDemo({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full h-full items-start justify-center bg-transparent dark:bg-black overflow-hidden">
      
      {/* Dots layer */}
      <div
        className={cn(
          "absolute top-0 h-26 w-full",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          "[mask-image:linear-gradient(to_bottom,black_50%,transparent)]",
          "[mask-repeat:no-repeat]"
        )}
      />

      {/* Content layer */}
      <div className="relative w-full z-10">
        {children}
      </div>
    </div>
  );
}