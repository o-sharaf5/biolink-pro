import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureCurrentUser } from "@/lib/user";

const Body = z.object({
  name: z.string().max(80).optional(),
  username: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional()
    .nullable(),
  bio: z.string().max(160).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  tipEnabled: z.boolean().optional(),
  themeSettings: z.record(z.string(), z.any()).optional(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await ensureCurrentUser();
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const input = Body.parse(await req.json());
  await ensureCurrentUser();

  if (input.username) {
    const taken = await prisma.user.findUnique({
      where: { username: input.username },
    });
    if (taken && taken.clerkId !== userId) {
      return NextResponse.json(
        { error: "username already taken" },
        { status: 409 }
      );
    }
  }

  const user = await prisma.user.update({
    where: { clerkId: userId },
    data: input,
  });
  return NextResponse.json(user);
}
