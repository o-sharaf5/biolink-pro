"use client";

import { useCallback } from "react";
import { ArrowUpRight, Link2 } from "lucide-react";
import type { Link } from "@prisma/client";

export function LinkCard({
  username,
  link,
  radius,
  accent,
}: {
  username: string;
  link: Link;
  radius: string;
  accent: string;
}) {
  const onClick = useCallback(() => {
    const body = JSON.stringify({ username, linkId: link.id });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track/click",
        new Blob([body], { type: "application/json" })
      );
    } else {
      void fetch("/api/track/click", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      });
    }
  }, [username, link.id]);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 border border-neutral-200/70 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md hover:shadow-neutral-900/5 active:scale-[0.99] ${radius}`}
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg"
        style={{ background: `${accent}14`, color: accent }}
      >
        {link.icon ? (
          link.icon.startsWith("http") ? (
            <img
              src={link.icon}
              alt=""
              className="size-6 rounded-md object-cover"
            />
          ) : (
            link.icon
          )
        ) : (
          <Link2 className="size-5" />
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-left font-medium text-neutral-900">
        {link.title}
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-neutral-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-500" />
    </a>
  );
}
