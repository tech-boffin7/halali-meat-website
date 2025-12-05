'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Get all unique categories from products with their usage counts
 */
export async function getCategories() {
  try {
    const products = await prisma.product.findMany({
      select: {
        category: true,
      },
    });

    // Count occurrences of each category
    const categoryMap = new Map<string, number>();
    products.forEach((product) => {
      const count = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, count + 1);
    });

    // Convert to array and sort alphabetically
    const categories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      success: true,
      categories,
    };
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories',
      categories: [],
    };
  }
}

/**
 * Get the number of products using a specific category
 */
export async function getCategoryUsageCount(categoryName: string) {
  try {
    const count = await prisma.product.count({
      where: {
        category: categoryName,
      },
    });

    return {
      success: true,
      count,
    };
  } catch (error: any) {
    console.error('Error getting category usage count:', error);
    return {
      success: false,
      error: 'Failed to get category usage count',
      count: 0,
    };
  }
}

/**
 * Rename a category across all products
 */
export async function renameCategory(oldName: string, newName: string) {
  try {
    // Validate inputs
    if (!oldName || !newName) {
      return {
        success: false,
        message: 'Category names cannot be empty',
      };
    }

    if (oldName === newName) {
      return {
        success: false,
        message: 'New name must be different from the old name',
      };
    }

    // Check if new name already exists
    const existingCategory = await prisma.product.findFirst({
      where: {
        category: newName,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: `Category "${newName}" already exists`,
      };
    }

    // Update all products with the old category name
    const result = await prisma.product.updateMany({
      where: {
        category: oldName,
      },
      data: {
        category: newName,
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: `Renamed "${oldName}" to "${newName}" (${result.count} products updated)`,
      updatedCount: result.count,
    };
  } catch (error: any) {
    console.error('Error renaming category:', error);
    return {
      success: false,
      message: 'Failed to rename category',
    };
  }
}

/**
 * Delete a category (only if not in use)
 */
export async function deleteCategory(categoryName: string) {
  try {
    // Check if category is in use
    const usageCount = await prisma.product.count({
      where: {
        category: categoryName,
      },
    });

    if (usageCount > 0) {
      return {
        success: false,
        message: `Cannot delete "${categoryName}". It is used by ${usageCount} product(s).`,
        usageCount,
      };
    }

    // Category is not in use, so it's safe to "delete" it
    // Since categories are just strings on products, there's nothing to delete
    // The category will naturally disappear from the list when no products use it

    revalidatePath('/admin/products');

    return {
      success: true,
      message: `Category "${categoryName}" removed successfully`,
    };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      message: 'Failed to delete category',
    };
  }
}

/**
 * Add a new category (by creating it in the system, not attached to any product yet)
 * Note: In string-based system, categories only exist when products use them
 * This function is here for API completeness but may not be needed
 */
export async function addCategory(categoryName: string) {
  try {
    // Validate input
    if (!categoryName || categoryName.trim() === '') {
      return {
        success: false,
        message: 'Category name cannot be empty',
      };
    }

    // Check if category already exists
    const existingCategory = await prisma.product.findFirst({
      where: {
        category: categoryName,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: `Category "${categoryName}" already exists`,
      };
    }

    // In string-based system, we don't actually create the category
    // It will be created when a product uses it
    // This just validates the name is available

    return {
      success: true,
      message: `Category "${categoryName}" is available and can be used`,
    };
  } catch (error: any) {
    console.error('Error adding category:', error);
    return {
      success: false,
      message: 'Failed to add category',
    };
  }
}
