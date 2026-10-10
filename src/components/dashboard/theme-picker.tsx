"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { defaultTheme, type ThemeSettings } from "@/types";
import { isDark, radiusCss } from "@/lib/theme";

const ACCENTS = [
  "#7c3aed",
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#db2777",
  "#0f172a",
];
const BACKGROUNDS = [
  "#fafafa",
  "#ffffff",
  "#fef3c7",
  "#ecfdf5",
  "#eff6ff",
  "#0f172a",
];
const RADII: ThemeSettings["borderRadius"][] = ["none", "sm", "lg", "full"];

export function ThemePicker() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) =>
        setTheme({ ...defaultTheme, ...(data.themeSettings as ThemeSettings) })
      );
  }, []);

  async function save(next: ThemeSettings) {
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ themeSettings: next }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const update = (patch: Partial<ThemeSettings>) => {
    const next = { ...theme, ...patch };
    setTheme(next);
    void save(next);
  };

  const dark = isDark(theme.background);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Theme</h2>
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
              <Check className="size-3.5" />
              Saved
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Accent color
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ accentColor: c })}
                  aria-label={c}
                  className={`flex size-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                    theme.accentColor === c
                      ? "scale-110 border-neutral-900"
                      : "border-transparent"
                  }`}
                  style={{ background: c }}
                >
                  {theme.accentColor === c && (
                    <Check className="size-4 text-white" />
                  )}
                </button>
              ))}
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => update({ accentColor: e.target.value })}
                aria-label="Custom accent color"
                className="size-8 cursor-pointer rounded-full border border-neutral-300"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Background
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {BACKGROUNDS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ background: c })}
                  aria-label={c}
                  className={`size-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                    theme.background === c
                      ? "scale-110 border-neutral-900"
                      : "border-neutral-200"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Corner radius
            </p>
            <div className="mt-2.5 flex gap-2">
              {RADII.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update({ borderRadius: r })}
                  className={`rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors ${
                    theme.borderRadius === r
                      ? "border-violet-600 bg-violet-50 font-medium text-violet-700"
                      : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={theme.showTipCard}
              onChange={(e) => update({ showTipCard: e.target.checked })}
              className="size-4 rounded border-neutral-300 accent-violet-600"
            />
            Show tip card on my page
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Live preview
        </p>
        <div
          className="rounded-2xl border border-neutral-200 p-5"
          style={{ background: theme.background }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="size-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-2 ring-offset-2"
              style={{ ["--tw-ring-color" as string]: `${theme.accentColor}55` }}
            />
            <div className="w-full rounded-lg border border-neutral-200/70 bg-white p-3 shadow-sm" style={{ borderRadius: radiusCss(theme.borderRadius) }}>
              <div className="flex items-center gap-2">
                <span
                  className="flex size-6 items-center justify-center rounded-md"
                  style={{ background: `${theme.accentColor}14` }}
                >
                  <span className="size-2 rounded-sm" style={{ background: theme.accentColor }} />
                </span>
                <span className="h-2 flex-1 rounded bg-neutral-200" />
              </div>
            </div>
            <div className="w-full rounded-lg border border-neutral-200/70 bg-white p-3 shadow-sm" style={{ borderRadius: radiusCss(theme.borderRadius) }}>
              <div className="flex items-center gap-2">
                <span
                  className="flex size-6 items-center justify-center rounded-md"
                  style={{ background: `${theme.accentColor}14` }}
                >
                  <span className="size-2 rounded-sm" style={{ background: theme.accentColor }} />
                </span>
                <span className="h-2 flex-1 rounded bg-neutral-200" />
              </div>
            </div>
            <button
              type="button"
              className="w-full py-1.5 text-xs font-medium text-white"
              style={{ background: theme.accentColor, borderRadius: radiusCss(theme.borderRadius) }}
            >
              Send a tip
            </button>
          </div>
        </div>
        <p className={`text-center text-xs ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
          {dark ? "Dark background detected — text adapts automatically" : "Light background"}
        </p>
      </div>
    </div>
  );
}
