import { env } from "@snappin/env";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@snappin/ui/components/avatar";
import { cn } from "@snappin/ui/lib/utils";

const AVATAR_COLORS = [
  "#00D66F", // brand green (primary)
  "#22C55E", // green
  "#16A34A", // deep green
  "#059669", // emerald
  "#0EA5E9", // sky blue
  "#3B82F6", // blue
  "#2563EB", // deep blue
  "#6366F1", // indigo
  "#7C3AED", // violet
  "#9333EA", // purple
  "#A855F7", // purple-light
  "#C026D3", // fuchsia
  "#D946EF", // pink-purple
  "#A3A3A3", // neutral fallback
];

function getHashedColor(value: string): string | undefined {
  if (!value) return "#A3A3A3";

  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export const getLogoByDomain = (
  domain: string,
  className?: string,
  fallbackClassName?: string
) => {
  const bgColor = getHashedColor(domain);

  return (
    <Avatar className={cn("size-7 ", className)}>
      <AvatarImage
        src={`https://img.logo.dev/${domain}?token=${env.logoDev.publicKey}`}
        alt={domain}
        className="rounded-md"
      />
      <AvatarFallback
        style={{ backgroundColor: bgColor }}
        className={cn(
          "text-white rounded-md font-semibold uppercase",
          fallbackClassName
        )}
      >
        {domain?.slice(0, 1) ?? "?"}
      </AvatarFallback>
    </Avatar>
  );
};

export const getLogoByName = (companyName: string) => {
  const bgColor = getHashedColor(companyName);

  return (
    <Avatar className="size-8 border border-slate-100">
      <AvatarImage
        src={`https://img.logo.dev/name/${companyName}?token=${env.logoDev.publicKey}`}
        alt={companyName}
      />
      <AvatarFallback
        style={{ backgroundColor: bgColor }}
        className="text-white font-semibold uppercase"
      >
        {companyName?.slice(0, 1) ?? "?"}
      </AvatarFallback>
    </Avatar>
  );
};
