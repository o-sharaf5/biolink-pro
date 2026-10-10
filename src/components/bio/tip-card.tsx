"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

const PRESETS = [200, 500, 1000, 2000];

export function TipCard({
  username,
  name,
  radius,
  accent,
}: {
  username: string;
  name: string;
  radius: string;
  accent: string;
}) {
  const [amount, setAmount] = useState(PRESETS[1]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTip() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, amount }),
      });
      if (!res.ok) {
        let message = "failed to create checkout";
        try {
          const data = await res.json();
          message = data.error ?? message;
        } catch {
          // non-JSON error body
        }
        setError(message);
        return;
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url as string;
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className={`w-full border bg-white p-5 shadow-sm ${radius}`}
      style={{ borderColor: `${accent}33` }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}14` }}
        >
          <Heart className="size-5" style={{ color: accent }} fill="currentColor" />
        </span>
        <div>
          <p className="font-semibold text-neutral-900">Support {name}</p>
          <p className="text-xs text-neutral-500">
            Tips go directly to the creator.
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(p)}
            className={`rounded-lg border py-1.5 text-sm font-medium transition-colors ${
              amount === p
                ? "text-white"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
            style={
              amount === p
                ? { background: accent, borderColor: accent }
                : undefined
            }
          >
            ${p / 100}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={handleTip}
        className="mt-3 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        style={{ background: accent }}
      >
        {pending ? "Redirecting…" : "Send tip"}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
