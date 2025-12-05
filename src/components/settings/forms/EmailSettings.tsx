'use client';

import { updateEmailSettings } from '@/app/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormChanges, useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { Settings } from '@prisma/client';
import { AlertCircle, Check, Eye, EyeOff, Key, Loader2, Lock, Mail, Save, Server, TestTube, User } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface EmailSettingsProps {
  settings: Settings | null;
  onUpdate: (settings: Settings | null) => void;
}

export function EmailSettings({ settings, onUpdate }: EmailSettingsProps) {
  const [smtpHost, setSmtpHost] = useState(settings?.smtpHost || '');
  const [smtpPort, setSmtpPort] = useState(settings?.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState(settings?.smtpUser || '');
  const [smtpPassword, setSmtpPassword] = useState(settings?.smtpPassword || '');
  const [smtpFromEmail, setSmtpFromEmail] = useState(settings?.smtpFromEmail || '');
  const [smtpFromName, setSmtpFromName] = useState(settings?.smtpFromName || '');
  const [emailSignature, setEmailSignature] = useState(settings?.emailSignature || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  // Track unsaved changes
  const hasUnsavedChanges = useFormChanges(
    {
      smtpHost: settings?.smtpHost || '',
      smtpPort: settings?.smtpPort || 587,
      smtpUser: settings?.smtpUser || '',
      smtpPassword: settings?.smtpPassword || '',
      smtpFromEmail: settings?.smtpFromEmail || '',
      smtpFromName: settings?.smtpFromName || '',
      emailSignature: settings?.emailSignature || '',
    },
    { smtpHost, smtpPort, smtpUser, smtpPassword, smtpFromEmail, smtpFromName, emailSignature }
  );
  useUnsavedChanges(hasUnsavedChanges);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    const result = await updateEmailSettings({
      smtpHost, smtpPort, smtpUser, smtpPassword, smtpFromEmail, smtpFromName, emailSignature
    });
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      onUpdate(null);
    } else {
      toast.error(result.message);
    }
  }, [smtpHost, smtpPort, smtpUser, smtpPassword, smtpFromEmail, smtpFromName, emailSignature, onUpdate]);

  const handleTest = useCallback(async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          password: smtpPassword,
          fromEmail: smtpFromEmail,
          fromName: smtpFromName,
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setTestEmailSent(true);
        setTimeout(() => setTestEmailSent(false), 3000);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to update email settings');
    } finally {
      setIsTesting(false);
    }
  }, [smtpHost, smtpPort, smtpUser, smtpPassword, smtpFromEmail, smtpFromName]);

  return (
    <div className="space-y-6">
      <div className='h-14 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6'>
        <h1 className="text-base md:text-lg font-bold flex items-center gap-2">
          <Mail className="h-4 w-4"/>
          Email Settings
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Configure SMTP server for sending email notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
          <CardDescription>Setup your email server credentials for sending automated emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">SMTP Setup Tip</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  For Gmail, use smtp.gmail.com:587 with an App Password (not your regular password). 
                  For custom domains, check your hosting provider's SMTP settings.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label 
                htmlFor="smtpHost"
                data-tooltip="SMTP server address (e.g., smtp.gmail.com for Gmail, smtp-mail.outlook.com for Outlook)"
                data-tooltip-position="right"
              >
                SMTP Host *
              </Label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="smtpHost" 
                  value={smtpHost} 
                  onChange={(e) => setSmtpHost(e.target.value)} 
                  placeholder="smtp.gmail.com"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="smtpPort"
                data-tooltip="SMTP port number (587 for TLS, 465 for SSL, 25 for unencrypted - use 587 for Gmail)"
                data-tooltip-position="right"
              >
                SMTP Port *
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="smtpPort" 
                  type="number" 
                  value={smtpPort} 
                  onChange={(e) => setSmtpPort(Number(e.target.value))} 
                  placeholder="587"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Common ports: 587 (TLS), 465 (SSL), 25 (Plain)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="smtpUser"
                data-tooltip="SMTP username (usually your full email address for most providers)"
                data-tooltip-position="right"
              >
                Username *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="smtpUser" 
                  value={smtpUser} 
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="pl-10"
                />
              </div>
            </div>
            
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="smtpPassword"
                  data-tooltip="SMTP password or app-specific password. For Gmail, create an App Password in your Google Account security settings."
                  data-tooltip-position="right"
                >
                  Password *
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  data-tooltip={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <><EyeOff className="h-3 w-3" /> Hide</>
                  ) : (
                    <><Eye className="h-3 w-3" /> Show</>
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="smtpPassword" 
                  type={showPassword ? "text" : "password"}
                  value={smtpPassword} 
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Encrypted and stored securely
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label 
                htmlFor="smtpFromEmail"
                data-tooltip="Email address that appears in the 'From' field of sent emails - should match your SMTP username"
                data-tooltip-position="right"
              >
                From Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="smtpFromEmail" 
                  type="email" 
                  value={smtpFromEmail} 
                  onChange={(e) => setSmtpFromEmail(e.target.value)}
                  placeholder="noreply@halali.co.ke"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="smtpFromName"
                data-tooltip="Display name that appears alongside the email address (e.g., 'Halali Support Team')"
                data-tooltip-position="right"
              >
                From Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="smtpFromName" 
                  value={smtpFromName} 
                  onChange={(e) => setSmtpFromName(e.target.value)}
                  placeholder="Halali Meat"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="emailSignature"
              data-tooltip="Signature automatically appended to all outgoing emails - can include contact info, legal disclaimers, or branding"
              data-tooltip-position="right"
            >
              Email Signature
            </Label>
            <Textarea 
              id="emailSignature" 
              value={emailSignature} 
              onChange={(e) => setEmailSignature(e.target.value)} 
              rows={4}
              placeholder="Best regards,&#10;The Halali Team&#10;&#10;Nairobi, Kenya&#10;+254 700 123 456"
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Plain text only - will be added to the end of all emails
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isLoading} 
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
              )}
            </Button>
            
            <Button
              variant={testEmailSent ? "outline" : "secondary"}
              onClick={handleTest}
              disabled={isTesting || !smtpHost || !smtpPort}
              className="w-full sm:w-auto"
            >
              {isTesting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
              ) : testEmailSent ? (
                <><Check className="mr-2 h-4 w-4 text-green-600" /> Test Sent</>
              ) : (
                <><TestTube className="mr-2 h-4 w-4" /> Send Test Email</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
