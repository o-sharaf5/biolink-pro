import { Suspense, type ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export function AsyncSection({
  children,
  fallback,
}: {
  children: (userId: string) => ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <Suspense
      fallback={fallback ?? <p className="text-sm text-neutral-500">Loading…</p>}
    >
      <AsyncSectionInner>{children}</AsyncSectionInner>
    </Suspense>
  );
}

async function AsyncSectionInner({
  children,
}: {
  children: (userId: string) => ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <>{children(userId)}</>;
}
