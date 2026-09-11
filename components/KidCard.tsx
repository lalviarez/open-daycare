"use client";

import Link from "next/link";
import type { Child } from "@/lib/mock-data";
import { Avatar } from "@/components/Avatar";

function ChevronIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-chevron"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function parentsLabel(count: number) {
  if (count === 0) return "sin padres vinculados";
  if (count === 1) return "1 padre vinculado";
  return `${count} padres vinculados`;
}

type KidCardProps = {
  child: Child;
};

export function KidCard({ child }: KidCardProps) {
  const hasAllergies = child.allergyTags.length > 0;
  const hasNoParents = child.parents.length === 0;

  return (
    <Link
      href={`/kids/${child.id}`}
      className="flex min-w-0 items-center gap-[14px] rounded-[18px] border border-border bg-paper p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)] transition hover:border-kid-hover-border hover:-translate-y-0.5"
    >
      <Avatar
        name={child.name}
        color={child.avatarColor}
        size={48}
        variant="kid"
      />
      <div className="min-w-0 flex-1">
        <div className="font-heading text-[16px] font-semibold text-earth">
          {child.name}
        </div>
        <div className="text-[13px] text-muted">
          {child.ageLabel} · {parentsLabel(child.parents.length)}
        </div>
      </div>
      <div className="shrink-0">
        {hasAllergies ? (
          <div className="flex gap-2">
            {child.allergyTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-allergy-chip-bg px-[9px] py-[5px] text-[11px] font-extrabold text-allergy-chip-text"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : hasNoParents ? (
          <span className="rounded-full bg-vincular-chip-bg px-[9px] py-[5px] text-[11px] font-extrabold text-vincular-chip-text">
            VINCULAR
          </span>
        ) : (
          <ChevronIcon />
        )}
      </div>
    </Link>
  );
}
