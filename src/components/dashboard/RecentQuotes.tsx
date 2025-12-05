'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { memo } from 'react';

interface QuoteData {
  id: string;
  name: string;
  company: string;
  product: string;
  date: string;
  avatar: string;
}

interface RecentQuotesProps {
  quotes: QuoteData[];
}

// Memoized to prevent unnecessary re-renders when dashboard state changes
export const RecentQuotes = memo(function RecentQuotes({ quotes }: RecentQuotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Quotes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotes.length > 0 ? (
          quotes.map((quote) => (
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
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No recent quotes</p>
        )}
        <Button 
          asChild 
          variant="secondary" 
          className="w-full mt-4"
          data-tooltip="Navigate to quotes page to manage all requests"
          data-tooltip-position="top"
        >
          <Link href="/admin/quotes">View All Quotes</Link>
        </Button>
      </CardContent>
    </Card>
  );
});
