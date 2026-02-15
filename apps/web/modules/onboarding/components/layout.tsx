import { H3, Paragraph } from "@snappin/ui/components/typography";
import { ReactNode } from "react";

export const OnboardingSection = ({ children }: { children: ReactNode }) => {
  return <div className="mx-auto max-w-lg mt-14">{children}</div>;
};

export const OnboardingHeader = ({ children }: { children: ReactNode }) => {
  return <div className="text-center flex flex-col gap-2">{children}</div>;
};

export const OnboardingTitle = ({ children }: { children: ReactNode }) => {
  return <H3>{children}</H3>;
};

export const OnboardingDescription = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <Paragraph className="text-muted-foreground">{children}</Paragraph>;
};

export const OnboardingContent = ({ children }: { children: ReactNode }) => {
  return <div className="mt-10">{children}</div>;
};

export const OnboardingFooter = ({ children }: { children: ReactNode }) => {
  return <div className="mt-18">{children}</div>;
};
