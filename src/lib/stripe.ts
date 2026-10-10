import Stripe from "stripe";

let client: Stripe | undefined;

export function getStripe(): Stripe {
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-09-30.endive",
      appInfo: { name: "BioLink Pro", version: "0.1.0" },
    });
  }
  return client;
}
