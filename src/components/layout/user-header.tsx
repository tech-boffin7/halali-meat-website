'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { DynamicLogo } from "../common/dynamic-logo";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "./theme-switcher";

interface UserHeaderProps {
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
}

export default function UserHeader({ lightLogoUrl, darkLogoUrl }: UserHeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Our Products" },
    { href: "/services", label: "Services" },
    { href: "/halal-standards", label: "Halal Standards" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled ? "bg-background/80 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <DynamicLogo 
              lightLogoUrl={lightLogoUrl}
              darkLogoUrl={darkLogoUrl}
              width={120}
              height={50}
              className="w-20 h-20"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const linkClasses = `relative text-xs font-medium transition-colors duration-300
                                 before:absolute before:left-0 before:-top-1 before:h-[2px] before:bg-primary
                                 before:transition-all before:duration-300`;
            const activeClasses = `text-foreground before:w-full before:opacity-100`;
            const inactiveClasses = `text-foreground/70 hover:text-foreground before:w-0 before:opacity-0 hover:before:w-full hover:before:opacity-100`;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center space-x-2">
          <Button asChild className="hidden md:inline-flex text-xs">
            <Link href="/get-a-quote">Get a Quote</Link>
          </Button>
          <Button asChild variant="outline" className="hidden md:inline-flex text-xs">
            <Link href="/login">Admin Login</Link>
          </Button>
          <ThemeSwitcher />
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border/50"
          >
            <nav className="flex flex-col space-y-1 p-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-accent p-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 pt-4">
                <Button asChild className="w-full">
                  <Link href="/get-a-quote">Get a Quote</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Admin Login</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
