"use client";

import { children, invitations, users, type UserRole } from "@/lib/mock-data";

const INVITATIONS_KEY = "odc-invitations:v1";

const SESSION_KEY = "odc-session:v1";
const ACCOUNTS_KEY = "odc-accounts:v1";

export type Session = {
  email: string;
  name: string;
  role: UserRole;
  roleLabel: string;
};

type StoredAccount = Session & { password: string };

let memorySession: Session | null = null;
let memoryAccounts: StoredAccount[] = [];

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeGetItem(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // noop: modo privado o localStorage deshabilitado
  }
}

function safeRemoveItem(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // noop
  }
}

function getAccounts(): StoredAccount[] {
  const raw = safeGetItem(ACCOUNTS_KEY);
  if (!raw) return memoryAccounts;
  try {
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return memoryAccounts;
  }
}

function saveAccounts(accounts: StoredAccount[]): void {
  memoryAccounts = accounts;
  safeSetItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function setSession(session: Session): void {
  memorySession = session;
  safeSetItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (memorySession) return memorySession;

  const raw = safeGetItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Session;
    memorySession = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function signOut(): void {
  memorySession = null;
  safeRemoveItem(SESSION_KEY);
}

export function signIn(email: string, password: string): Session | null {
  const normalizedEmail = email.trim().toLowerCase();

  const mockUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
  );
  if (mockUser) {
    const session: Session = {
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      roleLabel: mockUser.roleLabel,
    };
    setSession(session);
    return session;
  }

  const accounts = getAccounts();
  const account = accounts.find(
    (stored) => stored.email.toLowerCase() === normalizedEmail && stored.password === password
  );
  if (account) {
    const session: Session = {
      email: account.email,
      name: account.name,
      role: account.role,
      roleLabel: account.roleLabel,
    };
    setSession(session);
    return session;
  }

  return null;
}

export function activateAccount(
  code: string,
  email: string,
  password: string
):
  | { ok: true; session: Session }
  | { ok: false; error: "code" | "email" | "password" } {
  const normalizedCode = code.trim().toUpperCase();

  const mockInvitation = invitations.find(
    (item) => item.code.toUpperCase() === normalizedCode
  );

  let localInvitation: { code: string; email: string; childId: string; parentName: string; parentRole: string } | null = null;
  if (!mockInvitation) {
    const raw = safeGetItem(INVITATIONS_KEY);
    if (raw) {
      try {
        const locals = JSON.parse(raw) as Array<{ code: string; email: string; childId: string; parentName: string; parentRole: string }>;
        localInvitation = locals.find((item) => item.code.toUpperCase() === normalizedCode) ?? null;
      } catch {
        // corrupt data, ignore
      }
    }
  }

  const invitation = mockInvitation ?? localInvitation;
  if (!invitation) {
    return { ok: false, error: "code" };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (invitation.email.toLowerCase() !== normalizedEmail) {
    return { ok: false, error: "email" };
  }

  if (password.length < 8) {
    return { ok: false, error: "password" };
  }

  const child = children.find((item) => item.id === invitation.childId);
  const childFirstName = child ? child.name.split(" ")[0] : "tu hijo";
  const roleLabel = `${invitation.parentRole} de ${childFirstName}`;

  const account: StoredAccount = {
    email: invitation.email,
    password,
    name: invitation.parentName,
    role: "family",
    roleLabel,
  };

  const accounts = getAccounts().filter(
    (stored) => stored.email.toLowerCase() !== account.email.toLowerCase()
  );
  accounts.push(account);
  saveAccounts(accounts);

  const session: Session = {
    email: account.email,
    name: account.name,
    role: account.role,
    roleLabel: account.roleLabel,
  };
  setSession(session);

  return { ok: true, session };
}

export function homePathFor(role: UserRole): string {
  // TEMP: ambos roles van a / hasta que exista familia-feed (SPEC futuro).
  void role;
  return "/";
}
