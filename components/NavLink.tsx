"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
};

export function NavLink({ href, onClick, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] transition-colors ${
        isActive
          ? "bg-nav-active-bg font-extrabold text-accent"
          : "font-semibold text-stone"
      }`}
    >
      {children}
    </Link>
  );
}
