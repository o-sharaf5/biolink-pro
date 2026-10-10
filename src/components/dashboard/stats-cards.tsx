import type { LucideIcon } from "lucide-react";

export function StatsCards({
  stats,
}: {
  stats: { label: string; value: string | number; icon: LucideIcon }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <stat.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-neutral-500">
              {stat.label}
            </p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-900">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
