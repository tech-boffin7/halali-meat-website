'use client';

import { updateNotificationPreferences } from '@/app/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFormChanges, useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { Settings } from '@prisma/client';
import { AlertCircle, Bell, BellOff, Loader2, Mail, MessageSquare, Save, ShoppingCart } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  settings: Settings | null;
  onUpdate: (settings: Settings | null) => void;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(settings?.emailNotifications ?? true);
  const [quoteNotifications, setQuoteNotifications] = useState(settings?.quoteNotifications ?? true);
  const [messageNotifications, setMessageNotifications] = useState(settings?.messageNotifications ?? true);
  const [productNotifications, setProductNotifications] = useState(settings?.productNotifications ?? false);
  const [isLoading, setIsLoading] = useState(false);

  // Track unsaved changes
  const hasUnsavedChanges = useFormChanges(
    {
      emailNotifications: settings?.emailNotifications ?? true,
      quoteNotifications: settings?.quoteNotifications ?? true,
      messageNotifications: settings?.messageNotifications ?? true,
      productNotifications: settings?.productNotifications ?? false,
    },
    { emailNotifications, quoteNotifications, messageNotifications, productNotifications }
  );
  useUnsavedChanges(hasUnsavedChanges);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    const result = await updateNotificationPreferences({
      emailNotifications, quoteNotifications, messageNotifications, productNotifications
    });
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      onUpdate(null);
    }
    else toast.error(result.message);
  }, [emailNotifications, quoteNotifications, messageNotifications, productNotifications, onUpdate]);

  const hasChanges = 
    emailNotifications !== (settings?.emailNotifications ?? true) ||
    quoteNotifications !== (settings?.quoteNotifications ?? true) ||
    messageNotifications !== (settings?.messageNotifications ?? true) ||
    productNotifications !== (settings?.productNotifications ?? false);

  return (
    <div className="space-y-6">
      <div className='h-14 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6'>
        <h1 className="text-base md:text-lg font-bold flex items-center gap-2">
          {emailNotifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
          Notification Preferences
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Control which email notifications you receive from the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Email Notifications</span>
            {hasChanges && (
              <span className="text-xs font-normal text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                Unsaved changes
              </span>
            )}
          </CardTitle>
          <CardDescription>
            These settings control actual email delivery - toggling OFF will prevent emails from being sent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Critical Setting</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  These toggles ACTUALLY control whether emails are sent. When disabled, no emails will be delivered for that category - this is not just a preference, it affects the entire notification system.
                </p>
              </div>
            </div>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <div className="flex-1 space-y-1">
              <Label 
                htmlFor="emailNotifications" 
                className="text-base font-semibold flex items-center gap-2 cursor-pointer"
                data-tooltip="Master control for ALL email notifications - when OFF, no emails will be sent regardless of individual settings"
                data-tooltip-position="right"
              >
                <Mail className="h-5 w-5" />
                Master Email Toggle
              </Label>
              <p className="text-sm text-muted-foreground">
                {emailNotifications ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ All notifications enabled</span>
                ) : (
                  <span className="text-red-600  dark:text-red-400 font-medium">✗ All notifications disabled</span>
                )}
              </p>
            </div>
            <Switch 
              id="emailNotifications" 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
              className="scale-110"
            />
          </div>

          <div className="h-px bg-border" />

          {/* Individual Toggles */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Individual Notification Types:</p>
            
            {/* Quote Notifications */}
            <div className={`flex items-center justify-between p-4 rounded-lg border transition-opacity ${!emailNotifications ? 'opacity-50' : ''}`}>
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor="quoteNotifications" 
                  className="text-base flex items-center gap-2 cursor-pointer"
                  data-tooltip="Receive email notifications when customers submit new quote requests through the website contact form"
                  data-tooltip-position="right"
                >
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  Quote Request Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when customers submit quote requests
                </p>
              </div>
              <Switch 
                id="quoteNotifications" 
                checked={quoteNotifications} 
                onCheckedChange={setQuoteNotifications} 
                disabled={!emailNotifications}
              />
            </div>

            {/* Message Notifications */}
            <div className={`flex items-center justify-between p-4 rounded-lg border transition-opacity ${!emailNotifications ? 'opacity-50' : ''}`}>
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor="messageNotifications" 
                  className="text-base flex items-center gap-2 cursor-pointer"
                  data-tooltip="Receive email alerts when customers send contact messages via the website form or admin panel"
                  data-tooltip-position="right"
                >
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  Message Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get alerted for new contact form messages
                </p>
              </div>
              <Switch 
                id="messageNotifications" 
                checked={messageNotifications} 
                onCheckedChange={setMessageNotifications} 
                disabled={!emailNotifications}
              />
            </div>

            {/* Product Notifications */}
            <div className={`flex items-center justify-between p-4 rounded-lg border transition-opacity ${!emailNotifications ? 'opacity-50' : ''}`}>
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor="productNotifications" 
                  className="text-base flex items-center gap-2 cursor-pointer"
                  data-tooltip="Future feature: Receive notifications about low stock, inventory updates, or product-related events"
                  data-tooltip-position="right"
                >
                  <Bell className="h-4 w-4 text-purple-600" />
                  Product Updates (Coming Soon)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Stock alerts, price changes, and product updates
                </p>
              </div>
              <Switch 
                id="productNotifications" 
                checked={productNotifications} 
                onCheckedChange={setProductNotifications} 
                disabled={!emailNotifications}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {!emailNotifications && (
                <span className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  Master toggle is OFF - no emails will be sent
                </span>
              )}
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !hasChanges}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Preferences</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How Notifications Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p>
                <strong className="text-foreground">Master Toggle:</strong> Controls ALL notifications. When OFF, no emails are sent regardless of individual settings.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p>
                <strong className="text-foreground">Individual Toggles:</strong> Control specific notification types. Only work when Master Toggle is ON.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p>
                <strong className="text-foreground">Changes Take Effect Immediately:</strong> Your preferences are applied as soon as you save.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
