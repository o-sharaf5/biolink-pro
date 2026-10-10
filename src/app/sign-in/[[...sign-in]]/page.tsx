import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div className="h-80 w-full max-w-md animate-pulse rounded-lg bg-muted" />}>
        <SignIn />
      </Suspense>
    </div>
  );
}
