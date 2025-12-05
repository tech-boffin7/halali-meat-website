import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test database connection
        await prisma.$connect();

        // Check if any users exist
        const userCount = await prisma.user.count();
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        });

        // Check database connection string (without exposing full URL)
        const dbUrl = process.env.DATABASE_URL || 'NOT SET';
        const dbUrlMasked = dbUrl.substring(0, 20) + '...' + dbUrl.substring(dbUrl.length - 10);

        return NextResponse.json({
            success: true,
            databaseConnected: true,
            databaseUrl: dbUrlMasked,
            userCount,
            users,
            nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
            nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            databaseConnected: false,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
