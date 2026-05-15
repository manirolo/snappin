import { Avatar, AvatarFallback, AvatarImage } from "@snappin/ui/components/avatar";
import { ExtraSmall } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";
import "./appearance.css";
import { DotPatternWrapper } from "@snappin/ui/components/magicui/dot-pattern-wrapper";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex flex-1 w-full flex-col items-center justify-center h-screen overflow-y-auto px-4">
        <div className="w-full max-w-md mx-auto p-12">{children}</div>
      </div>
      <div className="relative hidden xl:flex h-screen lg:w-2xl 2xl:w-3xl">
        <div className="relative h-full w-full auth-left-panel flex flex-col p-8 items-start justify-center overflow-hidden">
          <DotPatternWrapper
            cr={1}
            cx={20}
            cy={20}
            className="[&_circle]:fill-green-a1"
          />
          <div className="max-w-xl bg-green-a2 z-10 rounded-sm p-6 gap-4 mx-auto w-full text-start flex flex-col items-start">
            <div className="space-y-4">
              <h2 className="text-white/70 text-base/7 font-normal">
                I used to spend hours every month chasing receipts. Now
                everything&#39;s captured and categorised before I even open my
                laptop.
              </h2>
              <div className="flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Rachel T."
                  />
                  <AvatarFallback className="bg-green-a2 text-green-a4/50">
                    RT
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-white/50 text-sm">Rachel T.</p>
                  <span className="text-white/30 text-sm">
                    Operations Manager
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
