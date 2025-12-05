import zxcvbn from 'zxcvbn';

export interface PasswordStrength {
  score: number; // 0-4 (0 = weak, 4 = strong)
  feedback: string[];
  isValid: boolean;
  percentage: number; // 0-100
}

const MIN_PASSWORD_LENGTH = 8;

/**
 * Validate password strength and requirements
 * @param password - Password to validate
 * @returns Password strength details
 */
export function validatePassword(password: string): PasswordStrength {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return {
      score: 0,
      feedback: [`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`],
      isValid: false,
      percentage: 0,
    };
  }

  // Use zxcvbn for strength analysis
  const result = zxcvbn(password);
  const feedback: string[] = [];

  // Check requirements
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase) feedback.push('Add uppercase letters');
  if (!hasLowercase) feedback.push('Add lowercase letters');
  if (!hasNumber) feedback.push('Add numbers');
  if (!hasSpecial) feedback.push('Add special characters (!@#$%^&*)');

  // Add z xcvbn suggestions
  if (result.feedback.warning) {
    feedback.push(result.feedback.warning);
  }
  if (result.feedback.suggestions) {
    feedback.push(...result.feedback.suggestions);
  }

  // Must have at least 3 of 4 character types
  const typesCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const isValid = password.length >= MIN_PASSWORD_LENGTH && typesCount >= 3;

  return {
    score: result.score,
    feedback,
    isValid,
    percentage: (result.score / 4) * 100,
  };
}

/**
 * Get password strength label
 * @param score - zxcvbn score (0-4)
 * @returns Human-readable strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[score] || 'Unknown';
}

/**
 * Get password strength color for UI
 * @param score - zxcvbn score (0-4)
 * @returns Tailwind color class
 */
export function getPasswordStrengthColor(score: number): string {
  const colors = [
    'bg-red-500',      // Very Weak
    'bg-orange-500',   // Weak
    'bg-yellow-500',   // Fair
    'bg-blue-500',     // Good
    'bg-green-500',    // Strong
  ];
  return colors[score] || 'bg-gray-500';
}
