import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const item = await prisma.watchlist.findUnique({
      where: { id: params.id },
      include: {
        profile: {
          include: { user: true },
        },
      },
    });

    if (!item || item.profile.user.email !== session.user.email) {
      return NextResponse.json({ error: "Item not found or forbidden" }, { status: 403 });
    }

    await prisma.watchlist.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete watchlist item" }, { status: 500 });
  }
}
