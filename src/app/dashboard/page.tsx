import Link from "next/link";
import { DollarSign, Eye, Link2, MousePointerClick } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AsyncSection } from "@/components/dashboard/async-section";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardOverviewPage() {
  return (
    <AsyncSection>
      {(userId) => <OverviewContent userId={userId} />}
    </AsyncSection>
  );
}

async function OverviewContent({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { links: { orderBy: { position: "asc" }, take: 5 } },
  });

  if (!user) {
    return (
      <p className="text-sm text-neutral-500">
        Your account is being provisioned. Sign out and back in if
        this persists.
      </p>
    );
  }

  const since = new Date(Date.now() - 30 * 864e5);
  const [pageViews, linkClicks, revenue] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { userId: user.id, type: "PAGE_VIEW", createdAt: { gte: since } },
    }),
    prisma.analyticsEvent.count({
      where: { userId: user.id, type: "LINK_CLICK", createdAt: { gte: since } },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId: user.id, createdAt: { gte: since } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Overview
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back{user.name ? `, ${user.name}` : ""}. Here&apos;s
            how your page is performing.
          </p>
        </div>
        {user.username && (
          <Link
            href={`/${user.username}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            View public page
          </Link>
        )}
      </div>

      {!user.username && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Claim your username to activate your public page:{" "}
          <Link href="/dashboard/settings" className="font-medium underline">
            open settings
          </Link>
        </div>
      )}

      <StatsCards
        stats={[
          { label: "Page views (30d)", value: pageViews, icon: Eye },
          { label: "Link clicks (30d)", value: linkClicks, icon: MousePointerClick },
          {
            label: "Tips received (30d)",
            value: `$${((revenue._sum.amount ?? 0) / 100).toFixed(2)}`,
            icon: DollarSign,
          },
          { label: "Links", value: user.links.length, icon: Link2 },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="font-semibold text-neutral-900">Recent links</h2>
          <Link
            href="/dashboard/links"
            className="text-sm font-medium text-violet-600 hover:underline"
          >
            Manage
          </Link>
        </div>
        {user.links.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-neutral-500">
            No links yet.{" "}
            <Link
              href="/dashboard/links"
              className="font-medium text-violet-600 hover:underline"
            >
              Add your first link
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {user.links.map((link) => (
              <li
                key={link.id}
                className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-neutral-50/60"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
                  {link.icon ?? <Link2 className="size-4" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">
                  {link.title}
                </span>
                <span className="text-sm tabular-nums text-neutral-500">
                  {link.clicksCount} clicks
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
