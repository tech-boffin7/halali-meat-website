import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/authOptions'; 

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
  }

  try {
    const { id } = params;
    const updatedProductData = await request.json();

    if (!updatedProductData.name || !updatedProductData.description || !updatedProductData.type) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    let products = await readProducts();
    const productIndex = products.findIndex((p: any) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[productIndex] = { ...products[productIndex], ...updatedProductData, id };
    await writeProducts(products);

    return NextResponse.json(products[productIndex]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
  }

  try {
    const { id } = params;

    let products = await readProducts();
    const initialLength = products.length;
    products = products.filter((p: any) => p.id !== id);

    if (products.length === initialLength) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await writeProducts(products);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}