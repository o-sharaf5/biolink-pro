import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/track/(.*)",
  "/api/stripe/webhook",
  "/api/webhooks/clerk(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  const isBioPage =
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/sign-in") &&
    !pathname.startsWith("/sign-up") &&
    /^\/[a-zA-Z0-9_-]{2,30}$/.test(pathname);

  if (isPublicRoute(request) || isBioPage) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  if (!userId) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(url, 307);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
