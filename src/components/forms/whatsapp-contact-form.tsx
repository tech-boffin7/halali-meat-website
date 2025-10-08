'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

const WhatsAppContactForm = () => {
  const phoneNumber = '+254123456789'; // Replace with your WhatsApp number
  const prefilledMessage = encodeURIComponent('Hello, I would like to inquire about your Halali Meat products.');
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${prefilledMessage}`;

  return (
    <div className="bg-secondary/50 p-8 rounded-lg border border-border/50 w-full flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-6">Contact via WhatsApp</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Prefer to chat? Click the button below to send us a message directly on WhatsApp.
      </p>
      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat on WhatsApp
        </Link>
      </Button>
    </div>
  );
};

export default WhatsAppContactForm;
