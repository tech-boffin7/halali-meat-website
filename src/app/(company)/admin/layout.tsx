'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Package, MessageSquare, FileText, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/logout-button';
import AdminFooter from '@/components/layout/admin-footer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdminLayoutSkeleton } from '@/components/layout/AdminLayoutSkeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  if (status === 'loading') {
    return <AdminLayoutSkeleton />;
  }

  if (!session || (session.user as any).role !== 'admin') {
    return null; // Or redirect, though middleware is better for this
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Quotes', href: '/admin/quotes', icon: FileText },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background dark:bg-secondary/50">
        {/* Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r border-border/50 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-28" : "w-64"
          )}
        >
          <div className={cn("flex items-center justify-between h-16 border-b p-4", isCollapsed && "px-2")}>
            <h2 className={cn("text-sm font-bold ml-2 text-primary transition-opacity", isCollapsed && "opacity-0 w-0")}>
              Admin Panel
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="flex-grow p-2 space-y-2">
            {navItems.map((item) => (
              <li key={item.name} className="list-none">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} passHref>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start',
                          pathname === item.href && 'bg-muted hover:bg-muted',
                          isCollapsed && 'justify-center'
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                        <span className={cn(isCollapsed && "hidden")}>{item.name}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </nav>
          <div className="mt-auto p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <LogoutButton
                  className={cn(
                    "w-full text-destructive hover:text-destructive/80",
                    isCollapsed && "justify-center"
                  )}
                  isCollapsed={isCollapsed} 
                />
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden p-2">
          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          <AdminFooter />
        </div>
      </div>
    </TooltipProvider>
  );
}