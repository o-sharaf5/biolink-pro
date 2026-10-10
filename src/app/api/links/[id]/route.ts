import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  title: z.string().min(1).max(80).optional(),
  url: z.string().url().optional(),
  icon: z.string().max(200).optional().nullable(),
  isActive: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

async function requireDbUserId() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dbUserId = await requireDbUserId();
  if (!dbUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }
  const input = parsed.data;
  const { id } = await params;

  const result = await prisma.link.updateMany({
    where: { id, userId: dbUserId },
    data: input,
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dbUserId = await requireDbUserId();
  if (!dbUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await prisma.link.deleteMany({
    where: { id, userId: dbUserId },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
