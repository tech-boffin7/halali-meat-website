import { MessagesShell } from '@/components/messages/MessagesShell';
import { MessagesProvider } from './messages-context';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MessagesProvider>
      <MessagesShell>
        {children}
      </MessagesShell>
    </MessagesProvider>
  );
}