'use client';

import { deleteDraft, getDrafts, sendDraft } from '@/app/actions/message-advanced-actions';
import { Message } from '@/components/messages/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { FileText, Mail, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    setLoading(true);
    const result = await getDrafts();
    if (result.success && result.messages) {
      setDrafts(result.messages as Message[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    const result = await deleteDraft(id);
    if (result.success) {
      toast.success('Draft deleted');
      loadDrafts();
    } else {
      toast.error(result.message || 'Failed to delete draft');
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm('Send this draft now?')) return;
    
    const result = await sendDraft(id);
    if (result.success) {
      toast.success('Draft sent successfully!');
      loadDrafts();
    } else {
      toast.error(result.message || 'Failed to send draft');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Drafts</h1>
        <p className="text-muted-foreground">Loading drafts...</p>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Drafts</h1>
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">No drafts</h2>
          <p className="text-muted-foreground">
            Saved message drafts will appear here
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Drafts</h1>
        <p className="text-muted-foreground">{drafts.length} saved draft{drafts.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-4">
        {drafts.map((draft) => (
          <Card key={draft.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{draft.email}</span>
                </div>
                <h3 className="font-semibold mb-1">{draft.subject || '(No subject)'}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {draft.body.replace(/<[^>]+>/g, '')}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Saved {format(new Date(draft.createdAt), 'MMM d, yyyy h:mm a')}</span>
                  {draft.attachments && draft.attachments.length > 0 && (
                    <span>{draft.attachments.length} attachment{draft.attachments.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleSend(draft.id)}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(draft.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
