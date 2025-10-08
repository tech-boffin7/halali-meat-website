'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { recentQuotes } from '@/data/dashboard-data';

export function RecentQuotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Quotes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentQuotes.map((quote) => (
          <div key={quote.id} className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={quote.avatar} alt="Avatar" />
              <AvatarFallback>{quote.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium leading-none">{quote.name}</p>
              <p className="text-xs text-muted-foreground">{quote.product}</p>
            </div>
            <p className="text-xs text-muted-foreground">{quote.date}</p>
          </div>
        ))}
        <Button asChild variant="secondary" className="w-full mt-4">
          <Link href="/admin/quotes">View All Quotes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
