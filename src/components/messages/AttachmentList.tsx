'use client';

import { Button } from '@/components/ui/button';
import { Download, File, FileText, Image as ImageIcon } from 'lucide-react';

interface AttachmentListProps {
  attachments: Array<{
    id?: string;
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>;
  canDelete?: boolean;
  onDelete?: (attachmentId: string) => void;
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (mimeType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">
        Attachments ({attachments.length})
      </div>
      <div className="space-y-1">
        {attachments.map((att, index) => (
          <div
            key={att.id || index}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-md border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getFileIcon(att.mimeType)}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{att.filename}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(att.fileSize)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(att.fileUrl, att.filename)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
