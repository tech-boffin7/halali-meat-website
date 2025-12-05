'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

const WhatsAppContactForm = () => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254123456789';
  const defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hello, I would like to inquire about your Halali Meat products.';
  const prefilledMessage = encodeURIComponent(defaultMessage);
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${prefilledMessage}`;

  return (
    <div className="bg-secondary/50 p-6 rounded-lg border border-border/50 w-full flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold mb-4">Contact via WhatsApp</h2>
      <p className="text-muted-foreground text-sm mb-4 max-w-md">
        Prefer to chat? Click the button below to send us a message directly on WhatsApp.
      </p>
      <Button asChild size="sm" className="w-full sm:w-auto">
        <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-3 w-3" />
          Chat on WhatsApp
        </Link>
      </Button>
    </div>
  );
};

export default WhatsAppContactForm;
