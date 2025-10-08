'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { recentMessages } from '@/data/dashboard-data';

export function RecentMessages() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentMessages.map((message) => (
          <div key={message.id} className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={message.avatar} alt="Avatar" />
              <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium leading-none">{message.name}</p>
              <p className="text-xs text-muted-foreground">{message.subject}</p>
            </div>
            <p className="text-xs text-muted-foreground">{message.date}</p>
          </div>
        ))}
        <Button asChild variant="secondary" className="w-full mt-4">
          <Link href="/admin/messages">View All Messages</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
