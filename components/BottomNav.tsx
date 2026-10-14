"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, ChatIcon, HomeIcon, InviteIcon } from "./Icons";

const items = [
  { href: "/", label: "Inicio", Icon: HomeIcon },
  { href: "/jalo", label: "Jalo", Icon: ChatIcon },
  { href: "/mis-planes", label: "Mis planes", Icon: CalendarIcon, match: ["/mis-planes", "/planes"] },
  { href: "/invitar", label: "Invitar", Icon: InviteIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/empresa")) return null;

  return (
    <nav className="nav" aria-label="Navegación principal">
      <ul>
        {items.map(({ href, label, Icon, match }) => {
          const active = match ? match.some((prefix) => pathname.startsWith(prefix)) : pathname === href;
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
