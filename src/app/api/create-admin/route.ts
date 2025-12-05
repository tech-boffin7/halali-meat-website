import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: { email: 'kuzzi@halalimeat.co.ke' }
        });

        if (existingAdmin) {
            return NextResponse.json({
                message: 'Admin already exists! Try logging in with: kuzzi@halalimeat.co.ke / Kuzzi123!',
                success: true
            });
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('Kuzzi123!', 10);

        const admin = await prisma.user.create({
            data: {
                name: 'Kuzzi',
                email: 'kuzzi@halalimeat.co.ke',
                password: hashedPassword,
            }
        });

        return NextResponse.json({
            message: 'Admin user created successfully! Email: kuzzi@halalimeat.co.ke / Password: Kuzzi123!',
            success: true,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error: any) {
        console.error('Error creating admin:', error);
        return NextResponse.json({
            message: 'Failed to create admin',
            error: error.message,
            success: false
        }, { status: 500 });
    }
}
