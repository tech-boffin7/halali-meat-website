import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
                email,
            });
        }

        // Test password
        const passwordMatch = await bcrypt.compare(password, user.password);

        return NextResponse.json({
            success: true,
            userFound: true,
            passwordMatch,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            passwordHashPreview: user.password.substring(0, 20) + '...',
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

// Also allow GET for quick testing
export async function GET() {
    return NextResponse.json({
        message: 'Use POST with { email, password } to test authentication',
        example: {
            email: 'kuzzi@halalimeat.co.ke',
            password: 'Kuzzi123!'
        }
    });
}
