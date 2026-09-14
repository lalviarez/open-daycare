import { invitations } from "@/lib/mock-data";
import type { AvatarColor, Parent } from "@/lib/mock-data";

const INVITATIONS_KEY = "odc-invitations:v1";

const AVATAR_COLORS: AvatarColor[] = [
  "sky",
  "blue",
  "pink",
  "mint",
  "yellow",
  "purple",
];

const CODE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

let memoryFallback: StoredInvitation[] = [];

export type StoredInvitation = {
  code: string;
  parentName: string;
  parentRole: string;
  email: string;
  childId: string;
  avatarColor: AvatarColor;
};

export type NewInvitationInput = Omit<StoredInvitation, "avatarColor">;

export function getLocalInvitations(): StoredInvitation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INVITATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredInvitation[];
    memoryFallback = parsed;
    return parsed;
  } catch {
    return memoryFallback;
  }
}

function saveLocalInvitations(invs: StoredInvitation[]): void {
  memoryFallback = invs;
  try {
    window.localStorage.setItem(INVITATIONS_KEY, JSON.stringify(invs));
  } catch {
    // Fallback en memoria ya está actualizado.
  }
}

export function generateInvitationCode(): string {
  const existingCodes = new Set([
    ...invitations.map((i) => i.code.toUpperCase()),
    ...getLocalInvitations().map((i) => i.code.toUpperCase()),
  ]);

  let code: string;
  do {
    code = "";
    for (let i = 0; i < 5; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
  } while (existingCodes.has(code));

  return code;
}

export function addInvitation(input: NewInvitationInput): StoredInvitation {
  const existing = getLocalInvitations();

  const invitation: StoredInvitation = {
    ...input,
    avatarColor: AVATAR_COLORS[existing.length % AVATAR_COLORS.length],
  };

  const next = [invitation, ...existing];
  saveLocalInvitations(next);
  return invitation;
}

export function getParentsForChild(
  childId: string,
  mockParents: Parent[]
): Parent[] {
  const locals = getLocalInvitations()
    .filter((inv) => inv.childId === childId)
    .map((inv) => ({
      name: inv.parentName,
      role: inv.parentRole,
      status: "pending" as const,
      avatarColor: inv.avatarColor,
    }));

  return [...mockParents, ...locals];
}