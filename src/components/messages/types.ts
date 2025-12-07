import { MessageType } from '@prisma/client';

export { MessageType };

// Extended Message type with new fields
export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'TRASH';
  type: 'INBOUND' | 'OUTBOUND';
  isDraft: boolean;
  createdAt: Date;
  userId?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
  threadId?: string | null;
  parentMessageId?: string | null;
  attachments?: Attachment[];
};

export interface Attachment {
  id: string;
  messageId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}
