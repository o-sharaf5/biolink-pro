"use client";

import { useEffect, useState, type FormEvent } from "react";
import { defaultTheme, type ThemeSettings } from "@/types";

type ProfileFormState = {
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  tipEnabled: boolean;
  themeSettings: ThemeSettings;
};

export function ProfileForm() {
  const [form, setForm] = useState<ProfileFormState | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) =>
        setForm({
          name: data.name ?? "",
          username: data.username ?? "",
          bio: data.bio ?? "",
          avatarUrl: data.avatarUrl ?? "",
          tipEnabled: data.tipEnabled,
          themeSettings: { ...defaultTheme, ...(data.themeSettings as ThemeSettings) },
        })
      );
  }, []);

  if (!form) return <p className="text-sm text-neutral-500">Loading…</p>;

  async function save(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "failed to save");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const set = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  return (
    <form
      onSubmit={save}
      className="rounded-xl border border-neutral-200 bg-white p-4"
    >
      <h2 className="text-sm font-medium">Profile</h2>
      <div className="mt-3 flex flex-col gap-3">
        <label className="block">
          <span className="text-xs font-medium text-neutral-500">
            Display name
          </span>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-neutral-500">Username</span>
          <input
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs text-neutral-400">
            yourpage.com/&lt;username&gt; — letters, numbers, - and _
          </span>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-neutral-500">
            Avatar URL
          </span>
          <input
            value={form.avatarUrl}
            onChange={(e) => set("avatarUrl", e.target.value)}
            type="url"
            placeholder="https://…"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-neutral-500">Bio</span>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            maxLength={160}
            rows={3}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs text-neutral-400">
            {form.bio.length}/160
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.tipEnabled}
            onChange={(e) => set("tipEnabled", e.target.checked)}
            className="rounded border-neutral-300"
          />
          Enable tipping on my page
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Save
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </div>
    </form>
  );
}
