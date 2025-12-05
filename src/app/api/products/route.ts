import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/db';
import { productSchema } from '@/lib/definitions';
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsedData = productSchema.parse(body);

    const newProduct = await prisma.product.create({
      data: {
        ...parsedData,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}