import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia" as any,
      typescript: true,
    })
  : null;

export const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$8.99",
    priceAmount: 899,
    quality: "Good",
    resolution: "720p (HD)",
    devices: 1,
    features: [
      "Watch on 1 supported device at a time",
      "Unlimited movies and TV shows",
      "720p HD streaming",
      "Cancel anytime",
    ],
    stripePriceId: process.env.STRIPE_PRICE_BASIC || "price_basic_default",
  },
  {
    id: "standard",
    name: "Standard",
    price: "$14.99",
    priceAmount: 1499,
    popular: true,
    quality: "Better",
    resolution: "1080p (Full HD)",
    devices: 2,
    features: [
      "Watch on 2 supported devices at a time",
      "Unlimited movies and TV shows",
      "1080p Full HD streaming",
      "Download on 2 devices",
      "Spatial audio support",
    ],
    stripePriceId: process.env.STRIPE_PRICE_STANDARD || "price_standard_default",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19.99",
    priceAmount: 1999,
    quality: "Best",
    resolution: "4K (Ultra HD) + HDR",
    devices: 4,
    features: [
      "Watch on 4 supported devices at a time",
      "Unlimited movies and TV shows",
      "4K Ultra HD + HDR streaming",
      "Download on 6 devices",
      "StreamFlix Spatial Audio",
      "Dolby Atmos & Vision",
    ],
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM || "price_premium_default",
  },
];
