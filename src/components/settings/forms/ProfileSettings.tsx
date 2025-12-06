import { updateProfileSettings, uploadUserAvatar, verifyEmailChange } from '@/app/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormChanges, useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { validateFile } from '@/lib/validation';
import { Settings } from '@prisma/client';
import { Loader2, Mail, Save, Upload, User } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  user: { id: string; name: string; email: string; image: string | null };
  onUpdate: (settings: Settings | null) => void;
}

export function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(user.image);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Email verification state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  // Track unsaved changes
  const hasUnsavedChanges = useFormChanges(
    { name: user.name, email: user.email, image: user.image },
    { name, email, image }
  );
  useUnsavedChanges(hasUnsavedChanges);

  const performUpdate = useCallback(async (password?: string) => {
    setIsLoading(true);
    const result = await updateProfileSettings({ 
      name, 
      email, 
      image: image || '',
      currentPassword: password 
    });
    setIsLoading(false);
    
    if (result.success) {
      toast.success(result.message);
      setShowPasswordDialog(false);
      setCurrentPassword('');  // Clear password for security
      onUpdate(null);
    } else if (result.requiresVerification) {
      setShowPasswordDialog(false);
      setCurrentPassword('');  // Clear password
      setShowVerificationDialog(true);
      toast.info(result.message);
    } else {
      setCurrentPassword('');  // Clear password even on error
      toast.error(result.message);
    }
  }, [name, email, image, onUpdate]);

  const handleSave = useCallback(async () => {
    // Validate name
    if (!name || name.trim().length === 0) {
      toast.error('Name is required');
      return;
    }
    
    if (name.length > 100) {
      toast.error('Name must be less than 100 characters');
      return;
    }
    
    // Validate email format (consistent with server-side Zod)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      toast.error('Invalid email format');
      return;
    }
    
    setIsLoading(true);
    
    // Check if email is changing
    if (email !== user.email) {
      setPendingEmail(email);
      setShowPasswordDialog(true);
      setIsLoading(false);
      return;
    }

    await performUpdate();
  }, [name, email, user.email, performUpdate]);

  const handleVerifyEmail = useCallback(async () => {
    if (!verificationCode) return;
    
    setIsLoading(true);
    const result = await verifyEmailChange(verificationCode, pendingEmail);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setShowVerificationDialog(false);
      setVerificationCode('');
      
      // Update local state to reflect new email
      setEmail(pendingEmail);
      
      // Trigger parent refresh to update user data
      onUpdate(null);
    } else {
      toast.error(result.message);
    }
  }, [verificationCode, pendingEmail, onUpdate]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use existing validation utility for security
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      e.target.value = '';  // Reset input on validation failure
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await uploadUserAvatar(formData);
    setIsUploading(false);
    
    if (result.success) {
      setImage(result.url);
      toast.success('Avatar uploaded successfully');
    } else {
      toast.error(result.message);
    }
    
    e.target.value = '';  // Reset input to allow re-upload of same file
  }, []);

  return (
    <div className="space-y-6">
      <div className='h-14 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6'>
        <h1 className="text-base md:text-lg font-bold flex items-center gap-2">
          <User className="h-4 w-4"/>
          Profile Settings
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your personal information and avatar</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details that appear throughout the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-3">
            <Label 
              htmlFor="avatar"
              data-tooltip="Upload a profile picture (JPG, PNG, or WebP up to 5MB). This will appear in the admin interface and on your sent messages."
              data-tooltip-position="right"
            >
              Profile Picture
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                {image ? (
                  <Image 
                    src={image} 
                    alt={name || 'User avatar'} 
                    width={80} 
                    height={80} 
                    unoptimized  // Skip Next.js optimization for Cloudinary CDN images
                    className="rounded-full object-cover border-2 border-muted"
                    onError={() => {
                      // Fallback if image fails to load
                      console.error('Failed to load avatar image:', image);
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-muted">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center">
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
                    disabled={isUploading}
                    onClick={() => document.getElementById('avatar')?.click()}
                    data-tooltip="Click to select an image file"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Clear image immediately for instant feedback
                        setImage(null);
                        toast.success('Profile picture removed. Click "Save Changes" to confirm.');
                      }}
                      data-tooltip="Remove current profile picture"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: Square image, at least 200x200px, max 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Name Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="name"
              data-tooltip="Your full name as it will appear throughout the admin panel and in email signatures"
              data-tooltip-position="right"
            >
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This name will be displayed on sent messages and quotes
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email"
              data-tooltip="Your email address for login and receiving admin notifications. Changing this will require verification."
              data-tooltip-position="right"
            >
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@halali.co.ke"
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used for login and receiving system notifications
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading || isUploading || !name || !email}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Password Confirmation Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Email Change</DialogTitle>
            <DialogDescription>
              To change your email address, please enter your current password for security.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => performUpdate(currentPassword)} 
              disabled={isLoading || !currentPassword}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify New Email</DialogTitle>
            <DialogDescription>
              We've sent a verification code to <strong>{pendingEmail}</strong>. 
              Please enter it below to complete the change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleVerifyEmail} 
              disabled={isLoading || !verificationCode}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
