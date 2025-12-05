/**
 * Server Action Error Handler Utility
 * Provides user-friendly error messages for common database and server errors
 */

import { Prisma } from '@prisma/client';

interface ErrorResponse {
  success: false;
  message: string;
}

/**
 * Handles server action errors and returns user-friendly messages
 */
export function handleServerActionError(error: unknown, defaultMessage: string): ErrorResponse {
  // Prisma-specific errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const field = (error.meta?.target as string[])?.join(', ') || 'field';
        return {
          success: false,
          message: `A record with this ${field} already exists. Please use a different value.`,
        };
      case 'P2025':
        // Record not found
        return {
          success: false,
          message: 'The requested record was not found. It may have been deleted.',
        };
      case 'P2003':
        // Foreign key constraint
        return {
          success: false,
          message: 'Cannot perform this operation due to related records. Please remove dependencies first.',
        };
      case 'P2014':
        // Required relation violation
        return {
          success: false,
          message: 'This operation requires related data that is missing.',
        };
      default:
        console.error('Prisma error:', error.code, error.message);
        return {
          success: false,
          message: `Database error: ${error.message}`,
        };
    }
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      success: false,
      message: 'Invalid data provided. Please check your input and try again.',
    };
  }

  // Generic Error objects
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes('timeout')) {
      return {
        success: false,
        message: 'Request timed out. Please try again.',
      };
    }
    
    if (error.message.includes('network')) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }

    if (error.message.includes('Forbidden') || error.message.includes('administrative privileges')) {
      return {
        success: false,
        message: error.message, // Keep auth errors as-is
      };
    }

    return {
      success: false,
      message: error.message || defaultMessage,
    };
  }

  // Unknown error type
  console.error('Unknown error type:', error);
  return {
    success: false,
    message: defaultMessage,
  };
}
