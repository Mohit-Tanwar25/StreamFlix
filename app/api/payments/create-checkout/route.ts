import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PLANS } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  planId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    const plan = PLANS.find((p) => p.id === result.data.planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // If Stripe is not configured or in development fallback mode:
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      // Simulate successful subscription for development
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan: plan.name,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
          userId: user.id,
          stripeCustomerId: `cus_dev_${user.id}`,
          stripeSubscriptionId: `sub_dev_${Date.now()}`,
          plan: plan.name,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentId: `pi_dev_${Date.now()}`,
          amount: plan.priceAmount,
          currency: "usd",
          status: "succeeded",
        },
      });

      return NextResponse.json({
        url: `${appUrl}/subscription?success=true&plan=${plan.name}`,
        isSimulated: true,
      });
    }

    // Real Stripe Checkout Session creation
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `StreamFlix ${plan.name} Plan`,
              description: `${plan.resolution} Streaming Plan`,
            },
            unit_amount: plan.priceAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        planName: plan.name,
      },
      success_url: `${appUrl}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/subscription?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Create Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
