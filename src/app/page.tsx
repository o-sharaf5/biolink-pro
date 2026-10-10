import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Link2,
  Palette,
  Sparkles,
  Wallet,
} from "lucide-react";
import { AuthActions } from "@/components/landing/auth-actions";
import { BioPageMock } from "@/components/landing/bio-page-mock";
import { HeroCta } from "@/components/landing/hero-cta";

const FEATURES = [
  {
    icon: Palette,
    title: "Your page, your brand",
    description:
      "Profile photo, bio, custom links, social icons, and a theme color picker — every detail customizable from one clean dashboard.",
  },
  {
    icon: Wallet,
    title: "Tips & digital products",
    description:
      "Visitors send a tip or buy a digital product in a couple of clicks via Stripe. Payouts go straight to your bank.",
  },
  {
    icon: BarChart3,
    title: "Analytics built in",
    description:
      "Page views, link clicks, and revenue — measured out of the box. No third-party tags, no cookie banners, no setup.",
  },
];

const STEPS = [
  {
    title: "Claim your username",
    description:
      "Sign up in under a minute and pick a memorable handle — your page is live at biolink.pro/you.",
  },
  {
    title: "Make it yours",
    description:
      "Upload an avatar, write your bio, add links, and dial in a theme that matches your brand.",
  },
  {
    title: "Share one link",
    description:
      "Drop it in your Instagram, YouTube, or TikTok bio. Every click and tip is tracked automatically.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Link2 className="size-4" />
            </span>
            <span className="font-bold text-neutral-900">BioLink Pro</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
            <a href="#features" className="transition-colors hover:text-neutral-900">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-neutral-900">
              How it works
            </a>
          </nav>
          <AuthActions />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10rem] top-24 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-2 lg:pb-32 lg:pt-28">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                <Sparkles className="size-3.5" />
                Public beta — free while we grow
              </span>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl">
                One link for{" "}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                  everything you create
                </span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-neutral-600">
                A beautiful home for your links — with tips, digital products,
                and analytics built in. Set up in under two minutes.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <HeroCta />
                <Link
                  href="/sign-in"
                  className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  Sign in
                </Link>
              </div>
              <p className="text-sm text-neutral-500">
                Free while in beta · No credit card · Keep your followers
              </p>
            </div>
            <div className="hidden justify-center lg:flex">
              <BioPageMock />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-t border-neutral-100 bg-neutral-50/60 py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                Features
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Everything a creator needs
              </h2>
              <p className="mt-3 text-lg text-neutral-600">
                No plugins, no tag managers, no monthly surprises.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Live in three steps
              </h2>
            </div>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title} className="relative">
                  <span className="flex size-9 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-sm font-semibold text-violet-700">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-8 py-16 text-center shadow-xl shadow-violet-600/20">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Claim your page today
            </h2>
            <p className="mx-auto mt-3 max-w-md text-lg text-violet-100">
              Your audience is already looking for you. Make it one link.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
            >
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-100 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Link2 className="size-4" />
            </span>
            <span className="font-semibold text-neutral-900">BioLink Pro</span>
          </div>
          <p className="text-sm text-neutral-500">
            © 2026 BioLink Pro — Built with Next.js, Prisma, Clerk & Stripe
          </p>
        </div>
      </footer>
    </div>
  );
}
