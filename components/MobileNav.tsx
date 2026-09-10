"use client";

import { useState } from "react";
import { currentUser, room } from "@/lib/mock-data";
import {
  LogoIcon,
  PlusIcon,
  HomeIcon,
  ChildrenIcon,
  BellIcon,
  AccountIcon,
  LogoutIcon,
} from "./Sidebar";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function DrawerLink({
  children,
  isActive = false,
}: {
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] transition-colors ${
        isActive
          ? "bg-nav-active-bg font-extrabold text-accent"
          : "font-semibold text-stone"
      }`}
    >
      {children}
    </a>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <header className="flex md:hidden sticky top-0 z-40 h-16 items-center justify-between border-b border-border bg-paper px-4">
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="flex items-center gap-3"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(155deg, var(--color-logo-start), var(--color-logo-end))",
            }}
          >
            <LogoIcon className="h-5 w-5" />
          </div>
          <span className="font-heading text-[17px] font-semibold text-earth">
            OpenDayCare
          </span>
        </a>

        <button
          type="button"
          onClick={open}
          aria-expanded={isOpen}
          aria-controls="mobile-drawer"
          aria-label="Abrir menú"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-earth"
        >
          <MenuIcon />
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-earth/30"
            onClick={close}
            aria-hidden="true"
          />
          <div
            id="mobile-drawer"
            className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-paper px-4 py-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(155deg, var(--color-logo-start), var(--color-logo-end))",
                  }}
                >
                  <LogoIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-heading text-[17px] font-semibold leading-none text-earth">
                    OpenDayCare
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-muted">
                    Sala {room.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-earth"
              >
                <CloseIcon />
              </button>
            </div>

            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-b from-coral to-coral-dark px-3 py-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)]"
            >
              <PlusIcon />
              Nueva publicación
            </a>

            <nav className="flex flex-1 flex-col gap-1">
              <DrawerLink isActive>
                <HomeIcon />
                Feed
              </DrawerLink>
              <DrawerLink>
                <ChildrenIcon />
                Niños
              </DrawerLink>
              <DrawerLink>
                <BellIcon />
                Avisos
              </DrawerLink>
              <DrawerLink>
                <AccountIcon />
                Mi cuenta
              </DrawerLink>
            </nav>

            <div className="mt-2.5 border-t border-border pt-3.5">
              <div className="flex items-center gap-[11px] px-2 py-1.5">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-user-avatar-bg font-heading text-[16px] font-semibold text-white">
                  {currentUser.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-extrabold text-earth">
                    {currentUser.name}
                  </div>
                  <div className="text-[12px] text-muted">
                    {currentUser.role} · {currentUser.room}
                  </div>
                </div>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  title="Cerrar sesión"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-cream text-dim"
                >
                  <LogoutIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
