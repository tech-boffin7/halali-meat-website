import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust path as needed

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'dynamic-products.json');

// Helper function to read products
async function readProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

// Helper function to write products
async function writeProducts(products: any[]) {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing products file:', error);
  }
}

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
  }

  try {
    const newProduct = await request.json();

    // Basic validation (can be enhanced with Zod)
    if (!newProduct.name || !newProduct.description || !newProduct.type) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const products = await readProducts();
    const newId = (products.length > 0 ? Math.max(...products.map((p: any) => parseInt(p.id))) : 0) + 1;
    const productToAdd = { id: newId.toString(), image: '/images/placeholder.jpg', ...newProduct }; // Add a default image

    products.push(productToAdd);
    await writeProducts(products);

    return NextResponse.json(productToAdd, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
