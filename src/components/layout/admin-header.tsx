"use client";

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon, Menu, X, Home, Package, FileText, MessageSquare } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { useTheme } from "next-themes";
import { Session } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/auth/logout-button';

interface AdminHeaderProps {
  session: Session | null;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const { theme } = useTheme();
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const logoSrc =
    theme === "dark"
      ? "/images/logo/logo-dark.png"
      : "/images/logo/logo-light.png";

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Quotes', href: '/admin/quotes', icon: FileText },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-2">
              <Image
                className="w-20 h-20"
                src={logoSrc}
                alt="Halali Meat Ltd Logo"
                width={120}
                height={50}
              />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <ThemeSwitcher />
              <Avatar className="h-10 w-10 border-2 border-primary/50">
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
                    "flex items-center p-3 rounded-md text-sm font-medium",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
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
