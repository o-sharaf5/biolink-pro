import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  title: z.string().min(1).max(80),
  url: z.string().url(),
  icon: z.string().max(200).optional().nullable(),
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

export async function GET() {
  const dbUserId = await requireDbUserId();
  if (!dbUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const links = await prisma.link.findMany({
    where: { userId: dbUserId },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const dbUserId = await requireDbUserId();
  if (!dbUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid input",
        issues: parsed.error.issues.map(
          (i) => `${i.path.join(".")}: ${i.message}`
        ),
      },
      { status: 400 }
    );
  }
  const input = parsed.data;
  const count = await prisma.link.count({ where: { userId: dbUserId } });

  const link = await prisma.link.create({
    data: {
      userId: dbUserId,
      title: input.title,
      url: input.url,
      icon: input.icon ?? null,
      position: count,
    },
  });
  return NextResponse.json(link, { status: 201 });
}
