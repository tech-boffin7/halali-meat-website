/**
 * Lightweight in-memory rate limiter
 * Uses sliding window algorithm with IP-based tracking
 */

interface RateLimitEntry {
  timestamps: number[];
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up old entries every 5 minutes
    if (typeof window === 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Check if request is allowed under rate limit
   * @param key - Unique identifier (usually IP address)
   * @param limit - Maximum number of requests
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed status and retry info
   */
  check(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetAt: Date } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create entry
    let entry = this.store.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.store.set(key, entry);
    }

    // Remove timestamps outside the window (sliding window)
    entry.timestamps = entry.timestamps.filter(t => t > windowStart);

    // Check if limit exceeded
    const allowed = entry.timestamps.length < limit;

    if (allowed) {
      // Add current timestamp
      entry.timestamps.push(now);
    }

    // Calculate remaining requests
    const remaining = Math.max(0, limit - entry.timestamps.length);

    // Calculate reset time (when oldest timestamp expires)
    const oldestTimestamp = entry.timestamps[0] || now;
    const resetAt = new Date(oldestTimestamp + windowMs);

    return { allowed, remaining, resetAt };
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup() {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, entry] of this.store.entries()) {
      const hasRecentActivity = entry.timestamps.some(t => now - t < maxAge);
      if (!hasRecentActivity) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  reset() {
    this.store.clear();
  }
}

// Export singleton instances for different use cases
export const contactFormLimiter = new RateLimiter();
export const quoteFormLimiter = new RateLimiter();
export const loginLimiter = new RateLimiter();
export const rateLimiter = new RateLimiter(); // Generic limiter for other use cases

// Export class for testing
export { RateLimiter };

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  CONTACT_FORM: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  QUOTE_FORM: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  LOGIN: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const;

/**
 * Helper to get client IP from request
 */
export function getClientIp(request: Request): string {
  // Try various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

