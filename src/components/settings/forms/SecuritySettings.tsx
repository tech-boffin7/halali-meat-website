'use client';

import { changePassword } from '@/app/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormChanges, useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { getPasswordStrengthColor, getPasswordStrengthLabel, validatePassword } from '@/lib/password-validator';
import { Settings } from '@prisma/client';
import { AlertCircle, Eye, EyeOff, Loader2, Save, Shield } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface SecuritySettingsProps {
  onUpdate: (settings: Settings | null) => void;
}

export function SecuritySettings({ onUpdate }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Track unsaved changes
  const hasUnsavedChanges = useFormChanges(
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    { currentPassword, newPassword, confirmPassword }
  );
  useUnsavedChanges(hasUnsavedChanges);

  // Memoize expensive password strength calculation
  const passwordStrength = useMemo(
    () => (newPassword ? validatePassword(newPassword) : null),
    [newPassword]
  );
  const handleChangePassword = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength && !passwordStrength.isValid) {
      toast.error('Password is too weak. Please follow the suggestions.');
      return;
    }

    setIsLoading(true);
    const result = await changePassword({ currentPassword, newPassword, confirmPassword });
    setIsLoading(false);
    
    if (result.success) {
      toast.success(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onUpdate(null);
    } else {
      toast.error(result.message);
    }
  }, [currentPassword, newPassword, confirmPassword, passwordStrength, onUpdate]);

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = !!(confirmPassword && !passwordsMatch);

  return (
    <div className="space-y-6">
      <div className='h-14 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6'>
        <h1 className="text-base md:text-lg font-bold flex items-center gap-2">
          <Shield className="h-4 w-4"/>
          Security Settings
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your password and account security</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password regularly to keep your account secure. Use a strong, unique password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="currentPassword"
                data-tooltip="Enter your existing password to verify it's you making this change"
                data-tooltip-position="right"
              >
                Current Password *
              </Label>
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                data-tooltip={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? (
                  <><EyeOff className="h-3 w-3" /> Hide</>
                ) : (
                  <><Eye className="h-3 w-3" /> Show</>
                )}
              </button>
            </div>
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="newPassword"
                data-tooltip="Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters"
                data-tooltip-position="right"
              >
                New Password *
              </Label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                data-tooltip={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <><EyeOff className="h-3 w-3" /> Hide</>
                ) : (
                  <><Eye className="h-3 w-3" /> Show</>
                )}
              </button>
            </div>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            
            {passwordStrength && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength.score >= 3 ? 'text-green-600' : 
                    passwordStrength.score >= 2 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {getPasswordStrengthLabel(passwordStrength.score)}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Password Strength Tips:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {passwordStrength.feedback.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="confirmPassword"
                data-tooltip="Re-enter your new password exactly as above to prevent typos"
                data-tooltip-position="right"
              >
                Confirm New Password *
              </Label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                data-tooltip={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <><EyeOff className="h-3 w-3" /> Hide</>
                ) : (
                  <><Eye className="h-3 w-3" /> Show</>
                )}
              </button>
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={passwordsDontMatch ? 'border-red-500' : passwordsMatch ? 'border-green-500' : ''}
            />
            {passwordsDontMatch && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Passwords do not match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                ✓ Passwords match
              </p>
            )}
          </div>

          <Button 
            onClick={handleChangePassword} 
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || passwordsDontMatch}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Update Password</>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
          <CardDescription>Keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Change your password every 90 days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Use a unique password that you don't use elsewhere</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Enable two-factor authentication when available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Never share your password with anyone</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
