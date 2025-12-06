import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET endpoint to fetch current user profile data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        success: false,
        user: null,
      });
    }

    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: user || null,
    });
  } catch (_error) {
    return NextResponse.json({
      success: false,
      user: null,
    });
  }
}
