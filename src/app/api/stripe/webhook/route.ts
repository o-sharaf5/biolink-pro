import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const signature = (await headers()).get("stripe-signature");
  const raw = await req.text();
  if (!signature) return new Response("missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(
      `invalid signature: ${(err as Error).message}`,
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.transaction.upsert({
      where: { stripeSessionId: session.id },
      update: {},
      create: {
        userId: session.client_reference_id ?? "",
        donorName: session.metadata?.donorName || null,
        message: session.metadata?.message || null,
        amount: session.amount_total ?? 0,
        currency: (session.currency ?? "usd").toUpperCase(),
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
      },
    });
  }

  return NextResponse.json({ received: true });
}
