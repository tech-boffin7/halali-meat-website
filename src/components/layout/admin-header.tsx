"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User as UserIcon } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { useTheme } from "next-themes";
import { Session } from "next-auth";

interface AdminHeaderProps {
  session: Session | null;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const { theme } = useTheme();
  const user = session?.user;

  const logoSrc =
    theme === "dark"
      ? "/images/logo/logo-dark.png"
      : "/images/logo/logo-light.png";

  return (
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
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                  <AvatarFallback className="bg-muted-foreground/20">
                    {user?.name?.[0]?.toUpperCase() ?? <UserIcon size={20} />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex flex-col items-start space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
