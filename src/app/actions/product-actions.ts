'use server';

import { authOptions } from "@/lib/authOptions";
import { getProducts } from '@/lib/data-access';
import { prisma } from '@/lib/db';
import { productSchema, productUpdateSchema } from '@/lib/definitions';
import { handleServerActionError } from '@/lib/error-handler';
import { getServerSession } from "next-auth";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper function to check admin authorization
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Forbidden: You do not have administrative privileges.");
  }
  return session.user.id;
}

export async function createProduct(formData: FormData) {
  try {
    const userId = await checkAdminAuth();

    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      type: formData.get('type'),
      imageUrl: formData.get('imageUrl'),
    };

    const parsedData = productSchema.parse(productData);

    const newProduct = await prisma.product.create({
      data: {
        ...parsedData,
        createdById: userId,
      },
    });

    // Revalidate public products page so new product appears immediately
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true, message: 'Product added successfully', product: newProduct };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return handleServerActionError(error, 'Failed to create product');
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await checkAdminAuth();

    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      type: formData.get('type'),
      imageUrl: formData.get('imageUrl'),
    };

    const parsedData = productUpdateSchema.parse(productData);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: parsedData,
    });

    // Revalidate public products page so changes reflect immediately
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true, message: 'Product updated successfully', product: updatedProduct };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return handleServerActionError(error, 'Failed to update product');
  }
}

export async function deleteProduct(id: string) {
  try {
    await checkAdminAuth();

    await prisma.product.delete({
      where: { id },
    });

    // Revalidate public products page so deleted product is removed immediately
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true, message: 'Product deleted successfully' };
  } catch (error: any) {
    return handleServerActionError(error, 'Failed to delete product');
  }
}

export async function getProductsAction(
  page = 1, 
  limit = 12, 
  search?: string, 
  sortBy?: string, 
  dateFrom?: Date, 
  dateTo?: Date,
  category?: string,
  type?: string
) {
  try {
    // Auth is handled at page/layout level, safe to call directly
    const { products, totalCount } = await getProducts(page, limit, search, sortBy, dateFrom, dateTo, category, type);
    return { success: true, products, totalCount };
  } catch (error: any) {
    console.error('Error in getProductsAction:', error);
    return { success: false, message: error.message || 'Failed to fetch products' };
  }
}

export async function getAllProductsForExport(
  search?: string, 
  sortBy?: string, 
  dateFrom?: Date, 
  dateTo?: Date,
  category?: string,
  type?: string
) {
  try {
    // Auth is handled at page/layout level, safe to call directly
    const { products } = await getProducts(1, 0, search, sortBy, dateFrom, dateTo, category, type);
    return { success: true, products };
  } catch (error: any) {
    console.error('Error in getAllProductsForExport:', error);
    return { success: false, message: error.message || 'Failed to fetch products for export' };
  }
}

export async function deleteMultipleProducts(ids: string[]) {
  try {
    await checkAdminAuth();
    await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });
    
    // Revalidate public products page
    revalidatePath('/products');
    revalidatePath('/admin/products');
    
    return { success: true, message: `Successfully deleted ${ids.length} products` };
  } catch (error: any) {
    console.error('Error in deleteMultipleProducts:', error);
    return handleServerActionError(error, 'Failed to delete products');
  }
}

export async function updateMultipleProductsCategory(ids: string[], category: string) {
  try {
    await checkAdminAuth();
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { category },
    });
    
    // Revalidate public products page
    revalidatePath('/products');
    revalidatePath('/admin/products');
    
    return { success: true, message: `Successfully updated category for ${ids.length} products` };
  } catch (error: any) {
    console.error('Error in updateMultipleProductsCategory:', error);
    return handleServerActionError(error, 'Failed to update product categories');
  }
}

export async function updateMultipleProductsPrices(ids: string[], percentage: number, operation: 'increase' | 'decrease') {
  try {
    await checkAdminAuth();
    
    // Fetch current products
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true },
    });

    // Calculate new prices
    const updatePromises = products.map(product => {
      const multiplier = operation === 'increase' ? (1 + percentage / 100) : (1 - percentage / 100);
      const newPrice = parseFloat((product.price * multiplier).toFixed(2));
      
      return prisma.product.update({
        where: { id: product.id },
        data: { price: newPrice },
      });
    });

    await Promise.all(updatePromises);
    
    // Revalidate public products page
    revalidatePath('/products');
    revalidatePath('/admin/products');
    
    const action = operation === 'increase' ? 'increased' : 'decreased';
    return { success: true, message: `Successfully ${action} prices for ${ids.length} products by ${percentage}%` };
  } catch (error: any) {
    console.error('Error in updateMultipleProductsPrices:', error);
    return handleServerActionError(error, 'Failed to update product prices');
  }
}
