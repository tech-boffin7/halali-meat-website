import { MessageStatus, MessageType } from '@prisma/client';

export { MessageType };

// Extended Message type with new fields
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: MessageStatus;
  type: MessageType;
  createdAt: Date;
  userId: string | null;
  
  // NEW: Threading
  threadId?: string | null;
  parentMessageId?: string | null;
  
  // NEW: Scheduling
  scheduledFor?: Date | null;
  sentAt?: Date | null;
  
  // NEW: Attachments
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  messageId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}
