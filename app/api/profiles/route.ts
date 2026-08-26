import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProfileSchema = z.object({
  name: z.string().min(1, "Profile name is required").max(20, "Name too long"),
  avatar: z.string().optional(),
  isKids: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profiles: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.profiles);
  } catch (error) {
    console.error("Profiles GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profiles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.profiles.length >= 5) {
      return NextResponse.json(
        { error: "Maximum limit of 5 profiles reached" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const result = createProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, avatar, isKids } = result.data;

    const profile = await prisma.profile.create({
      data: {
        name,
        avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isKids: Boolean(isKids),
        userId: user.id,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
