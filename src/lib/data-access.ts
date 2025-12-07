import { Prisma, QuoteStatus } from '@prisma/client';
import { prisma } from './db';
import { validateDateRange } from './validation';

// Prevent abuse by limiting max results per query
const MAX_LIMIT = 100;

/**
 * Get user settings by userId
 * Creates default settings if none exist
 */
export async function getUserSettings(userId: string) {
  let settings = await prisma.settings.findUnique({
    where: { userId },
  });

  // Create default settings if none exist
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        userId,
        // Defaults are set in Prisma schema
      },
    });
  }

  return settings;
}
export async function getProducts(
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
    // Validate date range
    const dateValidation = validateDateRange(dateFrom, dateTo);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.error);
    }

    // Enforce max limit to prevent abuse
    const safeLimit = limit === 0 ? 0 : Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * safeLimit;

    const where: Prisma.ProductWhereInput = {};

    // Search filter - case insensitive across name and description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filter - String field, case insensitive
    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    // Type filter - ProductType enum, must match exact value (CHILLED or FROZEN)
    if (type) {
      // Convert to uppercase to match enum: "frozen" -> "FROZEN"
      // We cast to any here because we're dynamically matching the enum string
      where.type = type.toUpperCase() as any;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endOfDay;
      }
    }

    // Sorting - handle field_order format
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy && sortBy.includes('_')) {
      const [field, order] = sortBy.split('_');
      // Validate field and order
      const validFields = ['createdAt', 'updatedAt', 'name', 'price'];
      const validOrders = ['asc', 'desc'];

      if (validFields.includes(field) && validOrders.includes(order)) {
        // Dynamic key assignment requires careful typing or casting for Prisma
        (orderBy as any)[field] = order;
      } else {
        // Default to createdAt desc if invalid
        orderBy.createdAt = 'desc';
      }
    } else {
      // Default sorting
      orderBy.createdAt = 'desc';
    }

    // Build query options
    const findManyOptions: Prisma.ProductFindManyArgs = {
      where,
      orderBy,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    };

    // Pagination - if limit is 0, fetch all
    if (safeLimit > 0) {
      findManyOptions.skip = skip;
      findManyOptions.take = safeLimit;
    }

    // Execute query in transaction for consistency
    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany(findManyOptions),
      prisma.product.count({ where }),
    ]);

    return { products, totalCount };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getQuotes(page = 1, limit = 10, status?: string, sortBy?: string, search?: string, dateFrom?: Date, dateTo?: Date) {
  try {
    // Validate date range
    const dateValidation = validateDateRange(dateFrom, dateTo);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.error);
    }

    // Enforce max limit to prevent abuse
    const safeLimit = limit === 0 ? 0 : Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * safeLimit;

    const where: Prisma.QuoteWhereInput = {};
    if (status && status !== 'ALL') {
      if (Object.values(QuoteStatus).includes(status as QuoteStatus)) {
        where.status = status as QuoteStatus;
      }
    } else {
      where.status = { notIn: [QuoteStatus.ARCHIVED, QuoteStatus.TRASH] };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { productInterest: { contains: search, mode: 'insensitive' } },
        { quantity: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        // Set time to end of day for inclusive filtering
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endOfDay;
      }
    }

    const orderBy: Prisma.QuoteOrderByWithRelationInput = {};
    if (sortBy) {
      const [field, order] = sortBy.split('_');
      (orderBy as any)[field] = order;
    } else {
      orderBy.createdAt = 'desc';
    }

    const findManyOptions: Prisma.QuoteFindManyArgs = {
      where,
      orderBy,
      include: {
        replies: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    };

    if (safeLimit > 0) {
      findManyOptions.skip = skip;
      findManyOptions.take = safeLimit;
    }

    const quotes = await prisma.quote.findMany(findManyOptions);

    const totalCount = await prisma.quote.count({ where });

    return { quotes, totalCount };
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return { quotes: [], totalCount: 0 };
  }
}

export async function getContactMessages(page = 1, limit = 10, status?: string, sortBy?: string, search?: string, dateFrom?: Date, dateTo?: Date) {
  try {
    // Validate date range
    const dateValidation = validateDateRange(dateFrom, dateTo);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.error);
    }

    // Enforce max limit to prevent abuse  
    const safeLimit = limit === 0 ? 0 : Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * safeLimit;

    const where: Prisma.MessageWhereInput = { type: 'INBOUND' };
    if (status && status !== 'ALL') {
      // Cast status to any to avoid strict enum check if status comes from URL param
      where.status = status as any;
    } else {
      // For 'ALL' (Inbox), we don't want to see archived or trashed messages
      where.status = { notIn: ['ARCHIVED', 'TRASH'] };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        // Set time to end of day for inclusive filtering
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endOfDay;
      }
    }

    const orderBy: Prisma.MessageOrderByWithRelationInput[] = [];
    if (sortBy) {
      const [field, order] = sortBy.split('_');
      orderBy.push({ [field]: order } as any);
      // If sorting by createdAt, add a secondary sort by id for consistency
      if (field === 'createdAt') {
        orderBy.push({ id: order } as any); // Use the same order as createdAt for id
      }
    } else {
      // Default sort
      orderBy.push({ createdAt: 'desc' });
      orderBy.push({ id: 'desc' });
    }

    const findManyOptions: Prisma.MessageFindManyArgs = {
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        body: true,
        status: true,
        type: true,
        isDraft: true,
        createdAt: true,
        attachments: true,
        threadId: true,
        parentMessageId: true,
      },
    };

    if (safeLimit !== 0) {
      findManyOptions.skip = skip;
      findManyOptions.take = safeLimit;
    }

    const [messages, totalCount] = await prisma.$transaction([
      prisma.message.findMany(findManyOptions),
      prisma.message.count({ where }),
    ]);

    return { messages, totalCount };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { messages: [], totalCount: 0 };
  }
}

export async function getSentMessages(userId: string, page = 1, limit = 10, sortBy?: string, search?: string, status?: string, dateFrom?: Date, dateTo?: Date) {
  try {
    // Enforce max limit to prevent abuse
    // const safeLimit = limit === 0 ? 0 : Math.min(limit, MAX_LIMIT);
    // const skip = (page - 1) * safeLimit;

    const where: Prisma.MessageWhereInput = { type: 'OUTBOUND', userId };

    if (status && status !== 'ALL') {
      where.status = status as any;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        // Set time to end of day for inclusive filtering
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endOfDay;
      }
    }

    const orderBy: Prisma.MessageOrderByWithRelationInput[] = [];
    if (sortBy) {
      const [field, order] = sortBy.split('_');
      orderBy.push({ [field]: order } as any);
      // If sorting by createdAt, add a secondary sort by id for consistency
      if (field === 'createdAt') {
        orderBy.push({ id: order } as any); // Use the same order as createdAt for id
      }
    } else {
      // Default sort
      orderBy.push({ createdAt: 'desc' });
      orderBy.push({ id: 'desc' });
    }

    const findManyOptions: Prisma.MessageFindManyArgs = {
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        body: true,
        status: true,
        type: true,
        createdAt: true,
      },
    };

    if (limit !== 0 && limit !== undefined) {
      findManyOptions.skip = (page - 1) * limit;
      findManyOptions.take = limit;
    }

    const [messages, totalCount] = await prisma.$transaction([
      prisma.message.findMany(findManyOptions),
      prisma.message.count({ where }),
    ]);

    return { messages, totalCount };
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    return { messages: [], totalCount: 0 };
  }
}
