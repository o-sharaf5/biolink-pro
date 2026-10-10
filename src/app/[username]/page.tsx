import { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import { after } from "next/server";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LinkCard } from "@/components/bio/link-card";
import { TipCard } from "@/components/bio/tip-card";
import { defaultTheme, type ThemeSettings } from "@/types";
import { isDark } from "@/lib/theme";

const getUser = cache((username: string) =>
  prisma.user.findUnique({
    where: { username },
    include: {
      links: { where: { isActive: true }, orderBy: { position: "asc" } },
    },
  })
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const user = await getUser((await params).username);
  const username = user?.username;
  if (!user || !username) return {};
  return {
    title: `${user.name ?? username} — all my links`,
    description:
      user.bio ?? `Everything from ${user.name ?? username} in one place.`,
    openGraph: {
      title: user.name ?? username,
      description: user.bio ?? undefined,
      images: user.avatarUrl ? [user.avatarUrl] : undefined,
      type: "profile",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function PublicBioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-neutral-500">Loading…</p>
        </main>
      }
    >
      <BioContent params={params} />
    </Suspense>
  );
}

async function BioContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const user = await getUser((await params).username);
  const username = user?.username;
  if (!user || !username) notFound();

  after(async () => {
    await prisma.analyticsEvent.create({
      data: { userId: user.id, type: "PAGE_VIEW" },
    });
  });

  const theme = (user.themeSettings as unknown as ThemeSettings) ?? defaultTheme;
  const dark = isDark(theme.background);
  const radius =
    {
      none: "rounded-none",
      sm: "rounded-lg",
      lg: "rounded-2xl",
      full: "rounded-full",
    }[theme.borderRadius] ?? "rounded-2xl";
  const textPrimary = dark ? "text-white" : "text-neutral-900";
  const textSecondary = dark ? "text-neutral-300" : "text-neutral-600";

  return (
    <main className="relative flex min-h-screen flex-col" style={{ background: theme.background }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(40rem circle at 50% -10%, ${theme.accentColor}1f, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-14">
        <div className="flex w-full flex-col items-center gap-7">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name ?? username}
              className="size-24 rounded-full object-cover ring-4 ring-offset-4"
              style={{ ["--tw-ring-color" as string]: `${theme.accentColor}55` }}
            />
          )}
          <div className="text-center">
            <h1 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>
              {user.name ?? username}
            </h1>
            {user.bio && (
              <p className={`mt-2 whitespace-pre-line text-sm ${textSecondary}`}>
                {user.bio}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-3">
            {user.links.map((link) => (
              <LinkCard
                key={link.id}
                username={username}
                link={link}
                radius={radius}
                accent={theme.accentColor}
              />
            ))}
            {user.tipEnabled && theme.showTipCard && (
              <TipCard
                username={username}
                name={user.name ?? username}
                accent={theme.accentColor}
                radius={radius}
              />
            )}
          </div>
        </div>
        <footer className="mt-14">
          <Link
            href="/"
            className={`text-xs transition-colors ${
              dark
                ? "text-neutral-500 hover:text-neutral-300"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Powered by BioLink Pro
          </Link>
        </footer>
      </div>
    </main>
  );
}
