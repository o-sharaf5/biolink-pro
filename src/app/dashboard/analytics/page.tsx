import { DollarSign, Eye, Link2, MousePointerClick } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AsyncSection } from "@/components/dashboard/async-section";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardAnalyticsPage() {
  return (
    <AsyncSection>
      {(userId) => <AnalyticsContent userId={userId} />}
    </AsyncSection>
  );
}

async function AnalyticsContent({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!user) return null;

  const since = new Date(Date.now() - 30 * 864e5);
  const weekAgo = new Date(Date.now() - 7 * 864e5);

  const [
    pageViews,
    linkClicks,
    revenue,
    txCount,
    topLinks,
    weekEvents,
    recentTips,
  ] = await Promise.all([
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
    prisma.transaction.count({
      where: { userId: user.id, createdAt: { gte: since } },
    }),
    prisma.link.findMany({
      where: { userId: user.id, clicksCount: { gt: 0 } },
      orderBy: { clicksCount: "desc" },
      take: 5,
      select: { title: true, clicksCount: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { userId: user.id, type: "PAGE_VIEW", createdAt: { gte: weekAgo } },
      select: { createdAt: true },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { donorName: true, amount: true, createdAt: true },
    }),
  ]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const series = days.map((day) => ({
    day,
    views: weekEvents.filter(
      (e) => e.createdAt.toISOString().slice(0, 10) === day
    ).length,
  }));
  const max = Math.max(1, ...series.map((s) => s.views));
  const totalWeek = series.reduce((sum, s) => sum + s.views, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {totalWeek} page views in the last 7 days.
        </p>
      </div>

      <StatsCards
        stats={[
          { label: "Page views (30d)", value: pageViews, icon: Eye },
          { label: "Link clicks (30d)", value: linkClicks, icon: MousePointerClick },
          {
            label: "Tips received (30d)",
            value: `$${((revenue._sum.amount ?? 0) / 100).toFixed(2)}`,
            icon: DollarSign,
          },
          { label: "Transactions (30d)", value: txCount, icon: Link2 },
        ]}
      />

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-neutral-900">
            Page views — last 7 days
          </p>
          <span className="text-sm tabular-nums text-neutral-500">
            {totalWeek} total
          </span>
        </div>
        <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
          {series.map((s) => (
            <div
              key={s.day}
              className="group flex flex-1 flex-col items-center gap-2"
              title={`${s.views} views on ${s.day}`}
            >
              <span className="text-xs font-medium tabular-nums text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
                {s.views}
              </span>
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-violet-400 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-400"
                  style={{
                    height: `${(s.views / max) * 100}%`,
                    minHeight: s.views ? "6px" : "2px",
                  }}
                />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                {s.day.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <p className="border-b border-neutral-100 px-6 py-4 font-semibold text-neutral-900">
            Top links
          </p>
          {topLinks.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-500">
              No clicks yet.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {topLinks.map((link, i) => (
                <li
                  key={link.title}
                  className="flex items-center gap-3 px-6 py-3.5"
                >
                  <span className="w-5 text-xs tabular-nums text-neutral-300">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">
                    {link.title}
                  </span>
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-violet-700">
                    {link.clicksCount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <p className="border-b border-neutral-100 px-6 py-4 font-semibold text-neutral-900">
            Recent tips
          </p>
          {recentTips.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-500">
              No tips yet.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {recentTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between px-6 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {tip.donorName || "Anonymous"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {tip.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-neutral-900">
                    ${(tip.amount / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
