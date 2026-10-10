"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  LayoutDashboard,
  Link2,
  Settings,
  type LucideIcon,
} from "lucide-react";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-neutral-100 px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-violet-600 text-white">
          <Link2 className="size-4" />
        </span>
        <span className="font-bold text-neutral-900">BioLink Pro</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
        <span className="text-xs text-neutral-400">Account</span>
        <UserButton />
      </div>
    </aside>
  );
}
