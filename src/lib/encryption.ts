import CryptoJS from 'crypto-js';

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'your-fallback-secret-key-change-in-production';

if (!process.env.ENCRYPTION_SECRET) {
  console.warn('WARNING: ENCRYPTION_SECRET not set in environment variables. Using fallback key.');
}

/**
 * Encrypt sensitive data (e.g., SMTP passwords)
 * @param data - Plain text data to encrypt
 * @returns Encrypted string
 */
export function encrypt(data: string): string {
  if (!data) return '';
  
  try {
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_SECRET).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData - Encrypted string
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return '';
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash data (one-way, for validation)
 * @param data - Data to hash
 * @returns Hashed string
 */
export function hash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}
