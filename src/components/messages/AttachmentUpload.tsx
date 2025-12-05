'use client';

import { Button } from '@/components/ui/button';
import { validateFile } from '@/lib/validation';
import { File, FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AttachmentUploadProps {
  onAttachmentsChange: (attachments: Array<{
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>) => void;
  existingAttachments?: Array<{
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>;
}

export function AttachmentUpload({ onAttachmentsChange, existingAttachments = [] }: AttachmentUploadProps) {
  const [attachments, setAttachments] = useState(existingAttachments);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate all files before uploading
    const validationResults = Array.from(files).map(file => ({
      file,
      validation: validateFile(file)
    }));

    const invalidFiles = validationResults.filter(r => !r.validation.valid);
    const validFiles = validationResults.filter(r => r.validation.valid).map(r => r.file);

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ file, validation }) => {
        toast.error(`${file.name}: ${validation.error}`);
      });
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const uploaded = [];

    for (const file of validFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'attachment');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        uploaded.push(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    const newAttachments = [...attachments, ...uploaded];
    setAttachments(newAttachments);
    onAttachmentsChange(newAttachments);
    setUploading(false);
    
    if (uploaded.length > 0) {
      toast.success(`${uploaded.length} file(s) uploaded`);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    onAttachmentsChange(newAttachments);
  };

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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Attach Files'}
        </Button>
        <span className="text-xs text-muted-foreground">Max 10MB per file</span>
      </div>

      <input
        id="file-upload"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
      />

      {attachments.length > 0 && (
        <div className="space-y-1">
          {attachments.map((att, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(att.mimeType)}
                <span className="truncate">{att.filename}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatFileSize(att.fileSize)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
