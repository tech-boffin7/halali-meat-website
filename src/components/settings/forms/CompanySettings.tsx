'use client';

import { updateCompanySettings, uploadCompanyLogo, uploadCompanyLogoDark, uploadFavicon } from '@/app/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormChanges, useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { Settings } from '@prisma/client';
import { Building2, Globe, Loader2, Mail, MapPin, Moon, Phone, Save, Sun, Upload } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface CompanySettingsProps {
  settings: Settings | null;
  onUpdate: (settings: Settings | null) => void;
}

export function CompanySettings({ settings, onUpdate }: CompanySettingsProps) {
  const [companyName, setCompanyName] = useState(settings?.companyName || '');
  const [companyEmail, setCompanyEmail] = useState(settings?.companyEmail || '');
  const [companyPhone, setCompanyPhone] = useState(settings?.companyPhone || '');
  const [companyAddress, setCompanyAddress] = useState(settings?.companyAddress || '');
  const [companyWebsite, setCompanyWebsite] = useState(settings?.companyWebsite || '');
  const [companyLogoUrl, setCompanyLogoUrl] = useState(settings?.companyLogoUrl || '');
  const [companyLogoDarkUrl, setCompanyLogoDarkUrl] = useState(settings?.companyLogoDarkUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(settings?.faviconUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLight, setIsUploadingLight] = useState(false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  // Track unsaved changes
  const hasUnsavedChanges = useFormChanges(
    {
      companyName: settings?.companyName || '',
      companyEmail: settings?.companyEmail || '',
      companyPhone: settings?.companyPhone || '',
      companyAddress: settings?.companyAddress || '',
      companyWebsite: settings?.companyWebsite || '',
      companyLogoUrl: settings?.companyLogoUrl || '',
      companyLogoDarkUrl: settings?.companyLogoDarkUrl || '',
      faviconUrl: settings?.faviconUrl || '',
    },
    { companyName, companyEmail, companyPhone, companyAddress, companyWebsite, companyLogoUrl, companyLogoDarkUrl, faviconUrl }
  );
  useUnsavedChanges(hasUnsavedChanges);

  const validateImage = async (file: File, maxSize: number, name: string): Promise<boolean> => {
    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      toast.error(`${name} size must be less than ${maxSizeMB}MB`);
      return false;
    }

    // Check if image is square (optional warning)
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const objectUrl = URL.createObjectURL(file);  // Store reference for cleanup
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);  // Clean up blob URL
        if (img.width !== img.height) {
          toast.warning(`${name} is not square (${img.width}x${img.height}). Square images recommended for best results.`);
        }
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);  // Clean up blob URL on error too
        toast.error('Failed to load image');
        resolve(false);
      };
      img.src = objectUrl;
    });
  };

  const handleSave = useCallback(async () => {
    // Validation
    if (!companyName?.trim()) {
      toast.error('Company name is required');
      return;
    }
    
    // Use consistent email validation regex (matches server-side Zod schema)
    if (companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
      toast.error('Invalid email format');
      return;
    }
    
    if (companyWebsite && !/^https?:\/\/.+/.test(companyWebsite)) {
      toast.error('Website must start with http:// or https://');
      return;
    }

    setIsLoading(true);
    const result = await updateCompanySettings({
      companyName, 
      companyEmail, 
      companyPhone, 
      companyAddress, 
      companyWebsite, 
      companyLogoUrl,
      companyLogoDarkUrl,
      faviconUrl
    });
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      onUpdate(null);
    } else {
      toast.error(result.message);
    }
  }, [companyName, companyEmail, companyWebsite, companyPhone, companyAddress, companyLogoUrl, companyLogoDarkUrl, faviconUrl, onUpdate]);

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateImage(file, 2 * 1024 * 1024, 'Logo (Light Mode)');
    if (!isValid) {
      e.target.value = '';  // Reset input on validation failure
      return;
    }

    setIsUploadingLight(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadCompanyLogo(formData);
    setIsUploadingLight(false);
    
    if (result.success) {
      setCompanyLogoUrl(result.url);
      toast.success('Light mode logo uploaded successfully');
    } else {
      toast.error(result.message);
    }
    
    e.target.value = '';  // Reset input to allow re-upload of same file
  }, []);

  const handleLogoDarkUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateImage(file, 2 * 1024 * 1024, 'Logo (Dark Mode)');
    if (!isValid) {
      e.target.value = '';  // Reset input on validation failure
      return;
    }

    setIsUploadingDark(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadCompanyLogoDark(formData);
    setIsUploadingDark(false);
    
    if (result.success) {
      setCompanyLogoDarkUrl(result.url);
      toast.success('Dark mode logo uploaded successfully');
    } else {
      toast.error(result.message);
    }
    
    e.target.value = '';  // Reset input to allow re-upload of same file
  }, []);

  const handleFaviconUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateImage(file, 500 * 1024, 'Favicon');
    if (!isValid) {
      e.target.value = '';  // Reset input on validation failure
      return;
    }

    setIsUploadingFavicon(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadFavicon(formData);
    setIsUploadingFavicon(false);
    
    if (result.success) {
      setFaviconUrl(result.url);
      toast.success('Favicon uploaded successfully');
    } else {
      toast.error(result.message);
    }
    
    e.target.value = '';  // Reset input to allow re-upload of same file
  }, []);

  return (
    <div className="space-y-6">
      <div className='h-14 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6'>
        <h1 className="text-base md:text-lg font-bold flex items-center gap-2">
          <Building2 className="h-4 w-4"/>
          Company Settings
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your business information and branding</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Branding</CardTitle>
          <CardDescription>Upload logos and favicon. Changes reflect immediately across the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Light Logo Section */}
          <div className="space-y-3">
            <Label 
              htmlFor="logo"
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Company Logo (Light Mode)
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                {companyLogoUrl ? (
                  <Image 
                    src={companyLogoUrl} 
                    alt="Company Logo Light" 
                    width={100} 
                    height={100} 
                    className="rounded object-contain bg-muted p-3 border-2 border-muted"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] rounded bg-muted flex items-center justify-center border-2 border-muted">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {isUploadingLight && (
                  <div className="absolute inset-0 rounded bg-background/80 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingLight}
                    onClick={() => document.getElementById('logo')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploadingLight ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                  {companyLogoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCompanyLogoUrl('')}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  For light mode. Square recommended (min 512x512px). Max 2MB. PNG with transparent background preferred.
                </p>
              </div>
            </div>
          </div>

          {/* Dark Logo Section */}
          <div className="space-y-3">
            <Label 
              htmlFor="logoDark"
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Company Logo (Dark Mode)
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                {companyLogoDarkUrl ? (
                  <Image 
                    src={companyLogoDarkUrl} 
                    alt="Company Logo Dark" 
                    width={100} 
                    height={100} 
                    className="rounded object-contain bg-slate-900 p-3 border-2 border-slate-700"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] rounded bg-slate-900 flex items-center justify-center border-2 border-slate-700">
                    <Building2 className="h-12 w-12 text-slate-400" />
                  </div>
                )}
                {isUploadingDark && (
                  <div className="absolute inset-0 rounded bg-background/80 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingDark}
                    onClick={() => document.getElementById('logoDark')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploadingDark ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                  {companyLogoDarkUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCompanyLogoDarkUrl('')}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  id="logoDark"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoDarkUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  For dark mode. Square recommended (min 512x512px). Max 2MB. PNG with transparent background preferred.
                </p>
              </div>
            </div>
          </div>

          {/* Favicon Section */}
          <div className="space-y-3">
            <Label 
              htmlFor="favicon"
            >
              Favicon
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                {faviconUrl ? (
                  <Image 
                    src={faviconUrl} 
                    alt="Favicon" 
                    width={32} 
                    height={32} 
                    className="rounded object-contain border-2 border-muted p-1"
                  />
                ) : (
                  <div className="w-[32px] h-[32px] rounded bg-muted flex items-center justify-center border-2 border-muted">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                {isUploadingFavicon && (
                  <div className="absolute inset-0 rounded bg-background/80 flex items-center justify-center">
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingFavicon}
                    onClick={() => document.getElementById('favicon')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                  </Button>
                  {faviconUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFaviconUrl('')}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  id="favicon"
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Browser tab icon. Must be square (32x32px, 64x64px, or 128x128px). Max 500KB. Accepts ICO, PNG, or SVG.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update company details that appear on emails, quotes, and documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Details */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label 
                htmlFor="companyName"
              >
                Company Name *
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="companyName" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Halali Meat Ltd."
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your registered business name that appears on all official documents
              </p>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="companyEmail"
              >
                Company Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="companyEmail" 
                  type="email" 
                  value={companyEmail} 
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="info@halali.co.ke"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Primary contact email for customer inquiries and business correspondence
              </p>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="companyPhone"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="companyPhone" 
                  value={companyPhone} 
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+254 700 123 456"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Include country code for international calls (e.g., +254 for Kenya)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="companyWebsite"
              >
                Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="companyWebsite" 
                  type="url" 
                  value={companyWebsite} 
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://halali.co.ke"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Must include https:// or http://
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="companyAddress"
            >
              Business Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea 
                id="companyAddress" 
                value={companyAddress} 
                onChange={(e) => setCompanyAddress(e.target.value)} 
                rows={3}
                placeholder="123 Business Street, Nairobi, Kenya"
                className="pl-10 resize-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Full physical address including street, city, postal code, and country
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isLoading || isUploadingLight || isUploadingDark || isUploadingFavicon} 
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (isUploadingLight || isUploadingDark || isUploadingFavicon) ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
