"use client";

import type { AvatarColor } from "@/lib/mock-data";

type AvatarSize = 40 | 48 | 84;
type AvatarVariant = "kid" | "parent";

type AvatarProps = {
  name: string;
  color: AvatarColor;
  size: AvatarSize;
  variant: AvatarVariant;
  className?: string;
};

const AVATAR_PALETTE: Record<AvatarColor, { bg: string; fg: string }> = {
  sky: { bg: "#A9D9E8", fg: "#1F7A93" },
  blue: { bg: "#A9C7E8", fg: "#1F7A93" },
  pink: { bg: "#F4B8CC", fg: "#C44A7A" },
  mint: { bg: "#B9DEC4", fg: "#3E8B62" },
  yellow: { bg: "#F4DC8E", fg: "#9A7B1E" },
  purple: { bg: "#C9B6E8", fg: "#7B5FC0" },
};

const SIZE_CLASSES: Record<AvatarSize, string> = {
  40: "h-10 w-10 text-[16px]",
  48: "h-12 w-12 text-[19px]",
  84: "h-[84px] w-[84px] text-[34px]",
};

export function Avatar({ name, color, size, variant, className }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const palette = AVATAR_PALETTE[color];
  const textColor = variant === "parent" ? "#fff" : palette.fg;

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-heading font-semibold ${SIZE_CLASSES[size]} ${className ?? ""}`}
      style={{ backgroundColor: palette.bg, color: textColor }}
    >
      {initial}
    </div>
  );
}
