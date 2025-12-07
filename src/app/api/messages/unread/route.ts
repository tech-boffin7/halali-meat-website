import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';

// Force dynamic rendering because we use getServerSession which reads headers
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const count = await prisma.message.count({
      where: {
        status: 'UNREAD',
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    return NextResponse.json({ error: 'Failed to fetch unread messages count' }, { status: 500 });
  }
}
