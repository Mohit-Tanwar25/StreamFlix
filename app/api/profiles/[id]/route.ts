import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(20).optional(),
  avatar: z.string().optional(),
  isKids: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
      include: {
        watchlist: {
          include: {
            movie: true,
            tvShow: true,
          },
        },
        watchHistory: {
          include: {
            movie: true,
            episode: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const existingProfile = await prisma.profile.findUnique({
      where: { id: params.id },
    });

    if (!existingProfile || existingProfile.userId !== user?.id) {
      return NextResponse.json({ error: "Profile not found or forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const updated = await prisma.profile.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profiles: true },
    });

    if (user && user.profiles.length <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the only remaining profile" },
        { status: 400 }
      );
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { id: params.id },
    });

    if (!existingProfile || existingProfile.userId !== user?.id) {
      return NextResponse.json({ error: "Profile not found or forbidden" }, { status: 403 });
    }

    await prisma.profile.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Profile DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
