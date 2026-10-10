import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook, type WebhookEvent } from "@clerk/nextjs/webhooks";
import { prisma } from "@/lib/prisma";

type ClerkUserPayload = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  primary_email_address_id: string | null;
  email_addresses: { id: string; email_address: string }[];
};

export async function POST(req: NextRequest) {
  let event: WebhookEvent;
  try {
    event = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET!,
    });
  } catch {
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ received: true });
  }

  const data = event.data as unknown as ClerkUserPayload;
  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  );
  const name = [data.first_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  await prisma.user.upsert({
    where: { clerkId: data.id },
    update: {
      email: primaryEmail?.email_address ?? `${data.id}@clerk.invalid`,
      name: name || null,
    },
    create: {
      clerkId: data.id,
      email: primaryEmail?.email_address ?? `${data.id}@clerk.invalid`,
      name: name || null,
    },
  });

  return NextResponse.json({ received: true });
}
