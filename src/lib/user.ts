import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function ensureCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (existing) return existing;

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? `${clerkUser.id}@clerk.invalid`;
  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email,
      name: name || null,
      avatarUrl: clerkUser.imageUrl || null,
    },
  });
}
