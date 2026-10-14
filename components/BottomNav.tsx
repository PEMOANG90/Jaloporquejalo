"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, ChatIcon, HomeIcon, InviteIcon } from "./Icons";

const items = [
  { href: "/", label: "Inicio", Icon: HomeIcon },
  { href: "/jalo", label: "Jalo", Icon: ChatIcon },
  { href: "/planes/coffee-party", label: "Mis planes", Icon: CalendarIcon, match: "/planes" },
  { href: "/invitar", label: "Invitar", Icon: InviteIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/empresa")) return null;

  return (
    <nav className="nav" aria-label="Navegación principal">
      <ul>
        {items.map(({ href, label, Icon, match }) => {
          const active = match ? pathname.startsWith(match) : pathname === href;
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}>
                <Icon />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
