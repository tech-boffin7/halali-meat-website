'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming a Label component exists or using plain label
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading('Logging in...');

    const result = await signIn('credentials', {
      username,
      password,
      callbackUrl: '/admin/products', // Let next-auth handle the redirect
    });

    toast.dismiss();
    setIsSubmitting(false);

    if (result?.error) {
      toast.error('Login failed: Invalid username or password.');
    } else if (result?.ok) {
      toast.success('Login successful!');
      // No need for router.push here, next-auth handles it
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md border border-border/50">
        <h1 className="text-3xl font-bold text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="adminpass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
