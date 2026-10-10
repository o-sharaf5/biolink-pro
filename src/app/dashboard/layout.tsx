import { Suspense, type ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Link2 } from "lucide-react";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { ensureCurrentUser } from "@/lib/user";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <p className="text-sm text-neutral-500">Loading…</p>
        </div>
      }
    >
      <RequireAuth>{children}</RequireAuth>
    </Suspense>
  );
}

async function RequireAuth({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  await ensureCurrentUser();

  return (
    <div className="min-h-screen bg-neutral-50 lg:pl-64">
      <SidebarNav />
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <span className="flex items-center gap-2 font-bold text-neutral-900">
          <span className="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Link2 className="size-4" />
          </span>
          BioLink Pro
        </span>
        <UserButton />
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
