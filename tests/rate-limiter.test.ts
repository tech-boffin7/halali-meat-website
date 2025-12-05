import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from '@/lib/rate-limiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter();
  });

  it('should allow requests under the limit', () => {
    const result1 = limiter.check('user1', 3, 60000);
    const result2 = limiter.check('user1', 3, 60000);
    
    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);
  });

  it('should block requests over the limit', () => {
    limiter.check('user2', 2, 60000); // 1st request
    limiter.check('user2', 2, 60000); // 2nd request
    const result = limiter.check('user2', 2, 60000); // 3rd request - should be blocked
    
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should use sliding window correctly', async () => {
    const windowMs = 100; // 100ms window for testing
    
    limiter.check('user3', 2, windowMs);
    limiter.check('user3', 2, windowMs);
    
    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const result = limiter.check('user3', 2, windowMs);
    expect(result.allowed).toBe(true); // Should be allowed after window expires
  });

  it('should track different users separately', () => {
    limiter.check('user4', 2, 60000);
    limiter.check('user4', 2, 60000);
    
    const userA = limiter.check('user4', 2, 60000);
    const userB = limiter.check('user5', 2, 60000);
    
    expect(userA.allowed).toBe(false); // user4 hit limit
    expect(userB.allowed).toBe(true);  // user5 is fresh
  });

  it('should reset correctly', () => {
    limiter.check('user6', 1, 60000);
    limiter.reset();
    
    const result = limiter.check('user6', 1, 60000);
    expect(result.allowed).toBe(true); // Should be allowed after reset
  });
});
