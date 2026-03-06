import { H4, Small } from "@snappin/ui/components/typography";
import React from "react";

export const NewConnection = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full flex flex-col items-center">{children}</div>;
};

export const NewConnectionHeader = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export const NewConnectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <H4 className="text-center">{children}</H4>;
};

export const NewConnectionDescription = ({ children }: { children: React.ReactNode }) => {
  return <Small className="text-muted-foreground text-center mt-1 max-w-2xl">{children}</Small>;
};

export const NewConnectionContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-6">{children}</div>;
};

export const NewConnectionCancel = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-6 mx-auto flex justify-center">{children}</div>;
};

export const NewConnectionFooter = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};