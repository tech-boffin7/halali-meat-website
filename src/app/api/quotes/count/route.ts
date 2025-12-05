import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const count = await prisma.quote.count({
      where: {
        status: { notIn: ['ARCHIVED', 'TRASH'] },
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching quote count:', error);
    return NextResponse.json({ error: 'Failed to fetch quote count' }, { status: 500 });
  }
}
