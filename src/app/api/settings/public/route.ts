import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Public endpoint to fetch logo URLs (no auth required)
export async function GET() {
  try {
    // Get the first admin user's settings
    const setting = await prisma.settings.findFirst({
      select: {
        companyLogoUrl: true,
        companyLogoDarkUrl: true,
        faviconUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      settings: setting || {},
    });
  } catch (_error) {
    return NextResponse.json({
      success: false,
      settings: {},
    });
  }
}
