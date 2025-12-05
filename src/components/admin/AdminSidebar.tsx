'use client';

import { LogoutButton } from '@/components/auth/logout-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronsLeft, ChevronsRight, FileText, Home, MessageSquare, Package, Settings } from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | null;
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  pathname: string;
  quoteCount: number;
  messageCount: number;
}

export function AdminSidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  pathname, 
  quoteCount, 
  messageCount 
}: AdminSidebarProps) {
  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Quotes', href: '/admin/quotes', icon: FileText, badge: quoteCount > 0 ? quoteCount : null },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: messageCount > 0 ? messageCount : null },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border/50 transition-all duration-300 ease-in-out md:h-[calc(100vh-80px)] md:sticky md:top-0",
        isCollapsed ? "w-28" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center justify-between h-16 border-b px-4 shrink-0", isCollapsed && "px-2")}>
        <h2 className={cn("text-sm font-bold ml-2 text-primary transition-opacity", isCollapsed && "opacity-0 w-0")}>
          Admin Panel
        </h2>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation - uses flex-1 and min-h-0 for proper scrolling */}
      <nav className="flex-1 min-h-0 p-2 space-y-2">
        {navItems.map((item) => (
          <li key={item.name} className="list-none">
            <Link href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  pathname === item.href && 'bg-muted hover:bg-muted',
                  isCollapsed && 'justify-center'
                )}
                data-tooltip={isCollapsed ? `${item.name}${item.badge ? ` (${item.badge})` : ''}` : undefined}
                data-tooltip-position="right"
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                <span className={cn(isCollapsed && "hidden")}>{item.name}</span>
                {item.badge && !isCollapsed && <Badge className="ml-auto">{item.badge}</Badge>}
              </Button>
            </Link>
          </li>
        ))}
        
        {/* Logout - directly below Settings */}
        <li className="list-none pt-2 border-t">
          <LogoutButton
            variant="destructive"
            className={cn(
              "w-full",
              isCollapsed && "justify-center"
            )}
            isCollapsed={isCollapsed} 
            data-tooltip={isCollapsed ? "Logout" : undefined}
            data-tooltip-position="right"
          />
        </li>
      </nav>
    </aside>
  );
}
