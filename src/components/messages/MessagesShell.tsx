'use client';

import { MessagesNavbar } from '@/components/messages/MessagesNavbar';
import { MessagesSidebar } from '@/components/messages/MessagesSidebar';

interface MessagesShellProps {
  children: React.ReactNode;
}

export function MessagesShell({ children }: MessagesShellProps) {
  return (
    <div className="grid min-h-screen md:h-[calc(100vh-80px)] w-full md:grid-cols-[280px_1fr] p-1">
      <MessagesSidebar />
      <div className="flex flex-col md:overflow-y-auto p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <MessagesNavbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
