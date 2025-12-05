# Cloudinary Image Upload Configuration

This application uses Cloudinary for cloud-based image storage and delivery.

## Required Environment Variables

Add these to your `.env.local` (development) and `.env.production` (production):

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

## Features

- ✅ Automatic image optimization
- ✅ Automatic format conversion (WebP, AVIF)
- ✅ Max dimensions: 800x800px
- ✅ Quality: Auto-optimized
- ✅ Storage: `halali-products/` folder
- ✅ CDN delivery worldwide

## File Limits

- Max file size: 5MB
- Allowed types: All image formats (JPEG, PNG, WebP, GIF, etc.)

## Local Development

Images uploaded in development will go to your Cloudinary account.
You can view them at: https://cloudinary.com/console

## Production Deployment

The same Cloudinary account will be used in production.
Ensure environment variables are set in your hosting provider.
