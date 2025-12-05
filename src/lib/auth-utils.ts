import { logger } from '@/lib/logger';

// In-memory store for failed login attempts and lockout status
// NOTE: For a production environment, this should be replaced with a persistent store (e.g., Redis, database)
// as in-memory data will be lost on server restarts or multiple instances.

interface LoginAttempt {
  timestamp: number;
  ip: string; // In a real scenario, you'd track by IP or username
}

interface LockoutStatus {
  lockedUntil: number;
  failedAttempts: number;
}

const FAILED_ATTEMPTS_THRESHOLD = 5; // Number of failed attempts before lockout
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

// Using a simple object for in-memory storage.
// In a multi-instance environment, this would be shared (e.g., Redis).
const loginAttempts: Record<string, LoginAttempt[]> = {};
const lockoutStatus: Record<string, LockoutStatus> = {};

// For simplicity, we'll use a fixed key for the admin user
const ADMIN_KEY = 'admin';

export function recordFailedLoginAttempt() {
  const now = Date.now();
  if (!loginAttempts[ADMIN_KEY]) {
    loginAttempts[ADMIN_KEY] = [];
  }
  loginAttempts[ADMIN_KEY].push({ timestamp: now, ip: '127.0.0.1' }); // IP is placeholder for admin
  
  // Clean up old attempts
  loginAttempts[ADMIN_KEY] = loginAttempts[ADMIN_KEY].filter(
    (attempt) => now - attempt.timestamp < LOCKOUT_DURATION_MS
  );

  if (loginAttempts[ADMIN_KEY].length >= FAILED_ATTEMPTS_THRESHOLD) {
    lockoutStatus[ADMIN_KEY] = {
      lockedUntil: now + LOCKOUT_DURATION_MS,
      failedAttempts: loginAttempts[ADMIN_KEY].length,
    };
    console.warn(`Admin account locked out until ${new Date(lockoutStatus[ADMIN_KEY].lockedUntil).toLocaleTimeString()}`);
  }
}

export function clearAdminLoginAttempts() {
  delete lockoutStatus[ADMIN_KEY];
  logger.info('Admin login attempts cleared');
}

export function isAccountLocked(): boolean {
  const status = lockoutStatus[ADMIN_KEY];
  if (status && Date.now() < status.lockedUntil) {
    logger.warn(`Admin account is locked. Try again after ${new Date(status.lockedUntil).toLocaleTimeString()}`);
    return true;
  } else if (status && Date.now() >= status.lockedUntil) {
    // Lockout period expired, clear status
    clearAdminLoginAttempts();
  }
  return false;
}

export function getRemainingLockoutTime(): number {
  const status = lockoutStatus[ADMIN_KEY];
  if (status && Date.now() < status.lockedUntil) {
    return status.lockedUntil - Date.now();
  }
  return 0;
}
