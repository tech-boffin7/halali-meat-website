import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// SECURITY: This endpoint should be deleted after first use
export async function GET(request: Request) {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'kuzzi@halalimeat.co.ke' }
        });

        if (existingAdmin) {
            return NextResponse.json({
                success: false,
                message: 'Admin user already exists. You can now login with: kuzzi@halalimeat.co.ke',
                action: 'DELETE THIS FILE: src/app/api/setup/route.ts'
            });
        }

        // Create admin user with hashed password
        const hashedPassword = await bcrypt.hash('Kuzzi123!', 10);

        await prisma.user.create({
            data: {
                name: 'Kuzzi',
                email: 'kuzzi@halalimeat.co.ke',
                password: hashedPassword,
            }
        });

        return NextResponse.json({
            success: true,
            message: '✅ Admin user created successfully!',
            credentials: {
                email: 'kuzzi@halalimeat.co.ke',
                password: 'Kuzzi123!'
            },
            nextSteps: [
                '1. Go to /login and sign in',
                '2. After logging in, DELETE this file: src/app/api/setup/route.ts',
                '3. Push the deletion to GitHub'
            ]
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
