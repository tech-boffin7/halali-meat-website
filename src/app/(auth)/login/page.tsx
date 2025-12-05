'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, User, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // Get router instance

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Attempting to log in...');

    const result = await signIn('credentials', {
      redirect: false, // Handle redirect manually to show toasts
      email,
      password,
    });

    setIsSubmitting(false);
    toast.dismiss(toastId);

    if (result?.error) {
      let errorMessage = 'Login Failed';
      let errorDescription = 'An unexpected error occurred. Please try again.';

      if (result.error === 'UserNotFound') {
        errorDescription = 'No account found with that email address.';
      } else if (result.error === 'IncorrectPassword') {
        errorDescription = 'Incorrect password. Please try again.';
      } else if (result.error === 'CredentialsSignin') {
        errorDescription = 'Invalid email or password. Please try again.';
      } else if (result.error === 'TooManyRequests') {
        errorDescription = 'Too many login attempts. Please try again later.';
      }

      toast.error(errorMessage, {
        description: errorDescription,
      });
    } else if (result?.ok) {
      toast.success('Login Successful', {
        description: 'Redirecting you to the admin dashboard...',
      });
      // Use router.push for client-side navigation
      router.push('/admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-background px-4">
      <Card className="w-full max-w-sm rounded-[10px]">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Logging In...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
