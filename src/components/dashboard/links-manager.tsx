"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { GripVertical, Link2, Plus, Trash2 } from "lucide-react";
import type { Link } from "@prisma/client";

export function LinksManager() {
  const [links, setLinks] = useState<Link[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/links");
    setLinks(await res.json());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function create(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        url: url.startsWith("http") ? url : `https://${url}`,
        icon: icon || null,
      }),
    });
    if (!res.ok) {
      let message = "failed to create link";
      try {
        const data = await res.json();
        message = data.error ?? message;
        if (Array.isArray(data.issues)) {
          message += ` (${data.issues.join("; ")})`;
        }
      } catch {
        // non-JSON error body
      }
      setError(message);
      return;
    }
    setTitle("");
    setUrl("");
    setIcon("");
    await refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    await refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={create}
        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-neutral-900">Add a link</h2>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Emoji (optional)"
              className="w-28 rounded-lg border border-neutral-300 px-3 py-2 text-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            type="url"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
            >
              <Plus className="size-4" />
              Add link
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="font-semibold text-neutral-900">Your links</h2>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">
            {links.length}
          </span>
        </div>
        {links.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-300">
              <Link2 className="size-5" />
            </span>
            <p className="text-sm font-medium text-neutral-700">No links yet</p>
            <p className="max-w-xs text-sm text-neutral-500">
              Add your first link above — it appears on your public page
              instantly.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {links.map((link, i) => (
              <li
                key={link.id}
                className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-neutral-50/60"
              >
                <GripVertical className="size-4 shrink-0 text-neutral-200" />
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-violet-50 text-sm text-violet-600">
                  {link.icon ? (
                    link.icon.startsWith("http") ? (
                      <img
                        src={link.icon}
                        alt=""
                        className="size-5 rounded object-cover"
                      />
                    ) : (
                      link.icon
                    )
                  ) : (
                    <Link2 className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {link.title}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {link.url}
                  </p>
                </div>
                <span className="hidden rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500 sm:inline">
                  {link.clicksCount} clicks
                </span>
                <button
                  onClick={() => toggle(link.id, link.isActive)}
                  aria-label={link.isActive ? "Pause link" : "Activate link"}
                  title={link.isActive ? "Pause" : "Activate"}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    link.isActive ? "bg-violet-600" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${
                      link.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <button
                  onClick={() => remove(link.id)}
                  aria-label={`Delete ${link.title}`}
                  className="rounded-lg p-1.5 text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
                <span className="w-6 shrink-0 text-xs tabular-nums text-neutral-300">
                  {i + 1}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
