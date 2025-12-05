/**
 * Centralized error types and utilities for the application
 */

export type AppError = {
  message: string;
  code?: string;
  details?: unknown;
};

export type ActionResponse<T = void> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: AppError;
};

/**
 * Safely handles unknown errors and converts them to AppError format
 * @param error - The error to handle (can be any type)
 * @returns Formatted AppError object
 */
export function handleError(error: unknown): AppError {
  if (error instanceof Error) {
    return { 
      message: error.message,
      details: error.stack 
    };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return { 
      message: String(error.message),
      details: error 
    };
  }
  
  return { 
    message: 'An unknown error occurred',
    details: error 
  };
}

/**
 * Creates a success response
 */
export function successResponse<T>(data?: T, message?: string): ActionResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Creates an error response
 */
export function errorResponse(error: unknown, message?: string): ActionResponse {
  const appError = handleError(error);
  return {
    success: false,
    message: message || appError.message,
    error: appError,
  };
}
