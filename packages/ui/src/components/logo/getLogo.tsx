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

export const getLogoByDomain = (domain: string, className?: string) => {
  if (!domain || domain.includes(" ") || !domain.includes(".")) {
    return getLogoByName(domain, className);
  }

  const bgColor = getHashedColor(domain);
  const initial = domain?.slice(0, 1).toUpperCase() ?? "?";

  return (
    <Avatar className={cn("size-7", className)}>
      <AvatarImage
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={domain}
        className="rounded-md object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <AvatarFallback
        style={{ backgroundColor: bgColor }}
        className="text-white rounded-md font-semibold uppercase"
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );
};

export const getLogoByName = (companyName: string, className?: string) => {
  const bgColor = getHashedColor(companyName);

  return (
    <Avatar className={cn("size-7", className)}>
      {/* ✅ No AvatarImage — logo.dev /name/ is unreliable, just use colored initial */}
      <AvatarFallback
        style={{ backgroundColor: bgColor }}
        className="text-white rounded-md font-semibold uppercase"
      >
        {companyName?.trim().slice(0, 1).toUpperCase() ?? "?"}
      </AvatarFallback>
    </Avatar>
  );
};
