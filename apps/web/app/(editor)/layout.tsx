import React from "react";

export  default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
};

export const metadata = {
  title: "Snappin App",
  description:
    "",
};
