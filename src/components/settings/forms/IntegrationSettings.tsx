'use client';

import { testCloudinaryConnection, updateIntegrationSettings } from '@/app/actions/settings-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { integrationSettingsSchema, type IntegrationSettingsData } from '@/lib/schemas/settings-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings } from '@prisma/client';
import { AlertCircle, Check, Database, ExternalLink, Eye, EyeOff, Plug, RefreshCw, Save, Server, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Extended Settings type to include cloudinary fields
type SettingsWithIntegrations = Settings & {
  cloudinaryCloudName?: string | null;
  cloudinaryApiKey?: string | null;
  cloudinaryApiSecret?: string | null;
};

interface IntegrationSettingsProps {
  settings: SettingsWithIntegrations | null;
  onUpdate: (settings: Settings | null) => void;
}

export function IntegrationSettings({ settings, onUpdate }: IntegrationSettingsProps) {
  const [showCloudinarySecret, setShowCloudinarySecret] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Detect if current values are from environment variables
  const hasDbCloudName = !!(settings?.cloudinaryCloudName && settings.cloudinaryCloudName !== '');
  const hasDbApiKey = !!(settings?.cloudinaryApiKey && settings.cloudinaryApiKey !== '');
  
  const form = useForm<IntegrationSettingsData>({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues: {
      cloudinaryCloudName: settings?.cloudinaryCloudName || '',
      cloudinaryApiKey: settings?.cloudinaryApiKey || '',
      cloudinaryApiSecret: '', // Don't show existing secret for security
    },
  });

  const isCloudinaryConfigured = !!(settings?.cloudinaryCloudName && settings?.cloudinaryApiKey);

  const onSubmit = async (data: IntegrationSettingsData) => {
    setIsSaving(true);
    try {
      const result = await updateIntegrationSettings(data);
      if (result.success) {
        toast.success('Integration settings updated successfully');
        onUpdate(null); // Trigger parent refresh
        form.reset({
          cloudinaryCloudName: data.cloudinaryCloudName,
          cloudinaryApiKey: data.cloudinaryApiKey,
          cloudinaryApiSecret: '', // Clear secret field after save
        });
        setLastTestResult(null); // Clear test result after saving new credentials
      } else {
        toast.error(result.message || 'Failed to update settings');
      }
    } catch {
      toast.error('Failed to update integration settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = useCallback(async () => {
    setIsTesting(true);
    setLastTestResult(null);
    
    try {
      // Get current form values
      const formValues = form.getValues();
      
      // If user has entered new values, test those
      // Otherwise test existing saved credentials
      const testData = (formValues.cloudinaryCloudName && formValues.cloudinaryApiKey && formValues.cloudinaryApiSecret)
        ? formValues
        : undefined;
      
      const result = await testCloudinaryConnection(testData);
      
      setLastTestResult(result);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Connection test failed');
    } finally {
      setIsTesting(false);
    }
  }, [form]);

  return (
    <div className="space-y-6">
      <div className='h-14 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6'>
        <h1 className="text-base md:text-lg font-bold flex items-center gap-2">
          <Plug className="h-4 w-4"/>
          API Integrations
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage third-party service integrations and API keys</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Cloudinary Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                      <path d="M23 12c0-6.07-4.93-11-11-11S1 5.93 1 12s4.93 11 11 11 11-4.93 11-11zm-2 0c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-base">Cloudinary</CardTitle>
                    <CardDescription>Image storage and CDN service</CardDescription>
                  </div>
                </div>
                <Badge variant={isCloudinaryConfigured ? 'default' : 'secondary'} className="gap-1">
                  {isCloudinaryConfigured ? (
                    <><Check className="h-3 w-3" /> Connected</>
                  ) : (
                    <><X className="h-3 w-3" /> Not Configured</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="cloudinaryCloudName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Cloud Name *</FormLabel>
                        {field.value && (
                          <Badge variant={hasDbCloudName ? "default" : "outline"} className="text-xs gap-1">
                            {hasDbCloudName ? (
                              <><Database className="h-3 w-3" /> Database</>
                            ) : (
                              <><Server className="h-3 w-3" /> .env</>  
                            )}
                          </Badge>
                        )}
                      </div>
                      <FormControl>
                        <Input {...field} placeholder="e.g. my-cloud-name" />
                      </FormControl>
                      <FormDescription>
                        Your Cloudinary cloud name from the dashboard
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cloudinaryApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>API Key *</FormLabel>
                        {field.value && (
                          <Badge variant={hasDbApiKey ? "default" : "outline"} className="text-xs gap-1">
                            {hasDbApiKey ? (
                              <><Database className="h-3 w-3" /> Database</>
                            ) : (
                              <><Server className="h-3 w-3" /> .env</>
                            )}
                          </Badge>
                        )}
                      </div>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 123456789012345" />
                      </FormControl>
                      <FormDescription>
                        Your Cloudinary API key
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cloudinaryApiSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Secret *</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field} 
                            type={showCloudinarySecret ? "text" : "password"} 
                            placeholder={settings?.cloudinaryApiSecret ? "Leave empty to keep current secret" : "Enter API Secret"}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCloudinarySecret(!showCloudinarySecret)}
                        >
                          {showCloudinarySecret ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <FormDescription>
                        {settings?.cloudinaryApiSecret ? 'Leave blank to keep current secret' : 'Required for new configuration'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Information about credential source */}
              {!hasDbCloudName && !hasDbApiKey && isCloudinaryConfigured && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
                  <div className="flex gap-2">
                    <Server className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900 dark:text-blue-100">
                      <p className="font-medium mb-1">Using environment variables</p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Credentials are loaded from your <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code> file. 
                        You can override them by entering new values and saving to the database.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Test result display */}
              {lastTestResult && (
                <div className={`rounded-lg border p-3 ${
                  lastTestResult.success 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex gap-2">
                    {lastTestResult.success ? (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    )}
                    <p className={`text-xs ${
                      lastTestResult.success 
                        ? 'text-green-900 dark:text-green-100' 
                        : 'text-red-900 dark:text-red-100'
                    }`}>
                      {lastTestResult.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Configuration</>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={!isCloudinaryConfigured || isTesting}
                  className="w-full sm:w-auto"
                >
                  {isTesting ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Testing...</>
                  ) : (
                    <><Check className="mr-2 h-4 w-4" /> Test Connection</>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  asChild
                >
                  <a 
                    href="https://cloudinary.com/console" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Dashboard <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Configuration Note</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Credentials entered here will be securely stored in the database and will override any environment variables.
                    </p>
                  </div>
                </div>
              </div>

              {isCloudinaryConfigured && (
                <div className="pt-4 border-t mt-4">
                  <h4 className="text-sm font-medium mb-2">Usage Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-sm md:text-base text-muted-foreground">Storage Limit</p>
                      <p className="font-medium">25 GB</p>
                    </div>
                    <div>
                      <p className="text-sm md:text-base text-muted-foreground">Bandwidth</p>
                      <p className="font-medium">25 GB/month</p>
                    </div>
                    <div>
                      <p className="text-sm md:text-base text-muted-foreground">Transformations</p>
                      <p className="font-medium">25,000/month</p>
                    </div>
                    <div>
                      <p className="text-sm md:text-base text-muted-foreground">Plan</p>
                      <p className="font-medium">Free Tier</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Future Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Integrations</CardTitle>
          <CardDescription>Connect additional services to extend functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Payment Gateway */}
          <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Payment Gateway</p>
                <p className="text-xs text-muted-foreground">Stripe, PayPal integration</p>
              </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

          {/* SMS Service */}
          <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">Twilio, Africa's Talking</p>
              </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Analytics & Tracking</p>
                <p className="text-xs text-muted-foreground">Google Analytics, Plausible</p>
              </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
