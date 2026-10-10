import { ArrowUpRight, Heart, Link2 } from "lucide-react";

const MOCK_LINKS = [
  { icon: Link2, label: "Latest video", classes: "bg-violet-50 text-violet-600" },
  { icon: Heart, label: "Support my work", classes: "bg-rose-50 text-rose-500" },
  { icon: ArrowUpRight, label: "Free presets", classes: "bg-amber-50 text-amber-600" },
];

export function BioPageMock() {
  return (
    <div className="relative w-full max-w-sm animate-[float_7s_ease-in-out_infinite] rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl shadow-violet-900/10">
      <div className="flex flex-col items-center gap-5">
        <div className="size-16 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 ring-4 ring-violet-100" />
        <div className="text-center">
          <p className="font-semibold text-neutral-900">Jane Creator</p>
          <p className="text-sm text-neutral-500">@jane — designer & educator</p>
        </div>
        <div className="flex w-full flex-col gap-2.5">
          {MOCK_LINKS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3 shadow-sm"
            >
              <span
                className={`flex size-8 items-center justify-center rounded-lg ${item.classes}`}
              >
                <item.icon className="size-4" />
              </span>
              <span className="flex-1 text-sm font-medium text-neutral-800">
                {item.label}
              </span>
              <span className="text-neutral-300">→</span>
            </div>
          ))}
        </div>
        <div className="w-full rounded-xl bg-violet-600 py-2.5 text-center text-sm font-medium text-white">
          Send a tip
        </div>
      </div>
    </div>
  );
}
