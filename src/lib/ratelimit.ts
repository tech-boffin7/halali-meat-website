import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Simple in-memory rate limiter for development/fallback
class SimpleRateLimiter {
  private requests = new Map<string, number[]>();

  async limit(identifier: string): Promise<{ success: boolean }> {
    const now = Date.now();
    const windowMs = 10000; // 10 seconds
    const maxRequests = 5;

    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return { success: false };
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      for (const [key, times] of this.requests.entries()) {
        const recent = times.filter(time => now - time < windowMs);
        if (recent.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, recent);
        }
      }
    }

    return { success: true };
  }
}

// Use Upstash if configured, otherwise fallback to simple in-memory rate limiter
let ratelimitInstance: Ratelimit | SimpleRateLimiter;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimitInstance = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10 s'), // 5 requests from the same IP in 10 seconds
  });

  console.log('✅ Using Upstash Redis for rate limiting');
} else {
  ratelimitInstance = new SimpleRateLimiter();
  console.warn('⚠️  Upstash Redis not configured. Using in-memory rate limiting (not suitable for production)');
}

export const ratelimit = ratelimitInstance;