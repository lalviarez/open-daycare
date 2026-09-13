"use client";

import { useMemo, useState } from "react";
import type { Child } from "@/lib/mock-data";
import { room } from "@/lib/mock-data";
import { KidCard } from "@/components/KidCard";

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-search-icon"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

type KidsBrowserProps = {
  kids: Child[];
  mockIds: Set<string>;
};

export function KidsBrowser({ kids, mockIds }: KidsBrowserProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query.trim());

  const filtered = useMemo(() => {
    if (!normalizedQuery) return kids;
    return kids.filter((kid) => normalize(kid.name).includes(normalizedQuery));
  }, [kids, normalizedQuery]);

  return (
    <>
      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-border bg-paper px-4 py-3">
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar niño…"
          className="flex-1 border-none bg-transparent text-[15px] text-earth placeholder:text-muted focus:outline-none"
        />
      </div>

      <div className="mb-[14px] flex items-center gap-[14px]">
        <span className="text-[12.5px] font-extrabold uppercase tracking-[0.8px] text-earth">
          SALA {room.name.toUpperCase()}
        </span>
        <span className="text-[13px] text-muted">{kids.length} niños</span>
        <span className="h-[1px] flex-1 bg-divider" />
      </div>

      {filtered.length === 0 && normalizedQuery ? (
        <p className="py-10 text-center text-[15px] text-muted">
          No encontramos ningún niño con ese nombre.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          {filtered.map((kid) => (
            <KidCard key={kid.id} child={kid} isMock={mockIds.has(kid.id)} />
          ))}
        </div>
      )}
    </>
  );
}