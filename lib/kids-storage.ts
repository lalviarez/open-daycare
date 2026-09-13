import { children } from "@/lib/mock-data";
import type { AvatarColor, Child } from "@/lib/mock-data";

const CHILDREN_KEY = "odc-children:v1";

const AVATAR_COLORS: AvatarColor[] = [
  "sky",
  "blue",
  "pink",
  "mint",
  "yellow",
  "purple",
];

const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export type NewKidInput = {
  name: string;
  birthDate: string;
  roomName: string;
  allergyTags: string[];
  allergyNotes: string;
};

let memoryFallback: Child[] = [];

export function getLocalKids(): Child[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CHILDREN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Child[];
    memoryFallback = parsed;
    return parsed;
  } catch {
    return memoryFallback;
  }
}

function saveLocalKids(kids: Child[]): void {
  memoryFallback = kids;
  try {
    window.localStorage.setItem(CHILDREN_KEY, JSON.stringify(kids));
  } catch {
    // Fallback en memoria ya está actualizado.
  }
}

export function addKid(input: NewKidInput): Child {
  const existing = getLocalKids();
  const existingIds = new Set([
    ...children.map((child) => child.id),
    ...existing.map((child) => child.id),
  ]);

  const child: Child = {
    id: uniqueId(slugify(input.name), existingIds),
    name: input.name,
    ageLabel: formatAge(calculateAge(input.birthDate, new Date())),
    birthDateLabel: input.birthDate,
    enrollmentLabel: monthLabel(new Date()),
    roomName: input.roomName,
    allergyTags: input.allergyTags,
    allergyNotes: input.allergyNotes,
    avatarColor: AVATAR_COLORS[existing.length % AVATAR_COLORS.length],
    parents: [],
  };

  const next = [child, ...existing];
  saveLocalKids(next);
  return child;
}

function slugify(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "nino";
}

function uniqueId(slug: string, existing: Set<string>): string {
  if (!existing.has(slug)) return slug;
  let counter = 2;
  while (existing.has(`${slug}-${counter}`)) {
    counter += 1;
  }
  return `${slug}-${counter}`;
}

function parseBirthDate(value: string): Date | null {
  const match = value.match(
    /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/,
  );
  if (!match) return null;

  const day = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10) - 1;
  const year = Number.parseInt(match[3], 10);
  const date = new Date(year, month, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
}

function calculateAge(birthDate: string, today: Date): number {
  const birth = parseBirthDate(birthDate);
  if (!birth) return 0;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return age;
}

function formatAge(years: number): string {
  return years === 1 ? "1 año" : `${years} años`;
}

function monthLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
