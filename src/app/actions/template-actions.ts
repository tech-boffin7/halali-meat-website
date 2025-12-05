'use server';

import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/db';
import { getServerSession } from "next-auth";
import { revalidatePath } from 'next/cache';

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  // Cast user to any to access role, or define a custom session type if available
  const user = session?.user as { role?: string; id?: string } | undefined;
  
  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden: You do not have administrative privileges.");
  }
  return user.id;
}

export interface TemplateData {
  name: string;
  content: string;
  isDefault?: boolean;
}

export async function getTemplates() {
  try {
    await checkAdminAuth();
    const templates = await prisma.quoteTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, templates };
  } catch (error: unknown) {
    console.error("Error fetching templates:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch templates';
    return { success: false, error: errorMessage };
  }
}

export async function createTemplate(data: TemplateData) {
  try {
    await checkAdminAuth();
    
    if (data.isDefault) {
      // Unset other defaults if this one is default
      await prisma.quoteTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await prisma.quoteTemplate.create({
      data: {
        name: data.name,
        content: data.content,
        isDefault: data.isDefault || false,
      },
    });
    
    revalidatePath('/admin/quotes');
    return { success: true, template };
  } catch (error: unknown) {
    console.error("Error creating template:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create template';
    return { success: false, error: errorMessage };
  }
}

export async function updateTemplate(id: string, data: TemplateData) {
  try {
    await checkAdminAuth();

    if (data.isDefault) {
      // Unset other defaults
      await prisma.quoteTemplate.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const template = await prisma.quoteTemplate.update({
      where: { id },
      data: {
        name: data.name,
        content: data.content,
        isDefault: data.isDefault,
      },
    });

    revalidatePath('/admin/quotes');
    return { success: true, template };
  } catch (error: unknown) {
    console.error("Error updating template:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update template';
    return { success: false, error: errorMessage };
  }
}

export async function deleteTemplate(id: string) {
  try {
    await checkAdminAuth();
    await prisma.quoteTemplate.delete({
      where: { id },
    });
    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting template:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete template';
    return { success: false, error: errorMessage };
  }
}
