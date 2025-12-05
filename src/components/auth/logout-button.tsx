'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  isCollapsed?: boolean;
}

export function LogoutButton({ className, variant = "ghost", isCollapsed = false, ...props }: LogoutButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn("w-full justify-start", className)}
      onClick={() => signOut({ callbackUrl: '/login' })}
      {...props}
    >
      <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
      {!isCollapsed && <span>Logout</span>}
    </Button>
  );
}
