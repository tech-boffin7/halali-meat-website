'use client';

import { usePathname } from 'next/navigation';

export default function AdminFooter() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <footer className="bg-secondary/50 border-t border-border/50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} Halali Meat Ltd. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">
          Designed & Developed by | {" "}
          <a href="https://winterjackson.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary hover:text-primary-foreground p-2 rounded-[5px] transition-colors duration-300 font-bold hover:scale-105 hover:-translate-y-1">
            K U Z Z I
          </a>
        </p>
      </footer>
    );
  }

  return null;
}
