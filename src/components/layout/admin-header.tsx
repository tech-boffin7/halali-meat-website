import { LogoutButton } from '@/components/auth/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useBadgeCounts } from '@/hooks/use-badge-counts';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Home, Menu, MessageSquare, Package, User as UserIcon, X } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { DynamicLogo } from "../common/dynamic-logo";
import { ThemeSwitcher } from "./theme-switcher";

interface AdminHeaderProps {
  session: Session | null;
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
}

export function AdminHeader({ session, lightLogoUrl, darkLogoUrl }: AdminHeaderProps) {
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { counts } = useBadgeCounts();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home, badge: null },
    { name: 'Products', href: '/admin/products', icon: Package, badge: null },
    { name: 'Quotes', href: '/admin/quotes', icon: FileText, badge: counts.quotes },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: counts.messages },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-2">
              <DynamicLogo 
                lightLogoUrl={lightLogoUrl}
                darkLogoUrl={darkLogoUrl}
                width={120}
                height={50}
                className="w-20 h-20"
              />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <ThemeSwitcher />
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                {user?.image && (
                  <AvatarImage 
                    src={user.image} 
                    alt={user.name || 'User avatar'}
                  />
                )}
                <AvatarFallback className="bg-muted-foreground/20">
                  {user?.name?.[0]?.toUpperCase() ?? <UserIcon size={20} />}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <ThemeSwitcher />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border/50 fixed top-20 w-full z-40"
          >
            <nav className="flex flex-col space-y-1 p-4">
              <div className="px-3 py-2">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md text-sm font-medium",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto"
                      data-tooltip={`${item.badge} unread ${item.name.toLowerCase()}`}
                      data-tooltip-position="top"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              <div className="border-t border-border/50 pt-4 mt-4">
                <LogoutButton
                  className="w-full justify-start text-destructive hover:text-destructive/80"
                  isCollapsed={false}
                />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
