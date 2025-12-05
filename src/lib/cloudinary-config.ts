/**
 * Cloudinary Configuration Helper
 * 
 * Provides environment variable access for Cloudinary credentials.
 * Used as fallback when database credentials are not configured.
 * 
 * Priority: Database > Environment Variables > Empty
 */

export interface CloudinaryEnvConfig {
  cloudName: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  hasEnvConfig: boolean;
}

/**
 * Get Cloudinary credentials from environment variables
 * @returns CloudinaryEnvConfig object with env credentials
 */
export function getCloudinaryEnvConfig(): CloudinaryEnvConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || null;
  const apiKey = process.env.CLOUDINARY_API_KEY || null;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || null;

  return {
    cloudName,
    apiKey,
    apiSecret,
    hasEnvConfig: !!(cloudName && apiKey && apiSecret),
  };
}

/**
 * Check if Cloudinary is configured (either in env or will be in db)
 * @returns boolean indicating if any configuration exists
 */
export function hasCloudinaryConfig(): boolean {
  const envConfig = getCloudinaryEnvConfig();
  return envConfig.hasEnvConfig;
}
