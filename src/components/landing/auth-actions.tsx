"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

export function AuthActions() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="h-9 w-36 animate-pulse rounded-lg bg-neutral-100" />
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Dashboard
        </Link>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/sign-in"
        className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        Get started free
      </Link>
    </div>
  );
}
