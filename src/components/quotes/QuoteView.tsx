'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Archive, CheckCircle, Trash2, Reply } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Quote {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  productInterest: string;
  quantity: string;
  message?: string;
  status: 'pending' | 'processed';
  isArchived?: boolean;
}

interface QuoteViewProps {
  quote: Quote;
  onBackClick: () => void;
  onArchive: (id: string, archive: boolean) => void;
  onUpdateStatus: (id: string, status: 'processed') => void;
  onDelete: (id: string) => void;
}

export function QuoteView({ quote, onBackClick, onArchive, onUpdateStatus, onDelete }: QuoteViewProps) {
  const [isArchiving, setIsArchiving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleArchive = async () => {
    setIsArchiving(true);
    await onArchive(quote.id, !quote.isArchived);
    setIsArchiving(false);
  };

  const handleMarkAsProcessed = async () => {
    setIsProcessing(true);
    await onUpdateStatus(quote.id, 'processed');
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(quote.id);
    setIsDeleting(false);
  };

  const handleReply = () => {
    const subject = encodeURIComponent(`Re: Quote Request - ${quote.productInterest}`);
    const body = encodeURIComponent(`Dear ${quote.name},

Thank you for your quote request regarding ${quote.productInterest} (${quote.quantity}).

`);
    window.open(`mailto:${quote.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const isActionDisabled = isArchiving || isProcessing || isDeleting;

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card shadow-sm">
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex items-center gap-2">
          {/* Desktop Buttons */}
          <div className="hidden lg:flex lg:gap-2">
            <Button variant="outline" size="sm" onClick={handleReply} disabled={isActionDisabled}>
              <Reply className="mr-2 h-4 w-4" /> Reply
            </Button>
            {!quote.isArchived && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsProcessed}
                disabled={quote.status === 'processed' || isActionDisabled}
              >
                {isProcessing ? 'Processing...' : <><CheckCircle className="mr-2 h-4 w-4" /> Mark as Processed</>}</Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleArchive}
              disabled={isActionDisabled}
            >
              {isArchiving ? (quote.isArchived ? 'Un-archiving...' : 'Archiving...') : <><Archive className="mr-2 h-4 w-4" /> {quote.isArchived ? 'Un-archive' : 'Archive'}</>}</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isActionDisabled}>
              {isDeleting ? 'Deleting...' : <><Trash2 className="mr-2 h-4 w-4" /> Delete</>}</Button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex gap-2 lg:hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleReply} disabled={isActionDisabled}>
                    <Reply className="h-4 w-4" />
                    <span className="sr-only">Reply</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Reply</p></TooltipContent>
              </Tooltip>
              {!quote.isArchived && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleMarkAsProcessed}
                      disabled={quote.status === 'processed' || isActionDisabled}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Mark as Processed</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Mark as Processed</p></TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleArchive} disabled={isActionDisabled}>
                    <Archive className="h-4 w-4" />
                    <span className="sr-only">{quote.isArchived ? 'Un-archive' : 'Archive'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>{quote.isArchived ? 'Un-archive' : 'Archive'}</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isActionDisabled}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Delete</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto p-4 text-sm">
        <h2 className="text-sm font-semibold mb-4 w-full bg-secondary py-2 pl-1">Details :</h2>
        <div className="grid gap-2 p-1">
          <div className="flex items-center">
            <div className="font-medium text-sm">From:</div>
            <div className="ml-2 text-muted-foreground text-sm">{quote.name} &lt;{quote.email}&gt;</div>
          </div>
          {quote.company && (
            <div className="flex items-center">
              <div className="font-medium text-sm">Company:</div>
              <div className="ml-2 text-muted-foreground text-sm">{quote.company}</div>
            </div>
          )}
          {quote.phone && (
            <div className="flex items-center">
              <div className="font-medium text-sm">Phone:</div>
              <div className="ml-2 text-muted-foreground text-sm">{quote.phone}</div>
            </div>
          )}
          <div className="flex items-center">
            <div className="font-medium text-sm">Product Interest:</div>
            <div className="ml-2 text-muted-foreground text-sm">{quote.productInterest}</div>
          </div>
          <div className="flex items-center">
            <div className="font-medium text-sm">Quantity:</div>
            <div className="ml-2 text-muted-foreground text-sm">{quote.quantity}</div>
          </div>
          <div className="flex items-center">
            <div className="font-medium text-sm">Status:</div>
            <div className="ml-2 text-muted-foreground text-sm capitalize">{quote.status}</div>
          </div>
          <div className="flex items-center">
            <div className="font-medium text-sm">Date:</div>
            <div className="ml-2 text-muted-foreground text-xs">{new Date(quote.timestamp).toLocaleString()}</div>
          </div>
        </div>
        {quote.message && (
          <div className="mt-4 p-1">
            <div className="font-medium text-sm">Message:</div>
            <div className="mt-1 rounded-md border bg-muted/50 p-3 text-muted-foreground text-sm">
              {quote.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}