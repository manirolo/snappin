import { H2, } from "@snappin/ui/components/typography";
import React from "react";

export const HowTo = () => {
  return (
    <div className="my-26 md:my-34">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-8 mx-auto">
          <div className="text-center max-w-md mx-auto flex flex-col gap-2">
            <span>Features</span>
            <H2>Everything that free you from <span className="font-source! font-semibold text-5xl/12 italic">manual efforts</span></H2>
          </div>
        </div>
      </div>
    </div>
  );
};
