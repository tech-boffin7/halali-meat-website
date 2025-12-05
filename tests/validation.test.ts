import { toAppError, validateDateRange, validateFile } from '@/lib/validation';
import { describe, expect, it } from 'vitest';

describe('validateFile', () => {
  it('should accept valid files', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 }); // 1KB
    
    const result = validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject files exceeding size limit', () => {
    const file = new File(['test'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB
    
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds');
  });

  it('should reject invalid file types', () => {
    const file = new File(['test'], 'malicious.exe', { type: 'application/x-msdownload' });
    Object.defineProperty(file, 'size', { value: 1024 });
    
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });
});

describe('validateDateRange', () => {
  it('should accept valid date range', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-06-01');
    
    const result = validateDateRange(start, end);
    expect(result.valid).toBe(true);
  });

  it('should reject reversed date range', () => {
    const start = new Date('2024-06-01');
    const end = new Date('2024-01-01');
    
    const result = validateDateRange(start, end);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('before end date');
  });

  it('should reject ranges exceeding 2 years', () => {
    const start = new Date('2020-01-01');
    const end = new Date('2024-01-01');
    
    const result = validateDateRange(start, end);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('cannot exceed 2 years');
  });

  it('should handle null/undefined dates', () => {
    const result = validateDateRange(null, null);
    expect(result.valid).toBe(true);
  });
});

describe('toAppError', () => {
  it('should convert Error object', () => {
    const error = new Error('Test error');
    const result = toAppError(error);
    
    expect(result.message).toBe('Test error');
    expect(result.details).toBeDefined();
  });

  it('should convert string error', () => {
    const result = toAppError('String error');
    expect(result.message).toBe('String error');
  });

  it('should handle unknown errors', () => {
    const result = toAppError({ custom: 'object' });
    expect(result.message).toBe('An unknown error occurred');
    expect(result.details).toEqual({ custom: 'object' });
  });
});
