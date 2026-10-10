"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export function HeroCta() {
  const { isSignedIn, isLoaded } = useAuth();

  const base =
    "group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-colors hover:bg-violet-700";

  if (!isLoaded) {
    return (
      <span className={base}>
        Create your page
        <ArrowRight className="size-4" />
      </span>
    );
  }

  return (
    <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className={base}>
      {isSignedIn ? "Go to your dashboard" : "Create your page"}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
