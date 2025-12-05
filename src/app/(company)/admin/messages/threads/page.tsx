'use client';

import { ThreadList } from '@/components/messages/ThreadList';
import { ThreadView } from '@/components/messages/ThreadView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function ThreadsPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (selectedThreadId) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedThreadId(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </Button>
        </div>
        <ThreadView 
          threadId={selectedThreadId}
          onClose={() => setSelectedThreadId(null)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Conversation Threads</h1>
        <p className="text-muted-foreground">
          View grouped messages and conversations
        </p>
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search threads..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ThreadList 
        onSelectThread={setSelectedThreadId}
        searchQuery={searchQuery}
      />
    </div>
  );
}
