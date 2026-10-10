import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  username: z.string().min(2).max(30),
  amount: z.number().int().min(100).max(99900),
  donorName: z.string().min(1).max(60).optional(),
  message: z.string().max(280).optional(),
});

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "tips are not configured yet" },
      { status: 503 }
    );
  }

  const input = Body.parse(await req.json());

  const user = await prisma.user.findUnique({
    where: { username: input.username },
  });
  if (!user || !user.tipEnabled) {
    return NextResponse.json({ error: "tips unavailable" }, { status: 404 });
  }

  const PLATFORM_FEE_BPS = 500;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: input.amount,
          product_data: { name: `Tip for ${user.name ?? user.username}` },
        },
        quantity: 1,
      },
    ],
    client_reference_id: user.id,
    metadata: {
      username: user.username,
      donorName: input.donorName ?? "",
      message: input.message ?? "",
    },
    ...(user.stripeAccountId
      ? {
          payment_intent_data: {
            application_fee_amount: Math.round(
              (input.amount * PLATFORM_FEE_BPS) / 10000
            ),
            transfer_data: { destination: user.stripeAccountId },
          },
        }
      : {}),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}?tip=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}?tip=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
