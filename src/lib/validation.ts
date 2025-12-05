// Application error types for consistent error handling
export type AppError = {
  message: string;
  code?: string;
  details?: unknown;
};

// File validation constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  ALLOWED_EXTENSIONS: [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.txt',
    '.csv',
  ],
} as const;

// File validation function
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB limit`,
    };
  }

  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: images, PDFs, and documents',
    };
  }

  // Check file extension as additional security
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(extension as any)) {
    return {
      valid: false,
      error: 'Invalid file extension',
    };
  }

  return { valid: true };
}

// Date range validation
export function validateDateRange(
  dateFrom?: Date | null,
  dateTo?: Date | null
): { valid: boolean; error?: string } {
  if (!dateFrom || !dateTo) {
    return { valid: true }; // Optional parameters
  }

  if (dateFrom > dateTo) {
    return {
      valid: false,
      error: 'Start date must be before end date',
    };
  }

  // Check if date range is reasonable (not more than 2 years)
  const maxRangeMs = 2 * 365 * 24 * 60 * 60 * 1000; // 2 years in ms
  if (dateTo.getTime() - dateFrom.getTime() > maxRangeMs) {
    return {
      valid: false,
      error: 'Date range cannot exceed 2 years',
    };
  }

  return { valid: true };
}

// Helper to convert unknown error to AppError
export function toAppError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return {
    message: 'An unknown error occurred',
    details: error,
  };
}
