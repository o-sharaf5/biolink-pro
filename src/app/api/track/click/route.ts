import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  username: z.string().min(1).max(30),
  linkId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { username, linkId } = Body.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.link.updateMany({
        where: { id: linkId, userId: user.id },
        data: { clicksCount: { increment: 1 } },
      }),
      prisma.analyticsEvent.create({
        data: {
          userId: user.id,
          linkId,
          type: "LINK_CLICK",
          referrer: req.headers.get("referer") ?? undefined,
          userAgent: req.headers.get("user-agent") ?? undefined,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
